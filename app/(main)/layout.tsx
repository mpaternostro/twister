import Link from "next/link";

import { Button } from "#components/ui/button";
import { getUser } from "#lib/server/get-user";

import { ProfileDropdown } from "./ProfileDropdown";

export default async function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getUser();
  return (
    <section>
      <nav className="mb-4 flex h-16 w-full justify-center border-b border-b-foreground/10 lg:mb-8">
        <div className="flex w-full max-w-4xl items-center justify-end gap-6 p-3 text-sm text-foreground">
          {profile ? (
            <ProfileDropdown
              avatarUrl={profile.avatar_url}
              handle={profile.handle}
              userName={profile.name}
            />
          ) : (
            <Button asChild>
              <Link href="/login" className="rounded-md px-4 py-2 no-underline">
                Login
              </Link>
            </Button>
          )}
        </div>
      </nav>

      <main className="container min-h-[calc(100vh-5rem)] w-full lg:flex lg:min-h-[calc(100vh-6rem)] lg:flex-col lg:items-center">
        {children}
      </main>
    </section>
  );
}
