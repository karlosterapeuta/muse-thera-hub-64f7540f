import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BackupResponse {
  success: boolean;
  data?: {
    metadata: {
      version: string;
      system: string;
      backupType: string;
      exportedAt: string;
      exportedBy: string;
      exportedByEmail: string;
      totalUsers: number;
      totalRecords: number;
    };
    users: {
      profiles: any[];
      professionals: any[];
      user_roles: any[];
    };
    clinical_data: {
      patients: any[];
      anamnesis: any[];
      assessments: any[];
      treatment_plans: any[];
      reports: any[];
      sessions: any[];
      financial_records: any[];
      clinics: any[];
    };
    courses: {
      courses: any[];
      course_modules: any[];
      course_lessons: any[];
      user_course_progress: any[];
    };
    system: {
      user_activity_logs: any[];
      user_status_logs: any[];
      invite_codes: any[];
    };
    statistics: Record<string, number>;
  };
  statistics?: Record<string, number>;
  error?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's token to verify identity
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error("User auth error:", userError);
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("🔐 Backup requested by user:", user.id, user.email);

    // Create service role client to check admin status (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin
    const { data: adminRole, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ success: false, error: "Error checking admin role" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!adminRole) {
      console.log("❌ User is not admin:", user.id);
      return new Response(
        JSON.stringify({ success: false, error: "Access denied. Admin role required." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("✅ Admin verified, starting full system backup...");

    // Parse request body for action type
    const body = await req.json().catch(() => ({}));
    const action = body.action || "backup";

    // If just getting statistics, return counts only
    if (action === "statistics") {
      const statistics = await getStatistics(adminClient);
      return new Response(
        JSON.stringify({ success: true, statistics }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch ALL data from ALL tables using service role (bypasses RLS)
    console.log("📊 Fetching all system data...");

    // Users data
    const [profiles, professionals, userRoles] = await Promise.all([
      adminClient.from("profiles").select("*"),
      adminClient.from("professionals").select("*"),
      adminClient.from("user_roles").select("*"),
    ]);

    // Clinical data
    const [patients, anamnesis, assessments, treatmentPlans, reports, sessions, financialRecords, clinics] = await Promise.all([
      adminClient.from("patients").select("*"),
      adminClient.from("anamnesis").select("*"),
      adminClient.from("assessments").select("*"),
      adminClient.from("treatment_plans").select("*"),
      adminClient.from("reports").select("*"),
      adminClient.from("sessions").select("*"),
      adminClient.from("financial_records").select("*"),
      adminClient.from("clinics").select("*"),
    ]);

    // Courses data
    const [courses, courseModules, courseLessons, userCourseProgress] = await Promise.all([
      adminClient.from("courses").select("*"),
      adminClient.from("course_modules").select("*"),
      adminClient.from("course_lessons").select("*"),
      adminClient.from("user_course_progress").select("*"),
    ]);

    // System data
    const [userActivityLogs, userStatusLogs, inviteCodes] = await Promise.all([
      adminClient.from("user_activity_logs").select("*"),
      adminClient.from("user_status_logs").select("*"),
      adminClient.from("invite_codes").select("*"),
    ]);

    // Calculate statistics
    const statistics: Record<string, number> = {
      profiles: profiles.data?.length || 0,
      professionals: professionals.data?.length || 0,
      user_roles: userRoles.data?.length || 0,
      patients: patients.data?.length || 0,
      anamnesis: anamnesis.data?.length || 0,
      assessments: assessments.data?.length || 0,
      treatment_plans: treatmentPlans.data?.length || 0,
      reports: reports.data?.length || 0,
      sessions: sessions.data?.length || 0,
      financial_records: financialRecords.data?.length || 0,
      clinics: clinics.data?.length || 0,
      courses: courses.data?.length || 0,
      course_modules: courseModules.data?.length || 0,
      course_lessons: courseLessons.data?.length || 0,
      user_course_progress: userCourseProgress.data?.length || 0,
      user_activity_logs: userActivityLogs.data?.length || 0,
      user_status_logs: userStatusLogs.data?.length || 0,
      invite_codes: inviteCodes.data?.length || 0,
    };

    const totalRecords = Object.values(statistics).reduce((sum, val) => sum + val, 0);

    console.log("📦 Total records to backup:", totalRecords);

    // Build backup response
    const backupData: BackupResponse = {
      success: true,
      data: {
        metadata: {
          version: "2.0",
          system: "MuseTera",
          backupType: "full_system",
          exportedAt: new Date().toISOString(),
          exportedBy: user.id,
          exportedByEmail: user.email || "",
          totalUsers: profiles.data?.length || 0,
          totalRecords,
        },
        users: {
          profiles: profiles.data || [],
          professionals: professionals.data || [],
          user_roles: userRoles.data || [],
        },
        clinical_data: {
          patients: patients.data || [],
          anamnesis: anamnesis.data || [],
          assessments: assessments.data || [],
          treatment_plans: treatmentPlans.data || [],
          reports: reports.data || [],
          sessions: sessions.data || [],
          financial_records: financialRecords.data || [],
          clinics: clinics.data || [],
        },
        courses: {
          courses: courses.data || [],
          course_modules: courseModules.data || [],
          course_lessons: courseLessons.data || [],
          user_course_progress: userCourseProgress.data || [],
        },
        system: {
          user_activity_logs: userActivityLogs.data || [],
          user_status_logs: userStatusLogs.data || [],
          invite_codes: inviteCodes.data || [],
        },
        statistics,
      },
    };

    // Log the backup action
    await adminClient.from("user_activity_logs").insert({
      user_id: user.id,
      activity_type: "full_system_backup",
      activity_data: {
        totalRecords,
        statistics,
        timestamp: new Date().toISOString(),
      },
    });

    console.log("✅ Full system backup completed successfully!");

    return new Response(
      JSON.stringify(backupData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Backup error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function getStatistics(client: any): Promise<Record<string, number>> {
  const tables = [
    "profiles", "professionals", "user_roles",
    "patients", "anamnesis", "assessments", "treatment_plans", 
    "reports", "sessions", "financial_records", "clinics",
    "courses", "course_modules", "course_lessons", "user_course_progress",
    "user_activity_logs", "user_status_logs", "invite_codes"
  ];

  const counts: Record<string, number> = {};
  
  await Promise.all(
    tables.map(async (table) => {
      const { count } = await client
        .from(table)
        .select("*", { count: "exact", head: true });
      counts[table] = count || 0;
    })
  );

  return counts;
}
