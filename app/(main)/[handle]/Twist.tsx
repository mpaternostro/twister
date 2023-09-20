import Link from "next/link";

import { formatTimeAgo } from "#lib/formatTimeAgo";

interface Props {
  id: string;
  created_at: string;
  profile_handle: string;
  profile_name: string;
  children: React.ReactNode;
}

export function Twist({
  id,
  created_at,
  profile_handle,
  profile_name,
  children,
}: Props) {
  return (
    <article className="w-full rounded-lg border px-4 py-2 first:mt-3 hover:bg-zinc-50 md:w-128">
      <Link href={`/${profile_handle}`}>
        <p>
          <span className="font-semibold">{profile_name}</span>
          <span className="ml-1 text-zinc-600">{`@${profile_handle}`}</span>
          {" | "}
          <span className="text-zinc-600" title={created_at}>
            {formatTimeAgo(new Date(created_at))}
          </span>
        </p>
      </Link>
      <Link href={`/twist/${id}`}>
        <p className="mt-1">{children}</p>
      </Link>
    </article>
  );
}
