
"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Search,
  X,
  ArrowRight,
} from "lucide-react"

import CourseCard, {
  type CourseCardData,
} from "@/components/courses/course-card"

// ============================================================
// TYPES
// ============================================================

type EducationType =
  | "ALL"
  | "UNIVERSITY"
  | "SECONDARY"

type AcademicLevel =
  | "ALL"
  | "UNIVERSITY_LEVEL_1"
  | "UNIVERSITY_LEVEL_2"
  | "UNIVERSITY_LEVEL_3"
  | "UNIVERSITY_LEVEL_4"
  | "SECONDARY_GRADE_1"
  | "SECONDARY_GRADE_2"
  | "SECONDARY_GRADE_3"

interface CoursesApiResponse {
  success: boolean
  courses?: CourseCardData[]
  error?: string
}

// ============================================================
// LABELS
// ============================================================

const educationTypeLabels: Record<
  EducationType,
  string
> = {
  ALL: "الكل",
  UNIVERSITY: "جامعي",
  SECONDARY: "ثانوي",
}

const academicLevelLabels: Record<
  Exclude<AcademicLevel, "ALL">,
  string
> = {
  UNIVERSITY_LEVEL_1: "المستوى الأول",
  UNIVERSITY_LEVEL_2: "المستوى الثاني",
  UNIVERSITY_LEVEL_3: "المستوى الثالث",
  UNIVERSITY_LEVEL_4: "المستوى الرابع",

  SECONDARY_GRADE_1: "الأول الثانوي",
  SECONDARY_GRADE_2: "الثاني الثانوي",
  SECONDARY_GRADE_3: "الثالث الثانوي",
}

// ============================================================
// SUBJECT TRANSLATIONS
// ============================================================

const subjectLabels: Record<string, string> = {
  arabic: "اللغة العربية",
  mathematics: "الرياضيات",
  math: "الرياضيات",
  physics: "الفيزياء",
  chemistry: "الكيمياء",
  biology: "الأحياء",
  english: "اللغة الإنجليزية",
  french: "اللغة الفرنسية",
  german: "اللغة الألمانية",
  computer: "الحاسب الآلي",
  computer_science: "علوم الحاسب",
  programming: "البرمجة",
  history: "التاريخ",
  geography: "الجغرافيا",
  philosophy: "الفلسفة",
  psychology: "علم النفس",
  statistics: "الإحصاء",
  science: "العلوم",
}

// ============================================================
// HELPERS
// ============================================================

