"use client"

import {
  useState,
} from "react"

import Link from "next/link"

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable"

import {
  CSS,
} from "@dnd-kit/utilities"

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
} from "lucide-react"

type Lesson = {
  id: string
  title: string
  description: string | null
  position: number
  chapterId: string
}

type Chapter = {
  id: string
  title: string
  position: number
  courseId: string
  lessons: Lesson[]
}

interface CurriculumBuilderProps {
  courseId: string
  courseTitle: string
  initialChapters: Chapter[]
}

// ============================================================
// MAIN
// ============================================================

export default function CurriculumBuilder({
  courseId,
  courseTitle,
  initialChapters,
}: CurriculumBuilderProps) {
  const [
    chapters,
    setChapters,
  ] = useState<Chapter[]>(
    initialChapters
  )

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  )

  const [
    newChapterTitle,
    setNewChapterTitle,
  ] = useState("")

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
  // CREATE CHAPTER
  // ==========================================================

  const createChapter =
    async () => {
      const title =
        newChapterTitle.trim()

      if (!title) {
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response =
          await fetch(
            `/api/courses/${courseId}/chapters`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                title,
              }),
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل إنشاء الفصل"
          )
        }

        setChapters(
          (current) => [
            ...current,
            {
              ...result.chapter,
              lessons:
                result.chapter
                  .lessons ?? [],
            },
          ]
        )

        setNewChapterTitle("")
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "حدث خطأ"
        )
      } finally {
        setLoading(false)
      }
    }

  // ==========================================================
  // DELETE CHAPTER
  // ==========================================================

  const deleteChapter =
    async (
      chapterId: string
    ) => {
      const confirmed =
        window.confirm(
          "هل أنت متأكد من حذف هذا الفصل؟ سيتم حذف جميع الدروس بداخله."
        )

      if (!confirmed) {
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response =
          await fetch(
            `/api/courses/${courseId}/chapters/${chapterId}`,
            {
              method: "DELETE",
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل حذف الفصل"
          )
        }

        setChapters(
          (current) =>
            current.filter(
              (chapter) =>
                chapter.id !==
                chapterId
            )
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "حدث خطأ"
        )
      } finally {
        setLoading(false)
      }
    }

  // ==========================================================
  // REORDER CHAPTERS
  // ==========================================================

  const handleDragEnd =
    async (
      event: DragEndEvent
    ) => {
      const {
        active,
        over,
      } = event

      if (
        !over ||
        active.id === over.id
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

      setChapters(reordered)

      try {
        const response =
          await fetch(
            `/api/courses/${courseId}/chapters/reorder`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                items:
                  reordered.map(
                    (
                      chapter
                    ) => ({
                      id:
                        chapter.id,
                      position:
                        chapter.position,
                    })
                  ),
              }),
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل حفظ الترتيب"
          )
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "فشل حفظ الترتيب"
        )
      }
    }

  return (
    <div
      dir="rtl"
      className="
        min-h-full
        bg-muted/[0.18]
        px-4
        pb-10
        sm:px-6
        lg:px-8
      "
    >
      {/* HEADER */}

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
                flex
                size-14
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

            <div>
              <p className="mb-1 text-xs font-bold text-red-500">
                محتوى الكورس
              </p>

              <h1 className="text-2xl font-black">
                {courseTitle}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                إدارة الفصول والدروس وترتيبها
              </p>
            </div>
          </div>

          <Link
            href="/admin/courses"
            className="
              inline-flex
              h-11
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
              transition
              hover:border-red-500/40
              hover:text-red-500
            "
          >
            <ArrowRight className="size-4" />
            العودة للكورسات
          </Link>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            mb-5
            rounded-xl
            border
            border-red-500/20
            bg-red-500/5
            px-4
            py-3
            text-sm
            font-semibold
            text-red-500
          "
        >
          {error}
        </div>
      )}

      {/* ADD CHAPTER */}

      <div
        className="
          mb-6
          rounded-2xl
          border
          border-border
          bg-background
          p-5
          shadow-sm
        "
      >
        <div className="mb-4">
          <h2 className="text-sm font-black">
            إضافة فصل جديد
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            كل فصل يمكن أن يحتوي على عدد من الدروس.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={
              newChapterTitle
            }
            onChange={(event) =>
              setNewChapterTitle(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                "Enter"
              ) {
                createChapter()
              }
            }}
            placeholder="مثال: الفصل الأول - مقدمة"
            className="
              h-12
              flex-1
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
            "
          />

          <button
            type="button"
            onClick={
              createChapter
            }
            disabled={
              loading ||
              !newChapterTitle.trim()
            }
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-500
              px-6
              text-sm
              font-black
              text-white
              transition
              hover:bg-red-600
              disabled:pointer-events-none
              disabled:opacity-50
            "
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}

            إضافة فصل
          </button>
        </div>
      </div>

      {/* CHAPTERS */}

      <DndContext
        sensors={sensors}
        collisionDetection={
          closestCenter
        }
        onDragEnd={
          handleDragEnd
        }
      >
        <SortableContext
          items={chapters.map(
            (chapter) =>
              chapter.id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >
          <div className="space-y-4">
            {chapters.map(
              (
                chapter,
                index
              ) => (
                <SortableChapter
                  key={
                    chapter.id
                  }
                  chapter={
                    chapter
                  }
                  index={
                    index
                  }
                  onDelete={
                    deleteChapter
                  }
                  setChapters={
                    setChapters
                  }
                  courseId={
                    courseId
                  }
                />
              )
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* EMPTY */}

      {chapters.length ===
        0 && (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-border
            bg-background
            px-6
            py-16
            text-center
          "
        >
          <BookOpen className="mx-auto mb-4 size-10 text-muted-foreground/50" />

          <h2 className="text-sm font-black">
            لا توجد فصول حتى الآن
          </h2>

          <p className="mt-2 text-xs text-muted-foreground">
            ابدأ بإضافة أول فصل للكورس.
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// SORTABLE CHAPTER
// ============================================================

interface SortableChapterProps {
  chapter: Chapter
  index: number
  onDelete: (
    chapterId: string
  ) => void
  setChapters: React.Dispatch<
    React.SetStateAction<
      Chapter[]
    >
  >
  courseId: string
}

function SortableChapter({
  chapter,
  index,
  onDelete,
  setChapters,
  courseId,
}: SortableChapterProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } =
    useSortable({
      id: chapter.id,
    })

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),
    transition,
  }

  const [
    open,
    setOpen,
  ] = useState(true)

  const [
    editing,
    setEditing,
  ] = useState(false)

  const [
    title,
    setTitle,
  ] = useState(
    chapter.title
  )

  const [
    newLessonTitle,
    setNewLessonTitle,
  ] = useState("")

  const [
    lessonLoading,
    setLessonLoading,
  ] = useState(false)

  const [
    chapterLoading,
    setChapterLoading,
  ] = useState(false)

  // ==========================================================
  // UPDATE CHAPTER
  // ==========================================================

  const updateChapter =
    async () => {
      const cleanTitle =
        title.trim()

      if (!cleanTitle) {
        return
      }

      try {
        setChapterLoading(
          true
        )

        const response =
          await fetch(
            `/api/courses/${courseId}/chapters/${chapter.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                title:
                  cleanTitle,
              }),
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل تعديل الفصل"
          )
        }

        setChapters(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                chapter.id
                  ? {
                      ...item,
                      title:
                        result
                          .chapter
                          .title,
                    }
                  : item
            )
        )

        setEditing(false)
      } catch (error) {
        window.alert(
          error instanceof
            Error
            ? error.message
            : "حدث خطأ"
        )
      } finally {
        setChapterLoading(
          false
        )
      }
    }

  // ==========================================================
  // CREATE LESSON
  // ==========================================================

  const createLesson =
    async () => {
      const cleanTitle =
        newLessonTitle.trim()

      if (!cleanTitle) {
        return
      }

      try {
        setLessonLoading(
          true
        )

        const response =
          await fetch(
            `/api/courses/${courseId}/lessons`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                chapterId:
                  chapter.id,
                title:
                  cleanTitle,
              }),
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل إنشاء الدرس"
          )
        }

        setChapters(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                chapter.id
                  ? {
                      ...item,
                      lessons:
                        [
                          ...item.lessons,
                          result.lesson,
                        ],
                    }
                  : item
            )
        )

        setNewLessonTitle("")
        setOpen(true)
      } catch (error) {
        window.alert(
          error instanceof
            Error
            ? error.message
            : "حدث خطأ"
        )
      } finally {
        setLessonLoading(
          false
        )
      }
    }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        overflow-hidden
        rounded-2xl
        border
        bg-background
        shadow-sm
        ${
          isDragging
            ? "z-50 opacity-70 shadow-2xl"
            : "border-border"
        }
      `}
    >
      {/* CHAPTER HEADER */}

      <div className="flex items-center gap-3 border-b border-border p-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="
            cursor-grab
            rounded-lg
            p-2
            text-muted-foreground
            transition
            hover:bg-muted
            active:cursor-grabbing
          "
          title="اسحب لترتيب الفصل"
        >
          <GripVertical className="size-5" />
        </button>

        <div
          className="
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-red-500/10
            text-sm
            font-black
            text-red-500
          "
        >
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex gap-2">
              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                className="
                  h-10
                  min-w-0
                  flex-1
                  rounded-lg
                  border
                  border-border
                  px-3
                  text-sm
                  outline-none
                  focus:border-red-500
                "
                autoFocus
              />

              <button
                type="button"
                onClick={
                  updateChapter
                }
                disabled={
                  chapterLoading
                }
                className="
                  rounded-lg
                  bg-red-500
                  px-3
                  text-white
                "
              >
                {chapterLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
              </button>
            </div>
          ) : (
            <>
              <h3 className="truncate text-sm font-black">
                {chapter.title}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                {chapter.lessons.length}{" "}
                درس
              </p>
            </>
          )}
        </div>

        {!editing && (
          <>
            <button
              type="button"
              onClick={() =>
                setEditing(
                  true
                )
              }
              className="
                rounded-lg
                p-2
                text-muted-foreground
                hover:bg-muted
                hover:text-red-500
              "
              title="تعديل الفصل"
            >
              <Pencil className="size-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete(
                  chapter.id
                )
              }
              className="
                rounded-lg
                p-2
                text-muted-foreground
                hover:bg-red-500/10
                hover:text-red-500
              "
              title="حذف الفصل"
            >
              <Trash2 className="size-4" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() =>
            setOpen(
              (value) =>
                !value
            )
          }
          className="
            rounded-lg
            p-2
            text-muted-foreground
            hover:bg-muted
          "
        >
          {open ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </button>
      </div>

      {/* CHAPTER CONTENT */}

      {open && (
        <div className="bg-muted/[0.12] p-4">
          <div className="space-y-2">
            {chapter.lessons.map(
              (
                lesson,
                lessonIndex
              ) => (
                <div
                  key={
                    lesson.id
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-4
                    py-3
                  "
                >
                  <div className="text-xs font-bold text-muted-foreground">
                    {lessonIndex +
                      1}
                  </div>

                  <Video className="size-4 text-red-500" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {
                        lesson.title
                      }
                    </p>

                    {lesson.description && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {
                          lesson.description
                        }
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-muted-foreground">
                    درس
                  </span>
                </div>
              )
            )}
          </div>

          {/* ADD LESSON */}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={
                newLessonTitle
              }
              onChange={(
                event
              ) =>
                setNewLessonTitle(
                  event.target.value
                )
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  createLesson()
                }
              }}
              placeholder="اسم الدرس الجديد"
              className="
                h-10
                flex-1
                rounded-lg
                border
                border-border
                bg-background
                px-3
                text-sm
                outline-none
                focus:border-red-500
              "
            />

            <button
              type="button"
              onClick={
                createLesson
              }
              disabled={
                lessonLoading ||
                !newLessonTitle.trim()
              }
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-red-500/20
                bg-red-500/10
                px-4
                text-xs
                font-black
                text-red-500
                transition
                hover:bg-red-500/20
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              {lessonLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}

              إضافة درس
            </button>
          </div>
        </div>
      )}
    </div>
  )
}