import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a Supabase client with the user's token to properly verify JWT signature
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { authorization: authHeader } },
    });

    // Verify the JWT and get the authenticated user
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      console.error("JWT verification failed:", userError?.message);
      return new Response(JSON.stringify({ error: "Unauthorized", details: "Invalid or expired token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;
    console.log("Authenticated user:", userId);

    // Use service role client to check admin role and list users
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: roleData, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("Role check error:", roleError);
    }

    if (!roleData) {
      console.warn("User attempted admin access without admin role:", userId);
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Admin access verified for user:", userId);

    // Get all auth users
    const { data: { users }, error } = await adminClient.auth.admin.listUsers({
      perPage: 1000,
    });

    if (error) throw error;

    // Return user_id to email mapping
    const emailMap: Record<string, string> = {};
    users?.forEach((u) => {
      if (u.email) {
        emailMap[u.id] = u.email;
      }
    });

    console.log(`Returning ${Object.keys(emailMap).length} user emails`);

    return new Response(JSON.stringify({ emails: emailMap }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in get-user-emails:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
