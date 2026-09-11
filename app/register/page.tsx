
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { RegisterForm } from "./_components/registerForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{
    google?: string;
  }>;
}) {
  // ============================================================
  // GET SESSION
  // ============================================================

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ============================================================
  // GET QUERY PARAMETERS
  // ============================================================

  const params = await searchParams;

  const googleStatus = params.google;

  // ============================================================
  // GOOGLE CALLBACK
  // ============================================================
  //
  // Existing user:
  // /register?google=login
  //
  // New user:
  // /register?google=new
  //
  // We must allow these URLs to reach RegisterForm
  // because Better Auth has already created the session.
  //
  // ============================================================

  const isGoogleCallback =
    googleStatus === "login" ||
    googleStatus === "new";

  // ============================================================
  // NORMAL REGISTER PAGE PROTECTION
  // ============================================================
  //
  // If the user is already logged in and this is NOT a
  // Google callback, send them back to the home page.
  //
  // ============================================================

  if (session && !isGoogleCallback) {
    redirect("/");
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main
      className="
        relative
        flex
        min-h-[100svh]
        w-full
        items-center
        justify-center
        overflow-hidden
        bg-background
        px-4
        py-4
      "
    >
      <RegisterForm />
    </main>
  );
}