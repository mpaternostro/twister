import Link from "next/link";
import { redirect } from "next/navigation";

import { getUser } from "#lib/server/get-user";

import Messages from "./messages";

export default async function SignUp() {
  const { user } = await getUser();
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
        action="/auth/sign-up"
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
        <p className="-mt-1 text-sm" id="password-description">
          Minimum 6 characters.
        </p>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          id="password"
          aria-describedby="password-description"
          type="password"
          name="password"
          placeholder="••••••••"
          minLength={6}
          required
        />
        <label className="text-md" htmlFor="name">
          Name
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          id="name"
          name="name"
          placeholder="John Doe"
          required
        />
        <label className="text-md" htmlFor="handle">
          Handle
        </label>
        <p className="-mt-1 text-sm" id="handle-description">
          Only letters, numbers and underscores are allowed.
        </p>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          id="handle"
          aria-describedby="handle-description"
          name="handle"
          placeholder="johndoe"
          pattern="[a-zA-Z0-9_]{3,}"
          required
        />
        <button className="mb-2 rounded border bg-blue-700 px-4 py-2 text-white">
          Sign Up
        </button>
        <Messages />
      </form>
    </main>
  );
}
