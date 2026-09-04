



import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"

// ============================================================
// CREATE LESSON
// ============================================================

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string
      chapterId: string
    }>
  }
) {
  try {
    // ==========================================================
    // ADMIN PROTECTION
    // ==========================================================

    await requireAdmin()

    // ==========================================================
    // GET PARAMS
    // ==========================================================

    const { id, chapterId } =
      await context.params

    if (!id || !chapterId) {
      return NextResponse.json(
        {
          error:
            "معرف الكورس أو الفصل غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // READ BODY
    // ==========================================================

    const body =
      await request.json()

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : ""

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : ""

    const videoUrl =
      typeof body.videoUrl === "string"
        ? body.videoUrl.trim()
        : ""

    const videoKey =
      typeof body.videoKey === "string"
        ? body.videoKey.trim()
        : ""

    const videoType =
      body.videoType === "VIDEO"
        ? "VIDEO"
        : undefined

    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!title) {
      return NextResponse.json(
        {
          error:
            "اسم الدرس مطلوب",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // CHECK COURSE + CHAPTER
    // ==========================================================

    const chapter =
      await prisma.chapter.findFirst({
        where: {
          id: chapterId,
          courseId: id,
        },
        select: {
          id: true,
        },
      })

    if (!chapter) {
      return NextResponse.json(
        {
          error:
            "الفصل غير موجود داخل هذا الكورس",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // VALIDATE VIDEO DATA
    // ==========================================================

    if (videoUrl && !videoKey) {
      return NextResponse.json(
        {
          error:
            "مفتاح الفيديو غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    if (videoKey && !videoUrl) {
      return NextResponse.json(
        {
          error:
            "رابط الفيديو غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    if (
      videoKey &&
      !videoKey.startsWith(
        "courses/videos/"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "مسار الفيديو غير مسموح به",
        },
        {
          status: 403,
        }
      )
    }

    // ==========================================================
    // GET LAST LESSON POSITION
    // ==========================================================

    const lastLesson =
      await prisma.lesson.findFirst({
        where: {
          chapterId,
        },
        orderBy: {
          position: "desc",
        },
        select: {
          position: true,
        },
      })

    const position = lastLesson
      ? lastLesson.position + 1
      : 0

    // ==========================================================
    // CREATE LESSON
    // ==========================================================

    const lesson =
      await prisma.lesson.create({
        data: {
          title,

          description:
            description || null,

          position,

          videoUrl:
            videoUrl || null,

          videoKey:
            videoKey || null,

          videoType:
            videoType ?? null,

          chapterId,
        },
      })

    // ==========================================================
    // SUCCESS
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        lesson,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "Create lesson error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء إنشاء الدرس",
      },
      {
        status: 500,
      }
    )
  }
}

