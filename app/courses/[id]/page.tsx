




import Link from "next/link"
import { notFound } from "next/navigation"

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  PlayCircle,
  ShoppingCart,
} from "lucide-react"

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import EnrollButton from "@/components/enroll-button"
import { prisma } from "@/lib/db"
import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

// ============================================================
// LABELS
// ============================================================

const SUBJECT_NAMES: Record<string, string> = {
  arabic: "اللغة العربية",
  english: "اللغة الإنجليزية",
  french: "اللغة الفرنسية",
  german: "اللغة الألمانية",
  mathematics: "الرياضيات",
  math: "الرياضيات",
  physics: "الفيزياء",
  chemistry: "الكيمياء",
  biology: "الأحياء",
  geology: "الجيولوجيا",
  history: "التاريخ",
  geography: "الجغرافيا",
  philosophy: "الفلسفة",
  sociology: "علم الاجتماع",
  computer: "الحاسب الآلي",
  "computer-science": "علوم الحاسب",
  programming: "البرمجة",
  accounting: "المحاسبة",
  "financial-accounting": "المحاسبة المالية",
  economics: "الاقتصاد",
  statistics: "الإحصاء",
  science: "العلوم",
  religious: "التربية الدينية",
  religion: "التربية الدينية",
}

const COURSE_LEVEL_NAMES: Record<string, string> = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم",
}

const EDUCATION_TYPE_NAMES: Record<string, string> = {
  UNIVERSITY: "جامعي",
  SECONDARY: "ثانوي",
}

const ACADEMIC_LEVEL_NAMES: Record<string, string> = {
  UNIVERSITY_LEVEL_1: "الفرقة الأولى",
  UNIVERSITY_LEVEL_2: "الفرقة الثانية",
  UNIVERSITY_LEVEL_3: "الفرقة الثالثة",
  UNIVERSITY_LEVEL_4: "الفرقة الرابعة",
  SECONDARY_GRADE_1: "الصف الأول الثانوي",
  SECONDARY_GRADE_2: "الصف الثاني الثانوي",
  SECONDARY_GRADE_3: "الصف الثالث الثانوي",
}

const SEMESTER_NAMES: Record<string, string> = {
  FIRST: "الترم الأول",
  SECOND: "الترم الثاني",
}

const SECONDARY_TRACK_NAMES: Record<string, string> = {
  SCIENCE: "علمي علوم",
  LITERARY: "أدبي",
  SCIENCE_SCIENCES: "علمي علوم",
  SCIENCE_MATH: "علمي رياضة",
}

// ============================================================
// HELPERS
// ============================================================

function stripHtml(value: string | null) {
  if (!value) {
    return ""
  }

  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
}

// ============================================================
// S3 MEDIA URL
// ============================================================

async function getMediaUrl(mediaKey: string | null) {
  if (!mediaKey) {
    return null
  }

  try {
    const command = new GetObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: mediaKey,
    })

    return await getSignedUrl(s3, command, {
      expiresIn: 60 * 60,
    })
  } catch (error) {
    console.error("Failed to generate course media URL:", error)

    return null
  }
}

