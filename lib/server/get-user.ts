import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Database } from "#types/supabase";

export async function getUser() {
  "use server";
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase.from("profile").select("*").single();
  return {
    user,
    profile: data,
  };
}
