import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"

// ============================================================
// GET CHAPTERS
// ============================================================

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    await requireAdmin()

    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        {
          error: "معرف الكورس غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        {
          error: "الكورس غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    const chapters = await prisma.chapter.findMany({
      where: {
        courseId: id,
      },
      orderBy: {
        position: "asc",
      },
      include: {
        lessons: {
          orderBy: {
            position: "asc",
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        chapters,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error("Get chapters error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء جلب الفصول",
      },
      {
        status: 500,
      }
    )
  }
}

// ============================================================
// CREATE CHAPTER
// ============================================================

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    await requireAdmin()

    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        {
          error: "معرف الكورس غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    const body = await request.json()

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : ""

    if (!title) {
      return NextResponse.json(
        {
          error: "اسم الفصل مطلوب",
        },
        {
          status: 400,
        }
      )
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        {
          error: "الكورس غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    const lastChapter =
      await prisma.chapter.findFirst({
        where: {
          courseId: id,
        },
        orderBy: {
          position: "desc",
        },
        select: {
          position: true,
        },
      })

    const position =
      lastChapter
        ? lastChapter.position + 1
        : 0

    const chapter =
      await prisma.chapter.create({
        data: {
          title,
          position,
          courseId: id,
        },
        include: {
          lessons: true,
        },
      })

    return NextResponse.json(
      {
        success: true,
        chapter,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error("Create chapter error:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء إنشاء الفصل",
      },
      {
        status: 500,
      }
    )
  }
}