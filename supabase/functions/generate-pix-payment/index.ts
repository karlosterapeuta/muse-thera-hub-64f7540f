import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PixPaymentRequest {
  courseId: string;
  userId: string;
  buyerName?: string;
  buyerEmail?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { courseId, userId, buyerName, buyerEmail }: PixPaymentRequest = await req.json();

    console.log("Generating PIX payment for course:", courseId, "user:", userId);

    // Get course details with creator info
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select(`
        *,
        creator:course_creators(*)
      `)
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      console.error("Course not found:", courseError);
      return new Response(
        JSON.stringify({ error: "Curso não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if course is free
    if (!course.price_cents || course.price_cents === 0) {
      // Grant immediate access for free courses
      const { error: accessError } = await supabase
        .from("course_access")
        .insert({
          course_id: courseId,
          user_id: userId,
          is_active: true,
        });

      if (accessError) {
        console.error("Error granting access:", accessError);
        return new Response(
          JSON.stringify({ error: "Erro ao liberar acesso" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, free: true, message: "Acesso liberado!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate amounts
    const amountCents = course.price_cents;
    const creatorPercentage = course.creator?.commission_percentage || 70;
    const creatorAmount = Math.floor(amountCents * (creatorPercentage / 100));
    const platformAmount = amountCents - creatorAmount;

    // Generate PIX code
    const pixKey = course.creator?.pix_key || "musetera@pagamentos.com";
    const pixKeyType = course.creator?.pix_key_type || "email";
    const receiverName = course.creator?.name || "MuseTera Cursos";
    
    // Generate a unique transaction ID
    const txId = `MT${Date.now().toString(36).toUpperCase()}`;
    
    // Create a simple EMV PIX code (simplified format)
    const amount = (amountCents / 100).toFixed(2);
    const pixCode = generatePixCode(pixKey, pixKeyType, receiverName, amount, txId, course.title);

    // Set expiration (30 minutes)
    const expirationTime = new Date(Date.now() + 30 * 60 * 1000);

    // Check for existing pending purchase
    const { data: existingPurchase } = await supabase
      .from("course_purchases")
      .select("*")
      .eq("course_id", courseId)
      .eq("user_id", userId)
      .eq("payment_status", "pending")
      .gt("pix_expiration", new Date().toISOString())
      .single();

    if (existingPurchase) {
      console.log("Returning existing pending purchase");
      return new Response(
        JSON.stringify({
          success: true,
          purchase: existingPurchase,
          pixCode: existingPurchase.pix_code,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from("course_purchases")
      .insert({
        course_id: courseId,
        user_id: userId,
        creator_id: course.creator_id,
        amount_cents: amountCents,
        creator_amount_cents: creatorAmount,
        platform_amount_cents: platformAmount,
        payment_status: "pending",
        payment_method: "pix",
        pix_code: pixCode,
        pix_expiration: expirationTime.toISOString(),
        buyer_name: buyerName,
        buyer_email: buyerEmail,
      })
      .select()
      .single();

    if (purchaseError) {
      console.error("Error creating purchase:", purchaseError);
      return new Response(
        JSON.stringify({ error: "Erro ao criar pedido de compra" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Purchase created successfully:", purchase.id);

    return new Response(
      JSON.stringify({
        success: true,
        purchase,
        pixCode,
        expiresAt: expirationTime.toISOString(),
        amount: amountCents,
        creatorAmount,
        platformAmount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-pix-payment:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generatePixCode(
  pixKey: string,
  pixKeyType: string,
  receiverName: string,
  amount: string,
  txId: string,
  description: string
): string {
  // This is a simplified static PIX code generator
  // In production, integrate with a real payment gateway (Mercado Pago, PagSeguro, etc.)
  
  // Clean strings for PIX
  const cleanName = receiverName.substring(0, 25).replace(/[^a-zA-Z0-9 ]/g, "");
  const cleanDesc = description.substring(0, 20).replace(/[^a-zA-Z0-9 ]/g, "");
  
  // Build EMV-like code (simplified)
  let pixCode = "";
  
  // Payload Format Indicator
  pixCode += "000201"; // ID 00, length 02, value "01"
  
  // Merchant Account Information (PIX)
  const merchantInfo = `0014BR.GOV.BCB.PIX01${pixKey.length.toString().padStart(2, "0")}${pixKey}`;
  pixCode += `26${merchantInfo.length.toString().padStart(2, "0")}${merchantInfo}`;
  
  // Merchant Category Code
  pixCode += "52040000";
  
  // Transaction Currency (986 = BRL)
  pixCode += "5303986";
  
  // Transaction Amount
  pixCode += `54${amount.length.toString().padStart(2, "0")}${amount}`;
  
  // Country Code
  pixCode += "5802BR";
  
  // Merchant Name
  pixCode += `59${cleanName.length.toString().padStart(2, "0")}${cleanName}`;
  
  // Merchant City
  pixCode += "6009SAO PAULO";
  
  // Additional Data Field (TX ID)
  const additionalData = `05${txId.length.toString().padStart(2, "0")}${txId}`;
  pixCode += `62${additionalData.length.toString().padStart(2, "0")}${additionalData}`;
  
  // CRC16 placeholder (in production, calculate actual CRC)
  pixCode += "6304";
  
  // Calculate simple checksum (simplified - use proper CRC16 in production)
  const checksum = calculateCRC16(pixCode);
  pixCode += checksum;
  
  return pixCode;
}

function calculateCRC16(str: string): string {
  // Simplified CRC16 calculation for demo purposes
  // In production, use proper CRC16-CCITT-FALSE algorithm
  let crc = 0xFFFF;
  
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
}
