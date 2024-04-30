import Image from "next/image";
import Link from "next/link";

import { Twist } from "#components/Twist";
import { Button } from "#components/ui/button";
import { Icon } from "#components/ui/icon";
import { getUser } from "#lib/server/get-user";
import { createClient } from "#lib/supabase/server";
import { Database } from "#types/supabase";

export default async function HandlePage({
  params,
}: {
  params: { handle: string };
}) {
  const supabaseClient = createClient<Database>();
  const { profile } = await getUser();
  const { data, error } = await supabaseClient
    .from("profile")
    .select(
      `
      id,
      avatar_url,
      bio,
      created_at,
      handle,
      name,
      twist(
        id,
        created_at,
        text
      )`,
    )
    .order("created_at", { foreignTable: "twist", ascending: false })
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

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const ownProfile = profile?.handle === params.handle;

  return (
    <div className="md:w-128">
      <div className="flex gap-3">
        {data.avatar_url ? (
          <Image
            src={`avatar/${data.avatar_url}`}
            alt={`${data.name} profile photo`}
            className="aspect-square h-36 w-36 rounded-full object-cover"
            width={144}
            height={144}
            priority
          />
        ) : (
          <div className="rounded-full border bg-muted">
            <Icon
              name="person"
              className="-m-[1px] h-36 w-36 p-6 text-muted-foreground"
            />
          </div>
        )}
        <section className="flex-1">
          <h1 className="text-lg font-medium">{data.name}</h1>
          <p className="text-muted-foreground">{`@${params.handle}`}</p>
          {data.bio ? <p className="mt-2">{data.bio}</p> : null}
        </section>
        {ownProfile ? (
          <Button asChild variant="outline">
            <Link href={`/${params.handle}/edit`}>Edit</Link>
          </Button>
        ) : null}
      </div>
      <p className="mt-3">
        {`Fellow Twister since ${formatter.format(new Date(data.created_at))}.`}
      </p>
      <section className="mt-3 lg:mt-6">
        <h2 className="text-lg font-semibold text-primary">Latest Twists</h2>
        {data.twist.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {data.twist.map((twist) => (
              <Twist
                key={twist.id}
                id={twist.id}
                createdAt={twist.created_at}
                profileHandle={data.handle}
                profileName={data.name}
                profileBio={data.bio}
                profileAvatarUrl={data.avatar_url}
              >
                {twist.text}
              </Twist>
            ))}
          </div>
        ) : ownProfile ? (
          <div className="mt-9 text-center">
            <p className="font-semibold">You don&apos;t have any Twists.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start sharing with the world.
            </p>
            <div className="mt-6">
              <Button>New Twist</Button>
            </div>
          </div>
        ) : (
          <p className="mt-9 text-center font-semibold">
            {`${data.name} doesn't have any Twists yet.`}
          </p>
        )}
      </section>
    </div>
  );
}
