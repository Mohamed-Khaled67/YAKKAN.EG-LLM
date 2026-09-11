
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  Home,
  LayoutDashboard,
  Loader2,
  Play,
  Trophy,
  UserRound,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"

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

function getLessonUrl(
  courseId: string,
  lessonId: string
) {
  return `/courses/${courseId}/lessons/${lessonId}`
}

function getCourseUrl(courseId: string) {
  return `/courses/${courseId}`
}

// ============================================================
// PAGE
// ============================================================

export default function ProfilePage() {
  const {
    data: session,
    isPending: sessionLoading,
  } = authClient.useSession()

  const [data, setData] =
    useState<DashboardResponse | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  // ==========================================================
  // FETCH DASHBOARD DATA
  // ==========================================================

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          "/api/dashboard",
          {
            method: "GET",
            cache: "no-store",
          }
        )

        const result =
          (await response.json()) as DashboardResponse

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ||
              "فشل تحميل بيانات الملف الشخصي"
          )
        }

        if (!mounted) return

        setData(result)
      } catch (error) {
        console.error(
          "Profile dashboard error:",
          error
        )

        if (!mounted) return

        setError(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحميل البيانات"
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [])

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading ||
    sessionLoading
  ) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f7f7f8] dark:bg-[#08090b]"
      >
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-bold text-zinc-500 dark:text-zinc-400">
            <Loader2 className="size-5 animate-spin text-[#C8102E]" />
            جاري تحميل ملفك الشخصي...
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
        className="min-h-screen bg-[#f7f7f8] px-5 py-10 dark:bg-[#08090b]"
      >
        <div className="mx-auto max-w-[900px]">

          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-black/[0.07] bg-white px-4 py-2.5 text-sm font-bold transition hover:border-[#C8102E]/20 hover:text-[#C8102E] dark:border-white/[0.08] dark:bg-white/[0.04]"
          >
            <Home className="size-4" />
            الصفحة الرئيسية
          </Link>

          <div className="rounded-[28px] border border-red-500/20 bg-red-500/[0.04] p-10 text-center">

            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <UserRound className="size-7" />
            </div>

            <h1 className="mt-5 text-xl font-black">
              تعذر تحميل الملف الشخصي
            </h1>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {error ||
                "حدث خطأ غير متوقع"}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-black text-white transition hover:bg-[#a90d27]"
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

  const user = session?.user

  const userRole = (
    user as
      | {
          role?: string
        }
      | undefined
  )?.role

  const isAdmin =
    userRole?.toUpperCase() === "ADMIN"

  const {
    stats,
    courses,
  } = data

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[#f7f7f8] text-zinc-950 dark:bg-[#08090b] dark:text-white"
    >

      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute right-[-180px] top-[-180px] size-[500px] rounded-full bg-[#C8102E]/[0.06] blur-[130px]" />

        <div className="absolute bottom-[-200px] left-[-180px] size-[500px] rounded-full bg-[#C8102E]/[0.04] blur-[130px]" />

      </div>

      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="relative z-10 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#08090b]/85">

        <div className="mx-auto flex h-[76px] max-w-[1250px] items-center justify-between px-5 lg:px-10">

          {/* ====================================================
              LOGO — SAME AS NAVBAR
          ==================================================== */}

          <Link
            href="/"
            className="
              group
              relative
              flex
              shrink-0
              items-center
              gap-2.5
            "
          >

            {/* Logo */}

            <div
              className="
                relative
                flex
                size-10
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-red-500/15
                bg-background
                p-1
                shadow-lg
                shadow-red-500/10
                transition-all
                duration-300
                group-hover:scale-105
                group-hover:border-red-500/30
                group-hover:shadow-xl
                group-hover:shadow-red-500/20
              "
            >

              <div
                className="
                  absolute
                  inset-0
                  rounded-xl
                  bg-gradient-to-br
                  from-red-500/20
                  via-rose-500/10
                  to-orange-500/20
                "
              />

              <img
                src="/myLogo.png"
                alt="YAKKAN-EG"
                className="
                  relative
                  z-10
                  size-full
                  rounded-lg
                  object-cover
                "
              />

            </div>

            {/* Brand */}

            <div className="hidden sm:block">

              <div
                className="
                  bg-gradient-to-l
                  from-red-500
                  via-rose-500
                  to-orange-500
                  bg-clip-text
                  text-sm
                  font-black
                  tracking-[0.12em]
                  text-transparent
                "
              >
                YAKKAN-EG
              </div>

              <div className="text-[9px] text-muted-foreground">
                تعلم • تطور • استمتع
              </div>

            </div>

          </Link>

          {/* ====================================================
              HOME
          ==================================================== */}

          <Link
            href="/"
            className="group flex items-center gap-2 rounded-xl border border-black/[0.07] bg-white px-4 py-2.5 text-sm font-black shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C8102E]/20 hover:text-[#C8102E] hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.04]"
          >

            <Home className="size-4" />

            <span className="hidden sm:inline">
              الصفحة الرئيسية
            </span>

            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />

          </Link>

        </div>
      </header>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="relative z-10 mx-auto max-w-[1250px] px-5 py-10 lg:px-10 lg:py-14">

        {/* ======================================================
            PROFILE HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(24,24,27,0.06)] dark:border-white/[0.07] dark:bg-[#111216]">

          <div className="absolute right-0 top-0 h-full w-1.5 bg-[#C8102E]" />

          <div className="relative p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-5">

                <div className="relative shrink-0">

                  <div className="flex size-[82px] items-center justify-center overflow-hidden rounded-full border-4 border-[#C8102E]/10 bg-[#C8102E]/10 shadow-lg sm:size-[96px]">

                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={
                          user.name ||
                          "User"
                        }
                        className="size-full object-cover"
                      />
                    ) : (
                      <UserRound className="size-10 text-[#C8102E]" />
                    )}

                  </div>

                  <div className="absolute bottom-0 left-0 flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#C8102E] dark:border-[#111216]">
                    <CheckCircle2 className="size-3.5 text-white" />
                  </div>

                </div>

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-xl font-black sm:text-2xl">
                      {user?.name ||
                        "مستخدم YAKKAN EG"}
                    </h1>

                    <span className="rounded-full bg-[#C8102E]/10 px-2.5 py-1 text-[10px] font-black text-[#C8102E]">
                      {isAdmin
                        ? "Admin"
                        : "طالب"}
                    </span>

                  </div>

                  <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                    {user?.email ||
                      "حساب YAKKAN EG"}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-zinc-400">

                    <GraduationCap className="size-4 text-[#C8102E]" />

                    {isAdmin
                      ? "إدارة منصتك التعليمية على YAKKAN EG"
                      : "رحلتك التعليمية على YAKKAN EG"}

                  </div>

                </div>

              </div>

              <div className="hidden rounded-2xl border border-black/[0.06] bg-zinc-50 px-5 py-4 text-center dark:border-white/[0.07] dark:bg-white/[0.03] sm:block">

                <p className="text-[11px] font-bold text-zinc-400">
                  إجمالي الكورسات
                </p>

                <p className="mt-1 text-2xl font-black text-[#C8102E]">
                  {stats.totalCourses}
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* ======================================================
            STATS
        ====================================================== */}

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <ProfileStat
            icon={<BookOpen />}
            title="كورساتي"
            value={stats.totalCourses}
            description="الكورسات المشترك فيها"
          />

          <ProfileStat
            icon={<Trophy />}
            title="مكتملة"
            value={stats.completedCourses}
            description="كورسات أنهيتها بالكامل"
          />

          <ProfileStat
            icon={<CheckCircle2 />}
            title="متوسط التقدم"
            value={`${Math.round(
              stats.overallProgress
            )}%`}
            description="تقدمك في جميع الكورسات"
          />

        </section>

        {/* ======================================================
            QUICK ACCESS
        ====================================================== */}

        <section className="mt-6">

          <div className="mb-4">

            <div className="flex items-center gap-2 text-sm font-black text-[#C8102E]">
              <ArrowLeft className="size-4" />
              الوصول السريع
            </div>

            <h2 className="mt-1 text-xl font-black">
              اختصاراتك
            </h2>

          </div>

          <div
            className={`grid gap-3 ${
              isAdmin
                ? "grid-cols-2 lg:grid-cols-4"
                : "grid-cols-2 lg:grid-cols-3"
            }`}
          >

            <QuickAccessCard
              href="/"
              icon={<Home />}
              title="الرئيسية"
              description="الصفحة الرئيسية"
            />

            <QuickAccessCard
              href="/courses"
              icon={<BookOpen />}
              title="الكورسات"
              description="استكشف الكورسات"
            />

            

            {isAdmin && (
              <QuickAccessCard
                href="/admin"
                icon={<LayoutDashboard />}
                title="لوحة التحكم"
                description="إدارة المنصة"
                admin
              />
            )}

          </div>

        </section>

        {/* ======================================================
            OVERALL PROGRESS
        ====================================================== */}

        {stats.totalCourses > 0 && (
          <section className="mt-6 rounded-[26px] border border-black/[0.06] bg-white p-6 shadow-[0_12px_40px_rgba(24,24,27,0.05)] dark:border-white/[0.07] dark:bg-[#111216] sm:p-7">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="text-lg font-black">
                  تقدمك التعليمي
                </h2>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  استمر في التعلم للوصول إلى أهدافك.
                </p>

              </div>

              <span className="text-2xl font-black text-[#C8102E]">
                {Math.round(
                  stats.overallProgress
                )}
                %
              </span>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/[0.06]">

              <div
                className="h-full rounded-full bg-[#C8102E] transition-all duration-700"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      stats.overallProgress
                    )
                  )}%`,
                }}
              />

            </div>

          </section>
        )}

        {/* ======================================================
            MY COURSES
        ====================================================== */}

        <section className="mt-10">

          <div className="mb-6">

            <div className="flex items-end justify-between gap-4">

              <div>

                <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#C8102E]">
                  <GraduationCap className="size-4" />
                  رحلتي التعليمية
                </div>

                <h2 className="text-2xl font-black sm:text-3xl">
                  كورساتي
                </h2>

                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  كل الكورسات اللي أنت مشترك فيها وحالة تقدمك فيها.
                </p>

              </div>

              {courses.length > 0 && (
                <span className="hidden rounded-full bg-[#C8102E]/10 px-3 py-1.5 text-xs font-black text-[#C8102E] sm:block">
                  {courses.length} كورس
                </span>
              )}

            </div>

          </div>

          {courses.length === 0 ? (

            <div className="rounded-[28px] border-2 border-dashed border-black/[0.08] bg-white px-6 py-16 text-center dark:border-white/[0.08] dark:bg-[#111216]">

              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#C8102E]/10 text-[#C8102E]">
                <BookOpen className="size-7" />
              </div>

              <h3 className="mt-5 text-lg font-black">
                لسه مفيش كورسات
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                لم تشترك في أي كورس حتى الآن.
                استكشف الكورسات المتاحة وابدأ رحلتك التعليمية.
              </p>

              <Link
                href="/courses"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(200,16,46,0.20)] transition-all hover:-translate-y-0.5 hover:bg-[#a90d27]"
              >
                استكشف الكورسات
                <ArrowLeft className="size-4" />
              </Link>

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2">

              {courses.map((item) => {

                const isCompleted =
                  item.progress >= 100

                return (
                  <article
                    key={item.enrollmentId}
                    className="group overflow-hidden rounded-[26px] border border-black/[0.06] bg-white shadow-[0_12px_35px_rgba(24,24,27,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(24,24,27,0.09)] dark:border-white/[0.07] dark:bg-[#111216]"
                  >

                    <Link
                      href={getCourseUrl(
                        item.course.id
                      )}
                      className="relative block aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-white/[0.04]"
                    >

                      {item.course.mediaUrl ? (

                        <img
                          src={
                            item.course.mediaUrl
                          }
                          alt={
                            item.course.title
                          }
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex size-full items-center justify-center">
                          <BookOpen className="size-12 text-zinc-300 dark:text-zinc-600" />
                        </div>

                      )}

                      <div className="absolute right-4 top-4">

                        {isCompleted ? (

                          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-black text-white shadow-lg">
                            <CheckCircle2 className="size-3.5" />
                            مكتمل
                          </span>

                        ) : (

                          <span className="rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-black text-white backdrop-blur-md">
                            {Math.round(
                              item.progress
                            )}
                            %
                          </span>

                        )}

                      </div>

                    </Link>

                    <div className="p-5 sm:p-6">

                      <p className="text-[11px] font-black text-[#C8102E]">
                        {item.course.subject.name}
                      </p>

                      <Link
                        href={getCourseUrl(
                          item.course.id
                        )}
                      >
                        <h3 className="mt-1 line-clamp-2 text-lg font-black leading-7 transition-colors group-hover:text-[#C8102E]">
                          {item.course.title}
                        </h3>
                      </Link>

                      <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between text-xs">

                          <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                            {item.completedLessons}{" "}
                            من{" "}
                            {item.totalLessons}{" "}
                            درس
                          </span>

                          <span className="font-black text-[#C8102E]">
                            {Math.round(
                              item.progress
                            )}
                            %
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/[0.06]">

                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isCompleted
                                ? "bg-emerald-500"
                                : "bg-[#C8102E]"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  item.progress
                                )
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                      <div className="mt-5 rounded-2xl bg-zinc-50 p-4 dark:bg-white/[0.035]">

                        <div className="flex items-start gap-3">

                          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">

                            {isCompleted ? (
                              <CheckCircle2 className="size-4" />
                            ) : (
                              <Play className="size-4" />
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="text-[10px] font-black text-zinc-400">
                              {isCompleted
                                ? "آخر إنجاز"
                                : "آخر درس"}
                            </p>

                            <p className="mt-1 line-clamp-1 text-sm font-bold">
                              {item.lastLesson?.title ||
                                "لم تبدأ الكورس بعد"}
                            </p>

                          </div>

                        </div>

                      </div>

                      {isCompleted ? (

                        <Link
                          href={getCourseUrl(
                            item.course.id
                          )}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-black/[0.07] bg-zinc-50 px-4 py-3 text-sm font-black transition-all hover:border-[#C8102E]/20 hover:bg-[#C8102E]/5 hover:text-[#C8102E] dark:border-white/[0.08] dark:bg-white/[0.03]"
                        >
                          مراجعة الكورس
                          <ArrowLeft className="size-4" />
                        </Link>

                      ) : item.continueLesson ? (

                        <Link
                          href={getLessonUrl(
                            item.course.id,
                            item.continueLesson.id
                          )}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-4 py-3 text-sm font-black text-white shadow-[0_8px_20px_rgba(200,16,46,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#a90d27]"
                        >
                          متابعة التعلم
                          <ArrowLeft className="size-4" />
                        </Link>

                      ) : (

                        <Link
                          href={getCourseUrl(
                            item.course.id
                          )}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-4 py-3 text-sm font-black text-white shadow-[0_8px_20px_rgba(200,16,46,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#a90d27]"
                        >
                          ابدأ الكورس
                          <ArrowLeft className="size-4" />
                        </Link>

                      )}

                    </div>
                  </article>
                )
              })}

            </div>
          )}

        </section>

        {/* ======================================================
            BOTTOM HOME BUTTON
        ====================================================== */}

        <div className="mt-10 flex justify-center">

          <Link
            href="/"
            className="group flex items-center gap-2 rounded-xl border border-black/[0.07] bg-white px-5 py-3 text-sm font-black shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C8102E]/20 hover:text-[#C8102E] dark:border-white/[0.08] dark:bg-white/[0.04]"
          >

            <Home className="size-4" />

            العودة للصفحة الرئيسية

            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />

          </Link>

        </div>

      </div>
    </main>
  )
}

// ============================================================
// QUICK ACCESS CARD
// ============================================================

function QuickAccessCard({
  href,
  icon,
  title,
  description,
  admin = false,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  admin?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-2xl border p-4 shadow-[0_8px_25px_rgba(24,24,27,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(24,24,27,0.08)] ${
        admin
          ? "border-[#C8102E]/15 bg-[#C8102E]/[0.04] hover:border-[#C8102E]/30 hover:bg-[#C8102E]/[0.07] dark:border-[#C8102E]/20 dark:bg-[#C8102E]/[0.05]"
          : "border-black/[0.06] bg-white hover:border-[#C8102E]/20 dark:border-white/[0.07] dark:bg-[#111216]"
      }`}
    >

      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E] transition-transform group-hover:scale-105">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-sm font-black">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] font-semibold text-zinc-400">
          {description}
        </p>

      </div>

      <ChevronLeft className="mr-auto size-4 shrink-0 text-zinc-400 transition-transform group-hover:-translate-x-1 group-hover:text-[#C8102E]" />

    </Link>
  )
}

// ============================================================
// STAT COMPONENT
// ============================================================

function ProfileStat({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode
  title: string
  value: number | string
  description: string
}) {
  return (
    <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-[0_10px_30px_rgba(24,24,27,0.04)] dark:border-white/[0.07] dark:bg-[#111216]">

      <div className="flex items-center justify-between gap-4">

        <div>

          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black">
            {value}
          </p>

        </div>

        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#C8102E]/10 text-[#C8102E]">
          {icon}
        </div>

      </div>

      <p className="mt-3 text-[11px] font-semibold text-zinc-400">
        {description}
      </p>

    </div>
  )
}
