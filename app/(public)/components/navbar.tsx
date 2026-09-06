"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BookOpen,
  ChevronDown,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DarkMode } from "@/components/ui/darkMode";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ================================================= */
  /* NAV ITEMS */
  /* ================================================= */

  const navItems = [
    {
      name: "الرئيسية",
      href: "/",
      icon: Sparkles,
    },
    {
      name: "الكورسات",
      href: "/courses",
      icon: BookOpen,
    },
    // {
    //   name: "الترفيه",
    //   href: "/entertainment",
    //   icon: Gamepad2,
    // },
    {
      name: "لوحة التحكم",
      href: "/admin",
      icon: LayoutDashboard,
    },
  ];

  /* ================================================= */
  /* CLOSE DROPDOWN WHEN CLICKING OUTSIDE */
  /* ================================================= */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================================================= */
  /* CLOSE MOBILE MENU WHEN ROUTE CHANGES */
  /* ================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [pathname]);

  /* ================================================= */
  /* LOGOUT */
  /* ================================================= */

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setUserOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  /* ================================================= */
  /* USER INITIALS */
  /* ================================================= */

  function getInitials() {
    if (!session?.user?.name) return "Y";

    return session.user.name
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }

  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-50
        px-3
        pt-3
        sm:px-5
        sm:pt-4
      "
    >
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav
        className="
          relative
          mx-auto
          flex
          h-[68px]
          max-w-7xl
          items-center
          justify-between
          rounded-2xl
          border
          border-red-500/10
          bg-background/80
          px-3
          shadow-xl
          shadow-red-500/[0.04]
          backdrop-blur-2xl
          sm:px-5
        "
      >
        {/* ================================================= */}
        {/* BACKGROUND GLOW */}
        {/* ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            size-40
            rounded-full
            bg-red-500/10
            blur-[70px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            left-1/3
            size-40
            rounded-full
            bg-orange-500/[0.06]
            blur-[70px]
          "
        />

        {/* ================================================= */}
        {/* LOGO */}
        {/* ================================================= */}

        <Link
          href="/"
          className="
            group
            relative
            flex
            shrink-0
            items-center
            gap-2.5
          "
        >
          {/* Logo */}

          <div
            className="
              relative
              flex
              size-10
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-red-500/15
              bg-background
              p-1
              shadow-lg
              shadow-red-500/10
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:border-red-500/30
              group-hover:shadow-xl
              group-hover:shadow-red-500/20
            "
          >
            <div
              className="
                absolute
                inset-0
                rounded-xl
                bg-gradient-to-br
                from-red-500/20
                via-rose-500/10
                to-orange-500/20
              "
            />

            <img
              src="/myLogo.png"
              alt="YAKKAN-EG"
              className="
                relative
                z-10
                size-full
                rounded-lg
                object-cover
              "
            />
          </div>

          {/* Brand */}

          <div className="hidden sm:block">
            <div
              className="
                bg-gradient-to-l
                from-red-500
                via-rose-500
                to-orange-500
                bg-clip-text
                text-sm
                font-black
                tracking-[0.12em]
                text-transparent
              "
            >
              YAKKAN-EG
            </div>

            <div className="text-[9px] text-muted-foreground">
              تعلم • تطور • استمتع
            </div>
          </div>
        </Link>

        {/* ================================================= */}
        {/* DESKTOP NAV */}
        {/* ================================================= */}

        <div
          className="
            hidden
            items-center
            gap-1
            rounded-xl
            border
            border-border/40
            bg-muted/30
            p-1
            lg:flex
          "
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  transition-all
                  duration-300

                  ${
                    active
                      ? `
                        bg-gradient-to-r
                        from-red-500/10
                        via-rose-500/10
                        to-orange-500/5
                        text-red-500
                        shadow-sm
                      `
                      : `
                        text-muted-foreground
                        hover:bg-background/70
                        hover:text-red-500
                      `
                  }
                `}
              >
                <Icon className="size-3.5" />

                {item.name}

               
              </Link>
            );
          })}
        </div>

        {/* ================================================= */}
        {/* RIGHT ACTIONS */}
        {/* ================================================= */}

        <div className="relative z-10 flex items-center gap-2">

          {/* Dark Mode */}

          <DarkMode />

          {/* ================================================= */}
          {/* AUTH LOADING */}
          {/* ================================================= */}

          {isPending ? (
            <div
              className="
                hidden
                h-9
                w-24
                animate-pulse
                rounded-lg
                bg-muted
                sm:block
              "
            />
          ) : session ? (

            /* ================================================= */
            /* USER */
            /* ================================================= */

            <div
              ref={dropdownRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setUserOpen((prev) => !prev)
                }
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-border/50
                  bg-background/80
                  px-2
                  transition-all
                  duration-300
                  hover:border-red-500/20
                  hover:bg-red-500/[0.03]
                "
              >
                {/* User Image */}

                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "المستخدم"}
                    className="
                      size-8
                      rounded-lg
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      size-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-gradient-to-br
                      from-red-500
                      via-rose-500
                      to-orange-500
                      text-xs
                      font-bold
                      text-white
                      shadow-md
                      shadow-red-500/20
                    "
                  >
                    {getInitials()}
                  </div>
                )}

                {/* User Info */}

                <div
                  className="
                    hidden
                    max-w-[120px]
                    text-right
                    sm:block
                  "
                >
                  <div className="truncate text-xs font-bold">
                    {session.user.name || "مستخدم"}
                  </div>

                  <div
                    className="
                      truncate
                      text-[9px]
                      text-muted-foreground
                    "
                  >
                    {session.user.email}
                  </div>
                </div>

                {/* Arrow */}

                <ChevronDown
                  className={`
                    hidden
                    size-3.5
                    text-muted-foreground
                    transition-transform
                    sm:block
                    ${userOpen ? "rotate-180 text-red-500" : ""}
                  `}
                />
              </button>

              {/* ================================================= */}
              {/* USER DROPDOWN */}
              {/* ================================================= */}

              {userOpen && (
                <div
                  className="
                    absolute
                    left-0
                    top-12
                    w-64
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border/60
                    bg-background/95
                    p-1.5
                    shadow-2xl
                    backdrop-blur-xl
                  "
                >
                  {/* User Info */}

                  <div
                    className="
                      mb-1
                      rounded-xl
                      bg-muted/50
                      p-3
                    "
                  >
                    <div className="flex items-center gap-3">

                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt=""
                          className="
                            size-10
                            rounded-xl
                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            size-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-gradient-to-br
                            from-red-500
                            via-rose-500
                            to-orange-500
                            font-bold
                            text-white
                            shadow-lg
                            shadow-red-500/20
                          "
                        >
                          {getInitials()}
                        </div>
                      )}

                      <div className="min-w-0">

                        <p className="truncate text-sm font-bold">
                          {session.user.name || "مستخدم"}
                        </p>

                        <p
                          dir="ltr"
                          className="
                            truncate
                            text-right
                            text-[10px]
                            text-muted-foreground
                          "
                        >
                          {session.user.email}
                        </p>

                      </div>

                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* DASHBOARD */}
                  {/* ================================================= */}

                  <Link
                    href="/dashboard"
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      transition-all
                      hover:bg-red-500/5
                      hover:text-red-500
                    "
                  >
                    <LayoutDashboard className="size-4" />

                    لوحة التحكم
                  </Link>

                  {/* ================================================= */}
                  {/* PROFILE */}
                  {/* ================================================= */}

                  <Link
                    href="/profile"
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      transition-all
                      hover:bg-red-500/5
                      hover:text-red-500
                    "
                  >
                    <User className="size-4" />

                    الملف الشخصي
                  </Link>

                  {/* ================================================= */}
                  {/* SETTINGS */}
                  {/* ================================================= */}

                

                  {/* Divider */}

                  <div className="my-1 border-t border-border/50" />

                  {/* ================================================= */}
                  {/* LOGOUT */}
                  {/* ================================================= */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      text-red-500
                      transition-all
                      hover:bg-red-500/10
                    "
                  >
                    <LogOut className="size-4" />

                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (

            /* ================================================= */
            /* GUEST */
            /* ================================================= */

            <div
              className="
                hidden
                items-center
                gap-2
                sm:flex
              "
            >
              {/* Login */}

              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="
                    text-xs
                    font-semibold
                    transition-colors
                    hover:bg-red-500/5
                    hover:text-red-500
                  "
                >
                  تسجيل الدخول
                </Button>
              </Link>

              {/* Register */}

              <Link href="/register">
                <Button
                  size="sm"
                  className="
                    gap-2
                    rounded-xl
                    border-0
                    bg-gradient-to-r
                    from-red-500
                    via-rose-500
                    to-orange-500
                    text-xs
                    font-bold
                    text-white
                    shadow-lg
                    shadow-red-500/20
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    hover:shadow-red-500/30
                  "
                >
                  ابدأ الآن

                  <Sparkles className="size-3.5" />
                </Button>
              </Link>
            </div>
          )}

          {/* ================================================= */}
          {/* MOBILE BUTTON */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen((prev) => !prev)
            }
            className="
              flex
              size-10
              items-center
              justify-center
              rounded-xl
              border
              border-border/50
              bg-background/70
              transition-all
              hover:border-red-500/20
              hover:bg-red-500/5
              hover:text-red-500
              lg:hidden
            "
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </nav>

      {/* ================================================= */}
      {/* MOBILE MENU */}
      {/* ================================================= */}

      {mobileOpen && (
        <div
          className="
            mx-auto
            mt-2
            max-w-7xl
            rounded-2xl
            border
            border-border/60
            bg-background/95
            p-3
            shadow-2xl
            backdrop-blur-2xl
            lg:hidden
          "
        >
          <div className="space-y-1">

            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    transition-all

                    ${
                      active
                        ? `
                          bg-gradient-to-r
                          from-red-500/10
                          via-rose-500/10
                          to-orange-500/5
                          text-red-500
                        `
                        : `
                          text-muted-foreground
                          hover:bg-red-500/5
                          hover:text-red-500
                        `
                    }
                  `}
                >
                  <Icon className="size-4" />

                  {item.name}
                </Link>
              );
            })}

          </div>

          {/* ================================================= */}
          {/* MOBILE AUTH */}
          {/* ================================================= */}

          {!session && !isPending && (
            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-2
                border-t
                border-border/50
                pt-3
              "
            >
              <Link href="/login">
                <Button
                  variant="outline"
                  className="
                    w-full
                    rounded-xl
                    border-red-500/15
                    hover:bg-red-500/5
                    hover:text-red-500
                  "
                >
                  تسجيل الدخول
                </Button>
              </Link>

              <Link href="/register">
                <Button
                  className="
                    w-full
                    rounded-xl
                    border-0
                    bg-gradient-to-r
                    from-red-500
                    via-rose-500
                    to-orange-500
                    font-bold
                    text-white
                    shadow-lg
                    shadow-red-500/20
                  "
                >
                  ابدأ الآن
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}