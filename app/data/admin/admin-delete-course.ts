
"use server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

export async function adminDeleteCourse(courseId: string) {
  await requireAdmin()

  if (!courseId || typeof courseId !== "string") {
    throw new Error("معرّف الكورس غير صالح")
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      mediaKey: true,
    },
  })

  if (!course) {
    throw new Error("الكورس غير موجود")
  }

  // حذف الملف من S3 لو موجود
  if (course.mediaKey) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
        Key: course.mediaKey,
      })
    )
  }

  // حذف الكورس من قاعدة البيانات
  await prisma.course.delete({
    where: {
      id: course.id,
    },
  })

  return {
    success: true,
  }
}

