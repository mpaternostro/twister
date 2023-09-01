import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";
import { ThemeSwitch } from "./ThemeSwitch";

export default async function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <section>
      <nav className="mb-4 flex h-16 w-full justify-center border-b border-b-foreground/10 lg:mb-8">
        <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm text-foreground">
          <div />
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                Hey, {user.email}!
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 no-underline"
              >
                Login
              </Link>
            )}
          </div>
          <ThemeSwitch />
        </div>
      </nav>

      <main className="container min-h-screen w-full lg:flex lg:flex-col lg:items-center">
        {children}
      </main>
    </section>
  );
}
