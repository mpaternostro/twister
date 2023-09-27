import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Database } from "#types/supabase";

export async function getUser() {
  "use server";
  const supabase = createServerComponentClient<Database>({ cookies });

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
