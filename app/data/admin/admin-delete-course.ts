
"use server"

import { DeleteObjectCommand } from "@aws-sdk/client-s3"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

// ============================================================
// DELETE COURSE
// ============================================================

export async function adminDeleteCourse(
  courseId: string
) {
  // ==========================================================
  // ADMIN PROTECTION
  // ==========================================================

  await requireAdmin()

  // ==========================================================
  // VALIDATE COURSE ID
  // ==========================================================

  if (
    !courseId ||
    typeof courseId !== "string"
  ) {
    throw new Error(
      "معرّف الكورس غير صالح"
    )
  }

  // ==========================================================
  // GET COURSE + ALL LESSON VIDEO KEYS
  // ==========================================================

  const course =
    await prisma.course.findUnique({
      where: {
        id: courseId,
      },

      select: {
        id: true,
        title: true,
        mediaKey: true,

        chapters: {
          select: {
            lessons: {
              select: {
                videoKey: true,
              },
            },
          },
        },
      },
    })

  // ==========================================================
  // COURSE NOT FOUND
  // ==========================================================

  if (!course) {
    throw new Error(
      "الكورس غير موجود"
    )
  }

  // ==========================================================
  // COLLECT ALL STORAGE KEYS
  // ==========================================================

  const storageKeys =
    new Set<string>()

  // ----------------------------------------------------------
  // COURSE MEDIA
  // ----------------------------------------------------------

  if (
    course.mediaKey &&
    typeof course.mediaKey === "string" &&
    course.mediaKey.trim()
  ) {
    storageKeys.add(
      course.mediaKey.trim()
    )
  }

  // ----------------------------------------------------------
  // LESSON VIDEOS
  // ----------------------------------------------------------

  for (
    const chapter of course.chapters
  ) {
    for (
      const lesson of chapter.lessons
    ) {
      if (
        lesson.videoKey &&
        typeof lesson.videoKey === "string" &&
        lesson.videoKey.trim()
      ) {
        storageKeys.add(
          lesson.videoKey.trim()
        )
      }
    }
  }

  // ==========================================================
  // CONVERT SET TO ARRAY
  // ==========================================================

  const keysToDelete =
    Array.from(storageKeys)

  // ==========================================================
  // DEBUG LOG
  // ==========================================================

  console.log(
    "Course storage cleanup:",
    {
      courseId: course.id,
      courseTitle: course.title,
      totalFiles:
        keysToDelete.length,
      keys: keysToDelete,
    }
  )

  // ==========================================================
  // DELETE ALL FILES FROM TIGRIS / S3
  // ==========================================================

  if (
    keysToDelete.length > 0
  ) {
    await Promise.all(
      keysToDelete.map(
        async (key) => {
          try {
            await s3.send(
              new DeleteObjectCommand({
                Bucket:
                  env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

                Key: key,
              })
            )

            console.log(
              "Tigris object deleted:",
              key
            )
          } catch (error) {
            console.error(
              "Failed to delete Tigris object:",
              {
                key,
                error,
              }
            )

            throw new Error(
              `فشل حذف الملف من التخزين: ${key}`
            )
          }
        }
      )
    )
  }

  // ==========================================================
  // DELETE COURSE FROM DATABASE
  //
  // Lessons
  // ↓
  // Chapters
  // ↓
  // Course
  //
  // Prisma relation/cascade handles the related records.
  // ==========================================================

  await prisma.course.delete({
    where: {
      id: course.id,
    },
  })

  // ==========================================================
  // SUCCESS
  // ==========================================================

  console.log(
    "Course deleted successfully:",
    {
      courseId: course.id,
      courseTitle: course.title,
      deletedFiles:
        keysToDelete.length,
    }
  )

  return {
    success: true,

    deletedFiles:
      keysToDelete.length,
  }
}


