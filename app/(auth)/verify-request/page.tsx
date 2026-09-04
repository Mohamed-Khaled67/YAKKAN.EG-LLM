"use client"

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react"
import {
  useRouter,
  useSearchParams,
} from "next/navigation"
import Link from "next/link"

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

// ============================================================
// VERIFY REQUEST CONTENT
// ============================================================

function VerifyRequestContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ============================================================
  // URL PARAMETERS
  // ============================================================

  const email = searchParams.get("email") || ""
  const name = searchParams.get("name") || ""

  // ============================================================
  // STATE
  // ============================================================

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ])

  const [isPending, startTransition] =
    useTransition()

  const [
    resendPending,
    startResendTransition,
  ] = useTransition()

  const [countdown, setCountdown] =
    useState(60)

  const inputRefs =
    useRef<(HTMLInputElement | null)[]>([])

  // ============================================================
  // COUNTDOWN
  // ============================================================

  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  // ============================================================
  // FOCUS FIRST INPUT
  // ============================================================

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // ============================================================
  // HANDLE OTP INPUT
  // ============================================================

  function handleChange(
    index: number,
    value: string
  ) {
    const number = value.replace(/\D/g, "")

    if (!number) {
      const newOtp = [...otp]

      newOtp[index] = ""

      setOtp(newOtp)

      return
    }

    // Handle paste / multiple numbers
    if (number.length > 1) {
      const digits = number
        .slice(0, 6)
        .split("")

      const newOtp = [...otp]

      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit
        }
      })

      setOtp(newOtp)

      const nextIndex = Math.min(
        index + digits.length,
        5
      )

      inputRefs.current[nextIndex]?.focus()

      return
    }

    const newOtp = [...otp]

    newOtp[index] = number

    setOtp(newOtp)

    // Move to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // ============================================================
  // HANDLE KEYBOARD
  // ============================================================

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp]

        newOtp[index] = ""

        setOtp(newOtp)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()

        const newOtp = [...otp]

        newOtp[index - 1] = ""

        setOtp(newOtp)
      }
    }

    if (
      e.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus()
    }

    if (
      e.key === "ArrowRight" &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // ============================================================
  // VERIFY OTP
  // ============================================================

  function handleVerify(
    e: React.FormEvent
  ) {
    e.preventDefault()

    const code = otp.join("")

    if (code.length !== 6) {
      toast.error(
        "من فضلك أدخل رمز التحقق المكون من 6 أرقام"
      )

      return
    }

    if (!email) {
      toast.error(
        "البريد الإلكتروني غير موجود"
      )

      return
    }

    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp: code,

        // ======================================================
        // IMPORTANT
        // ======================================================
        // name is only sent when coming from Register.
        // Login does not send a name.
        ...(name ? { name } : {}),

        fetchOptions: {
          onSuccess: () => {
            toast.success(
              name
                ? "تم إنشاء حسابك بنجاح 🎉"
                : "تم تسجيل الدخول بنجاح 🎉"
            )

            router.push("/")

            router.refresh()
          },

          onError: (error: {
            error: {
              message: string
            }
          }) => {
            toast.error(
              error.error.message ||
                "رمز التحقق غير صحيح"
            )
          },
        },
      })
    })
  }

  // ============================================================
  // RESEND OTP
  // ============================================================

  function handleResend() {
    if (countdown > 0 || !email) {
      return
    }

    startResendTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,

        type: "sign-in",

        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "تم إرسال رمز جديد إلى بريدك الإلكتروني"
            )

            setCountdown(60)

            setOtp([
              "",
              "",
              "",
              "",
              "",
              "",
            ])

            inputRefs.current[0]?.focus()
          },

          onError: (error) => {
            toast.error(
              error.error.message ||
                "حدث خطأ أثناء إرسال الرمز"
            )
          },
        },
      })
    })
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="relative w-full">
      {/* Background Glow */}

      <div
        className="
          pointer-events-none
          absolute
          -top-24
          left-1/2
          size-56
          -translate-x-1/2
          rounded-full
          bg-primary/15
          blur-[80px]
        "
      />

      {/* Card */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-border/50
          bg-background/75
          p-5
          shadow-2xl
          backdrop-blur-2xl
          sm:p-7
        "
      >
        {/* Top Gradient */}

        <div
          className="
            absolute
            left-0
            top-0
            h-1
            w-full
            rounded-t-3xl
            bg-gradient-to-r
            from-transparent
            via-primary
            to-transparent
          "
        />

        {/* Icon */}

        <div className="mb-5 flex justify-center">
          <div
            className="
              relative
              flex
              size-16
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              ring-1
              ring-primary/20
              shadow-lg
            "
          >
            <div
              className="
                absolute
                inset-1
                rounded-xl
                border
                border-primary/10
              "
            />

            <ShieldCheck className="size-8 text-primary" />

            <div
              className="
                absolute
                -right-1
                -top-1
                flex
                size-5
                items-center
                justify-center
                rounded-full
                bg-background
                ring-1
                ring-border
              "
            >
              <Lock className="size-2.5 text-primary" />
            </div>
          </div>
        </div>

        {/* Header */}

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            تحقق من بريدك الإلكتروني
          </h1>

          <p
            className="
              mx-auto
              mt-2
              max-w-sm
              text-xs
              leading-6
              text-muted-foreground
            "
          >
            أرسلنا رمز تحقق مكون من 6 أرقام
            إلى البريد الإلكتروني
          </p>

          {/* Email */}

          <div
            className="
              mx-auto
              mt-3
              flex
              w-fit
              max-w-full
              items-center
              gap-2
              rounded-full
              border
              border-border/60
              bg-muted/40
              px-3
              py-1.5
            "
          >
            <Mail className="size-3.5 text-primary" />

            <span
              dir="ltr"
              className="
                max-w-[230px]
                truncate
                text-xs
                font-medium
              "
            >
              {email || "البريد الإلكتروني"}
            </span>
          </div>
        </div>

        {/* OTP Form */}

        <form
          onSubmit={handleVerify}
          className="mt-7"
        >
          <div
            dir="ltr"
            className="
              flex
              justify-center
              gap-2
              sm:gap-3
            "
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                value={digit}
                onChange={(e) =>
                  handleChange(
                    index,
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(
                    index,
                    e
                  )
                }
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                disabled={isPending}
                className="
                  size-11
                  rounded-xl
                  border
                  border-border/70
                  bg-background
                  text-center
                  text-lg
                  font-bold
                  outline-none
                  transition-all
                  duration-200
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                  sm:size-12
                "
              />
            ))}
          </div>

          {/* Verify Button */}

          <Button
            type="submit"
            disabled={
              isPending ||
              otp.join("").length !== 6
            }
            className="
              mt-6
              h-11
              w-full
              gap-2
              font-semibold
              shadow-md
              transition-all
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />

                جاري التحقق...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />

                {name
                  ? "تأكيد الرمز وإنشاء الحساب"
                  : "تأكيد الرمز وتسجيل الدخول"}
              </>
            )}
          </Button>
        </form>

        {/* Resend */}

        <div className="mt-5 text-center">
          <p className="text-xs text-muted-foreground">
            لم يصلك الرمز؟
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={
              countdown > 0 ||
              resendPending ||
              !email
            }
            className="
              mt-2
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-semibold
              text-primary
              transition
              hover:underline
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {resendPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />

                جاري الإرسال...
              </>
            ) : countdown > 0 ? (
              <>
                <RefreshCw className="size-3.5" />

                إعادة الإرسال بعد{" "}
                {countdown} ثانية
              </>
            ) : (
              <>
                <RefreshCw className="size-3.5" />

                إعادة إرسال الرمز
              </>
            )}
          </button>
        </div>

        {/* Change Email */}

        <div
          className="
            mt-5
            border-t
            border-border/50
            pt-4
            text-center
          "
        >
          <Link
            href={
              name
                ? "/register"
                : "/login"
            }
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              text-muted-foreground
              transition
              hover:text-foreground
            "
          >
            <ArrowRight className="size-3.5" />

            استخدام بريد إلكتروني آخر
          </Link>
        </div>

        {/* Security */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-1.5
            text-[10px]
            text-muted-foreground
          "
        >
          <Lock className="size-3" />

          رمز التحقق صالح لفترة محدودة
        </div>
      </div>
    </div>
  )
}

// ============================================================
// PAGE
// ============================================================

export default function VerifyRequest() {
  return (
    <Suspense
      fallback={
        <div className="relative w-full">
          <div
            className="
              relative
              flex
              min-h-[300px]
              items-center
              justify-center
              rounded-3xl
              border
              border-border/50
              bg-background/75
              shadow-2xl
              backdrop-blur-2xl
            "
          >
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        </div>
      }
    >
      <VerifyRequestContent />
    </Suspense>
  )
}

