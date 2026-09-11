"use client"

import Link from "next/link"
import {
  BookOpen,
  Clock3,
  PlayCircle,
  Users,
} from "lucide-react"

// ============================================================
// TYPES
// ============================================================

export interface CourseCardData {
  id: string
  title: string
  description?: string | null
  image?: string | null
  mediaUrl?: string | null
  mediaType?: "IMAGE" | "VIDEO" | string | null
  price: number
  level?: string | null
  levelLabel?: string | null
  educationType?: string | null
  educationTypeLabel?: string | null
  academicLevel?: string | null
  academicLevelLabel?: string | null
  semester?: string | null
  semesterLabel?: string | null
  secondaryTrack?: string | null
  secondaryTrackLabel?: string | null
  subject?: {
    id?: string
    name?: string
    code?: string
  } | null
  chaptersCount?: number
  lessonsCount?: number
}

// ============================================================
// HELPERS
// ============================================================

function getImageUrl(course: CourseCardData) {
  return course.image ?? course.mediaUrl ?? null
}

// ============================================================
// COURSE CARD
// ============================================================

export default function CourseCard({
  course,
}: {
  course: CourseCardData
}) {
  const imageUrl = getImageUrl(course)

  const chaptersCount = course.chaptersCount ?? 0
  const lessonsCount = course.lessonsCount ?? 0

  return (
    <Link
      href={`/courses/${course.id}`}
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[22px]
        border
        border-border/60
        bg-background
        shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        transition-all
        duration-500
        hover:-translate-y-1.5
        hover:border-red-500/20
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
      "
    >
      {/* ====================================================== */}
      {/* IMAGE */}
      {/* ====================================================== */}

      <div
        className="
          relative
          aspect-[16/9]
          w-full
          shrink-0
          overflow-hidden
          bg-muted
        "
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={course.title}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.06]
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-muted
            "
          >
            <BookOpen
              className="
                size-12
                text-muted-foreground/30
              "
            />
          </div>
        )}

        {/* DARK GRADIENT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/65
            via-black/10
            to-transparent
            opacity-80
            transition-opacity
            duration-500
            group-hover:opacity-100
          "
        />

        {/* TOP BADGES */}

        <div
          className="
            absolute
            right-4
            top-4
            left-4
            flex
            items-start
            justify-between
            gap-3
          "
        >
          {/* EDUCATION TYPE */}

          {course.educationTypeLabel && (
            <span
              className="
                rounded-full
                border
                border-white/20
                bg-black/45
                px-3
                py-1.5
                text-[11px]
                font-bold
                text-white
                shadow-lg
                backdrop-blur-md
              "
            >
              {course.educationTypeLabel}
            </span>
          )}

          {/* PRICE */}

          <span
            className="
              rounded-full
              border
              border-white/20
              bg-white/95
              px-3
              py-1.5
              text-xs
              font-black
              text-red-500
              shadow-lg
              backdrop-blur-md
            "
          >
            {course.price === 0
              ? "مجاني"
              : `${course.price} ج.م`}
          </span>
        </div>

        {/* BOTTOM IMAGE INFO */}

        <div
          className="
            absolute
            bottom-4
            right-4
            left-4
            flex
            items-end
            justify-between
            gap-3
          "
        >
          <div className="min-w-0">
            {course.subject?.name && (
              <span
                className="
                  inline-flex
                  max-w-full
                  items-center
                  gap-1.5
                  rounded-full
                  bg-red-500
                  px-3
                  py-1.5
                  text-[10px]
                  font-black
                  text-white
                  shadow-lg
                "
              >
                <BookOpen className="size-3" />

                <span className="truncate">
                  {course.subject.name}
                </span>
              </span>
            )}
          </div>

          {course.mediaType === "VIDEO" && (
            <span
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-black/40
                text-white
                shadow-lg
                backdrop-blur-md
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <PlayCircle className="size-5" />
            </span>
          )}
        </div>
      </div>

      {/* ====================================================== */}
      {/* CONTENT */}
      {/* ====================================================== */}

      <div
        className="
          flex
          flex-1
          flex-col
          p-5
          sm:p-6
        "
      >
        {/* TITLE */}

        <h3
          className="
            line-clamp-2
            min-h-[3.5rem]
            text-[17px]
            font-black
            leading-7
            tracking-[-0.01em]
            text-foreground
            transition-colors
            duration-300
            group-hover:text-red-500
          "
        >
          {course.title}
        </h3>

        {/* DESCRIPTION */}

        <div className="mt-2.5 min-h-[3rem]">
          {course.description ? (
            <p
              className="
                line-clamp-2
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {course.description}
            </p>
          ) : (
            <p
              className="
                line-clamp-2
                text-sm
                leading-6
                text-transparent
                select-none
              "
              aria-hidden="true"
            >
              —
            </p>
          )}
        </div>

        {/* META */}

        <div
          className="
            mt-5
            flex
            flex-wrap
            items-center
            gap-x-4
            gap-y-2
            border-t
            border-border/60
            pt-4
            text-[11px]
            font-semibold
            text-muted-foreground
          "
        >
          {/* LESSONS */}

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <PlayCircle
              className="
                size-3.5
                text-red-500
              "
            />

            <span>
              {lessonsCount} درس
            </span>
          </div>

          {/* CHAPTERS */}

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <BookOpen
              className="
                size-3.5
                text-red-500
              "
            />

            <span>
              {chaptersCount} فصل
            </span>
          </div>

          {/* LEVEL */}

          {course.levelLabel && (
            <div
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <Clock3
                className="
                  size-3.5
                  text-red-500
                "
              />

              <span>
                {course.levelLabel}
              </span>
            </div>
          )}
        </div>

        {/* ACADEMIC INFO */}

        <div
          className="
            mt-4
            min-h-[2rem]
            flex
            flex-wrap
            gap-2
          "
        >
          {course.academicLevelLabel && (
            <span
              className="
                rounded-lg
                bg-muted
                px-2.5
                py-1.5
                text-[10px]
                font-bold
                text-muted-foreground
              "
            >
              {course.academicLevelLabel}
            </span>
          )}

          {course.secondaryTrackLabel && (
            <span
              className="
                rounded-lg
                bg-muted
                px-2.5
                py-1.5
                text-[10px]
                font-bold
                text-muted-foreground
              "
            >
              {course.secondaryTrackLabel}
            </span>
          )}
        </div>

        {/* FOOTER */}

        <div
          className="
            mt-auto
            pt-5
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-bold
              text-muted-foreground
            "
          >
            <span
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-lg
                bg-red-500/10
                text-red-500
              "
            >
              <Users className="size-4" />
            </span>

            كورس تعليمي
          </div>

          <span
            className="
              flex
              items-center
              gap-1.5
              text-xs
              font-black
              text-red-500
              transition-all
              duration-300
              group-hover:gap-2.5
            "
          >
            عرض الكورس

            <span
              className="
                text-base
                transition-transform
                duration-300
                group-hover:-translate-x-1
              "
            >
              ←
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}