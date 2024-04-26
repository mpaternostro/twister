import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { Icon } from "#components/ui/icon";
import { Database } from "#types/supabase";

export default async function TwistPage({
  params,
}: {
  params: { id: string };
}) {
  cookies().getAll(); // see https://github.com/vercel/next.js/issues/56630
  const supabaseClient = createServerComponentClient<Database>({ cookies });
  const { data, error } = await supabaseClient
    .from("twist")
    .select(
      `
      id,
      created_at,
      text,
      profile(
        handle,
        name,
        bio,
        avatar_url
      )
      `,
    )
    .eq("id", params.id)
    .maybeSingle();

  if (error) {
    return <pre>{error.message}</pre>;
  }

  if (!data?.profile) {
    return (
      <div>
        <h1>Twist not found</h1>
      </div>
    );
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <article className="flex w-full px-4 py-2 md:w-128">
      {data.profile.avatar_url ? (
        <Image
          src={`avatar/${data.profile.avatar_url}`}
          alt={`${data.profile.name} data.profile photo`}
          className="mr-3 aspect-square h-12 w-12 rounded-full object-cover"
          width={48}
          height={48}
          priority
        />
      ) : (
        <div className="mr-3 h-12 rounded-full border bg-muted">
          <Icon
            name="person"
            className="-m-[1px] h-12 w-12 p-2 text-muted-foreground"
          />
        </div>
      )}
      <div className="flex-1">
        <p>
          <Link href={`/${data.profile.handle}`} className="hover:underline">
            <span className="font-semibold">{data.profile.name}</span>
            <span className="ml-1 opacity-75">{`@${data.profile.handle}`}</span>
          </Link>
        </p>
        <p className="mt-1">{data.text}</p>
        <p className="mt-1 w-fit opacity-75">
          <time dateTime={data.created_at}>
            {formatter.format(new Date(data.created_at))}
          </time>
        </p>
      </div>
    </article>
  );
}
