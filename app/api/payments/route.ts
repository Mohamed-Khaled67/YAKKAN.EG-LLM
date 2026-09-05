
import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// ============================================================
// CREATE PAYMENT
// ============================================================

export async function POST(request: Request) {
  try {
    // ==========================================================
    // SESSION
    // ==========================================================

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب تسجيل الدخول أولًا",
        },
        {
          status: 401,
        }
      )
    }

    // ==========================================================
    // REQUEST BODY
    // ==========================================================

    let body: {
      courseId?: string
    }

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "بيانات الطلب غير صحيحة",
        },
        {
          status: 400,
        }
      )
    }

    const courseId = body.courseId

    if (!courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "معرف الكورس مطلوب",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // COURSE
    // ==========================================================

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        isPublished: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "الكورس غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // PUBLISHED CHECK
    // ==========================================================

    if (!course.isPublished) {
      return NextResponse.json(
        {
          success: false,
          message: "هذا الكورس غير منشور",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // PAID COURSE CHECK
    // ==========================================================

    if (course.price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "هذا الكورس مجاني ولا يحتاج إلى عملية دفع",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // CHECK EXISTING ENROLLMENT
    // ==========================================================

    const existingEnrollment =
      await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          },
        },
      })

    if (existingEnrollment) {
      return NextResponse.json(
        {
          success: false,
          message: "أنت مسجل بالفعل في هذا الكورس",
          alreadyEnrolled: true,
        },
        {
          status: 409,
        }
      )
    }

    // ==========================================================
    // CHECK EXISTING PENDING PAYMENT
    // ==========================================================

    const existingPendingPayment =
      await prisma.payment.findFirst({
        where: {
          userId: session.user.id,
          courseId: course.id,
          status: "PENDING",
        },
        orderBy: {
          createdAt: "desc",
        },
      })

    if (existingPendingPayment) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        message: "لديك عملية دفع معلقة بالفعل",
        payment: {
          id: existingPendingPayment.id,
          courseId: existingPendingPayment.courseId,
          amount: existingPendingPayment.amount,
          currency: existingPendingPayment.currency,
          status: existingPendingPayment.status,
          createdAt: existingPendingPayment.createdAt,
        },
      })
    }

    // ==========================================================
    // CREATE PAYMENT
    // ==========================================================

    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        amount: course.price,
        currency: "EGP",
        status: "PENDING",
      },
    })

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        alreadyExists: false,
        message: "تم إنشاء عملية الدفع بنجاح",
        payment: {
          id: payment.id,
          courseId: payment.courseId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          createdAt: payment.createdAt,
        },
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    // ==========================================================
    // ERROR
    // ==========================================================

    console.error("CREATE PAYMENT ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء إنشاء عملية الدفع",
      },
      {
        status: 500,
      }
    )
  }
}

