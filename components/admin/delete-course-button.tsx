
"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { adminDeleteCourse } from "@/app/data/admin/admin-delete-course"

interface DeleteCourseButtonProps {
  courseId: string
  courseTitle: string
}

export default function DeleteCourseButton({
  courseId,
  courseTitle,
}: DeleteCourseButtonProps) {
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف الكورس "${courseTitle}"؟\n\nسيتم حذف الكورس وملفه المرتبط من التخزين.`
    )

    if (!confirmed) {
      return
    }

    try {
      setIsDeleting(true)

      await adminDeleteCourse(courseId)

      router.refresh()
    } catch (error) {
      console.error("Delete course error:", error)

      window.alert(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء حذف الكورس"
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      type="button"
      title="حذف الكورس"
      onClick={handleDelete}
      disabled={isDeleting}
      className="
        flex
        size-8
        items-center
        justify-center
        rounded-lg
        border
        border-border
        bg-background
        text-muted-foreground
        transition
        hover:border-red-500/30
        hover:bg-red-500/10
        hover:text-red-500
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {isDeleting ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
    </button>
  )
}

