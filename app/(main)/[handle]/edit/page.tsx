import { getUser } from "#lib/server/get-user";
import { createClient } from "#lib/supabase/server";
import { Database } from "#types/supabase";

import EditProfileForm from "./EditProfileForm";

export default async function EditProfilePage({
  params,
}: {
  params: { handle: string };
}) {
  const { profile } = await getUser();

  if (profile?.handle !== params.handle) {
    return (
      <section className="flex w-full flex-1 flex-col items-center gap-2 px-8 sm:mx-auto sm:max-w-md">
        <h1 className="mb-6 text-xl font-medium md:mb-10">Edit Profile</h1>
        <p>Cannot edit this profile.</p>
      </section>
    );
  }

  const supabaseClient = createClient<Database>();
  const { data, error } = await supabaseClient
    .from("profile")
    .select(
      `
      id,
      avatar_url,
      bio,
      handle,
      name`,
    )
    .eq("handle", params.handle)
    .maybeSingle();

  if (error) {
    return <pre>{error.message}</pre>;
  }

  if (data === null) {
    return (
      <div>
        <h1>@{params.handle}</h1>
        <p>This user doesnt exist</p>
      </div>
    );
  }

  return (
    <section className="flex w-full flex-1 flex-col items-center gap-2 px-8 sm:mx-auto sm:max-w-md">
      <h1 className="mb-6 text-xl font-medium md:mb-10">Edit Profile</h1>
      <EditProfileForm profile={data} />
    </section>
  );
}
