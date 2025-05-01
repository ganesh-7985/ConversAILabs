// Why GET /notes: Using GET for retrieving resources, no parameters needed as we're fetching all notes for the authenticated user

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = Deno.env.toObject();
  const supabase = createClient(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});