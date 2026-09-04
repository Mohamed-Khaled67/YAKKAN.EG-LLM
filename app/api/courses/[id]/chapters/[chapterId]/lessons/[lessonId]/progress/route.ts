import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

// ============================================================
// TYPES
// ============================================================

type RouteContext = {
  params: Promise<{
    id: string
    lessonId: string
  }>
}

// ============================================================
// GET PROGRESS
// ============================================================

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id, lessonId } = await context.params

    // ==========================================================
    // VALIDATE PARAMS
    // ==========================================================

    if (!id || !lessonId) {
      return NextResponse.json(
        {
          error: "معرف الكورس أو الدرس غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // AUTHENTICATION
    // ==========================================================

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "يجب تسجيل الدخول أولاً",
        },
        {
          status: 401,
        }
      )
    }

    const userId = session.user.id

    // ==========================================================
    // CHECK ENROLLMENT
    // ==========================================================

    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: id,
          },
        },

        select: {
          id: true,
        },
      })

    if (!enrollment) {
      return NextResponse.json(
        {
          error: "أنت غير مسجل في هذا الكورس",
        },
        {
          status: 403,
        }
      )
    }

    // ==========================================================
    // CHECK LESSON
    // ==========================================================

    const lesson =
      await prisma.lesson.findFirst({
        where: {
          id: lessonId,

          chapter: {
            courseId: id,

            course: {
              isPublished: true,
            },
          },
        },

        select: {
          id: true,
        },
      })

    if (!lesson) {
      return NextResponse.json(
        {
          error: "الدرس غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // GET PROGRESS
    // ==========================================================

    const progress =
      await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },

        select: {
          id: true,
          progress: true,
          watchedSeconds: true,
          completed: true,
          completedAt: true,
          updatedAt: true,
        },
      })

    // ==========================================================
    // NO PROGRESS YET
    // ==========================================================

    if (!progress) {
      return NextResponse.json(
        {
          success: true,

          progress: {
            progress: 0,
            watchedSeconds: 0,
            completed: false,
            completedAt: null,
          },
        },
        {
          status: 200,
        }
      )
    }

    // ==========================================================
    // SUCCESS
    // ==========================================================

    return NextResponse.json(
      {
        success: true,

        progress: {
          progress: progress.progress,
          watchedSeconds: progress.watchedSeconds,
          completed: progress.completed,
          completedAt: progress.completedAt,
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "GET lesson progress error:",
      error
    )

    return NextResponse.json(
      {
        error: "حدث خطأ أثناء جلب تقدم الدرس",
      },
      {
        status: 500,
      }
    )
  }
}

// ============================================================
// SAVE PROGRESS
// ============================================================

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id, lessonId } = await context.params

    // ==========================================================
    // VALIDATE PARAMS
    // ==========================================================

    if (!id || !lessonId) {
      return NextResponse.json(
        {
          error: "معرف الكورس أو الدرس غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // AUTHENTICATION
    // ==========================================================

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "يجب تسجيل الدخول أولاً",
        },
        {
          status: 401,
        }
      )
    }

    const userId = session.user.id

    // ==========================================================
    // CHECK ENROLLMENT
    // ==========================================================

    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: id,
          },
        },

        select: {
          id: true,
        },
      })

    if (!enrollment) {
      return NextResponse.json(
        {
          error: "أنت غير مسجل في هذا الكورس",
        },
        {
          status: 403,
        }
      )
    }

    // ==========================================================
    // CHECK LESSON
    // ==========================================================

    const lesson =
      await prisma.lesson.findFirst({
        where: {
          id: lessonId,

          chapter: {
            courseId: id,

            course: {
              isPublished: true,
            },
          },
        },

        select: {
          id: true,
        },
      })

    if (!lesson) {
      return NextResponse.json(
        {
          error: "الدرس غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // READ BODY
    // ==========================================================

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          error: "بيانات الطلب غير صحيحة",
        },
        {
          status: 400,
        }
      )
    }

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          error: "بيانات الطلب غير صحيحة",
        },
        {
          status: 400,
        }
      )
    }

    const data = body as Record<
      string,
      unknown
    >

    // ==========================================================
    // PARSE PROGRESS
    // ==========================================================

    const rawProgress =
      typeof data.progress === "number"
        ? data.progress
        : Number(data.progress)

    const rawWatchedSeconds =
      typeof data.watchedSeconds === "number"
        ? data.watchedSeconds
        : Number(data.watchedSeconds)

    if (
      !Number.isFinite(rawProgress) ||
      !Number.isFinite(rawWatchedSeconds)
    ) {
      return NextResponse.json(
        {
          error: "قيمة التقدم غير صحيحة",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // NORMALIZE VALUES
    // ==========================================================

    const progress = Math.min(
      100,
      Math.max(0, rawProgress)
    )

    const watchedSeconds = Math.max(
      0,
      rawWatchedSeconds
    )

    // ==========================================================
    // COMPLETION
    //
    // 90% OR MORE = COMPLETED
    // ==========================================================

    const completed =
      progress >= 90

    // ==========================================================
    // UPSERT
    // ==========================================================

    const savedProgress =
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },

        create: {
          userId,
          lessonId,
          progress,
          watchedSeconds,
          completed,
          completedAt: completed
            ? new Date()
            : null,
        },

        update: {
          progress,
          watchedSeconds,
          completed,

          completedAt: completed
            ? undefined
            : null,
        },

        select: {
          id: true,
          progress: true,
          watchedSeconds: true,
          completed: true,
          completedAt: true,
        },
      })

    // ==========================================================
    // SUCCESS
    // ==========================================================

    return NextResponse.json(
      {
        success: true,

        progress: {
          progress: savedProgress.progress,
          watchedSeconds:
            savedProgress.watchedSeconds,
          completed: savedProgress.completed,
          completedAt:
            savedProgress.completedAt,
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "PUT lesson progress error:",
      error
    )

    return NextResponse.json(
      {
        error: "حدث خطأ أثناء حفظ تقدم الدرس",
      },
      {
        status: 500,
      }
    )
  }
}