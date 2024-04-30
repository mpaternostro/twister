"use server";
import { nanoid } from "nanoid/non-secure";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getUser } from "#lib/server/get-user";
import { createClient } from "#lib/supabase/server";
import { Database } from "#types/supabase";

export async function updateProfile(formData: FormData) {
  const { profile } = await getUser();

  if (!profile) {
    return;
  }

  const supabaseClient = createClient<Database>();
  const schema = z.object({
    avatar: z.instanceof(Blob).nullable(),
    name: z.string(),
    handle: z.string(),
    bio: z.string().min(3).nullable(),
  });

  const formEntries = Object.fromEntries<FormDataEntryValue | null>(
    formData.entries(),
  );
  for (const key in formEntries) {
    const value = formEntries[key];
    if (value === "" || (value instanceof Blob && value.size === 0)) {
      formEntries[key] = null;
    }
  }

  const parsed = schema.parse(formEntries);
  const { avatar, ...newProfileData } = parsed as z.infer<typeof schema> & {
    avatar_url?: string;
  };

  if (avatar && avatar instanceof Blob) {
    const randomId = nanoid(8);
    const fileExtension = avatar.name.split(".").at(-1);
    const filename = `${profile.id}-${randomId}.${fileExtension}`;

    const { error } = await supabaseClient.storage
      .from("avatar")
      .upload(filename, avatar);

    if (error) {
      throw new Error(`Could not upload Avatar: ${error.message}.`);
    }

    newProfileData.avatar_url = filename;
  }

  const { error } = await supabaseClient
    .from("profile")
    .update(newProfileData)
    .eq("id", profile.id);

  if (error) {
    throw new Error(`Could not update profile: ${error.message}.`);
  }

  return redirect(`/${profile?.handle}`);
}
