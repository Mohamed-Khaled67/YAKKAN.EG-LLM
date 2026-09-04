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

    const chapterIds = items.map(
      (item) => item?.id
    )

    if (
      chapterIds.some(
        (item) =>
          typeof item !== "string"
      )
    ) {
      return NextResponse.json(
        {
          error: "معرف الفصل غير صحيح",
        },
        {
          status: 400,
        }
      )
    }

    const chapters =
      await prisma.chapter.findMany({
        where: {
          courseId,
          id: {
            in: chapterIds,
          },
        },
        select: {
          id: true,
        },
      })

    if (
      chapters.length !==
      chapterIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "بعض الفصول لا تنتمي إلى هذا الكورس",
        },
        {
          status: 400,
        }
      )
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.chapter.update({
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
      "Reorder chapters error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء ترتيب الفصول",
      },
      {
        status: 500,
      }
    )
  }
}