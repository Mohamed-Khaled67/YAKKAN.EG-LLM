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
  }>
}

// ============================================================
// GET COURSE PROGRESS
// ============================================================

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // ========================================================
    // AUTH
    // ========================================================

    const session =
      await auth.api.getSession({
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

    // ========================================================
    // ENROLLMENT
    // ========================================================

    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
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
          error:
            "أنت غير مسجل في هذا الكورس",
        },
        {
          status: 403,
        }
      )
    }

    // ========================================================
    // COURSE
    // ========================================================

    const course =
      await prisma.course.findUnique({
        where: {
          id,
        },

        select: {
          isPublished: true,

          chapters: {
            orderBy: {
              position: "asc",
            },

            select: {
              lessons: {
                orderBy: {
                  position: "asc",
                },

                select: {
                  id: true,
                },
              },
            },
          },
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

    if (!course.isPublished) {
      return NextResponse.json(
        {
          error: "هذا الكورس غير منشور",
        },
        {
          status: 403,
        }
      )
    }

    // ========================================================
    // LESSON IDS
    // ========================================================

    const lessons =
      course.chapters.flatMap(
        (chapter) => chapter.lessons
      )

    const lessonIds =
      lessons.map(
        (lesson) => lesson.id
      )

    // ========================================================
    // NO LESSONS
    // ========================================================

    if (lessonIds.length === 0) {
      return NextResponse.json({
        success: true,

        progress: {
          percentage: 0,
          completedLessons: 0,
          totalLessons: 0,
        },

        lessons: [],
      })
    }

    // ========================================================
    // USER PROGRESS
    // ========================================================

    const progress =
      await prisma.lessonProgress.findMany({
        where: {
          userId: session.user.id,

          lessonId: {
            in: lessonIds,
          },
        },

        select: {
          lessonId: true,
          progress: true,
          completed: true,
          watchedSeconds: true,
        },
      })

    // ========================================================
    // MAP
    // ========================================================

    const progressMap =
      new Map(
        progress.map(
          (item) => [
            item.lessonId,
            item,
          ]
        )
      )

    // ========================================================
    // CALCULATE
    // ========================================================

    let totalProgress = 0
    let completedLessons = 0

    for (const lesson of lessons) {
      const item =
        progressMap.get(lesson.id)

      const percentage =
        item?.completed
          ? 100
          : item?.progress ?? 0

      totalProgress += percentage

      if (item?.completed) {
        completedLessons++
      }
    }

    const percentage = Math.round(
      totalProgress / lessons.length
    )

    // ========================================================
    // SUCCESS
    // ========================================================

    return NextResponse.json({
      success: true,

      progress: {
        percentage,

        completedLessons,

        totalLessons:
          lessons.length,
      },

      lessons: lessons.map(
        (lesson) => {
          const item =
            progressMap.get(
              lesson.id
            )

          return {
            lessonId: lesson.id,

            // Keep frontend response name
            progressPercent:
              item?.progress ?? 0,

            completed:
              item?.completed ?? false,

            // Keep frontend response name
            lastPosition:
              item?.watchedSeconds ?? 0,
          }
        }
      ),
    })
  } catch (error) {
    console.error(
      "Get course progress error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء حساب تقدم الكورس",
      },
      {
        status: 500,
      }
    )
  }
}