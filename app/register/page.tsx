
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// import { RegisterForm } from "./_components/registerForm";

// export default async function RegisterPage() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (session) {
//     return redirect("/");
//   }

//   return <RegisterForm />;
// }













import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { RegisterForm } from "./_components/registerForm";

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

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



