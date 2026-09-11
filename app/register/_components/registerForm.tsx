"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Check,
  Loader2,
  Lock,
  Mail,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";
import { motion, type Variants } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/lib/auth-client";

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(4px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ============================================================
// REGISTER FORM
// ============================================================

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [emailPending, startEmailTransition] =
    useTransition();

  const [googlePending, startGoogleTransition] =
    useTransition();

  const isPending =
    emailPending || googlePending;

  // ==========================================================
  // GOOGLE RESULT MESSAGE
  // ==========================================================

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const googleStatus = params.get("google");

    // ========================================================
    // EXISTING GOOGLE USER
    // ========================================================

    if (googleStatus === "login") {
      toast.success(
        "تم تسجيل الدخول بحسابك الموجود بالفعل"
      );

      const timer = window.setTimeout(() => {
        router.replace("/");
      }, 1200);

      return () => {
        window.clearTimeout(timer);
      };
    }

    // ========================================================
    // NEW GOOGLE USER
    // ========================================================

    if (googleStatus === "new") {
      toast.success(
        "تم إنشاء حسابك بنجاح"
      );

      const timer = window.setTimeout(() => {
        router.replace("/");
      }, 1200);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [router]);

  // ==========================================================
  // EMAIL REGISTER
  // ==========================================================

  async function registerWithEmail() {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!cleanName) {
      toast.error("من فضلك أدخل اسمك");
      return;
    }

    if (cleanName.length < 2) {
      toast.error(
        "الاسم يجب أن يكون حرفين على الأقل"
      );
      return;
    }

    if (!cleanEmail) {
      toast.error(
        "من فضلك أدخل البريد الإلكتروني"
      );
      return;
    }

    // --------------------------------------------------------
    // REQUEST
    // --------------------------------------------------------

    startEmailTransition(async () => {
      try {
        const response = await fetch(
          "/api/auth/check-email",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              email: cleanEmail,
            }),
          }
        );

        const data = await response.json();

        // ======================================================
        // API ERROR
        // ======================================================

        if (!response.ok) {
          toast.error(
            data.error ||
              "حدث خطأ أثناء التحقق من البريد الإلكتروني"
          );

          return;
        }

        // ======================================================
        // EXISTING USER
        // ======================================================

        if (data.exists) {
          toast.error(
            "هذا البريد الإلكتروني مسجل بالفعل"
          );

          setTimeout(() => {
            router.push("/login");
          }, 700);

          return;
        }

        // ======================================================
        // SEND OTP
        // ======================================================

        await authClient.emailOtp.sendVerificationOtp({
          email: cleanEmail,
          type: "sign-in",

          fetchOptions: {
            onSuccess: () => {
              toast.success(
                "تم إرسال رمز التحقق إلى بريدك الإلكتروني"
              );

              router.push(
                `/verify-request?email=${encodeURIComponent(
                  cleanEmail
                )}&name=${encodeURIComponent(
                  cleanName
                )}`
              );
            },

            onError: (error) => {
              toast.error(
                error.error?.message ||
                  "حدث خطأ أثناء إرسال رمز التحقق"
              );
            },
          },
        });
      } catch (error) {
        console.error(
          "REGISTER EMAIL ERROR:",
          error
        );

        toast.error(
          "حدث خطأ غير متوقع، حاول مرة أخرى"
        );
      }
    });
  }

  // ==========================================================
  // GOOGLE
  // ==========================================================

  async function registerWithGoogle() {
    startGoogleTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "google",

          // ====================================================
          // EXISTING USER
          // ====================================================

          callbackURL:
            "/register?google=login",

          // ====================================================
          // NEW USER
          // ====================================================

          newUserCallbackURL:
            "/register?google=new",

          fetchOptions: {
            onError: (error) => {
              console.error(
                "GOOGLE AUTH ERROR:",
                error
              );

              toast.error(
                error.error?.message ||
                  "حدث خطأ أثناء التسجيل باستخدام Google"
              );
            },
          },
        });
      } catch (error) {
        console.error(
          "GOOGLE REGISTER ERROR:",
          error
        );

        toast.error(
          "حدث خطأ أثناء الاتصال بـ Google"
        );
      }
    });
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        relative
        flex
        w-full
        items-center
        justify-center
        overflow-hidden
      "
    >
      {/* ================================================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Main glow */}

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-1/2
            size-[180px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-primary/20
            blur-[70px]
          "
        />

        {/* Top glow */}

        <motion.div
          animate={{
            y: [0, -12, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-[-30px]
            size-[100px]
            -translate-x-1/2
            rounded-full
            bg-primary/20
            blur-[50px]
          "
        />

        {/* Bottom glow */}

        <motion.div
          animate={{
            x: [0, 15, 0],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[-30px]
            right-[5%]
            size-[100px]
            rounded-full
            bg-primary/15
            blur-[50px]
          "
        />

        {/* Particle */}

        <motion.div
          animate={{
            y: [0, -12, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[10%]
            top-[25%]
            size-1
            rounded-full
            bg-primary
          "
        />

        {/* Particle */}

        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.1, 0.35, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="
            absolute
            right-[10%]
            top-[35%]
            size-1
            rounded-full
            bg-primary
          "
        />
      </div>

      {/* ================================================== */}
      {/* CARD */}
      {/* ================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
          y: 18,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-10
          w-[70%]
          max-w-[500px]
          min-w-[300px]
        "
      >
        {/* Animated border */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
            duration: 0.7,
          }}
          className="
            pointer-events-none
            absolute
            -inset-px
            rounded-[26px]
            bg-gradient-to-b
            from-primary/30
            via-transparent
            to-primary/10
          "
        />

        {/* ================================================== */}
        {/* CARD CONTENT */}
        {/* ================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[26px]
            border
            border-border/50
            bg-background/95
            px-5
            py-4
            shadow-2xl
            backdrop-blur-2xl
            sm:px-6
            sm:py-5
          "
        >
          {/* ================================================== */}
          {/* ANIMATED LIGHT LINE */}
          {/* ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              left-0
              top-0
              h-px
              w-full
              overflow-hidden
            "
          >
            <motion.div
              animate={{
                x: ["-120%", "120%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
              className="
                h-full
                w-1/3
                bg-gradient-to-r
                from-transparent
                via-primary
                to-transparent
              "
            />
          </div>

          {/* ================================================== */}
          {/* CONTENT */}
          {/* ================================================== */}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* ================================================= */}
            {/* LOGO */}
            {/* ================================================= */}

            <motion.div
              variants={itemVariants}
              className="
                mb-2.5
                flex
                justify-center
              "
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="
                  relative
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-background
                  p-1
                  shadow-lg
                  ring-1
                  ring-border
                "
              >
                {/* Logo glow */}

                <motion.div
                  animate={{
                    opacity: [0.15, 0.35, 0.15],
                    scale: [0.9, 1.08, 0.9],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    absolute
                    inset-0
                    rounded-xl
                    bg-primary/30
                    blur-lg
                  "
                />

                <img
                  src="/myLogo.png"
                  alt="YAKKAN EG"
                  className="
                    relative
                    size-full
                    rounded-lg
                    object-cover
                  "
                />

                {/* Sparkle */}

                <motion.div
                  animate={{
                    rotate: [0, 12, -8, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    absolute
                    -right-1.5
                    -top-1.5
                    flex
                    size-5
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-primary/20
                    bg-background
                    shadow-md
                  "
                >
                  <Sparkles className="size-2.5 text-primary" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* ================================================= */}
            {/* TITLE */}
            {/* ================================================= */}

            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <h1
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  sm:text-2xl
                "
              >
                أنشئ حسابك
              </h1>

              <p
                className="
                  mt-1
                  text-[10px]
                  leading-5
                  text-muted-foreground
                  sm:text-[11px]
                "
              >
                ابدأ رحلتك التعليمية مع{" "}
                <span className="font-semibold text-foreground">
                  YAKKAN EG
                </span>
              </p>
            </motion.div>

            {/* ================================================= */}
            {/* GOOGLE */}
            {/* ================================================= */}

            <motion.div
              variants={itemVariants}
              className="mt-3"
            >
              <Button
                type="button"
                variant="outline"
                onClick={registerWithGoogle}
                disabled={isPending}
                className="
                  group
                  relative
                  h-9
                  w-full
                  overflow-hidden
                  gap-2
                  rounded-xl
                  border-border/60
                  bg-background/70
                  text-[11px]
                  font-semibold
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-primary/30
                  hover:bg-primary/[0.03]
                  hover:shadow-md
                  sm:h-10
                  sm:text-xs
                "
              >
                {/* Shine */}

                <motion.span
                  initial={{
                    x: "-120%",
                  }}
                  whileHover={{
                    x: "120%",
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeInOut",
                  }}
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    w-1/3
                    skew-x-[-20deg]
                    bg-gradient-to-r
                    from-transparent
                    via-white/10
                    to-transparent
                  "
                />

                {googlePending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />

                    جاري الاتصال بـ Google...
                  </>
                ) : (
                  <>
                    <FcGoogle className="size-4" />

                    <span>
                      المتابعة باستخدام Google
                    </span>
                  </>
                )}
              </Button>
            </motion.div>

            {/* ================================================= */}
            {/* DIVIDER */}
            {/* ================================================= */}

            <motion.div
              variants={itemVariants}
              className="relative my-3"
            >
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>

              <div className="relative flex justify-center">
                <span
                  className="
                    bg-background
                    px-3
                    text-[8px]
                    font-medium
                    text-muted-foreground
                  "
                >
                  أو باستخدام البريد الإلكتروني
                </span>
              </div>
            </motion.div>

            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                registerWithEmail();
              }}
              className="space-y-2.5"
            >
              {/* NAME */}

              <motion.div
                variants={itemVariants}
                className="space-y-1"
              >
                <Label
                  htmlFor="name"
                  className="text-[10px] font-semibold"
                >
                  الاسم
                </Label>

                <div className="relative">
                  <User
                    className="
                      absolute
                      right-3
                      top-1/2
                      size-3.5
                      -translate-y-1/2
                      text-muted-foreground
                    "
                  />

                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                    minLength={2}
                    placeholder="محمد خالد"
                    disabled={isPending}
                    dir="rtl"
                    className="
                      h-9
                      rounded-xl
                      border-border/60
                      bg-background/60
                      pr-9
                      text-right
                      text-[11px]
                      shadow-sm
                      transition-all
                      duration-300
                      placeholder:text-muted-foreground/40
                      focus:border-primary/50
                      focus:bg-background
                      focus:ring-4
                      focus:ring-primary/10
                      sm:h-10
                      sm:text-xs
                    "
                  />
                </div>
              </motion.div>

              {/* EMAIL */}

              <motion.div
                variants={itemVariants}
                className="space-y-1"
              >
                <Label
                  htmlFor="email"
                  className="text-[10px] font-semibold"
                >
                  البريد الإلكتروني
                </Label>

                <div className="relative">
                  <Mail
                    className="
                      absolute
                      right-3
                      top-1/2
                      size-3.5
                      -translate-y-1/2
                      text-muted-foreground
                    "
                  />

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    placeholder="example@gmail.com"
                    disabled={isPending}
                    dir="ltr"
                    className="
                      h-9
                      rounded-xl
                      border-border/60
                      bg-background/60
                      pr-9
                      text-left
                      text-[11px]
                      shadow-sm
                      transition-all
                      duration-300
                      placeholder:text-muted-foreground/40
                      focus:border-primary/50
                      focus:bg-background
                      focus:ring-4
                      focus:ring-primary/10
                      sm:h-10
                      sm:text-xs
                    "
                  />
                </div>
              </motion.div>

              {/* SUBMIT */}

              <motion.div
                variants={itemVariants}
                className="pt-0.5"
              >
                <Button
                  type="submit"
                  disabled={isPending}
                  className="
                    group
                    relative
                    h-9
                    w-full
                    overflow-hidden
                    rounded-xl
                    text-[11px]
                    font-bold
                    shadow-lg
                    shadow-primary/10
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    hover:shadow-primary/20
                    sm:h-10
                    sm:text-xs
                  "
                >
                  {!isPending && (
                    <motion.span
                      initial={{
                        x: "-150%",
                      }}
                      animate={{
                        x: "150%",
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                      className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        w-1/3
                        skew-x-[-20deg]
                        bg-gradient-to-r
                        from-transparent
                        via-white/20
                        to-transparent
                      "
                    />
                  )}

                  <span
                    className="
                      relative
                      flex
                      items-center
                      justify-center
                      gap-1.5
                    "
                  >
                    {emailPending ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />

                        جاري التحقق...
                      </>
                    ) : (
                      <>
                        <Send
                          className="
                            size-3.5
                            transition-transform
                            duration-300
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                          "
                        />

                        إنشاء الحساب
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>
            </form>

            {/* ================================================= */}
            {/* SECURITY */}
            {/* ================================================= */}

            <motion.div
              variants={itemVariants}
              className="
                mt-2.5
                flex
                items-center
                justify-center
                gap-1.5
                rounded-xl
                border
                border-border/40
                bg-muted/20
                px-2
                py-1.5
              "
            >
              <div
                className="
                  flex
                  size-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-primary/10
                  text-primary
                "
              >
                <Check className="size-3" />
              </div>

              <p
                className="
                  text-center
                  text-[8px]
                  leading-4
                  text-muted-foreground
                  sm:text-[9px]
                "
              >
                سنرسل رمز تحقق إلى بريدك الإلكتروني
                لتأكيد هويتك بأمان.
              </p>
            </motion.div>

            {/* ================================================= */}
            {/* LOGIN */}
            {/* ================================================= */}

            <motion.div
              variants={itemVariants}
              className="
                mt-2.5
                flex
                items-center
                justify-center
                gap-1
                text-[9px]
                text-muted-foreground
                sm:text-[10px]
              "
            >
              <span>
                لديك حساب بالفعل؟
              </span>

              <Link
                href="/login"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1
                  font-semibold
                  text-primary
                "
              >
                تسجيل الدخول

                <ArrowRight
                  className="
                    size-2.5
                    transition-transform
                    duration-300
                    group-hover:-translate-x-1
                  "
                />
              </Link>
            </motion.div>

            {/* ================================================= */}
            {/* SECURITY FOOTER */}
            {/* ================================================= */}

            <motion.div
              variants={itemVariants}
              className="
                mt-1.5
                flex
                items-center
                justify-center
                gap-1
                text-[8px]
                text-muted-foreground/60
              "
            >
              <Lock className="size-2.5" />

              <span>
                اتصال آمن ومشفر
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}


