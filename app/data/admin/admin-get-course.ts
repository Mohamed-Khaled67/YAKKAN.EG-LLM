
import "server-only"

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

import {
  universityData,
  secondaryData,
} from "@/lib/course-data"

// ============================================================
// GET ARABIC SUBJECT NAME
// ============================================================

function getSubjectArabicName(
  subjectId: string
) {
  // UNIVERSITY

  for (const level of Object.values(universityData)) {
    for (const semester of ["FIRST", "SECOND"] as const) {
      const subjects = level[semester]

      const subject = subjects.find(
        (item: { id: string; name: string }) =>
          item.id === subjectId
      )

      if (subject) {
        return subject.name
      }
    }
  }

  // SECONDARY

  for (const grade of Object.values(secondaryData)) {
    if (!grade.tracks) {
      for (const semester of ["FIRST", "SECOND"] as const) {
        const subjects = grade[semester]

        const subject = subjects.find(
          (item: { id: string; name: string }) =>
            item.id === subjectId
        )

        if (subject) {
          return subject.name
        }
      }

      continue
    }

    for (const track of Object.values(grade.tracks)) {
      for (const semester of ["FIRST", "SECOND"] as const) {
        const subjects = track[semester]

        const subject = subjects.find(
          (item: { id: string; name: string }) =>
            item.id === subjectId
        )

        if (subject) {
          return subject.name
        }
      }
    }
  }

  return subjectId
}

// ============================================================
// MEDIA URL
// ============================================================

async function getMediaUrl(
  mediaKey: string | null,
  mediaType: string | null
) {
  if (!mediaKey) {
    return null
  }

  if (
    mediaType !== "IMAGE" &&
    mediaType !== "VIDEO"
  ) {
    return null
  }

  try {
    const command = new GetObjectCommand({
      Bucket:
        env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

      Key: mediaKey,
    })

    return await getSignedUrl(
      s3,
      command,
      {
        expiresIn: 60 * 60,
      }
    )
  } catch (error) {
    console.error(
      "Failed to generate media URL:",
      error
    )

    return null
  }
}

// ============================================================
// GET SINGLE COURSE
// ============================================================

export async function adminGetCourse(
  courseId: string
) {
  // ==========================================================
  // ADMIN PROTECTION
  // ==========================================================

  await requireAdmin()

  // ==========================================================
  // GET COURSE
  // ==========================================================

  const course =
    await prisma.course.findUnique({
      where: {
        id: courseId,
      },

      select: {
        id: true,

        title: true,

        description: true,

        mediaUrl: true,

        mediaKey: true,

        mediaType: true,

        price: true,

        level: true,

        educationType: true,

        academicLevel: true,

        semester: true,

        secondaryTrack: true,

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

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!course) {
    return null
  }

  // ==========================================================
  // MEDIA
  // ==========================================================

  const generatedMediaUrl =
    await getMediaUrl(
      course.mediaKey,
      course.mediaType
    )

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    ...course,

    mediaUrl:
      generatedMediaUrl ??
      course.mediaUrl,

    subject:
      course.subject
        ? {
            ...course.subject,

            name:
              getSubjectArabicName(
                course.subject.code
              ),
          }
        : null,
  }
}

