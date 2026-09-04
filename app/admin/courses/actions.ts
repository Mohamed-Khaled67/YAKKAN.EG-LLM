"use server"

import { z } from "zod"

import { prisma } from "@/lib/db"
import { courseSchema } from "@/lib/zodSchema"

// ============================================================
// SERVER ACTION SCHEMA
// ============================================================

const createCourseActionSchema =
  courseSchema
    .extend({
      mediaKey: z
        .string()
        .min(1),

      mediaType: z.enum([
        "IMAGE",
        "VIDEO",
      ]),

      mediaUrl: z
        .string()
        .url(),
    })

// ============================================================
// RESULT
// ============================================================

export type CreateCourseResult =
  | {
      success: true
      courseId: string
    }
  | {
      success: false
      error: string
    }

// ============================================================
// CREATE COURSE
// ============================================================

export async function createCourse(
  input: unknown
): Promise<CreateCourseResult> {
  try {
    // ========================================================
    // VALIDATE
    // ========================================================

    const validation =
      createCourseActionSchema.safeParse(
        input
      )

    if (!validation.success) {
      console.error(
        "Create course validation error:",
        validation.error.flatten()
      )

      return {
        success: false,
        error:
          "بيانات الكورس غير صحيحة، تأكد من مراجعة جميع الحقول.",
      }
    }

    const data =
      validation.data

    // ========================================================
    // SUBJECT
    // ========================================================

    const subject =
      await prisma.subject.findUnique({
        where: {
          id: data.subject,
        },
      })

    if (!subject) {
      return {
        success: false,
        error:
          "المادة المحددة غير موجودة.",
      }
    }

    // ========================================================
    // SECONDARY TRACK
    // ========================================================

    const requiresTrack =
      data.educationType ===
        "SECONDARY" &&
      (
        data.academicLevel ===
          "SECONDARY_GRADE_2" ||
        data.academicLevel ===
          "SECONDARY_GRADE_3"
      )

    if (
      requiresTrack &&
      !data.secondaryTrack
    ) {
      return {
        success: false,
        error:
          "يجب اختيار الشعبة.",
      }
    }

    // ========================================================
    // CREATE
    // ========================================================

    const course =
      await prisma.course.create({
        data: {
          title:
            data.title,

          description:
            data.description ||
            null,

          mediaUrl:
            data.mediaUrl,

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
            data.secondaryTrack ??
            null,

          subjectId:
            data.subject,

          level:
            data.courseLevel,

          isPublished:
            data.isPublished,
        },
      })

    // ========================================================
    // SUCCESS
    // ========================================================

    return {
      success: true,
      courseId:
        course.id,
    }
  } catch (error) {
    console.error(
      "Create course error:",
      error
    )

    return {
      success: false,
      error:
        "حدث خطأ أثناء إنشاء الكورس. حاول مرة أخرى.",
    }
  }
}