// ============================================================
// PAGE
// ============================================================

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params

  // ==========================================================
  // FETCH COURSE
  // ==========================================================

  const course = await prisma.course.findFirst({
    where: {
      id,
      isPublished: true,
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

            select: {
              id: true,
              title: true,
              description: true,
              position: true,
              duration: true,
            },
          },
        },
      },
    },
  })

  // ==========================================================
  // COURSE NOT FOUND
  // ==========================================================

  if (!course) {
    notFound()
  }

  // ==========================================================
  // MEDIA
  // ==========================================================

  const mediaUrl = await getMediaUrl(course.mediaKey)

  // ==========================================================
  // COUNTS
  // ==========================================================

  const chaptersCount = course.chapters.length

  const lessonsCount = course.chapters.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0
  )

  // ==========================================================
  // LABELS
  // ==========================================================

  const subjectName =
    SUBJECT_NAMES[course.subject.code] || course.subject.name

  const levelName =
    COURSE_LEVEL_NAMES[course.level] || course.level

  const educationTypeName =
    EDUCATION_TYPE_NAMES[course.educationType] ||
    course.educationType

  const academicLevelName =
    ACADEMIC_LEVEL_NAMES[course.academicLevel] ||
    course.academicLevel

  const semesterName =
    SEMESTER_NAMES[course.semester] || course.semester

  const secondaryTrackName = course.secondaryTrack
    ? SECONDARY_TRACK_NAMES[course.secondaryTrack] ||
      course.secondaryTrack
    : null

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-background"
    >
      {/* ======================================================
          TOP
      ====================================================== */}

      <section className="border-b border-border bg-muted/[0.15]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <Link
            href="/courses"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-muted-foreground
              transition-colors
              hover:text-red-500
            "
          >
            <ArrowRight className="size-4" />
            العودة إلى الكورسات
          </Link>
        </div>
      </section>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section>
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-8
            px-5
            py-8
            sm:px-8
            lg:grid-cols-[1.25fr_0.75fr]
            lg:gap-12
            lg:py-12
          "
        >
          {/* ==================================================
              COURSE INFO
          ================================================== */}

          <div className="flex flex-col justify-center">
            {/* SUBJECT */}

            <div
              className="
                mb-4
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                bg-red-500/10
                px-3
                py-1.5
                text-xs
                font-black
                text-red-500
              "
            >
              <BookOpen className="size-3.5" />
              {subjectName}
            </div>

            {/* TITLE */}

            <h1
              className="
                text-3xl
                font-black
                leading-tight
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              {course.title}
            </h1>

            {/* DESCRIPTION */}

            {course.description && (
              <p
                className="
                  mt-5
                  max-w-3xl
                  text-sm
                  leading-8
                  text-muted-foreground
                  sm:text-base
                "
              >
                {stripHtml(course.description)}
              </p>
            )}

            {/* META */}

            <div className="mt-7 flex flex-wrap gap-3">
              {/* LEVEL */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-3.5
                  py-2.5
                  text-xs
                  font-bold
                "
              >
                <Clock3 className="size-4 text-red-500" />
                {levelName}
              </div>

              {/* EDUCATION */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-3.5
                  py-2.5
                  text-xs
                  font-bold
                "
              >
                <GraduationCap className="size-4 text-red-500" />
                {educationTypeName}
              </div>

              {/* CHAPTERS */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-3.5
                  py-2.5
                  text-xs
                  font-bold
                "
              >
                <Layers3 className="size-4 text-red-500" />
                {chaptersCount} فصل
              </div>

              {/* LESSONS */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-3.5
                  py-2.5
                  text-xs
                  font-bold
                "
              >
                <PlayCircle className="size-4 text-red-500" />
                {lessonsCount} درس
              </div>
            </div>

            {/* ACADEMIC INFO */}

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className="
                  rounded-lg
                  bg-muted
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-muted-foreground
                "
              >
                {academicLevelName}
              </span>

              <span
                className="
                  rounded-lg
                  bg-muted
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-muted-foreground
                "
              >
                {semesterName}
              </span>

              {secondaryTrackName && (
                <span
                  className="
                    rounded-lg
                    bg-muted
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-muted-foreground
                  "
                >
                  {secondaryTrackName}
                </span>
              )}
            </div>
          </div>

          {/* ==================================================
              MEDIA + PURCHASE CARD
          ================================================== */}

          <div>
            <div
              className="
                overflow-hidden
                rounded-[26px]
                border
                border-border/60
                bg-background
                shadow-[0_15px_50px_rgba(0,0,0,0.08)]
              "
            >
              {/* MEDIA */}

              <div
                className="
                  aspect-video
                  overflow-hidden
                  bg-muted
                "
              >
                {mediaUrl && course.mediaType === "VIDEO" ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      bg-muted
                    "
                  >
                    <BookOpen
                      className="
                        size-16
                        text-muted-foreground/30
                      "
                    />
                  </div>
                )}
              </div>

              {/* PRICE */}

              <div className="p-5 sm:p-6">
                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        font-bold
                        text-muted-foreground
                      "
                    >
                      سعر الكورس
                    </p>

                    <p
                      className="
                        mt-1
                        text-3xl
                        font-black
                        text-red-500
                      "
                    >
                      {course.price === 0
                        ? "مجاني"
                        : `${course.price} ج.م`}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      size-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-red-500/10
                      text-red-500
                    "
                  >
                    <ShoppingCart className="size-5" />
                  </div>
                </div>

                {/* PURCHASE */}

               <EnrollButton
  courseId={course.id}
  price={course.price}
/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          COURSE CONTENT
      ====================================================== */}

      <section
        className="
          border-t
          border-border
          bg-muted/[0.08]
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
            px-5
            py-10
            sm:px-8
            lg:py-14
          "
        >
          {/* HEADER */}

          <div className="mb-7">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-red-500/10
                px-3
                py-1.5
                text-xs
                font-black
                text-red-500
              "
            >
              <BookOpen className="size-3.5" />
              محتوى الكورس
            </div>

            <h2
              className="
                mt-3
                text-2xl
                font-black
              "
            >
              Chapters & Lessons
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-muted-foreground
              "
            >
              {chaptersCount} فصل يحتوي على{" "}
              {lessonsCount} درس
            </p>
          </div>

          {/* CHAPTERS */}

          <div className="space-y-4">
            {course.chapters.map(
              (chapter, chapterIndex) => (
                <div
                  key={chapter.id}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-background
                  "
                >
                  {/* CHAPTER HEADER */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      border-b
                      border-border
                      px-5
                      py-4
                      sm:px-6
                    "
                  >
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
                      {chapterIndex + 1}
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="
                          truncate
                          text-sm
                          font-black
                          sm:text-base
                        "
                      >
                        {chapter.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-[11px]
                          font-semibold
                          text-muted-foreground
                        "
                      >
                        {chapter.lessons.length} درس
                      </p>
                    </div>
                  </div>

                  {/* LESSONS */}

                  <div>
                    {chapter.lessons.length === 0 ? (
                      <div
                        className="
                          px-6
                          py-5
                          text-xs
                          text-muted-foreground
                        "
                      >
                        لا توجد دروس في هذا
                        الفصل حاليًا.
                      </div>
                    ) : (
                      chapter.lessons.map(
                        (lesson, lessonIndex) => (
                          /*
                           * ==================================================
                           * LESSON LINK
                           *
                           * عند الضغط على أي درس:
                           *
                           * /courses/[courseId]/lessons/[lessonId]
                           *
                           * ==================================================
                           */

                          <Link
                            key={lesson.id}
                            href={`/courses/${course.id}/lessons/${lesson.id}`}
                            className="
                              group
                              flex
                              items-center
                              gap-4
                              border-b
                              border-border/60
                              px-5
                              py-4
                              transition-colors
                              last:border-b-0
                              hover:bg-muted/50
                              sm:px-6
                            "
                          >
                            {/* PLAY ICON */}

                            <div
                              className="
                                flex
                                size-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-muted
                                text-muted-foreground
                                transition-colors
                                group-hover:bg-red-500/10
                                group-hover:text-red-500
                              "
                            >
                              <PlayCircle className="size-4" />
                            </div>

                            {/* LESSON INFO */}

                            <div className="min-w-0 flex-1">
                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-bold
                                  transition-colors
                                  group-hover:text-red-500
                                "
                              >
                                {lessonIndex + 1}.{" "}
                                {lesson.title}
                              </p>

                              {lesson.description && (
                                <p
                                  className="
                                    mt-1
                                    line-clamp-1
                                    text-xs
                                    text-muted-foreground
                                  "
                                >
                                  {stripHtml(
                                    lesson.description
                                  )}
                                </p>
                              )}
                            </div>

                            {/* DURATION */}

                            {lesson.duration ? (
                              <span
                                className="
                                  shrink-0
                                  text-[11px]
                                  font-semibold
                                  text-muted-foreground
                                "
                              >
                                {Math.floor(
                                  lesson.duration / 60
                                )}
                                :
                                {String(
                                  lesson.duration % 60
                                ).padStart(2, "0")}
                              </span>
                            ) : null}

                            {/* CHECK */}

                            <CheckCircle2
                              className="
                                hidden
                                size-4
                                text-muted-foreground/40
                                transition-colors
                                group-hover:text-red-500
                                sm:block
                              "
                            />

                            {/* ARROW */}

                            <ArrowRight
                              className="
                                size-4
                                shrink-0
                                text-muted-foreground/40
                                transition-all
                                group-hover:-translate-x-1
                                group-hover:text-red-500
                              "
                            />
                          </Link>
                        )
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

