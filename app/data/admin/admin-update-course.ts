
import "server-only"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"

// ============================================================
// UPDATE COURSE
// ============================================================

export async function adminUpdateCourse(
  courseId: string,
  data: {
    title: string
    description: string | null

    mediaKey: string | null
    mediaType: "IMAGE" | "VIDEO" | null

    price: number

    educationType:
      | "UNIVERSITY"
      | "SECONDARY"

    academicLevel:
      | "UNIVERSITY_LEVEL_1"
      | "UNIVERSITY_LEVEL_2"
      | "UNIVERSITY_LEVEL_3"
      | "UNIVERSITY_LEVEL_4"
      | "SECONDARY_GRADE_1"
      | "SECONDARY_GRADE_2"
      | "SECONDARY_GRADE_3"

    semester:
      | "FIRST"
      | "SECOND"

    secondaryTrack:
      | "SCIENCE"
      | "LITERARY"
      | "SCIENCE_SCIENCES"
      | "SCIENCE_MATH"
      | null

    subjectId: string

    level:
      | "BEGINNER"
      | "INTERMEDIATE"
      | "ADVANCED"

    isPublished: boolean
  }
) {
  // ==========================================================
  // ADMIN PROTECTION
  // ==========================================================

  await requireAdmin()

  // ==========================================================
  // CHECK COURSE
  // ==========================================================

  const existingCourse =
    await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    })

  if (!existingCourse) {
    throw new Error(
      "الكورس غير موجود"
    )
  }

  // ==========================================================
  // CHECK SUBJECT
  // ==========================================================

  const subject =
    await prisma.subject.findUnique({
      where: {
        id: data.subjectId,
      },
    })

  if (!subject) {
    throw new Error(
      "المادة غير موجودة"
    )
  }

  // ==========================================================
  // UPDATE
  // ==========================================================

  const course =
    await prisma.course.update({
      where: {
        id: courseId,
      },

      data: {
        title: data.title,

        description:
          data.description,

        mediaKey:
          data.mediaKey,

        mediaType:
          data.mediaType,

        price:
          data.price,

        educationType:
          data.educationType,

        academicLevel:
          data.academicLevel,

        semester:
          data.semester,

        secondaryTrack:
          data.secondaryTrack,

        subjectId:
          data.subjectId,

        level:
          data.level,

        isPublished:
          data.isPublished,
      },

      select: {
        id: true,
        title: true,
        description: true,
        mediaKey: true,
        mediaType: true,
        mediaUrl: true,
        price: true,
        educationType: true,
        academicLevel: true,
        semester: true,
        secondaryTrack: true,
        level: true,
        subjectId: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,

        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    })

  return course
}

