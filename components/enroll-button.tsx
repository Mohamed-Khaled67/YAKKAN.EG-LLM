// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Loader2, ShoppingCart, CheckCircle2 } from "lucide-react"

// type EnrollButtonProps = {
//   courseId: string
//   price: number
// }

// export default function EnrollButton({
//   courseId,
//   price,
// }: EnrollButtonProps) {
//   const router = useRouter()

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState(false)

//   async function handleEnroll() {
//     try {
//       setLoading(true)
//       setError("")

//       const response = await fetch(
//         `/api/courses/${courseId}/enroll`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )

//       const data = await response.json()

//       if (response.status === 401) {
//         router.push(
//           `/login?callbackUrl=/courses/${courseId}`
//         )
//         return
//       }

//       if (!response.ok) {
//         throw new Error(
//           data?.message || "حدث خطأ أثناء التسجيل"
//         )
//       }

//       setSuccess(true)

//       router.refresh()
//     } catch (error) {
//       console.error("ENROLL_ERROR:", error)

//       setError(
//         error instanceof Error
//           ? error.message
//           : "حدث خطأ أثناء التسجيل"
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ==========================================================
//   // SUCCESS
//   // ==========================================================

//   if (success) {
//     return (
//       <div className="space-y-3">
//         <div
//           className="
//             flex
//             h-12
//             w-full
//             items-center
//             justify-center
//             gap-2
//             rounded-xl
//             bg-emerald-500/10
//             text-sm
//             font-black
//             text-emerald-600
//             dark:text-emerald-400
//           "
//         >
//           <CheckCircle2 className="size-4" />
//           تم التسجيل في الكورس بنجاح
//         </div>

//         <button
//           type="button"
//           onClick={() =>
//             router.push(`/courses/${courseId}`)
//           }
//           className="
//             w-full
//             text-center
//             text-xs
//             font-bold
//             text-muted-foreground
//             transition-colors
//             hover:text-foreground
//           "
//         >
//           الذهاب إلى الكورس
//         </button>
//       </div>
//     )
//   }

//   // ==========================================================
//   // BUTTON
//   // ==========================================================

//   return (
//     <div>
//       <button
//         type="button"
//         onClick={handleEnroll}
//         disabled={loading}
//         className="
//           flex
//           h-12
//           w-full
//           items-center
//           justify-center
//           gap-2
//           rounded-xl
//           bg-red-500
//           text-sm
//           font-black
//           text-white
//           shadow-lg
//           shadow-red-500/20
//           transition-all
//           hover:bg-red-600
//           hover:shadow-xl
//           hover:shadow-red-500/25
//           disabled:cursor-not-allowed
//           disabled:opacity-60
//         "
//       >
//         {loading ? (
//           <>
//             <Loader2 className="size-4 animate-spin" />
//             جاري التسجيل...
//           </>
//         ) : (
//           <>
//             <ShoppingCart className="size-4" />
//             {price === 0
//               ? "التسجيل في الكورس"
//               : "شراء الكورس"}
//           </>
//         )}
//       </button>

//       {error && (
//         <div
//           className="
//             mt-3
//             rounded-lg
//             border
//             border-red-500/20
//             bg-red-500/10
//             px-3
//             py-2
//             text-center
//             text-xs
//             font-semibold
//             text-red-500
//           "
//         >
//           {error}
//         </div>
//       )}
//     </div>
//   )
// }












"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  Loader2,
  ShoppingCart,
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

  // ==========================================================
  // ENROLL
  // ==========================================================

  async function handleEnroll() {
    if (loading) {
      return
    }

    try {
      setLoading(true)
      setError("")

      // ========================================================
      // SEND REQUEST
      // ========================================================

      const response = await fetch(
        `/api/courses/${courseId}/enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      // ========================================================
      // READ RESPONSE
      // ========================================================

      let data: any = null

      try {
        data = await response.json()
      } catch {
        data = null
      }

      // ========================================================
      // DEBUG
      // ========================================================

      console.log("ENROLL API RESPONSE:", {
        status: response.status,
        ok: response.ok,
        data,
      })

      // ========================================================
      // NOT AUTHENTICATED
      // ========================================================

      if (response.status === 401) {
        router.push(
          `/login?callbackUrl=/courses/${courseId}`
        )

        return
      }

      // ========================================================
      // API ERROR
      // ========================================================

      if (!response.ok) {
        console.error("ENROLL API ERROR:", {
          status: response.status,
          statusText: response.statusText,
          data,
        })

        throw new Error(
          data?.message ||
            `فشل التسجيل - HTTP ${response.status}`
        )
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      if (!data?.success) {
        console.error(
          "ENROLL API RETURNED SUCCESS FALSE:",
          data
        )

        throw new Error(
          data?.message ||
            "تعذر التسجيل في الكورس"
        )
      }

      // ========================================================
      // SUCCESS STATE
      // ========================================================

      setSuccess(true)

      // تحديث بيانات الصفحة
      router.refresh()
    } catch (error) {
      // ========================================================
      // ERROR
      // ========================================================

      console.error("ENROLL_ERROR:", error)

      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء التسجيل في الكورس"
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================================
  // SUCCESS UI
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

            جاري التسجيل...
          </>
        ) : (
          <>
            <ShoppingCart className="size-4" />

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

