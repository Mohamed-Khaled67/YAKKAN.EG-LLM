
"use client"

import {
  useRef,
  useState,
} from "react"

import Link from "next/link"

import FileUpload from "@/components/file-uploader/uploader"

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"

import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Video,
  X,
  CheckCircle2,
} from "lucide-react"

// ============================================================
// CONSTANTS
// ============================================================

const MAX_VIDEO_SIZE =
  5 * 1024 * 1024 * 1024

// ============================================================
// TYPES
// ============================================================

type Lesson = {
  id: string
  title: string
  description: string | null
  position: number
  videoUrl: string | null
  videoKey: string | null
  videoType:
    | "IMAGE"
    | "VIDEO"
    | null
  isFree: boolean
}

type Chapter = {
  id: string
  title: string
  position: number
  lessons: Lesson[]
}

type Course = {
  id: string
  title: string

  subject: {
    id: string
    name: string
    code: string
  } | null

  chapters: Chapter[]
}

interface CurriculumManagerProps {
  course: Course
}

type ModalState =
  | null
  | {
      type:
        | "chapter"
        | "lesson"

      mode:
        | "create"
        | "edit"

      chapterId?: string
      itemId?: string
    }

// ============================================================
// API HELPER
// ============================================================

async function parseApiResponse(
  response: Response
) {
  const contentType =
    response.headers.get(
      "content-type"
    ) || ""

  if (
    !contentType.includes(
      "application/json"
    )
  ) {
    const text =
      await response.text()

    console.error(
      "API returned non-JSON response:",
      text
    )

    throw new Error(
      `السيرفر رجّع استجابة غير صحيحة (${response.status})`
    )
  }

  return response.json()
}

// ============================================================
// SORTABLE CHAPTER
// ============================================================

