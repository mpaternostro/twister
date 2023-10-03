import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import supabaseImgLoader from "#/other/supabase-image-loader";
import { Button } from "#components/ui/button";
import { Icon } from "#components/ui/icon";
import { getUser } from "#lib/server/get-user";
import { Database } from "#types/supabase";

import { Twist } from "./Twist";

export default async function HandlePage({
  params,
}: {
  params: { handle: string };
}) {
  const supabaseClient = createServerComponentClient<Database>({ cookies });
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

  return (
    <div className="md:w-128">
      <div className="flex gap-3">
        <Avatar className="h-36 w-36">
          {data.avatar_url ? (
            <AvatarImage
              className="object-cover"
              // we need to pass the same children src to AvatarImage, otherwise it renders fallback
              src={supabaseImgLoader({
                src: `avatar/${data.avatar_url}`,
                width: 144,
              })}
              asChild
            >
              <Image
                src={`avatar/${data.avatar_url}`}
                alt={`${data.name} profile photo`}
                width={144}
                height={144}
                priority
              />
            </AvatarImage>
          ) : null}
          <AvatarFallback>
            <Icon name="person" className="h-full w-full" />
          </AvatarFallback>
        </Avatar>
        <section className="flex-1">
          <h1 className="text-lg font-medium">{data.name}</h1>
          <p className="text-zinc-500">{`@${params.handle}`}</p>
          {data.bio ? <p className="mt-2">{data.bio}</p> : null}
        </section>
        {profile?.handle === params.handle ? (
          <Button asChild>
            <Link href={`/${params.handle}/edit`}>Edit</Link>
          </Button>
        ) : null}
      </div>
      <p className="mt-3">
        {`Fellow Twister since ${formatter.format(new Date(data.created_at))}.`}
      </p>
      <section className="mt-3 lg:mt-6">
        <h2 className="text-lg font-semibold text-primary">Latest Twists</h2>
        <ul className="space-y-4 md:space-y-6">
          {data.twist.length > 0 ? (
            data.twist.map((twist) => (
              <li key={twist.id}>
                <Twist
                  key={twist.id}
                  id={twist.id}
                  created_at={twist.created_at}
                  profile_handle={data.handle}
                  profile_name={data.name}
                >
                  {twist.text}
                </Twist>
              </li>
            ))
          ) : (
            <div className="mt-9 text-center">
              <h3 className="mt-2 font-semibold text-zinc-900">
                You don&apos;t have any Twists.
              </h3>
              <p className="mt-1 text-sm text-zinc-600">
                Start sharing with the world.
              </p>
              <div className="mt-6">
                <Button>New Twist</Button>
              </div>
            </div>
          )}
        </ul>
      </section>
    </div>
  );
}
