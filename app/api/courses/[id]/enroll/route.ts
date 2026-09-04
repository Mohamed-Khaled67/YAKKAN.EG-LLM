

import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// ============================================================
// ENROLL IN COURSE
// ============================================================

export async function POST(
  _request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    // ==========================================================
    // COURSE ID
    // ==========================================================

    const { id } = await context.params

    console.log("========================================")
    console.log("ENROLL REQUEST")
    console.log("Course ID:", id)
    console.log("========================================")

    // ==========================================================
    // SESSION
    // ==========================================================

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    console.log("Session exists:", !!session)
    console.log("User ID:", session?.user?.id)

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
    // COURSE
    // ==========================================================

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        price: true,
        isPublished: true,
      },
    })

    console.log("Course:", course)

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
    // FREE COURSE CHECK
    // ==========================================================

    if (course.price > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "هذا الكورس مدفوع ويحتاج إلى إتمام عملية الشراء",
        },
        {
          status: 403,
        }
      )
    }

    // ==========================================================
    // CHECK EXISTING ENROLLMENT
    // ==========================================================

    console.log("Checking existing enrollment...")

    const existingEnrollment =
      await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          },
        },
      })

    console.log(
      "Existing enrollment:",
      existingEnrollment
    )

    // ==========================================================
    // ALREADY ENROLLED
    // ==========================================================

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        alreadyEnrolled: true,
        message: "أنت مسجل بالفعل في هذا الكورس",
        enrollment: existingEnrollment,
      })
    }

    // ==========================================================
    // CREATE ENROLLMENT
    // ==========================================================

    console.log("Creating enrollment...")

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
      },
    })

    console.log("Enrollment created:", enrollment)

    // ==========================================================
    // SUCCESS
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        alreadyEnrolled: false,
        message: "تم التسجيل في الكورس بنجاح",
        enrollment,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    // ==========================================================
    // REAL ERROR
    // ==========================================================

    console.error("========================================")
    console.error("ENROLLMENT ERROR")
    console.error("========================================")

    console.error("Error:", error)

    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    console.error("========================================")

    // ==========================================================
    // TEMPORARY DEBUG RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "حدث خطأ غير معروف أثناء التسجيل",
      },
      {
        status: 500,
      }
    )
  }
}

