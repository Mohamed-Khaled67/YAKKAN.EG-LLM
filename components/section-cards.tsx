"use client"

import { Badge } from "@/components/ui/badge"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  TrendingUpIcon,
  TrendingDownIcon,
  UsersIcon,
  UserPlusIcon,
  GraduationCapIcon,
  ActivityIcon,
} from "lucide-react"

// ============================================================
// TYPES
// ============================================================

export interface DashboardStats {
  totalStudents: number
  totalCourses: number
  publishedCourses: number
  totalEnrollments: number
  totalLessons: number
  newUsers: number
  activeSessions: number
  revenue: number
  currentMonthEnrollments: number
  previousMonthEnrollments: number
  enrollmentGrowth: number
}

interface SectionCardsProps {
  stats: DashboardStats
}

// ============================================================
// COMPONENT
// ============================================================

export function SectionCards({
  stats,
}: SectionCardsProps) {
  const growth = stats.enrollmentGrowth

  const isGrowthPositive = growth >= 0

  return (
    <div
      dir="rtl"
      className="
        grid grid-cols-1 gap-4
        px-4
        sm:grid-cols-2
        lg:px-6
        @5xl/main:grid-cols-4
      "
    >
      {/* =====================================================
          REVENUE
      ===================================================== */}

      <Card
        className="
          group relative overflow-hidden
          border-border/60
          bg-gradient-to-br
          from-red-500/10
          via-card
          to-card
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:border-red-500/30
          hover:shadow-xl
          hover:shadow-red-500/10
        "
      >
        <div
          className="
            pointer-events-none absolute
            -left-10 -top-10
            h-32 w-32
            rounded-full
            bg-red-500/10
            blur-3xl
            transition-all duration-500
            group-hover:bg-red-500/20
          "
        />

        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex size-11 shrink-0 items-center justify-center
                  rounded-xl
                  bg-red-500/10
                  text-red-500
                  ring-1 ring-red-500/20
                  transition-all duration-300
                  group-hover:scale-105
                "
              >
                <ActivityIcon className="size-5" />
              </div>

              <div>
                <CardDescription className="text-sm">
                  إجمالي الإيرادات
                </CardDescription>

                <CardTitle
                  dir="ltr"
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    tabular-nums
                    @[250px]/card:text-3xl
                  "
                >
                  {stats.revenue.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}{" "}
                  EGP
                </CardTitle>
              </div>
            </div>

            <CardAction>
              <Badge
                variant="outline"
                className="
                  gap-1
                  border-red-500/20
                  bg-red-500/5
                  text-red-600
                  dark:text-red-400
                "
              >
                <TrendingUpIcon className="size-3.5" />
                مدفوع
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardFooter className="relative flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span>
              إجمالي المدفوعات الناجحة
            </span>

            <TrendingUpIcon className="size-4 text-red-500" />
          </div>

          <div className="text-muted-foreground">
            يتم احتساب المدفوعات التي حالتها PAID فقط
          </div>
        </CardFooter>
      </Card>

      {/* =====================================================
          NEW USERS
      ===================================================== */}

      <Card
        className="
          group relative overflow-hidden
          border-border/60
          bg-gradient-to-br
          from-rose-500/10
          via-card
          to-card
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:border-rose-500/30
          hover:shadow-xl
          hover:shadow-rose-500/10
        "
      >
        <div
          className="
            pointer-events-none absolute
            -left-10 -top-10
            h-32 w-32
            rounded-full
            bg-rose-500/10
            blur-3xl
          "
        />

        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex size-11 shrink-0 items-center justify-center
                  rounded-xl
                  bg-rose-500/10
                  text-rose-500
                  ring-1 ring-rose-500/20
                  transition-all duration-300
                  group-hover:scale-105
                "
              >
                <UserPlusIcon className="size-5" />
              </div>

              <div>
                <CardDescription className="text-sm">
                  مستخدمون جدد
                </CardDescription>

                <CardTitle
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    tabular-nums
                    @[250px]/card:text-3xl
                  "
                >
                  {stats.newUsers.toLocaleString(
                    "en-US"
                  )}
                </CardTitle>
              </div>
            </div>

            <CardAction>
              <Badge
                variant="outline"
                className="
                  gap-1
                  border-red-500/20
                  bg-red-500/5
                  text-red-600
                  dark:text-red-400
                "
              >
                <UserPlusIcon className="size-3.5" />
                هذا الشهر
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardFooter className="relative flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span>
              طلاب جدد خلال الشهر الحالي
            </span>

            <UserPlusIcon className="size-4 text-red-500" />
          </div>

          <div className="text-muted-foreground">
            لا يتم احتساب حسابات الأدمن
          </div>
        </CardFooter>
      </Card>

      {/* =====================================================
          ACTIVE USERS
      ===================================================== */}

      <Card
        className="
          group relative overflow-hidden
          border-border/60
          bg-gradient-to-br
          from-red-600/10
          via-card
          to-card
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:border-red-600/30
          hover:shadow-xl
          hover:shadow-red-600/10
        "
      >
        <div
          className="
            pointer-events-none absolute
            -left-10 -top-10
            h-32 w-32
            rounded-full
            bg-red-600/10
            blur-3xl
          "
        />

        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex size-11 shrink-0 items-center justify-center
                  rounded-xl
                  bg-red-600/10
                  text-red-600
                  ring-1 ring-red-600/20
                  transition-all duration-300
                  group-hover:scale-105
                "
              >
                <UsersIcon className="size-5" />
              </div>

              <div>
                <CardDescription className="text-sm">
                  الحسابات النشطة
                </CardDescription>

                <CardTitle
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    tabular-nums
                    @[250px]/card:text-3xl
                  "
                >
                  {stats.activeSessions.toLocaleString(
                    "en-US"
                  )}
                </CardTitle>
              </div>
            </div>

            <CardAction>
              <Badge
                variant="outline"
                className="
                  gap-1
                  border-red-500/20
                  bg-red-500/5
                  text-red-600
                  dark:text-red-400
                "
              >
                <UsersIcon className="size-3.5" />
                الآن
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardFooter className="relative flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span>
              جلسات تسجيل الدخول الحالية
            </span>

            <ActivityIcon className="size-4 text-red-500" />
          </div>

          <div className="text-muted-foreground">
            يتم الاعتماد على الجلسات غير المنتهية
          </div>
        </CardFooter>
      </Card>

      {/* =====================================================
          GROWTH
      ===================================================== */}

      <Card
        className="
          group relative overflow-hidden
          border-border/60
          bg-gradient-to-br
          from-red-500/10
          via-card
          to-card
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:border-red-500/30
          hover:shadow-xl
          hover:shadow-red-500/10
        "
      >
        <div
          className="
            pointer-events-none absolute
            -left-10 -top-10
            h-32 w-32
            rounded-full
            bg-red-500/10
            blur-3xl
          "
        />

        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex size-11 shrink-0 items-center justify-center
                  rounded-xl
                  bg-red-500/10
                  text-red-500
                  ring-1 ring-red-500/20
                  transition-all duration-300
                  group-hover:scale-105
                "
              >
                <GraduationCapIcon className="size-5" />
              </div>

              <div>
                <CardDescription className="text-sm">
                  معدل النمو
                </CardDescription>

                <CardTitle
                  dir="ltr"
                  className="
                    mt-1
                    text-2xl
                    font-bold
                    tabular-nums
                    @[250px]/card:text-3xl
                  "
                >
                  {growth.toFixed(1)}%
                </CardTitle>
              </div>
            </div>

            <CardAction>
              <Badge
                variant="outline"
                className={`
                  gap-1
                  ${
                    isGrowthPositive
                      ? "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400"
                      : "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400"
                  }
                `}
              >
                {isGrowthPositive ? (
                  <TrendingUpIcon className="size-3.5" />
                ) : (
                  <TrendingDownIcon className="size-3.5" />
                )}

                <span dir="ltr">
                  {growth >= 0 ? "+" : ""}
                  {growth.toFixed(1)}%
                </span>
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardFooter className="relative flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span>
              مقارنة التسجيلات بالشهر السابق
            </span>

            {isGrowthPositive ? (
              <TrendingUpIcon className="size-4 text-green-500" />
            ) : (
              <TrendingDownIcon className="size-4 text-red-500" />
            )}
          </div>

          <div className="text-muted-foreground">
            هذا الشهر:{" "}
            {stats.currentMonthEnrollments} تسجيل
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}