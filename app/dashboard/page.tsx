

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Play,
  ArrowLeft,
  GraduationCap,
  Loader2,
  Home,
} from "lucide-react"

// ============================================================
// TYPES
// ============================================================

type DashboardCourse = {
  enrollmentId: string
  enrolledAt: string

  course: {
    id: string
    title: string
    description: string | null
    mediaUrl: string | null
    mediaKey: string | null
    mediaType: "IMAGE" | "VIDEO" | null
    price: number

    subject: {
      id: string
      name: string
      code: string
    }
  }

  totalLessons: number
  completedLessons: number
  progress: number

  lastLesson: {
    id: string
    title: string
    duration: number | null
    chapterId: string
    chapterTitle: string
    progress: number
    watchedSeconds: number
    completed: boolean
  } | null

  continueLesson: {
    id: string
    title: string
    duration: number | null
    chapterId: string
    chapterTitle: string
  } | null
}

type DashboardResponse = {
  success: boolean

  stats: {
    totalCourses: number
    completedCourses: number
    overallProgress: number
  }

  courses: DashboardCourse[]

  lastCourse: DashboardCourse | null

  error?: string
}

// ============================================================
// HELPERS
// ============================================================

function cleanHtml(value: string | null | undefined) {
  if (!value) {
    return ""
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function formatDuration(seconds: number | null) {
  if (!seconds || seconds <= 0) {
    return ""
  }

  const minutes = Math.floor(seconds / 60)

  if (minutes < 60) {
    return `${minutes} دقيقة`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} ساعة`
  }

  return `${hours} ساعة و ${remainingMinutes} دقيقة`
}

// ============================================================
// LESSON URL
// ============================================================

function getLessonUrl(courseId: string, lessonId: string) {
  return `/courses/${courseId}/lessons/${lessonId}`
}

// ============================================================
// PAGE
// ============================================================

export default function DashboardPage() {
  const [data, setData] =
    useState<DashboardResponse | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  // ==========================================================
  // FETCH
  // ==========================================================

  useEffect(() => {
    let mounted = true

    async function loadDashboard() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/dashboard", {
          method: "GET",
          cache: "no-store",
        })

        const result =
          (await response.json()) as DashboardResponse

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "فشل تحميل لوحة الطالب"
          )
        }

        if (!mounted) {
          return
        }

        setData(result)
      } catch (error) {
        console.error("Dashboard error:", error)

        if (!mounted) {
          return
        }

        setError(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحميل لوحة الطالب"
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      mounted = false
    }
  }, [])

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-background"
      >
        <div
          className="
            mx-auto
            flex
            min-h-[70vh]
            max-w-7xl
            items-center
            justify-center
            px-5
          "
        >
          <div className="flex items-center gap-3">
            <Loader2 className="size-5 animate-spin text-red-500" />

            <span className="text-sm font-semibold text-muted-foreground">
              جاري تحميل لوحة الطالب...
            </span>
          </div>
        </div>
      </main>
    )
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !data) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-background"
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-12
            sm:px-8
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/5
              p-8
              text-center
            "
          >
            <h2 className="text-lg font-black">
              حصل خطأ
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {error || "تعذر تحميل لوحة الطالب"}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                mt-5
                rounded-xl
                bg-red-500
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                transition
                hover:bg-red-600
              "
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const {
    stats,
    courses,
    lastCourse,
  } = data

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        bg-background
      "
    >
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <section
        className="
          border-b
          border-border
          bg-muted/[0.15]
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-8
            sm:px-8
            lg:py-10
          "
        >
          {/* ================================================= */}
          {/* TOP NAV */}
          {/* ================================================= */}

          <div className="mb-8 flex items-center justify-between gap-4">
            {/* PAGE LABEL */}

            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-red-500/20
                bg-red-500/10
                px-3
                py-1.5
                text-xs
                font-bold
                text-red-500
              "
            >
              <GraduationCap className="size-3.5" />

              لوحة الطالب
            </motion.div>

            {/* HOME BUTTON */}

            <motion.a
              href="/"
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.04,
                y: -2,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="
                group
                relative
                inline-flex
                items-center
                gap-2
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-background
                px-4
                py-2.5
                text-sm
                font-bold
                shadow-sm
                transition-all
                duration-300
                hover:border-red-500/30
                hover:text-red-500
                hover:shadow-md
              "
            >
              {/* SHINE */}

              <motion.span
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  -left-10
                  w-8
                  rotate-12
                  bg-gradient-to-r
                  from-transparent
                  via-red-500/20
                  to-transparent
                "
                initial={{
                  x: -20,
                }}
                animate={{
                  x: 170,
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />

              <Home
                className="
                  relative
                  size-4
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                "
              />

              <span className="relative">
                الرئيسية
              </span>
            </motion.a>
          </div>

          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="max-w-3xl"
          >
            <h1
              className="
                text-3xl
                font-black
                leading-tight
                sm:text-4xl
              "
            >
              كمل رحلتك التعليمية 🚀
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
              "
            >
              تابع تقدمك وارجع مباشرة لآخر درس
              كنت بتتعلمه.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-8
          sm:px-8
          lg:py-10
        "
      >
        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >
          {/* TOTAL COURSES */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            whileHover={{
              y: -4,
            }}
            className="
              rounded-2xl
              border
              border-border
              bg-background
              p-5
              shadow-sm
              transition-shadow
              hover:shadow-lg
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  كورساتي
                </p>

                <p className="mt-2 text-3xl font-black">
                  {stats.totalCourses}
                </p>
              </div>

              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-500/10
                  text-red-500
                "
              >
                <BookOpen className="size-5" />
              </div>
            </div>
          </motion.div>

          {/* PROGRESS */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            whileHover={{
              y: -4,
            }}
            className="
              rounded-2xl
              border
              border-border
              bg-background
              p-5
              shadow-sm
              transition-shadow
              hover:shadow-lg
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  نسبة التقدم
                </p>

                <p className="mt-2 text-3xl font-black">
                  {stats.overallProgress}%
                </p>
              </div>

              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-500/10
                  text-green-500
                "
              >
                <CheckCircle2 className="size-5" />
              </div>
            </div>

            <div
              className="
                mt-4
                h-2
                overflow-hidden
                rounded-full
                bg-muted
              "
            >
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${stats.overallProgress}%`,
                }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                  ease: "easeOut",
                }}
                className="
                  h-full
                  rounded-full
                  bg-red-500
                "
              />
            </div>
          </motion.div>

          {/* COMPLETED */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.3,
            }}
            whileHover={{
              y: -4,
            }}
            className="
              rounded-2xl
              border
              border-border
              bg-background
              p-5
              shadow-sm
              transition-shadow
              hover:shadow-lg
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  كورسات مكتملة
                </p>

                <p className="mt-2 text-3xl font-black">
                  {stats.completedCourses}
                </p>
              </div>

              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-500
                "
              >
                <CheckCircle2 className="size-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================================================= */}
        {/* CONTINUE LEARNING */}
        {/* ================================================= */}

        {lastCourse?.continueLesson && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.35,
            }}
            className="mt-8"
          >
            <div className="mb-4">
              <h2 className="text-xl font-black">
                متابعة التعلم
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                ارجع مباشرة لآخر مكان وصلت له.
              </p>
            </div>

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/[0.03]
                shadow-sm
              "
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-red-500/10
                        px-2.5
                        py-1.5
                        text-[11px]
                        font-bold
                        text-red-500
                      "
                    >
                      <Play className="size-3" />

                      متابعة التعلم
                    </div>

                    <h3
                      className="
                        mt-3
                        text-lg
                        font-black
                        sm:text-xl
                      "
                    >
                      {lastCourse.course.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {
                        lastCourse.continueLesson
                          .chapterTitle
                      }

                      {" — "}

                      {
                        lastCourse.continueLesson
                          .title
                      }
                    </p>

                    {lastCourse.lastLesson && (
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          تقدم الدرس:{" "}
                          {Math.round(
                            lastCourse.lastLesson.progress
                          )}
                          %
                        </span>

                        {lastCourse.continueLesson.duration && (
                          <>
                            <span>•</span>

                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="size-3.5" />

                              {formatDuration(
                                lastCourse.continueLesson
                                  .duration
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CONTINUE BUTTON */}

                  <motion.a
                    href={getLessonUrl(
                      lastCourse.course.id,
                      lastCourse.continueLesson.id
                    )}
                    whileHover={{
                      scale: 1.03,
                      x: -3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="
                      inline-flex
                      shrink-0
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-red-500
                      px-5
                      py-3
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-red-600
                    "
                  >
                    متابعة التعلم

                    <ArrowLeft className="size-4" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================= */}
        {/* MY COURSES */}
        {/* ================================================= */}

        <div className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-black">
              كورساتي
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              الكورسات اللي أنت مشترك فيها.
            </p>
          </div>

          {courses.length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                rounded-2xl
                border-2
                border-dashed
                border-border
                px-6
                py-16
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  size-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-muted
                "
              >
                <BookOpen className="size-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-base font-black">
                لسه مشتركش في أي كورس
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                ابدأ رحلتك التعليمية من صفحة الكورسات.
              </p>

              <motion.a
                href="/courses"
                whileHover={{
                  scale: 1.04,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  mt-5
                  inline-flex
                  rounded-xl
                  bg-red-500
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-red-600
                "
              >
                تصفح الكورسات
              </motion.a>
            </motion.div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
              "
            >
              {courses.map((item, index) => (
                <motion.article
                  key={item.enrollmentId}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    shadow-sm
                    transition-shadow
                    hover:shadow-xl
                  "
                >
                  {/* IMAGE */}

                  <div
                    className="
                      aspect-video
                      overflow-hidden
                      bg-muted
                    "
                  >
                    {item.course.mediaUrl ? (
                      <img
                        src={item.course.mediaUrl}
                        alt={item.course.title}
                        className="
                          size-full
                          object-cover
                          transition-transform
                          duration-500
                          hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          size-full
                          items-center
                          justify-center
                          bg-muted
                        "
                      >
                        <BookOpen className="size-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* BODY */}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span
                          className="
                            text-[11px]
                            font-bold
                            text-red-500
                          "
                        >
                          {item.course.subject.name}
                        </span>

                        <h3
                          className="
                            mt-1
                            line-clamp-2
                            text-base
                            font-black
                          "
                        >
                          {item.course.title}
                        </h3>
                      </div>

                      <span
                        className="
                          shrink-0
                          rounded-lg
                          bg-muted
                          px-2.5
                          py-1.5
                          text-[11px]
                          font-bold
                        "
                      >
                        {item.progress}%
                      </span>
                    </div>

                    {/* PROGRESS */}

                    <div className="mt-5">
                      <div
                        className="
                          mb-2
                          flex
                          items-center
                          justify-between
                          text-[11px]
                          text-muted-foreground
                        "
                      >
                        <span>
                          {item.completedLessons} من{" "}
                          {item.totalLessons} درس مكتمل
                        </span>

                        <span>{item.progress}%</span>
                      </div>

                      <div
                        className="
                          h-2
                          overflow-hidden
                          rounded-full
                          bg-muted
                        "
                      >
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${item.progress}%`,
                          }}
                          transition={{
                            duration: 0.9,
                            delay: 0.3,
                            ease: "easeOut",
                          }}
                          className="
                            h-full
                            rounded-full
                            bg-red-500
                          "
                        />
                      </div>
                    </div>

                    {/* LAST LESSON */}

                    <div
                      className="
                        mt-5
                        rounded-xl
                        bg-muted/[0.4]
                        p-3.5
                      "
                    >
                      <p
                        className="
                          text-[11px]
                          font-bold
                          text-muted-foreground
                        "
                      >
                        آخر درس
                      </p>

                      <p
                        className="
                          mt-1
                          line-clamp-1
                          text-sm
                          font-bold
                        "
                      >
                        {item.lastLesson?.title ??
                          "لم تبدأ الكورس بعد"}
                      </p>
                    </div>

                    {/* ACTION */}

                    {item.continueLesson && (
                      <motion.a
                        href={getLessonUrl(
                          item.course.id,
                          item.continueLesson.id
                        )}
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        className="
                          mt-4
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-red-500
                          px-4
                          py-3
                          text-sm
                          font-bold
                          text-white
                          transition
                          hover:bg-red-600
                        "
                      >
                        <Play className="size-4" />

                        {item.progress === 100
                          ? "مراجعة الكورس"
                          : "متابعة التعلم"}
                      </motion.a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}