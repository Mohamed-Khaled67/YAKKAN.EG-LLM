
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { DarkMode } from "@/components/ui/darkMode";
export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    
    <div
      dir="rtl"
      className="relative flex min-h-svh items-center justify-center px-4 py-3"
    >
      <div className="absolute right-4 top-4">
    <DarkMode />
  </div>
      {/* Back Button */}
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute left-4 top-4 gap-2",
        })}
      >
        <ArrowLeft className="size-4" />
        رجوع
      </Link>

      {/* Main Container */}
      <div className="flex w-full max-w-md flex-col gap-3">

       

        {children}

      </div>
    </div>
  );
}