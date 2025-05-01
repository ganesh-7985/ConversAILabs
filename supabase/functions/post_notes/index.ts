// Why POST /notes: Using POST for creating resources, reading parameters from request body for structured data input

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = Deno.env.toObject();
  const supabase = createClient(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  let body;
  try {
    body = await req.json();
  } catch (_) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  const { title, content } = body;
  if (!content) {
    return new Response(JSON.stringify({ error: "`content` is required" }), { status: 422 });
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
});