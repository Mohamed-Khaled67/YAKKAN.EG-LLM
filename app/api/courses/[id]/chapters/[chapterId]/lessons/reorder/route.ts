import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    await requireAdmin()

    const { id: courseId } = await context.params

    if (!courseId) {
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

    const items = body?.items

    if (!Array.isArray(items)) {
      return NextResponse.json(
        {
          error: "بيانات الترتيب غير صحيحة",
        },
        {
          status: 400,
        }
      )
    }

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: true,
        },
        {
          status: 200,
        }
      )
    }

    const course =
      await prisma.course.findUnique({
        where: {
          id: courseId,
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

    const lessonIds = items.map(
      (item) => item?.id
    )

    if (
      lessonIds.some(
        (item) =>
          typeof item !== "string"
      )
    ) {
      return NextResponse.json(
        {
          error: "معرف الدرس غير صحيح",
        },
        {
          status: 400,
        }
      )
    }

    const lessons =
      await prisma.lesson.findMany({
        where: {
          id: {
            in: lessonIds,
          },
          chapter: {
            courseId,
          },
        },
        select: {
          id: true,
        },
      })

    if (
      lessons.length !==
      lessonIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "بعض الدروس لا تنتمي إلى هذا الكورس",
        },
        {
          status: 400,
        }
      )
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.lesson.update({
          where: {
            id: item.id,
          },
          data: {
            position: item.position,
          },
        })
      )
    )

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Reorder lessons error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء ترتيب الدروس",
      },
      {
        status: 500,
      }
    )
  }
}