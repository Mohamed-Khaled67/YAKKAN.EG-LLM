













"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  Loader2,
  ShoppingCart,
  CreditCard,
} from "lucide-react"

// ============================================================
// TYPES
// ============================================================

type EnrollButtonProps = {
  courseId: string
  price: number
}

// ============================================================
// COMPONENT
// ============================================================

export default function EnrollButton({
  courseId,
  price,
}: EnrollButtonProps) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [paymentCreated, setPaymentCreated] = useState(false)

  // ==========================================================
  // HANDLE ACTION
  // ==========================================================

  async function handleEnroll() {
    if (loading) {
      return
    }

    try {
      setLoading(true)
      setError("")

      // ========================================================
      // FREE COURSE
      // ========================================================

      if (price === 0) {
        const response = await fetch(
          `/api/courses/${courseId}/enroll`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        let data: any = null

        try {
          data = await response.json()
        } catch {
          data = null
        }

        console.log("ENROLL API RESPONSE:", {
          status: response.status,
          ok: response.ok,
          data,
        })

        // ------------------------------------------------------
        // NOT AUTHENTICATED
        // ------------------------------------------------------

        if (response.status === 401) {
          router.push(
            `/login?callbackUrl=/courses/${courseId}`
          )

          return
        }

        // ------------------------------------------------------
        // API ERROR
        // ------------------------------------------------------

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `فشل التسجيل - HTTP ${response.status}`
          )
        }

        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "تعذر التسجيل في الكورس"
          )
        }

        setSuccess(true)

        router.refresh()

        return
      }

      // ========================================================
      // PAID COURSE
      // ========================================================

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
        }),
      })

      let data: any = null

      try {
        data = await response.json()
      } catch {
        data = null
      }

      console.log("PAYMENT API RESPONSE:", {
        status: response.status,
        ok: response.ok,
        data,
      })

      // --------------------------------------------------------
      // NOT AUTHENTICATED
      // --------------------------------------------------------

      if (response.status === 401) {
        router.push(
          `/login?callbackUrl=/courses/${courseId}`
        )

        return
      }

      // --------------------------------------------------------
      // API ERROR
      // --------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `فشل إنشاء عملية الدفع - HTTP ${response.status}`
        )
      }

      // --------------------------------------------------------
      // PAYMENT CREATED
      // --------------------------------------------------------

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "تعذر إنشاء عملية الدفع"
        )
      }

      console.log("PAYMENT CREATED:", data)

      setPaymentCreated(true)
    } catch (error) {
      console.error("ENROLL/PAYMENT ERROR:", error)

      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تنفيذ العملية"
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================================
  // FREE COURSE SUCCESS
  // ==========================================================

  if (success) {
    return (
      <div className="space-y-3">
        <div
          className="
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-emerald-500/10
            text-sm
            font-black
            text-emerald-600
            dark:text-emerald-400
          "
        >
          <CheckCircle2 className="size-4" />

          تم التسجيل في الكورس بنجاح
        </div>

        <button
          type="button"
          onClick={() => {
            router.push(`/courses/${courseId}`)
          }}
          className="
            w-full
            text-center
            text-xs
            font-bold
            text-muted-foreground
            transition-colors
            hover:text-foreground
          "
        >
          الذهاب إلى الكورس
        </button>
      </div>
    )
  }

  // ==========================================================
  // PAYMENT CREATED
  // ==========================================================

  if (paymentCreated) {
    return (
      <div className="space-y-3">
        <div
          className="
            flex
            min-h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-amber-500/10
            px-4
            py-3
            text-center
            text-sm
            font-black
            text-amber-600
            dark:text-amber-400
          "
        >
          <CreditCard className="size-4 shrink-0" />

          تم إنشاء طلب الدفع بنجاح
        </div>

        <p
          className="
            text-center
            text-xs
            leading-6
            text-muted-foreground
          "
        >
          عملية الدفع جاهزة. سيتم ربطها بصفحة الدفع
          الخاصة بـ Paymob في الخطوة التالية.
        </p>
      </div>
    )
  }

  // ==========================================================
  // DEFAULT UI
  // ==========================================================

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading}
        className="
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-red-500
          text-sm
          font-black
          text-white
          shadow-lg
          shadow-red-500/20
          transition-all
          hover:bg-red-600
          hover:shadow-xl
          hover:shadow-red-500/25
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />

            {price === 0
              ? "جاري التسجيل..."
              : "جاري تجهيز الدفع..."}
          </>
        ) : (
          <>
            {price === 0 ? (
              <ShoppingCart className="size-4" />
            ) : (
              <CreditCard className="size-4" />
            )}

            {price === 0
              ? "التسجيل في الكورس"
              : "شراء الكورس"}
          </>
        )}
      </button>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="
            mt-3
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
            text-center
            text-xs
            font-semibold
            leading-6
            text-red-500
          "
        >
          {error}
        </div>
      )}
    </div>
  )
}

