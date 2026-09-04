
import { notFound } from "next/navigation"

import { adminGetCourse } from "@/app/data/admin/admin-get-course"
import EditCourseForm from "../edit/edit-course-form"

interface EditCoursePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCoursePage({
  params,
}: EditCoursePageProps) {
  const { id } = await params

  const course = await adminGetCourse(id)

  if (!course) {
    notFound()
  }

  return (
    <EditCourseForm course={course} />
  )
}

