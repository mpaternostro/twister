import { createClient } from "#lib/supabase/server";
import { Database } from "#types/supabase";

export async function getUser() {
  "use server";
  const supabase = createClient<Database>();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null) {
    return {
      user: null,
      profile: null,
    };
  }

  const { data } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();
  return {
    user,
    profile: data,
  };
}
