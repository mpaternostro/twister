import Image from "next/image";
import Link from "next/link";

import { Button } from "#/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "#/components/ui/hover-card";
import { formatTimeAgo } from "#lib/formatTimeAgo";

import { Icon } from "./ui/icon";

interface Props {
  id: string;
  createdAt: string;
  profileHandle: string;
  profileName: string;
  profileBio: string | null;
  profileAvatarUrl: string | null;
  children: React.ReactNode;
}

export function Twist({
  id,
  createdAt,
  profileHandle,
  profileName,
  profileBio,
  profileAvatarUrl,
  children,
}: Props) {
  const link = `/${profileHandle}/twists/${id}`;

  return (
    <article className="flex w-full first:mt-3 md:w-128">
      {profileAvatarUrl ? (
        <Image
          src={`avatar/${profileAvatarUrl}`}
          alt={`${profileName} profile photo`}
          className="mr-3 aspect-square h-12 w-12 rounded-full object-cover"
          width={48}
          height={48}
          priority
        />
      ) : (
        <div className="mr-3 rounded-full border bg-zinc-200">
          <Icon
            name="person"
            className="-m-[1px] h-12 w-12 p-6 text-zinc-600"
          />
        </div>
      )}
      <div>
        <p className="flex justify-between">
          <HoverCard openDelay={500}>
            <HoverCardTrigger asChild>
              <Link href={`/${profileHandle}`} className="hover:underline">
                <span className="font-semibold">{profileName}</span>
                <span className="ml-1 opacity-75">{`@${profileHandle}`}</span>
              </Link>
            </HoverCardTrigger>
            <HoverCardPortal>
              <HoverCardContent className="flex w-80 text-sm">
                {profileAvatarUrl ? (
                  <Image
                    src={`avatar/${profileAvatarUrl}`}
                    alt={`${profileName} profile photo`}
                    className="mr-3 aspect-square h-16 w-16 rounded-full object-cover"
                    width={64}
                    height={64}
                    priority
                  />
                ) : (
                  <div className="mr-3 space-y-3 rounded-full border bg-zinc-200">
                    <Icon
                      name="person"
                      className="-m-[1px] h-16 w-16 p-6 text-zinc-600"
                    />
                  </div>
                )}
                <div>
                  <p className="space-y-1">
                    <span className="font-semibold">{profileName}</span>
                    <span className="ml-1 opacity-75">{`@${profileHandle}`}</span>
                  </p>
                  {profileBio ? <p className="mt-1">{profileBio}</p> : null}
                  <Button asChild variant="outline" className="mt-3">
                    <Link href={`/${profileHandle}`}>View Profile</Link>
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCardPortal>
          </HoverCard>
          <time className="opacity-75" dateTime={createdAt} title={createdAt}>
            {formatTimeAgo(new Date(createdAt))}
          </time>
        </p>
        <p className="mt-1 rounded-lg border transition-colors duration-100 hover:bg-secondary">
          <Link href={link} className="block px-4 py-2">
            {children}
          </Link>
        </p>
      </div>
    </article>
  );
}
