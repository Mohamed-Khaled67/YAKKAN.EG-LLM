

import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  GraduationCap,
  CalendarDays,
  Layers3,
  Sparkles,
} from "lucide-react"

import Link from "next/link"

import DeleteCourseButton from "@/components/admin/delete-course-button"
import { requireAdmin } from "@/lib/require-admin"
import { adminGetCourses } from "@/app/data/admin/admin-get-courses"

// ============================================================
// HELPERS
// ============================================================

function getEducationLabel(
  educationType: string
) {
  switch (educationType) {
    case "UNIVERSITY":
      return "الجامعة"

    case "SECONDARY":
      return "الثانوية العامة"

    default:
      return educationType
  }
}

function getAcademicLevelLabel(
  academicLevel: string
) {
  switch (academicLevel) {
    case "UNIVERSITY_LEVEL_1":
      return "الفرقة الأولى"

    case "UNIVERSITY_LEVEL_2":
      return "الفرقة الثانية"

    case "UNIVERSITY_LEVEL_3":
      return "الفرقة الثالثة"

    case "UNIVERSITY_LEVEL_4":
      return "الفرقة الرابعة"

    case "SECONDARY_GRADE_1":
      return "الصف الأول الثانوي"

    case "SECONDARY_GRADE_2":
      return "الصف الثاني الثانوي"

    case "SECONDARY_GRADE_3":
      return "الصف الثالث الثانوي"

    default:
      return academicLevel
  }
}

function getLevelLabel(
  level: string
) {
  switch (level) {
    case "BEGINNER":
      return "مبتدئ"

    case "INTERMEDIATE":
      return "متوسط"

    case "ADVANCED":
      return "متقدم"

    default:
      return level
  }
}

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "ar-EG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date)
}