function cleanHtml(
  value: string | null | undefined
) {
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

function getSubjectLabel(
  subject: CourseCardData["subject"]
) {
  if (!subject) {
    return "غير محدد"
  }

  const code =
    subject.code?.toLowerCase().trim()

  const name =
    subject.name?.trim()

  if (
    code &&
    subjectLabels[code]
  ) {
    return subjectLabels[code]
  }

  return name || "غير محدد"
}

// ============================================================
// PAGE
// ============================================================

export default function CoursesPage() {
  // ==========================================================
  // DATA
  // ==========================================================

  const [courses, setCourses] =
    useState<CourseCardData[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [search, setSearch] =
    useState("")

  const [educationType, setEducationType] =
    useState<EducationType>("ALL")

  const [academicLevel, setAcademicLevel] =
    useState<AcademicLevel>("ALL")

  // ==========================================================
  // FETCH COURSES
  // ==========================================================

  useEffect(() => {
    let mounted = true

    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)

        const response =
          await fetch("/api/courses", {
            method: "GET",
            cache: "no-store",
          })

        const data =
          (await response.json()) as CoursesApiResponse

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
              "فشل تحميل الكورسات"
          )
        }

        if (!mounted) {
          return
        }

        const safeCourses =
          Array.isArray(data.courses)
            ? data.courses
            : []

        setCourses(safeCourses)
      } catch (error) {
        console.error(
          "Fetch courses error:",
          error
        )

        if (!mounted) {
          return
        }

        setCourses([])

        setError(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحميل الكورسات"
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchCourses()

    return () => {
      mounted = false
    }
  }, [])

  // ==========================================================
  // PREPARE COURSES
  // ==========================================================

  const preparedCourses =
    useMemo(() => {
      return courses.map(
        (course) => ({
          ...course,

          description:
            course.description
              ? cleanHtml(
                  course.description
                )
              : null,

          subject: course.subject
            ? {
                ...course.subject,

                name: getSubjectLabel(
                  course.subject
                ),
              }
            : null,
        })
      )
    }, [courses])

  // ==========================================================
  // FILTERED COURSES
  // ==========================================================

  const filteredCourses =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase()

      return preparedCourses.filter(
        (course) => {
          const title =
            course.title
              ?.toLowerCase() ?? ""

          const description =
            course.description
              ?.toLowerCase() ?? ""

          const subjectName =
            course.subject?.name
              ?.toLowerCase() ?? ""

          const matchesSearch =
            !normalizedSearch ||
            title.includes(
              normalizedSearch
            ) ||
            description.includes(
              normalizedSearch
            ) ||
            subjectName.includes(
              normalizedSearch
            )

          const matchesEducationType =
            educationType === "ALL" ||
            course.educationType ===
              educationType

          const matchesAcademicLevel =
            academicLevel === "ALL" ||
            course.academicLevel ===
              academicLevel

          return (
            matchesSearch &&
            matchesEducationType &&
            matchesAcademicLevel
          )
        }
      )
    }, [
      preparedCourses,
      search,
      educationType,
      academicLevel,
    ])

  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const hasFilters =
    search.trim() !== "" ||
    educationType !== "ALL" ||
    academicLevel !== "ALL"

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearch("")
    setEducationType("ALL")
    setAcademicLevel("ALL")
  }

  // ==========================================================
  // LEVELS
  // ==========================================================

  const currentLevels =
    educationType === "SECONDARY"
      ? ([
          "SECONDARY_GRADE_1",
          "SECONDARY_GRADE_2",
          "SECONDARY_GRADE_3",
        ] as const)
      : educationType === "UNIVERSITY"
        ? ([
            "UNIVERSITY_LEVEL_1",
            "UNIVERSITY_LEVEL_2",
            "UNIVERSITY_LEVEL_3",
            "UNIVERSITY_LEVEL_4",
          ] as const)
        : []

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        overflow-hidden
        bg-background
      "
    >
      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-border
          bg-muted/[0.15]
        "
      >
        {/* Background glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            top-10
            size-72
            rounded-full
            bg-red-500/[0.06]
            blur-[100px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-32
            bottom-0
            size-64
            rounded-full
            bg-rose-500/[0.05]
            blur-[100px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-5
            py-10
            sm:px-8
            sm:py-14
            lg:py-16
          "
        >
          {/* BACK TO HOME */}

          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="mb-8"
          >
            <motion.a
              href="/"
              whileHover={{
                x: 4,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-border
                bg-background
                px-4
                py-2.5
                text-xs
                font-bold
                text-muted-foreground
                shadow-sm
                transition-colors
                hover:border-red-500/20
                hover:bg-red-500/5
                hover:text-red-500
              "
            >
              <ArrowRight className="size-4" />

              الصفحة الرئيسية
            </motion.a>
          </motion.div>

          {/* HERO CONTENT */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: "easeOut",
            }}
            className="max-w-2xl"
          >
            {/* BADGE */}

            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="
                mb-4
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
              <BookOpen className="size-3.5" />

              كورسات YAKKAN
            </motion.div>

            {/* TITLE */}

            <h1
              className="
                text-3xl
                font-black
                leading-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              اتعلم مهارات جديدة
              <br />

              <span className="text-red-500">
                وطور مستواك
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
              "
            >
              اكتشف الكورسات المتاحة
              واختر المحتوى المناسب
              لمستواك ودراستك.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

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
        {/* =================================================
            SEARCH + TABS
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="
            rounded-2xl
            border
            border-border
            bg-background
            p-4
            shadow-sm
            sm:p-5
          "
        >
          <div className="flex flex-col gap-4">
            {/* SEARCH */}

            <div className="relative">
              <Search
                className="
                  absolute
                  right-4
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="ابحث عن كورس أو مادة..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-muted/[0.15]
                  pr-11
                  pl-10
                  text-sm
                  outline-none
                  transition
                  focus:border-red-500
                  focus:ring-4
                  focus:ring-red-500/10
                "
              />

              {search && (
                <motion.button
                  type="button"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={() =>
                    setSearch("")
                  }
                  className="
                    absolute
                    left-3
                    top-1/2
                    flex
                    size-7
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-muted-foreground
                    transition-colors
                    hover:bg-muted
                    hover:text-foreground
                  "
                  aria-label="مسح البحث"
                >
                  <X className="size-4" />
                </motion.button>
              )}
            </div>

            {/* MAIN TABS */}

            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div
                className="
                  flex
                  w-full
                  items-center
                  gap-1
                  overflow-x-auto
                  rounded-xl
                  border
                  border-border
                  bg-muted/[0.18]
                  p-1
                  sm:w-fit
                "
              >
                {(
                  Object.entries(
                    educationTypeLabels
                  ) as [
                    EducationType,
                    string
                  ][]
                ).map(
                  ([value, label]) => {
                    const active =
                      educationType ===
                      value

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setEducationType(
                            value
                          )

                          setAcademicLevel(
                            "ALL"
                          )
                        }}
                        className={`
                          shrink-0
                          rounded-lg
                          px-5
                          py-2.5
                          text-sm
                          font-bold
                          transition-all
                          ${
                            active
                              ? "bg-background text-red-500 shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        {label}
                      </button>
                    )
                  }
                )}
              </div>

              {/* CLEAR FILTERS */}

              {hasFilters && (
                <motion.button
                  type="button"
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={
                    clearFilters
                  }
                  className="
                    shrink-0
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/5
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-red-500
                    transition
                    hover:bg-red-500/10
                  "
                >
                  مسح الفلاتر
                </motion.button>
              )}
            </div>

            {/* ACADEMIC LEVEL TABS */}

            {educationType !==
              "ALL" && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                transition={{
                  duration: 0.25,
                }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {/* ALL LEVELS */}

                  <button
                    type="button"
                    onClick={() =>
                      setAcademicLevel(
                        "ALL"
                      )
                    }
                    className={`
                      rounded-lg
                      border
                      px-4
                      py-2
                      text-xs
                      font-bold
                      transition
                      ${
                        academicLevel ===
                        "ALL"
                          ? "border-red-500 bg-red-500 text-white shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:border-red-500/30 hover:text-red-500"
                      }
                    `}
                  >
                    كل المستويات
                  </button>

                  {/* LEVELS */}

                  {currentLevels.map(
                    (level) => {
                      const active =
                        academicLevel ===
                        level

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setAcademicLevel(
                              level
                            )
                          }
                          className={`
                            rounded-lg
                            border
                            px-4
                            py-2
                            text-xs
                            font-bold
                            transition
                            ${
                              active
                                ? "border-red-500 bg-red-500 text-white shadow-sm"
                                : "border-border bg-background text-muted-foreground hover:border-red-500/30 hover:text-red-500"
                            }
                          `}
                        >
                          {
                            academicLevelLabels[
                              level
                            ]
                          }
                        </button>
                      )
                    }
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* =================================================
            RESULT HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="
            mb-6
            mt-8
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h2 className="text-xl font-black">
              الكورسات
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {loading
                ? "جاري تحميل الكورسات..."
                : `${filteredCourses.length} كورس متاح`}
            </p>
          </div>
        </motion.div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-background
                "
              >
                <div
                  className="
                    aspect-video
                    animate-pulse
                    bg-muted
                  "
                />

                <div className="space-y-3 p-5">
                  <div
                    className="
                      h-5
                      w-3/4
                      animate-pulse
                      rounded-lg
                      bg-muted
                    "
                  />

                  <div
                    className="
                      h-4
                      w-full
                      animate-pulse
                      rounded-lg
                      bg-muted
                    "
                  />

                  <div
                    className="
                      h-4
                      w-1/2
                      animate-pulse
                      rounded-lg
                      bg-muted
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/5
              px-6
              py-16
              text-center
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.35,
                delay: 0.05,
                ease: "easeOut",
              }}
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
              <BookOpen className="size-7" />
            </motion.div>

            <h3 className="mt-5 text-base font-black">
              حصل خطأ أثناء تحميل الكورسات
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {error}
            </p>

            <motion.button
              type="button"
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() =>
                window.location.reload()
              }
              className="
                mt-6
                rounded-xl
                bg-red-500
                px-5
                py-2.5
                text-xs
                font-bold
                text-white
                transition
                hover:bg-red-600
              "
            >
              إعادة المحاولة
            </motion.button>
          </motion.div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredCourses.length ===
            0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="
                rounded-2xl
                border-2
                border-dashed
                border-border
                px-6
                py-20
                text-center
              "
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.05,
                  ease: "easeOut",
                }}
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
                <Search className="size-7" />
              </motion.div>

              <h3
                className="
                  mt-5
                  text-base
                  font-black
                "
              >
                لا توجد كورسات متاحة
              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                {academicLevel !==
                "ALL"
                  ? `لا توجد كورسات متاحة في ${academicLevelLabels[academicLevel]} حاليًا.`
                  : educationType !==
                      "ALL"
                    ? `لا توجد كورسات متاحة في التعليم ${educationType === "SECONDARY" ? "الثانوي" : "الجامعي"} حاليًا.`
                    : "جرّب تغيير كلمة البحث أو الفلاتر للعثور على الكورس المناسب لك."}
              </p>

              {hasFilters && (
                <motion.button
                  type="button"
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={
                    clearFilters
                  }
                  className="
                    mt-6
                    rounded-xl
                    bg-red-500
                    px-5
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-red-600
                  "
                >
                  مسح الفلاتر
                </motion.button>
              )}
            </motion.div>
          )}

        {/* =================================================
            COURSES
        ================================================= */}

        {!loading &&
          !error &&
          filteredCourses.length >
            0 && (
            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                xl:grid-cols-3
              "
            >
              {filteredCourses.map(
                (course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.08,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(
                        index * 0.05,
                        0.2
                      ),
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="h-full"
                  >
                    <CourseCard
                      course={course}
                    />
                  </motion.div>
                )
              )}
            </div>
          )}
      </section>
    </main>
  )
}