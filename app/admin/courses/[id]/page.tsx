
import Link from "next/link"

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Layers3,
  Pencil,
  PlayCircle,
  Tag,
  Video,
  Image as ImageIcon,
  XCircle,
} from "lucide-react"

import { adminGetCourse } from "@/app/data/admin/admin-get-course"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function CourseDetailsPage({
  params,
}: PageProps) {
  const { id } = await params

  const course =
    await adminGetCourse(id)

  // ==========================================================
  // COURSE NOT FOUND
  // ==========================================================

  if (!course) {
    return (
      <div
        dir="rtl"
        className="min-h-full px-4 pb-10 lg:px-6"
      >
        <div className="flex min-h-[500px] items-center justify-center">
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-border
              bg-background
              p-8
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                size-16
                items-center
                justify-center
                rounded-2xl
                bg-red-500/10
                text-red-500
              "
            >
              <XCircle className="size-7" />
            </div>

            <h1 className="mt-5 text-xl font-black">
              الكورس غير موجود
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              الكورس الذي تحاول الوصول إليه غير موجود أو تم حذفه.
            </p>

            <Link
              href="/admin/courses"
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
                font-black
                text-white
                transition
                hover:bg-red-600
              "
            >
              <ArrowRight className="size-4" />
              العودة للكورسات
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      dir="rtl"
      className="
        min-h-full
        px-4
        pb-10
        lg:px-6
      "
    >
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

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
                shrink-0
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
              <div className="mb-1.5">
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-red-500
                  "
                >
                  تفاصيل الكورس
                </span>
              </div>

              <h1 className="text-2xl font-black">
                {course.title}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                عرض جميع بيانات الكورس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className="
                inline-flex
                h-11
                items-center
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
                hover:border-red-500/40
                hover:text-red-500
              "
            >
              <ArrowRight className="size-4" />
              العودة
            </Link>

            <Link
              href={`/admin/courses/${course.id}/edit`}
              className="
                inline-flex
                h-11
                items-center
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
              "
            >
              <Pencil className="size-4" />
              تعديل الكورس
            </Link>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ==================================================== */}
        {/* MEDIA */}
        {/* ==================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[26px]
            border
            border-border
            bg-background
            shadow-sm
            xl:col-span-2
          "
        >
          <div className="relative aspect-video overflow-hidden bg-muted">
            {course.mediaType === "VIDEO" &&
            course.mediaUrl ? (
              <video
                src={course.mediaUrl}
                controls
                className="size-full object-cover"
              />
            ) : course.mediaType === "IMAGE" &&
              course.mediaUrl ? (
              <img
                src={course.mediaUrl}
                alt={course.title}
                className="size-full object-cover"
              />
            ) : (
              <div
                className="
                  flex
                  size-full
                  flex-col
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-red-500/10
                  via-background
                  to-rose-500/10
                  text-red-500
                "
              >
                <BookOpen className="size-16 opacity-30" />

                <p className="mt-3 text-sm font-bold text-muted-foreground">
                  لا توجد صورة أو فيديو
                </p>
              </div>
            )}

            {/* STATUS */}

            <div className="absolute right-4 top-4">
              {course.isPublished ? (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-emerald-500
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-white
                    shadow-lg
                  "
                >
                  <CheckCircle2 className="size-3.5" />
                  منشور
                </span>
              ) : (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-black/60
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-white
                    backdrop-blur
                  "
                >
                  <XCircle className="size-3.5" />
                  مسودة
                </span>
              )}
            </div>
          </div>

          {/* MEDIA TYPE */}

          <div className="flex items-center gap-2 border-t border-border px-5 py-4">
            {course.mediaType === "VIDEO" ? (
              <>
                <Video className="size-4 text-red-500" />

                <span className="text-xs font-bold">
                  فيديو
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="size-4 text-red-500" />

                <span className="text-xs font-bold">
                  صورة
                </span>
              </>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* SUMMARY */}
        {/* ==================================================== */}

        <div
          className="
            rounded-[26px]
            border
            border-border
            bg-background
            p-5
            shadow-sm
          "
        >
          <div className="mb-5">
            <p className="text-xs font-bold text-muted-foreground">
              السعر
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-black text-red-500">
                {Number(course.price).toLocaleString("ar-EG")}
              </span>

              <span className="pb-1 text-sm font-bold text-muted-foreground">
                جنيه
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <InfoRow
              icon={<BookOpen className="size-4" />}
              label="المادة"
              value={
                course.subject?.name ??
                "غير محدد"
              }
            />

            <InfoRow
              icon={<GraduationCap className="size-4" />}
              label="نوع التعليم"
              value={getEducationLabel(
                course.educationType
              )}
            />

            <InfoRow
              icon={<GraduationCap className="size-4" />}
              label="المستوى الدراسي"
              value={getAcademicLevelLabel(
                course.academicLevel
              )}
            />

            <InfoRow
              icon={<Layers3 className="size-4" />}
              label="الفصل الدراسي"
              value={getSemesterLabel(
                course.semester
              )}
            />

            <InfoRow
              icon={<BarChartIcon />}
              label="مستوى الكورس"
              value={getLevelLabel(
                course.level
              )}
            />

            {course.secondaryTrack && (
              <InfoRow
                icon={<Tag className="size-4" />}
                label="الشعبة"
                value={getTrackLabel(
                  course.secondaryTrack
                )}
              />
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* DESCRIPTION */}
        {/* ==================================================== */}

        <div
          className="
            rounded-[26px]
            border
            border-border
            bg-background
            p-6
            shadow-sm
            xl:col-span-2
          "
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
                text-red-500
              "
            >
              <BookOpen className="size-5" />
            </div>

            <div>
              <h2 className="text-sm font-black">
                وصف الكورس
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                الوصف الخاص بالكورس
              </p>
            </div>
          </div>

          {course.description ? (
            <div
              className="
                prose
                prose-sm
                max-w-none
                dark:prose-invert
                leading-7
              "
              dangerouslySetInnerHTML={{
                __html: course.description,
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              لا يوجد وصف لهذا الكورس.
            </p>
          )}
        </div>

        {/* ==================================================== */}
        {/* DATES */}
        {/* ==================================================== */}

        <div
          className="
            rounded-[26px]
            border
            border-border
            bg-background
            p-6
            shadow-sm
          "
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
                text-red-500
              "
            >
              <CalendarDays className="size-5" />
            </div>

            <div>
              <h2 className="text-sm font-black">
                معلومات إضافية
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                بيانات الكورس
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground">
                تاريخ الإنشاء
              </p>

              <p className="mt-1 text-sm font-black">
                {formatDate(
                  course.createdAt
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-muted-foreground">
                آخر تحديث
              </p>

              <p className="mt-1 text-sm font-black">
                {formatDate(
                  course.updatedAt
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-muted-foreground">
                حالة الكورس
              </p>

              <p
                className={`mt-1 text-sm font-black ${
                  course.isPublished
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}
              >
                {course.isPublished
                  ? "منشور"
                  : "مسودة"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <PlayCircle className="size-3 text-red-500" />

        <span>
          YAKKAN.EG — تفاصيل الكورس
        </span>
      </div>
    </div>
  )
}

// ============================================================
// INFO ROW
// ============================================================

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-border
        bg-muted/[0.18]
        p-3
      "
    >
      <div
        className="
          flex
          size-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-red-500/10
          text-red-500
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-black">
          {value}
        </p>
      </div>
    </div>
  )
}

// ============================================================
// ICON
// ============================================================

function BarChartIcon() {
  return (
    <Layers3 className="size-4" />
  )
}

// ============================================================
// LABELS
// ============================================================

function getEducationLabel(
  value: string
) {
  switch (value) {
    case "UNIVERSITY":
      return "التعليم الجامعي"

    case "SECONDARY":
      return "الثانوية العامة"

    default:
      return value
  }
}

function getAcademicLevelLabel(
  value: string
) {
  switch (value) {
    case "UNIVERSITY_LEVEL_1":
      return "المستوى الأول"

    case "UNIVERSITY_LEVEL_2":
      return "المستوى الثاني"

    case "UNIVERSITY_LEVEL_3":
      return "المستوى الثالث"

    case "UNIVERSITY_LEVEL_4":
      return "المستوى الرابع"

    case "SECONDARY_GRADE_1":
      return "الصف الأول الثانوي"

    case "SECONDARY_GRADE_2":
      return "الصف الثاني الثانوي"

    case "SECONDARY_GRADE_3":
      return "الصف الثالث الثانوي"

    default:
      return value
  }
}

function getSemesterLabel(
  value: string
) {
  switch (value) {
    case "FIRST":
      return "الفصل الدراسي الأول"

    case "SECOND":
      return "الفصل الدراسي الثاني"

    default:
      return value
  }
}

function getTrackLabel(
  value: string
) {
  switch (value) {
    case "SCIENCE":
      return "الشعبة العلمية"

    case "LITERARY":
      return "الشعبة الأدبية"

    case "SCIENCE_SCIENCES":
      return "علمي علوم"

    case "SCIENCE_MATH":
      return "علمي رياضة"

    default:
      return value
  }
}

function getLevelLabel(
  value: string
) {
  switch (value) {
    case "BEGINNER":
      return "مبتدئ"

    case "INTERMEDIATE":
      return "متوسط"

    case "ADVANCED":
      return "متقدم"

    default:
      return value
  }
}

function formatDate(
  date: Date | string
) {
  return new Intl.DateTimeFormat(
    "ar-EG",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(date))
}