// ============================================================
// PAGE
// ============================================================

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
  }>
}) {
  // ==========================================================
  // ADMIN PROTECTION
  // ==========================================================

  await requireAdmin()

  // ==========================================================
  // SEARCH PARAMS
  // ==========================================================

  const params =
    await searchParams

  const search =
    params.search?.trim() ?? ""

  // ==========================================================
  // GET COURSES
  // ==========================================================

  const courses =
    await adminGetCourses()

  // ==========================================================
  // FILTER COURSES
  // ==========================================================

  const normalizedSearch =
    search.toLocaleLowerCase("ar-EG")

  const filteredCourses =
    normalizedSearch
      ? courses.filter((course) => {
          const title =
            course.title?.toLocaleLowerCase(
              "ar-EG"
            ) ?? ""

          const subject =
            course.subject?.name?.toLocaleLowerCase(
              "ar-EG"
            ) ?? ""

          return (
            title.includes(
              normalizedSearch
            ) ||
            subject.includes(
              normalizedSearch
            )
          )
        })
      : courses

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-background
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                flex
                size-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-red-500/15
                bg-red-500/10
                text-red-600
                dark:text-red-400
              "
            >
              <BookOpen className="size-5" />
            </div>

            <div>
              <p
                className="
                  mb-1
                  text-xs
                  font-bold
                  text-red-500
                "
              >
                إدارة المحتوى
              </p>

              <h1
                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-foreground
                  sm:text-3xl
                "
              >
                الكورسات
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                إدارة وتنظيم جميع الكورسات
                الموجودة على المنصة
              </p>
            </div>
          </div>

          {/* ADD COURSE */}

          <Link
            href="/admin/courses/create"
            className="
              inline-flex
              h-11
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#C8102E]
              px-5
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-red-500/15
              transition-all
              duration-300
              hover:bg-[#A80D27]
              hover:shadow-xl
              hover:shadow-red-500/20
              active:scale-[0.98]
            "
          >
            <Plus className="size-4" />

            إضافة كورس
          </Link>
        </div>

        {/* ================================================== */}
        {/* SEARCH + COUNT */}
        {/* ================================================== */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* SEARCH */}

          <form
            method="GET"
            className="
              flex
              h-12
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-border
              bg-background
              px-4
              transition-all
              duration-300
              focus-within:border-red-500/50
              focus-within:ring-4
              focus-within:ring-red-500/10
              lg:max-w-md
            "
          >
            <Search
              className="
                size-4
                shrink-0
                text-muted-foreground
              "
            />

            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="ابحث عن اسم الكورس أو المادة..."
              autoComplete="off"
              className="
                w-full
                bg-transparent
                text-sm
                outline-none
                placeholder:text-muted-foreground
              "
            />

            {search && (
              <Link
                href="/admin/courses"
                className="
                  shrink-0
                  text-xs
                  font-bold
                  text-muted-foreground
                  transition-colors
                  hover:text-red-500
                "
              >
                مسح
              </Link>
            )}
          </form>

          {/* COUNT */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-3
              rounded-xl
              border
              border-border
              bg-card
              px-4
              py-2.5
            "
          >
            <div
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
              <Layers3 className="size-4" />
            </div>

            <div>
              <p
                className="
                  text-[11px]
                  font-medium
                  text-muted-foreground
                "
              >
                {search
                  ? "نتائج البحث"
                  : "إجمالي الكورسات"}
              </p>

              <p
                className="
                  text-sm
                  font-black
                  text-foreground
                "
              >
                {filteredCourses.length}
              </p>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* EMPTY STATE */}
        {/* ================================================== */}

        {filteredCourses.length === 0 ? (
          <div
            className="
              flex
              min-h-[360px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-border
              bg-card/50
              px-6
              text-center
            "
          >
            <div
              className="
                mb-5
                flex
                size-16
                items-center
                justify-center
                rounded-2xl
                bg-red-500/10
                text-red-500
              "
            >
              {search ? (
                <Search className="size-7" />
              ) : (
                <BookOpen className="size-7" />
              )}
            </div>

            <h2
              className="
                text-lg
                font-black
                text-foreground
              "
            >
              {search
                ? "لا توجد نتائج مطابقة"
                : "لا توجد كورسات حتى الآن"}
            </h2>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {search
                ? `لم يتم العثور على كورس يطابق "${search}". جرّب البحث بكلمة أخرى.`
                : "ابدأ بإضافة أول كورس إلى المنصة."}
            </p>

            {search ? (
              <Link
                href="/admin/courses"
                className="
                  mt-5
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-5
                  text-sm
                  font-bold
                  text-foreground
                  transition-all
                  hover:border-red-500/30
                  hover:text-red-500
                "
              >
                مسح البحث
              </Link>
            ) : (
              <Link
                href="/admin/courses/create"
                className="
                  mt-5
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#C8102E]
                  px-5
                  text-sm
                  font-bold
                  text-white
                  transition-all
                  hover:bg-[#A80D27]
                "
              >
                <Plus className="size-4" />

                إضافة كورس
              </Link>
            )}
          </div>
        ) : (
          /* ================================================== */
          /* COURSES GRID */
          /* ================================================== */

          <div
            className="
              grid
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredCourses.map(
              (course) => (
                <div
                  key={course.id}
                  className="
                    group
                    flex
                    h-full
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-red-500/20
                    hover:shadow-xl
                    hover:shadow-red-500/[0.06]
                  "
                >
                  {/* ================================================== */}
                  {/* MEDIA */}
                  {/* ================================================== */}

                  <div
                    className="
                      relative
                      aspect-[16/9]
                      shrink-0
                      overflow-hidden
                      bg-muted
                    "
                  >
                    {course.mediaUrl ? (
                      course.mediaType ===
                      "VIDEO" ? (
                        <video
                          src={course.mediaUrl}
                          className="
                            size-full
                            object-cover
                          "
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={course.mediaUrl}
                          alt={course.title}
                          className="
                            size-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                        />
                      )
                    ) : (
                      <div
                        className="
                          flex
                          size-full
                          items-center
                          justify-center
                          bg-gradient-to-br
                          from-red-500/10
                          via-background
                          to-red-500/5
                        "
                      >
                        <BookOpen
                          className="
                            size-10
                            text-red-500/40
                          "
                        />
                      </div>
                    )}

                    {/* STATUS */}

                    <div
                      className="
                        absolute
                        right-3
                        top-3
                      "
                    >
                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-[10px]
                          font-black
                          backdrop-blur-md
                          ${
                            course.isPublished
                              ? `
                                border-emerald-500/20
                                bg-emerald-500/10
                                text-emerald-600
                                dark:text-emerald-400
                              `
                              : `
                                border-amber-500/20
                                bg-amber-500/10
                                text-amber-600
                                dark:text-amber-400
                              `
                          }
                        `}
                      >
                        <span
                          className={`
                            size-1.5
                            rounded-full
                            ${
                              course.isPublished
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }
                          `}
                        />

                        {course.isPublished
                          ? "منشور"
                          : "مسودة"}
                      </span>
                    </div>
                  </div>

                  {/* ================================================== */}
                  {/* CONTENT */}
                  {/* ================================================== */}

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      p-5
                    "
                  >
                    {/* PRICE */}

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-lg
                          bg-red-500/10
                          px-2.5
                          py-1
                          text-xs
                          font-black
                          text-red-500
                        "
                      >
                        {course.price === 0
                          ? "مجاني"
                          : `${course.price} جنيه`}
                      </span>

                      {course.level && (
                        <span
                          className="
                            text-[11px]
                            font-bold
                            text-muted-foreground
                          "
                        >
                          {getLevelLabel(
                            course.level
                          )}
                        </span>
                      )}
                    </div>

                    {/* TITLE */}

                    <h2
                      className="
                        line-clamp-2
                        min-h-[3.5rem]
                        text-base
                        font-black
                        leading-7
                        text-foreground
                        transition-colors
                        group-hover:text-red-500
                      "
                    >
                      {course.title}
                    </h2>

                    {/* SUBJECT */}

                    <div
                      className="
                        mt-3
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-muted-foreground
                      "
                    >
                      <Sparkles className="size-3.5 shrink-0" />

                      <span className="truncate">
                        {course.subject?.name ??
                          "بدون مادة"}
                      </span>
                    </div>

                    {/* INFO */}

                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-2
                      "
                    >
                      {/* EDUCATION */}

                      <div
                        className="
                          rounded-xl
                          border
                          border-border
                          bg-muted/30
                          p-3
                        "
                      >
                        <div
                          className="
                            mb-1.5
                            flex
                            items-center
                            gap-1.5
                            text-muted-foreground
                          "
                        >
                          <GraduationCap className="size-3.5" />

                          <span
                            className="
                              text-[10px]
                              font-bold
                            "
                          >
                            المرحلة
                          </span>
                        </div>

                        <p
                          className="
                            truncate
                            text-xs
                            font-black
                            text-foreground
                          "
                        >
                          {getEducationLabel(
                            course.educationType
                          )}
                        </p>
                      </div>

                      {/* ACADEMIC LEVEL */}

                      <div
                        className="
                          rounded-xl
                          border
                          border-border
                          bg-muted/30
                          p-3
                        "
                      >
                        <div
                          className="
                            mb-1.5
                            flex
                            items-center
                            gap-1.5
                            text-muted-foreground
                          "
                        >
                          <Layers3 className="size-3.5" />

                          <span
                            className="
                              text-[10px]
                              font-bold
                            "
                          >
                            المستوى
                          </span>
                        </div>

                        <p
                          className="
                            truncate
                            text-xs
                            font-black
                            text-foreground
                          "
                        >
                          {getAcademicLevelLabel(
                            course.academicLevel
                          )}
                        </p>
                      </div>
                    </div>

                    {/* ================================================== */}
                    {/* FOOTER */}
                    {/* ================================================== */}

                    <div
                      className="
                        mt-auto
                        pt-5
                      "
                    >
                      <div
                        className="
                          mb-4
                          flex
                          items-center
                          justify-between
                          gap-3
                          border-t
                          border-border
                          pt-4
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-[11px]
                            text-muted-foreground
                          "
                        >
                          <CalendarDays className="size-3.5" />

                          <span>
                            {formatDate(
                              course.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div
                        className="
                          grid
                          grid-cols-4
                          gap-2
                        "
                      >
                        {/* CURRICULUM */}

                        <Link
                          href={`/admin/courses/${course.id}/curriculum`}
                          className="
                            inline-flex
                            h-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            bg-background
                            text-xs
                            font-bold
                            text-foreground
                            transition-all
                            hover:border-red-500/30
                            hover:bg-red-500/5
                            hover:text-red-500
                          "
                        >
                          المنهج
                        </Link>

                        {/* VIEW */}

                        <Link
                          href={`/courses/${course.id}`}
                          target="_blank"
                          className="
                            inline-flex
                            h-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            bg-background
                            text-muted-foreground
                            transition-all
                            hover:border-red-500/30
                            hover:bg-red-500/5
                            hover:text-red-500
                          "
                          aria-label="عرض الكورس"
                        >
                          <Eye className="size-4" />
                        </Link>

                        {/* EDIT */}

                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          className="
                            inline-flex
                            h-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            bg-background
                            text-muted-foreground
                            transition-all
                            hover:border-red-500/30
                            hover:bg-red-500/5
                            hover:text-red-500
                          "
                          aria-label="تعديل الكورس"
                        >
                          <Pencil className="size-4" />
                        </Link>

                        {/* DELETE */}

                        <div
                          className="
                            flex
                            h-9
                            items-center
                            justify-center
                          "
                        >
                          <DeleteCourseButton
                            courseId={course.id}
                            courseTitle={course.title}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}