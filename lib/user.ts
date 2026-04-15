import { createClient } from "@/lib/supabase/server";

export async function getUserData() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();
  const user = authData?.claims;

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
        id, username, display_name, avatar_url, created_at
      `
    )
    .eq("id", user.sub)
    .single();

  if (error || !data) return null;

  return data;
}
