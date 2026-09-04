import { notFound } from "next/navigation"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"

import CurriculumManager from "./curriculum-manager"

interface CurriculumPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CurriculumPage({
  params,
}: CurriculumPageProps) {
  // ============================================================
  // ADMIN PROTECTION
  // ============================================================

  await requireAdmin()

  // ============================================================
  // GET COURSE ID
  // ============================================================

  const { id } = await params

  if (!id) {
    notFound()
  }

  // ============================================================
  // GET COURSE WITH CURRICULUM
  // ============================================================

  const course = await prisma.course.findUnique({
    where: {
      id,
    },

    include: {
      subject: true,

      chapters: {
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
      },
    },
  })

  // ============================================================
  // COURSE NOT FOUND
  // ============================================================

  if (!course) {
    notFound()
  }

  // ============================================================
  // SERIALIZE DATA
  // ============================================================

  const serializedCourse = {
    id: course.id,
    title: course.title,

    subject: course.subject
      ? {
          id: course.subject.id,
          name: course.subject.name,
          code: course.subject.code,
        }
      : null,

    chapters: course.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      position: chapter.position,

      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        position: lesson.position,
        videoUrl: lesson.videoUrl,
        videoKey: lesson.videoKey,
        videoType: lesson.videoType as "IMAGE" | "VIDEO" | null,
      })),
    })),
  }

  // ============================================================
  // RENDER
  // ============================================================

  return <CurriculumManager course={serializedCourse} />
}