function SortableChapter({
  chapter,
  children,
  onEdit,
  onDelete,
  onAddLesson,
  expanded,
  onToggle,
}: {
  chapter: Chapter
  children: React.ReactNode
  onEdit: () => void
  onDelete: () => void
  onAddLesson: () => void
  expanded: boolean
  onToggle: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: chapter.id,
  })

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-2xl border bg-background transition ${
        isDragging
          ? "z-50 border-red-500 opacity-90 shadow-2xl"
          : "border-border shadow-sm"
      }`}
    >
      <div
        className="
          flex
          items-center
          gap-3
          border-b
          border-border
          bg-muted/[0.15]
          p-4
        "
      >
        {/* DRAG */}

        <button
          type="button"
          {...attributes}
          {...listeners}
          className="
            flex size-9 shrink-0
            cursor-grab
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            transition
            hover:bg-muted
            hover:text-foreground
            active:cursor-grabbing
          "
          aria-label="تحريك الشابتر"
        >
          <GripVertical className="size-5" />
        </button>

        {/* TOGGLE */}

        <button
          type="button"
          onClick={
            onToggle
          }
          className="
            flex size-9 shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-border
            bg-background
            transition
            hover:border-red-500/40
            hover:text-red-500
          "
        >
          {expanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>

        {/* TITLE */}

        <button
          type="button"
          onClick={
            onToggle
          }
          className="
            min-w-0
            flex-1
            text-right
          "
        >
          <div className="flex items-center gap-2">
            <span
              className="
                rounded-lg
                bg-red-500/10
                px-2 py-1
                text-[10px]
                font-black
                text-red-500
              "
            >
              Chapter
            </span>

            <span className="text-xs text-muted-foreground">
              {chapter.lessons.length}{" "}
              {chapter.lessons.length ===
              1
                ? "درس"
                : "دروس"}
            </span>
          </div>

          <h3 className="mt-1 truncate text-base font-black">
            {chapter.title}
          </h3>
        </button>

        {/* ACTIONS */}

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={
              onEdit
            }
            className="
              flex size-9
              items-center
              justify-center
              rounded-lg
              text-muted-foreground
              transition
              hover:bg-blue-500/10
              hover:text-blue-500
            "
          >
            <Pencil className="size-4" />
          </button>

          <button
            type="button"
            onClick={
              onDelete
            }
            className="
              flex size-9
              items-center
              justify-center
              rounded-lg
              text-muted-foreground
              transition
              hover:bg-red-500/10
              hover:text-red-500
            "
          >
            <Trash2 className="size-4" />
          </button>

          <button
            type="button"
            onClick={
              onAddLesson
            }
            className="
              flex h-9
              items-center
              gap-1.5
              rounded-lg
              bg-red-500
              px-3
              text-xs
              font-bold
              text-white
              transition
              hover:bg-red-600
            "
          >
            <Plus className="size-3.5" />
            درس
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  )
}

// ============================================================
// SORTABLE LESSON
// ============================================================

function SortableLesson({
  lesson,
  onEdit,
  onDelete,
}: {
  lesson: Lesson
  onEdit: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lesson.id,
  })

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border bg-background p-3 transition ${
        isDragging
          ? "z-50 border-red-500 shadow-xl"
          : "border-border"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="
          flex size-8 shrink-0
          cursor-grab
          items-center
          justify-center
          rounded-lg
          text-muted-foreground
          hover:bg-muted
          active:cursor-grabbing
        "
      >
        <GripVertical className="size-4" />
      </button>

      <div
        className="
          flex size-9 shrink-0
          items-center
          justify-center
          rounded-lg
          bg-red-500/10
          text-red-500
        "
      >
        <Video className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold">
            {lesson.title}
          </p>

          {lesson.isFree && (
            <span
              className="
                shrink-0
                rounded-full
                bg-emerald-500/10
                px-2 py-0.5
                text-[10px]
                font-bold
                text-emerald-500
              "
            >
              مجاني
            </span>
          )}
        </div>

        {lesson.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {lesson.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={
            onEdit
          }
          className="
            flex size-8
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            hover:bg-blue-500/10
            hover:text-blue-500
          "
        >
          <Pencil className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={
            onDelete
          }
          className="
            flex size-8
            items-center
            justify-center
            rounded-lg
            text-muted-foreground
            hover:bg-red-500/10
            hover:text-red-500
          "
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

// ============================================================
// COMPONENT
// ============================================================

export default function CurriculumManager({
  course,
}: CurriculumManagerProps) {
  // ==========================================================
  // CHAPTERS
  // ==========================================================

  const [chapters, setChapters] =
    useState<Chapter[]>(
      [...course.chapters]
        .sort(
          (a, b) =>
            a.position -
            b.position
        )
        .map((chapter) => ({
          ...chapter,
          lessons: [
            ...chapter.lessons,
          ].sort(
            (a, b) =>
              a.position -
              b.position
          ),
        }))
    )

  const [
    expandedChapters,
    setExpandedChapters,
  ] = useState<Set<string>>(
    new Set(
      course.chapters.map(
        (chapter) =>
          chapter.id
      )
    )
  )

  // ==========================================================
  // GENERAL STATE
  // ==========================================================

  const [loading, setLoading] =
    useState(false)

  const [uploading, setUploading] =
    useState(false)

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState(0)

  // ==========================================================
  // PREVENT DOUBLE SAVE
  // ==========================================================

  const saveLessonLock =
    useRef(false)

  // ==========================================================
  // MODAL
  // ==========================================================

  const [modal, setModal] =
    useState<ModalState>(null)

  // ==========================================================
  // FORM
  // ==========================================================

  const [title, setTitle] =
    useState("")

  const [
    description,
    setDescription,
  ] = useState("")

  const [isFree, setIsFree] =
    useState(false)

  // ==========================================================
  // VIDEO
  // ==========================================================

  const [
    videoFile,
    setVideoFile,
  ] = useState<File | null>(
    null
  )

  const [
    videoKey,
    setVideoKey,
  ] = useState<string | null>(
    null
  )

  const [
    videoUrl,
    setVideoUrl,
  ] = useState<string | null>(
    null
  )

  const [
    videoType,
    setVideoType,
  ] = useState<
    "VIDEO" | null
  >(null)

  // Original DB video.
  // Used when editing to clean old S3 objects
  // only AFTER successful DB update.
  const [
    originalVideoKey,
    setOriginalVideoKey,
  ] = useState<
    string | null
  >(null)

  // ==========================================================
  // ERROR
  // ==========================================================

  const [error, setError] =
    useState<string | null>(
      null
    )

  // ==========================================================
  // DND
  // ==========================================================

  const sensors =
    useSensors(
      useSensor(
        PointerSensor,
        {
          activationConstraint: {
            distance: 8,
          },
        }
      )
    )

  // ==========================================================
  // TOGGLE CHAPTER
  // ==========================================================

  const toggleChapter = (
    chapterId: string
  ) => {
    setExpandedChapters(
      (previous) => {
        const next =
          new Set(previous)

        if (
          next.has(
            chapterId
          )
        ) {
          next.delete(
            chapterId
          )
        } else {
          next.add(
            chapterId
          )
        }

        return next
      }
    )
  }

  // ==========================================================
  // CREATE CHAPTER
  // ==========================================================

  const openCreateChapter =
    () => {
      setTitle("")
      setDescription("")
      setIsFree(false)
      setError(null)

      setModal({
        type: "chapter",
        mode: "create",
      })
    }

  // ==========================================================
  // EDIT CHAPTER
  // ==========================================================

  const openEditChapter = (
    chapter: Chapter
  ) => {
    setTitle(
      chapter.title
    )

    setDescription("")
    setIsFree(false)
    setError(null)

    setModal({
      type: "chapter",
      mode: "edit",
      itemId:
        chapter.id,
    })
  }

  // ==========================================================
  // CREATE LESSON
  // ==========================================================

  const openCreateLesson = (
    chapterId: string
  ) => {
    setTitle("")
    setDescription("")
    setIsFree(false)

    setVideoFile(null)
    setVideoKey(null)
    setVideoUrl(null)
    setVideoType(null)

    setOriginalVideoKey(
      null
    )

    setError(null)

    setUploadProgress(0)
    setUploading(false)

    saveLessonLock.current =
      false

    setModal({
      type: "lesson",
      mode: "create",
      chapterId,
    })
  }

  // ==========================================================
  // EDIT LESSON
  // ==========================================================

  const openEditLesson = (
    chapterId: string,
    lesson: Lesson
  ) => {
    setTitle(
      lesson.title
    )

    setDescription(
      lesson.description ??
        ""
    )

    setIsFree(
      lesson.isFree
    )

    setVideoFile(null)

    setVideoKey(
      lesson.videoKey ??
        null
    )

    setVideoUrl(
      lesson.videoUrl ??
        null
    )

    setVideoType(
      lesson.videoType ===
        "VIDEO"
        ? "VIDEO"
        : null
    )

    setOriginalVideoKey(
      lesson.videoKey ??
        null
    )

    setError(null)

    setUploadProgress(0)
    setUploading(false)

    saveLessonLock.current =
      false

    setModal({
      type: "lesson",
      mode: "edit",
      chapterId,
      itemId:
        lesson.id,
    })
  }

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (
      loading ||
      uploading
    ) {
      return
    }

    setModal(null)

    setTitle("")
    setDescription("")
    setIsFree(false)

    setVideoFile(null)
    setVideoKey(null)
    setVideoUrl(null)
    setVideoType(null)

    setOriginalVideoKey(
      null
    )

    setUploadProgress(0)
    setUploading(false)

    setError(null)

    saveLessonLock.current =
      false
  }

  // ==========================================================
  // VIDEO FILE CHANGE
  //
  // IMPORTANT:
  // This function DOES NOT upload.
  // FileUpload handles the upload.
  // ==========================================================

  const handleLessonVideoChange =
    (
      file: File | null
    ) => {
      setError(null)

      if (!file) {
        setVideoFile(null)

        // If the user removes a newly
        // selected file, clear uploaded data.
        if (
          originalVideoKey ===
          null
        ) {
          setVideoKey(null)
          setVideoUrl(null)
          setVideoType(null)
        }

        return
      }

      if (
        !file.type.startsWith(
          "video/"
        )
      ) {
        setVideoFile(null)

        setError(
          "من فضلك اختر ملف فيديو فقط"
        )

        return
      }

      if (
        file.size >
        MAX_VIDEO_SIZE
      ) {
        setVideoFile(null)

        setError(
          "حجم الفيديو لا يمكن أن يتجاوز 5GB"
        )

        return
      }

      setVideoFile(file)
    }

  // ==========================================================
  // UPLOAD COMPLETE
  //
  // This is called ONCE by FileUpload.
  // ==========================================================

  const handleLessonVideoUploadComplete =
    (
      key: string,
      url: string
    ) => {
      setVideoKey(key)
      setVideoUrl(url)
      setVideoType(
        "VIDEO"
      )

      setUploadProgress(
        100
      )

      setUploading(false)

      setError(null)
    }

  // ==========================================================
  // UPLOAD STATE
  // ==========================================================

  const handleUploadStateChange =
    (
      isUploading: boolean,
      progress: number
    ) => {
      setUploading(
        isUploading
      )

      setUploadProgress(
        progress
      )

      if (
        isUploading
      ) {
        setError(null)
      }
    }

  // ==========================================================
  // DELETE UPLOAD
  // ==========================================================

  const handleLessonVideoDelete =
    () => {
      setVideoFile(null)

      setVideoKey(null)
      setVideoUrl(null)
      setVideoType(null)

      setUploadProgress(0)
      setUploading(false)
    }

  // ==========================================================
  // DELETE S3 OBJECT
  // ==========================================================

  const deleteS3Object = async (
    key: string | null
  ) => {
    if (!key) {
      return
    }

    try {
      const response =
        await fetch(
          "/api/s3/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              key,
            }),
          }
        )

      if (!response.ok) {
        console.error(
          "Failed to delete S3 object:",
          key
        )
      }
    } catch (error) {
      console.error(
        "Failed to delete S3 object:",
        error
      )
    }
  }

  // ==========================================================
  // SAVE CHAPTER
  // ==========================================================

  const saveChapter =
    async () => {
      const cleanTitle =
        title.trim()

      if (!cleanTitle) {
        setError(
          "اسم الشابتر مطلوب"
        )
        return
      }

      if (
        !modal ||
        modal.type !==
          "chapter"
      ) {
        return
      }

      try {
        setLoading(true)
        setError(null)

        const isEdit =
          modal.mode ===
          "edit"

        const url = isEdit
          ? `/api/courses/${course.id}/chapters/${modal.itemId}`
          : `/api/courses/${course.id}/chapters`

        const response =
          await fetch(
            url,
            {
              method: isEdit
                ? "PUT"
                : "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  title:
                    cleanTitle,

                  ...(isEdit
                    ? {}
                    : {
                        position:
                          chapters.length,
                      }),
                }
              ),
            }
          )

        const result =
          await parseApiResponse(
            response
          )

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل حفظ الشابتر"
          )
        }

        if (isEdit) {
          setChapters(
            (previous) =>
              previous.map(
                (
                  chapter
                ) =>
                  chapter.id ===
                  modal.itemId
                    ? {
                        ...chapter,

                        title:
                          result
                            .chapter
                            ?.title ??
                          cleanTitle,

                        position:
                          result
                            .chapter
                            ?.position ??
                          chapter.position,
                      }
                    : chapter
              )
          )
        } else {
          const newChapter =
            result.chapter

          if (!newChapter) {
            throw new Error(
              "لم يتم إرجاع الشابتر الجديد"
            )
          }

          const chapter:
            Chapter = {
            id:
              newChapter.id,

            title:
              newChapter.title,

            position:
              newChapter.position ??
              chapters.length,

            lessons:
              newChapter.lessons ??
              [],
          }

          setChapters(
            (previous) => [
              ...previous,
              chapter,
            ]
          )

          setExpandedChapters(
            (previous) => {
              const next =
                new Set(
                  previous
                )

              next.add(
                chapter.id
              )

              return next
            }
          )
        }

        closeModal()
      } catch (error) {
        setError(
          error instanceof
            Error
            ? error.message
            : "حدث خطأ أثناء حفظ الشابتر"
        )
      } finally {
        setLoading(false)
      }
    }

  // ==========================================================
  // SAVE LESSON
  //
  // IMPORTANT:
  // NO UPLOAD HERE.
  //
  // FileUpload already uploaded the file.
  // We only save videoKey/videoUrl into DB.
  // ==========================================================

  const saveLesson =
    async () => {
      const cleanTitle =
        title.trim()

      const cleanDescription =
        description.trim() ||
        null

      if (!cleanTitle) {
        setError(
          "اسم الدرس مطلوب"
        )
        return
      }

      if (
        !modal ||
        modal.type !==
          "lesson"
      ) {
        return
      }

      if (!modal.chapterId) {
        setError(
          "الشابتر غير محدد"
        )
        return
      }

      // --------------------------------------------------------
      // Prevent double save
      // --------------------------------------------------------

      if (
        saveLessonLock.current
      ) {
        return
      }

      // --------------------------------------------------------
      // Do not save while video is uploading
      // --------------------------------------------------------

      if (uploading) {
        setError(
          "انتظر حتى يكتمل رفع الفيديو أولًا"
        )
        return
      }

      // --------------------------------------------------------
      // If a file exists but no key exists,
      // upload failed or isn't complete.
      // --------------------------------------------------------

      if (
        videoFile &&
        !videoKey
      ) {
        setError(
          "انتظر حتى يكتمل رفع الفيديو"
        )
        return
      }

      saveLessonLock.current =
        true

      let newUploadedKey:
        | string
        | null = null

      try {
        setLoading(true)
        setError(null)

        const isEdit =
          modal.mode ===
          "edit"

        const chapter =
          chapters.find(
            (item) =>
              item.id ===
              modal.chapterId
          )

        if (!chapter) {
          throw new Error(
            "الشابتر غير موجود"
          )
        }

        // ------------------------------------------------------
        // Determine whether current video is a new upload.
        // ------------------------------------------------------

        if (
          videoKey &&
          videoKey !==
            originalVideoKey
        ) {
          newUploadedKey =
            videoKey
        }

        // ------------------------------------------------------
        // SAVE LESSON IN DATABASE
        // ------------------------------------------------------

        const url = isEdit
          ? `/api/courses/${course.id}/chapters/${modal.chapterId}/lessons/${modal.itemId}`
          : `/api/courses/${course.id}/chapters/${modal.chapterId}/lessons`

        const response =
          await fetch(
            url,
            {
              method: isEdit
                ? "PUT"
                : "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  title:
                    cleanTitle,

                  description:
                    cleanDescription,

                  isFree,

                  videoUrl:
                    videoUrl,

                  videoKey:
                    videoKey,

                  videoType:
                    videoType,

                  ...(isEdit
                    ? {}
                    : {
                        position:
                          chapter
                            .lessons
                            .length,
                      }),
                }
              ),
            }
          )

        const result =
          await parseApiResponse(
            response
          )

        // ------------------------------------------------------
        // DB SAVE FAILED
        // ------------------------------------------------------

        if (!response.ok) {
          // New video was already uploaded to S3.
          // Since DB save failed, clean it up.
          if (
            newUploadedKey
          ) {
            await deleteS3Object(
              newUploadedKey
            )
          }

          throw new Error(
            result.error ||
              "فشل حفظ الدرس"
          )
        }

        // ======================================================
        // EDIT
        // ======================================================

        if (isEdit) {
          setChapters(
            (previous) =>
              previous.map(
                (
                  item
                ) => {
                  if (
                    item.id !==
                    modal.chapterId
                  ) {
                    return item
                  }

                  return {
                    ...item,

                    lessons:
                      item.lessons.map(
                        (
                          lesson
                        ) =>
                          lesson.id ===
                          modal.itemId
                            ? {
                                ...lesson,

                                title:
                                  result
                                    .lesson
                                    ?.title ??
                                  cleanTitle,

                                description:
                                  result
                                    .lesson
                                    ?.description ??
                                  cleanDescription,

                                position:
                                  result
                                    .lesson
                                    ?.position ??
                                  lesson.position,

                                videoUrl:
                                  result
                                    .lesson
                                    ?.videoUrl ??
                                  videoUrl,

                                videoKey:
                                  result
                                    .lesson
                                    ?.videoKey ??
                                  videoKey,

                                videoType:
                                  result
                                    .lesson
                                    ?.videoType ??
                                  videoType,

                                isFree:
                                  result
                                    .lesson
                                    ?.isFree ??
                                  isFree,
                              }
                            : lesson
                      ),
                  }
                }
              )
          )

          // ----------------------------------------------------
          // IMPORTANT:
          // Delete old video ONLY after DB successfully
          // points to the new video.
          // ----------------------------------------------------

          if (
            originalVideoKey &&
            originalVideoKey !==
              videoKey
          ) {
            await deleteS3Object(
              originalVideoKey
            )
          }
        }

        // ======================================================
        // CREATE
        // ======================================================

        else {
          const newLesson =
            result.lesson

          if (!newLesson) {
            if (
              newUploadedKey
            ) {
              await deleteS3Object(
                newUploadedKey
              )
            }

            throw new Error(
              "لم يتم إرجاع الدرس الجديد"
            )
          }

          setChapters(
            (previous) =>
              previous.map(
                (
                  item
                ) => {
                  if (
                    item.id !==
                    modal.chapterId
                  ) {
                    return item
                  }

                  return {
                    ...item,

                    lessons: [
                      ...item.lessons,

                      {
                        id:
                          newLesson.id,

                        title:
                          newLesson.title,

                        description:
                          newLesson.description ??
                          null,

                        position:
                          newLesson.position ??
                          item.lessons
                            .length,

                        videoUrl:
                          newLesson.videoUrl ??
                          videoUrl,

                        videoKey:
                          newLesson.videoKey ??
                          videoKey,

                        videoType:
                          newLesson.videoType ??
                          videoType,

                        isFree:
                          newLesson.isFree ??
                          isFree,
                      },
                    ],
                  }
                }
              )
          )

          setExpandedChapters(
            (previous) => {
              const next =
                new Set(
                  previous
                )

              next.add(
                modal.chapterId!
              )

              return next
            }
          )
        }

        closeModal()
      } catch (error) {
        setError(
          error instanceof
            Error
            ? error.message
            : "حدث خطأ أثناء حفظ الدرس"
        )
      } finally {
        setLoading(false)

        saveLessonLock.current =
          false
      }
    }

  // ==========================================================
  // DELETE CHAPTER
  // ==========================================================

  const deleteChapter =
    async (
      chapter: Chapter
    ) => {
      const confirmed =
        window.confirm(
          `هل أنت متأكد من حذف الشابتر "${chapter.title}"؟\nسيتم حذف جميع الدروس الموجودة بداخله.`
        )

      if (!confirmed) {
        return
      }

      try {
        setLoading(true)

        const response =
          await fetch(
            `/api/courses/${course.id}/chapters/${chapter.id}`,
            {
              method:
                "DELETE",
            }
          )

        const result =
          await parseApiResponse(
            response
          )

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل حذف الشابتر"
          )
        }

        setChapters(
          (previous) =>
            previous
              .filter(
                (item) =>
                  item.id !==
                  chapter.id
              )
              .map(
                (
                  item,
                  index
                ) => ({
                  ...item,
                  position:
                    index,
                })
              )
        )

        setExpandedChapters(
          (previous) => {
            const next =
              new Set(
                previous
              )

            next.delete(
              chapter.id
            )

            return next
          }
        )
      } catch (error) {
        window.alert(
          error instanceof
            Error
            ? error.message
            : "حدث خطأ أثناء حذف الشابتر"
        )
      } finally {
        setLoading(false)
      }
    }

  // ==========================================================
  // DELETE LESSON
  // ==========================================================

  const deleteLesson =
    async (
      chapterId: string,
      lesson: Lesson
    ) => {
      const confirmed =
        window.confirm(
          `هل أنت متأكد من حذف الدرس "${lesson.title}"؟`
        )

      if (!confirmed) {
        return
      }

      try {
        setLoading(true)

        const response =
          await fetch(
            `/api/courses/${course.id}/chapters/${chapterId}/lessons/${lesson.id}`,
            {
              method:
                "DELETE",
            }
          )

        const result =
          await parseApiResponse(
            response
          )

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل حذف الدرس"
          )
        }

        setChapters(
          (previous) =>
            previous.map(
              (chapter) => {
                if (
                  chapter.id !==
                  chapterId
                ) {
                  return chapter
                }

                const lessons =
                  chapter.lessons
                    .filter(
                      (
                        item
                      ) =>
                        item.id !==
                        lesson.id
                    )
                    .map(
                      (
                        item,
                        index
                      ) => ({
                        ...item,
                        position:
                          index,
                      })
                    )

                return {
                  ...chapter,
                  lessons,
                }
              }
            )
        )
      } catch (error) {
        window.alert(
          error instanceof
            Error
            ? error.message
            : "حدث خطأ أثناء حذف الدرس"
        )
      } finally {
        setLoading(false)
      }
    }

  // ==========================================================
  // SAVE CHAPTER ORDER
  // ==========================================================

  const saveChapterOrder =
    async (
      reorderedChapters: Chapter[]
    ) => {
      const response =
        await fetch(
          `/api/courses/${course.id}/chapters/reorder`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              items:
                reorderedChapters.map(
                  (
                    chapter,
                    index
                  ) => ({
                    id:
                      chapter.id,
                    position:
                      index,
                  })
                ),
            }),
          }
        )

      const result =
        await parseApiResponse(
          response
        )

      if (!response.ok) {
        throw new Error(
          result.error ||
            "فشل حفظ ترتيب الشباتر"
        )
      }

      return result
    }

  // ==========================================================
  // SAVE LESSON ORDER
  // ==========================================================

  const saveLessonOrder =
    async (
      chapterId: string,
      lessons: Lesson[]
    ) => {
      const response =
        await fetch(
          `/api/courses/${course.id}/chapters/${chapterId}/lessons/reorder`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              items:
                lessons.map(
                  (
                    lesson,
                    index
                  ) => ({
                    id:
                      lesson.id,
                    position:
                      index,
                  })
                ),
            }),
          }
        )

      const result =
        await parseApiResponse(
          response
        )

      if (!response.ok) {
        throw new Error(
          result.error ||
            "فشل حفظ ترتيب الدروس"
        )
      }

      return result
    }

  // ==========================================================
  // CHAPTER DRAG END
  // ==========================================================

  const handleChapterDragEnd =
    async (
      event: DragEndEvent
    ) => {
      const {
        active,
        over,
      } = event

      if (
        !over ||
        active.id ===
          over.id
      ) {
        return
      }

      const oldIndex =
        chapters.findIndex(
          (chapter) =>
            chapter.id ===
            active.id
        )

      const newIndex =
        chapters.findIndex(
          (chapter) =>
            chapter.id ===
            over.id
        )

      if (
        oldIndex === -1 ||
        newIndex === -1
      ) {
        return
      }

      const reordered =
        arrayMove(
          chapters,
          oldIndex,
          newIndex
        ).map(
          (
            chapter,
            index
          ) => ({
            ...chapter,
            position:
              index,
          })
        )

      setChapters(
        reordered
      )

      try {
        await saveChapterOrder(
          reordered
        )
      } catch (error) {
        console.error(
          "Failed to save chapter order:",
          error
        )

        window.alert(
          error instanceof
            Error
            ? error.message
            : "فشل حفظ ترتيب الشباتر"
        )
      }
    }

  // ==========================================================
  // LESSON DRAG END
  // ==========================================================

  const handleLessonDragEnd =
    async (
      chapterId: string,
      event: DragEndEvent
    ) => {
      const {
        active,
        over,
      } = event

      if (
        !over ||
        active.id ===
          over.id
      ) {
        return
      }

      const chapter =
        chapters.find(
          (item) =>
            item.id ===
            chapterId
        )

      if (!chapter) {
        return
      }

      const oldIndex =
        chapter.lessons.findIndex(
          (lesson) =>
            lesson.id ===
            active.id
        )

      const newIndex =
        chapter.lessons.findIndex(
          (lesson) =>
            lesson.id ===
            over.id
        )

      if (
        oldIndex === -1 ||
        newIndex === -1
      ) {
        return
      }

      const reordered =
        arrayMove(
          chapter.lessons,
          oldIndex,
          newIndex
        ).map(
          (
            lesson,
            index
          ) => ({
            ...lesson,
            position:
              index,
          })
        )

      setChapters(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              chapterId
                ? {
                    ...item,
                    lessons:
                      reordered,
                  }
                : item
          )
      )

      try {
        await saveLessonOrder(
          chapterId,
          reordered
        )
      } catch (error) {
        console.error(
          "Failed to save lesson order:",
          error
        )

        window.alert(
          error instanceof
            Error
            ? error.message
            : "فشل حفظ ترتيب الدروس"
        )
      }
    }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div dir="rtl">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="mb-7">
        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex size-14 shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-red-500
                text-white
                shadow-lg
                shadow-red-500/20
              "
            >
              <BookOpen className="size-6" />
            </div>

            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-2.5 py-1
                    text-[10px]
                    font-bold
                    text-red-500
                  "
                >
                  محتوى الكورس
                </span>
              </div>

              <h1 className="truncate text-2xl font-black">
                {course.title}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {course.subject?.name ??
                  "بدون مادة"}{" "}
                • إدارة الشباتر والدروس
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/courses/${course.id}/edit`}
              className="
                inline-flex h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-border
                bg-background
                px-5
                text-sm
                font-bold
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:border-red-500/40
                hover:text-red-500
              "
            >
              <Pencil className="size-4" />
              تعديل الكورس
            </Link>

            <Link
              href="/admin/courses"
              className="
                inline-flex h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-border
                bg-background
                px-5
                text-sm
                font-bold
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:border-red-500/40
                hover:text-red-500
              "
            >
              <ArrowRight className="size-4" />
              الكورسات
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN
          ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-[26px]
          border
          border-border
          bg-background
          shadow-[0_10px_40px_rgba(0,0,0,0.04)]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-border
            bg-muted/[0.15]
            px-6 py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
          "
        >
          <div>
            <h2 className="text-base font-black">
              هيكل الكورس
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              اسحب الشباتر والدروس لتغيير ترتيبها
            </p>
          </div>

          <button
            type="button"
            onClick={
              openCreateChapter
            }
            disabled={
              loading
            }
            className="
              inline-flex h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-500
              px-5
              text-sm
              font-black
              text-white
              shadow-lg
              shadow-red-500/20
              transition
              hover:bg-red-600
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            <Plus className="size-4" />
            إضافة Chapter
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {chapters.length ===
          0 ? (
            <div
              className="
                rounded-2xl
                border-2
                border-dashed
                border-border
                px-6 py-16
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex size-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-red-500/10
                  text-red-500
                "
              >
                <BookOpen className="size-7" />
              </div>

              <h3 className="mt-5 text-base font-black">
                الكورس لسه مفيهوش محتوى
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                ابدأ بإضافة أول Chapter، وبعدها تقدر تضيف الدروس بداخله.
              </p>

              <button
                type="button"
                onClick={
                  openCreateChapter
                }
                className="
                  mt-6
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-5
                  text-sm
                  font-bold
                  text-white
                  hover:bg-red-600
                "
              >
                <Plus className="size-4" />
                إضافة أول Chapter
              </button>
            </div>
          ) : (
            <DndContext
              sensors={
                sensors
              }
              collisionDetection={
                closestCenter
              }
              onDragEnd={
                handleChapterDragEnd
              }
            >
              <SortableContext
                items={chapters.map(
                  (
                    chapter
                  ) =>
                    chapter.id
                )}
                strategy={
                  verticalListSortingStrategy
                }
              >
                <div className="space-y-4">
                  {chapters.map(
                    (
                      chapter
                    ) => (
                      <SortableChapter
                        key={
                          chapter.id
                        }
                        chapter={
                          chapter
                        }
                        expanded={expandedChapters.has(
                          chapter.id
                        )}
                        onToggle={() =>
                          toggleChapter(
                            chapter.id
                          )
                        }
                        onEdit={() =>
                          openEditChapter(
                            chapter
                          )
                        }
                        onDelete={() =>
                          deleteChapter(
                            chapter
                          )
                        }
                        onAddLesson={() =>
                          openCreateLesson(
                            chapter.id
                          )
                        }
                      >
                        {chapter
                          .lessons
                          .length ===
                        0 ? (
                          <div
                            className="
                              rounded-xl
                              border
                              border-dashed
                              border-border
                              px-4 py-8
                              text-center
                            "
                          >
                            <p className="text-xs text-muted-foreground">
                              لا توجد دروس في هذا الشابتر
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                openCreateLesson(
                                  chapter.id
                                )
                              }
                              className="
                                mt-3
                                inline-flex
                                items-center
                                gap-1.5
                                text-xs
                                font-bold
                                text-red-500
                                hover:underline
                              "
                            >
                              <Plus className="size-3.5" />
                              إضافة درس
                            </button>
                          </div>
                        ) : (
                          <DndContext
                            sensors={
                              sensors
                            }
                            collisionDetection={
                              closestCenter
                            }
                            onDragEnd={(
                              event
                            ) =>
                              handleLessonDragEnd(
                                chapter.id,
                                event
                              )
                            }
                          >
                            <SortableContext
                              items={chapter.lessons.map(
                                (
                                  lesson
                                ) =>
                                  lesson.id
                              )}
                              strategy={
                                verticalListSortingStrategy
                              }
                            >
                              <div className="space-y-2">
                                {chapter.lessons.map(
                                  (
                                    lesson
                                  ) => (
                                    <SortableLesson
                                      key={
                                        lesson.id
                                      }
                                      lesson={
                                        lesson
                                      }
                                      onEdit={() =>
                                        openEditLesson(
                                          chapter.id,
                                          lesson
                                        )
                                      }
                                      onDelete={() =>
                                        deleteLesson(
                                          chapter.id,
                                          lesson
                                        )
                                      }
                                    />
                                  )
                                )}
                              </div>
                            </SortableContext>
                          </DndContext>
                        )}
                      </SortableChapter>
                    )
                  )}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* ======================================================
          MODAL
          ====================================================== */}

      {modal && (
        <div
          className="
            fixed inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal()
            }
          }}
        >
          <div
            className="
              max-h-[90vh]
              w-full
              max-w-lg
              overflow-y-auto
              rounded-3xl
              border
              border-border
              bg-background
              shadow-2xl
            "
          >
            {/* HEADER */}

            <div
              className="
                sticky
                top-0
                z-10
                flex
                items-center
                justify-between
                border-b
                border-border
                bg-background
                px-6 py-5
              "
            >
              <div>
                <h2 className="text-base font-black">
                  {modal.type ===
                  "chapter"
                    ? modal.mode ===
                      "create"
                      ? "إضافة Chapter جديد"
                      : "تعديل Chapter"
                    : modal.mode ===
                        "create"
                      ? "إضافة درس جديد"
                      : "تعديل الدرس"}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {modal.type ===
                  "chapter"
                    ? "أدخل اسم الشابتر"
                    : "أدخل بيانات الدرس"}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  loading ||
                  uploading ||
                  saveLessonLock.current
                }
                className="
                  flex size-9
                  items-center
                  justify-center
                  rounded-lg
                  text-muted-foreground
                  hover:bg-muted
                  hover:text-foreground
                  disabled:pointer-events-none
                  disabled:opacity-50
                "
              >
                <X className="size-4" />
              </button>
            </div>

            {/* BODY */}

            <div className="space-y-5 p-6">
              {/* TITLE */}

              <div className="space-y-2">
                <label className="text-sm font-bold">
                  {modal.type ===
                  "chapter"
                    ? "اسم Chapter"
                    : "اسم الدرس"}

                  <span className="mr-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  autoFocus
                  disabled={
                    loading ||
                    uploading
                  }
                  value={
                    title
                  }
                  onChange={(
                    event
                  ) =>
                    setTitle(
                      event.target
                        .value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault()

                      if (
                        modal.type ===
                        "chapter"
                      ) {
                        saveChapter()
                      } else {
                        saveLesson()
                      }
                    }
                  }}
                  placeholder={
                    modal.type ===
                    "chapter"
                      ? "مثال: مقدمة في البرمجة"
                      : "مثال: مقدمة الدرس الأول"
                  }
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-4
                    text-sm
                    outline-none
                    transition
                    focus:border-red-500
                    focus:ring-4
                    focus:ring-red-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>

              {/* DESCRIPTION */}

              {modal.type ===
                "lesson" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    وصف الدرس
                  </label>

                  <textarea
                    disabled={
                      loading ||
                      uploading
                    }
                    value={
                      description
                    }
                    onChange={(
                      event
                    ) =>
                      setDescription(
                        event.target
                          .value
                      )
                    }
                    placeholder="وصف مختصر للدرس..."
                    rows={4}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-border
                      bg-background
                      px-4 py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-red-500
                      focus:ring-4
                      focus:ring-red-500/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />
                </div>
              )}

              {/* FREE */}

              {modal.type ===
                "lesson" && (
                <div
                  className="
                    rounded-2xl
                    border
                    border-border
                    bg-muted/[0.12]
                    p-4
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-bold">
                          الدرس مجاني
                        </label>

                        {isFree && (
                          <span
                            className="
                              rounded-full
                              bg-emerald-500/10
                              px-2 py-0.5
                              text-[10px]
                              font-bold
                              text-emerald-500
                            "
                          >
                            متاح للجميع
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        يمكن للطلاب مشاهدة هذا الدرس بدون شراء أو تسجيل في الكورس
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={
                        isFree
                      }
                      disabled={
                        loading ||
                        uploading
                      }
                      onClick={() =>
                        setIsFree(
                          (
                            previous
                          ) =>
                            !previous
                        )
                      }
                      className={`
                        relative
                        h-6
                        w-11
                        shrink-0
                        rounded-full
                        transition
                        ${
                          isFree
                            ? "bg-emerald-500"
                            : "bg-muted-foreground/30"
                        }
                      `}
                    >
                      <span
                        className={`
                          absolute
                          top-1
                          size-4
                          rounded-full
                          bg-white
                          shadow-sm
                          transition
                          ${
                            isFree
                              ? "right-1"
                              : "right-6"
                          }
                        `}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  VIDEO
                  ================================================= */}

              {modal.type ===
                "lesson" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-bold">
                      فيديو الدرس
                    </label>

                    <p className="mt-1 text-xs text-muted-foreground">
                      ارفع فيديو الدرس وسيتم تخزينه على Tigris بشكل آمن
                    </p>
                  </div>

                  {/* CURRENT VIDEO */}

                  {videoUrl &&
                    !videoFile && (
                      <div
                        className="
                          overflow-hidden
                          rounded-2xl
                          border
                          border-emerald-500/20
                          bg-emerald-500/5
                          p-4
                        "
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className="
                                flex size-10 shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-emerald-500/10
                                text-emerald-500
                              "
                            >
                              <Video className="size-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-bold">
                                يوجد فيديو حالي للدرس
                              </p>

                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                اختر فيديو جديدًا لاستبداله
                              </p>
                            </div>
                          </div>

                          <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                        </div>
                      </div>
                    )}

                  {/* UPLOADER */}

                  <div
                    className="
                      rounded-2xl
                      border-2
                      border-dashed
                      border-border
                      bg-muted/[0.12]
                      p-4
                    "
                  >
                    <FileUpload
                      value={
                        videoFile
                      }
                      onFileChange={
                        handleLessonVideoChange
                      }
                      onUploadComplete={
                        handleLessonVideoUploadComplete
                      }
                      onDeleteComplete={
                        handleLessonVideoDelete
                      }
                      onUploadStateChange={
                        handleUploadStateChange
                      }
                      maxSize={
                        MAX_VIDEO_SIZE
                      }
                    />
                  </div>

                  {/* STATUS */}

                  {videoKey &&
                    !uploading && (
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-emerald-500/20
                          bg-emerald-500/5
                          px-3 py-2.5
                        "
                      >
                        <CheckCircle2 className="size-4 text-emerald-500" />

                        <p className="text-xs font-bold text-emerald-600">
                          الفيديو تم رفعه بنجاح وجاهز للحفظ
                        </p>
                      </div>
                    )}

                  {/* INFO */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-border
                      bg-muted/30
                      px-3 py-2.5
                    "
                  >
                    <Video className="size-3.5 shrink-0 text-muted-foreground" />

                    <p className="text-[11px] text-muted-foreground">
                      المسموح: MP4 / WEBM / MOV
                      {" • "}
                      الحد الأقصى:
                      {" "}
                      <span className="font-bold text-foreground">
                        5GB
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div
                  className="
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/5
                    px-4 py-3
                    text-xs
                    font-semibold
                    text-red-500
                  "
                >
                  {error}
                </div>
              )}
            </div>

            {/* ==================================================
                ACTIONS
                ================================================== */}

            <div
              className="
                flex
                gap-3
                border-t
                border-border
                bg-background
                p-6
              "
            >
              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  loading ||
                  uploading
                }
                className="
                  flex h-11
                  flex-1
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-border
                  text-sm
                  font-bold
                  transition
                  hover:bg-muted
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    modal.type ===
                    "chapter"
                  ) {
                    saveChapter()
                  } else {
                    saveLesson()
                  }
                }}
                disabled={
                  loading ||
                  uploading
                }
                className="
                  flex h-11
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-red-500/20
                  transition
                  hover:bg-red-600
                  disabled:pointer-events-none
                  disabled:opacity-50
                "
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري رفع الفيديو...
                    {uploadProgress}%
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    {modal.mode ===
                    "create" ? (
                      <Plus className="size-4" />
                    ) : (
                      <Save className="size-4" />
                    )}

                    {modal.mode ===
                    "create"
                      ? "إضافة"
                      : "حفظ التعديل"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}

      <div className="mt-5 flex items-center justify-center text-[11px] text-muted-foreground">
        <span>
          يمكنك ترتيب محتوى الكورس بالسحب والإفلات
        </span>
      </div>
    </div>
  )
}