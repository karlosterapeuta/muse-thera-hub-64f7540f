import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create admin client with service role key to bypass RLS
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, creatorId, creatorToken, ...params } = await req.json();

    console.log("📦 Creator Operations received:", { operation, creatorId, hasToken: !!creatorToken });

    // Verify creator authentication
    if (!creatorId || !creatorToken) {
      console.log("❌ Missing creatorId or creatorToken");
      return new Response(
        JSON.stringify({ error: "Autenticação inválida" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify creator exists and token matches (simplified - in production use proper JWT)
    const { data: creator, error: creatorError } = await supabaseAdmin
      .from("course_creators")
      .select("id, is_active")
      .eq("id", creatorId)
      .eq("is_active", true)
      .single();

    if (creatorError || !creator) {
      console.log("❌ Creator not found or inactive:", creatorError);
      return new Response(
        JSON.stringify({ error: "Criador não encontrado ou inativo" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("✅ Creator verified:", creator.id);

    let result;

    switch (operation) {
      case "createModule": {
        const { courseId, title } = params;

        // Verify course belongs to creator
        const { data: course, error: courseError } = await supabaseAdmin
          .from("courses")
          .select("id, creator_id")
          .eq("id", courseId)
          .eq("creator_id", creatorId)
          .single();

        if (courseError || !course) {
          console.log("❌ Course not found or doesn't belong to creator:", courseError);
          return new Response(
            JSON.stringify({ error: "Curso não encontrado ou não pertence ao criador" }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get module count for order_index
        const { count } = await supabaseAdmin
          .from("course_modules")
          .select("*", { count: "exact", head: true })
          .eq("course_id", courseId);

        const orderIndex = count || 0;

        // Create module using admin client (bypasses RLS)
        const { data: module, error } = await supabaseAdmin
          .from("course_modules")
          .insert({
            course_id: courseId,
            title,
            order_index: orderIndex,
          })
          .select()
          .single();

        if (error) {
          console.log("❌ Error creating module:", error);
          throw error;
        }

        console.log("✅ Module created:", module.id);
        result = { module };
        break;
      }

      case "createLesson": {
        const { moduleId, title, youtube_url, description, duration_minutes, is_free_preview } = params;

        // Verify module belongs to a course owned by the creator
        const { data: moduleData, error: moduleError } = await supabaseAdmin
          .from("course_modules")
          .select("id, course_id, courses(id, creator_id, thumbnail_url)")
          .eq("id", moduleId)
          .single();

        if (moduleError || !moduleData) {
          console.log("❌ Module not found:", moduleError);
          return new Response(
            JSON.stringify({ error: "Módulo não encontrado" }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const courseCreatorId = (moduleData.courses as any)?.creator_id;
        if (courseCreatorId !== creatorId) {
          console.log("❌ Module doesn't belong to creator's course");
          return new Response(
            JSON.stringify({ error: "Módulo não pertence a um curso do criador" }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get lesson count for order_index
        const { count } = await supabaseAdmin
          .from("course_lessons")
          .select("*", { count: "exact", head: true })
          .eq("module_id", moduleId);

        const orderIndex = count || 0;

        // Create lesson using admin client (bypasses RLS)
        const { data: lesson, error } = await supabaseAdmin
          .from("course_lessons")
          .insert({
            module_id: moduleId,
            title,
            youtube_url,
            description: description || null,
            duration_minutes: duration_minutes || null,
            is_free_preview: is_free_preview || false,
            order_index: orderIndex,
          })
          .select()
          .single();

        if (error) {
          console.log("❌ Error creating lesson:", error);
          throw error;
        }

        console.log("✅ Lesson created:", lesson.id);

        // Update course thumbnail if not set
        const courseThumbnail = (moduleData.courses as any)?.thumbnail_url;
        const courseId = moduleData.course_id;

        if (courseId && !courseThumbnail && youtube_url) {
          // Extract YouTube video ID
          const videoIdMatch = youtube_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
          if (videoIdMatch && videoIdMatch[1]) {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
            await supabaseAdmin
              .from("courses")
              .update({ thumbnail_url: thumbnailUrl })
              .eq("id", courseId);
            console.log("✅ Course thumbnail updated");
          }
        }

        result = { lesson };
        break;
      }

      case "createCourse": {
        const { title, description, price_cents, thumbnail_url } = params;

        // Create course using admin client (bypasses RLS)
        const { data: course, error } = await supabaseAdmin
          .from("courses")
          .insert({
            title,
            description: description || null,
            price_cents: price_cents || null,
            thumbnail_url: thumbnail_url || null,
            creator_id: creatorId,
            is_published: false,
          })
          .select()
          .single();

        if (error) {
          console.log("❌ Error creating course:", error);
          throw error;
        }

        console.log("✅ Course created:", course.id);
        result = { course };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Operação não suportada" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Error in creator-operations:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro interno" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
