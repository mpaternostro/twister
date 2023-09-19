import Link from "next/link";
import { redirect } from "next/navigation";

import { getUser } from "#lib/server/get-user";

import Messages from "./messages";

export default async function Login() {
  const user = await getUser();
  if (user) {
    throw redirect("/");
  }

  return (
    <main className="flex min-h-screen w-full flex-1 flex-col items-center justify-center gap-2 px-8 sm:mx-auto sm:max-w-md">
      <Link
        href="/"
        className="bg-btn-background hover:bg-btn-background-hover group absolute left-8 top-8 flex items-center rounded-md px-4 py-2 text-sm text-foreground no-underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form
        className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground"
        action="/auth/sign-in"
        method="post"
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="mb-2 rounded bg-green-700 px-4 py-2 text-white">
          Sign In
        </button>
        <a href="/sign-up">
          Don&apos;t have an account?
          <span className="ml-1 text-indigo-600 hover:underline">
            Sign up here.
          </span>
        </a>
        <Messages />
      </form>
    </main>
  );
}
