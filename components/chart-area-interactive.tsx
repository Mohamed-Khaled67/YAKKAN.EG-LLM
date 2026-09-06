"use client"

import * as React from "react"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import {
  Activity,
  BarChart3,
  UserPlus,
  GraduationCap,
  TrendingUp,
} from "lucide-react"

// ============================================================
// TYPES
// ============================================================

export interface DashboardChartItem {
  date: string
  users: number
  enrollments: number
}

interface ChartAreaInteractiveProps {
  data: DashboardChartItem[]
}

// ============================================================
// CHART CONFIG
// ============================================================

const chartConfig = {
  users: {
    label: "مستخدمون جدد",
    color: "#ef4444",
  },

  enrollments: {
    label: "تسجيلات الكورسات",
    color: "#f43f5e",
  },
} satisfies ChartConfig

// ============================================================
// COMPONENT
// ============================================================

export function ChartAreaInteractive({
  data,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()

  const [timeRange, setTimeRange] =
    React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // ==========================================================
  // FILTER DATA
  // ==========================================================

  const filteredData = React.useMemo(() => {
    const daysToSubtract =
      timeRange === "30d"
        ? 30
        : timeRange === "7d"
          ? 7
          : 90

    const startDate = new Date()

    startDate.setHours(0, 0, 0, 0)

    startDate.setDate(
      startDate.getDate() - daysToSubtract + 1
    )

    return data.filter((item) => {
      const date = new Date(item.date)

      return date >= startDate
    })
  }, [data, timeRange])

  // ==========================================================
  // TOTAL
  // ==========================================================

  const totalActivity = filteredData.reduce(
    (total, item) =>
      total +
      item.users +
      item.enrollments,
    0
  )

  const totalUsers = filteredData.reduce(
    (total, item) =>
      total + item.users,
    0
  )

  const totalEnrollments = filteredData.reduce(
    (total, item) =>
      total + item.enrollments,
    0
  )

  return (
    <div dir="rtl">
      <Card
        className="
          group
          relative
          isolate
          overflow-hidden
          rounded-3xl
          border
          border-border/50
          bg-background/70
          backdrop-blur-xl
          shadow-xl
          shadow-red-500/[0.03]
          transition-all
          duration-500
          hover:border-red-500/20
          hover:shadow-2xl
          hover:shadow-red-500/[0.06]
        "
      >
        {/* ==================================================
            GLOW
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -left-28
            -top-28
            -z-10
            size-72
            rounded-full
            bg-red-500/10
            blur-3xl
            transition-all
            duration-700
            group-hover:bg-red-500/15
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-32
            -right-28
            -z-10
            size-80
            rounded-full
            bg-rose-500/10
            blur-3xl
          "
        />

        {/* ==================================================
            HEADER
        ================================================== */}

        <CardHeader
          className="
            relative
            z-10
            border-b
            border-border/40
            bg-gradient-to-r
            from-red-500/[0.07]
            via-background/20
            to-rose-500/[0.03]
            px-5
            py-5
            sm:px-6
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                size-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-red-500
                to-rose-600
                text-white
                shadow-lg
                shadow-red-500/25
                transition-all
                duration-300
                group-hover:scale-105
              "
            >
              <BarChart3 className="size-5" />
            </div>

            <div className="space-y-1">
              <CardTitle
                className="
                  text-base
                  font-black
                  tracking-tight
                "
              >
                نشاط المنصة
              </CardTitle>

              <CardDescription>
                <span className="hidden @[540px]/card:block">
                  التسجيلات والمستخدمون الجدد خلال الفترة المحددة
                </span>

                <span className="@[540px]/card:hidden">
                  إحصائيات النشاط
                </span>
              </CardDescription>
            </div>
          </div>

          {/* ==================================================
              TOTAL
          ================================================== */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-red-500/10
              bg-red-500/[0.035]
              px-4
              py-3
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-500/10
                  text-red-500
                "
              >
                <Activity className="size-4" />
              </div>

              <div>
                <p className="text-[11px] text-muted-foreground">
                  إجمالي النشاط
                </p>

                <p
                  dir="ltr"
                  className="
                    text-lg
                    font-black
                    tracking-tight
                    text-right
                  "
                >
                  {totalActivity.toLocaleString(
                    "en-US"
                  )}
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-1.5
                rounded-full
                bg-green-500/10
                px-3
                py-1.5
                text-xs
                font-semibold
                text-green-600
                dark:text-green-400
              "
            >
              <TrendingUp className="size-3.5" />

              <span>
                بيانات حقيقية
              </span>
            </div>
          </div>

          {/* ==================================================
              FILTERS
          ================================================== */}

          <CardAction className="top-5">
            <ToggleGroup
              multiple={false}
              value={timeRange ? [timeRange] : []}
              onValueChange={(value) => {
                setTimeRange(
                  value[0] ?? "90d"
                )
              }}
              variant="outline"
              className="
                hidden
                rounded-xl
                bg-background/60
                backdrop-blur-md
                *:data-[slot=toggle-group-item]:px-4!
                @[767px]/card:flex
              "
            >
              <ToggleGroupItem
                value="90d"
                className="
                  rounded-lg
                  data-[state=on]:bg-red-500
                  data-[state=on]:text-white
                  data-[state=on]:shadow-md
                  data-[state=on]:shadow-red-500/20
                "
              >
                آخر 3 شهور
              </ToggleGroupItem>

              <ToggleGroupItem
                value="30d"
                className="
                  rounded-lg
                  data-[state=on]:bg-red-500
                  data-[state=on]:text-white
                  data-[state=on]:shadow-md
                  data-[state=on]:shadow-red-500/20
                "
              >
                آخر 30 يوم
              </ToggleGroupItem>

              <ToggleGroupItem
                value="7d"
                className="
                  rounded-lg
                  data-[state=on]:bg-red-500
                  data-[state=on]:text-white
                  data-[state=on]:shadow-md
                  data-[state=on]:shadow-red-500/20
                "
              >
                آخر 7 أيام
              </ToggleGroupItem>
            </ToggleGroup>

            <Select
              value={timeRange}
              onValueChange={(value) => {
                if (value) {
                  setTimeRange(value)
                }
              }}
            >
              <SelectTrigger
                className="
                  flex
                  w-36
                  rounded-xl
                  border-border/50
                  bg-background/60
                  backdrop-blur-md
                  @[767px]/card:hidden
                "
                size="sm"
                aria-label="اختر الفترة"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                <SelectItem
                  value="90d"
                  className="rounded-lg"
                >
                  آخر 3 شهور
                </SelectItem>

                <SelectItem
                  value="30d"
                  className="rounded-lg"
                >
                  آخر 30 يوم
                </SelectItem>

                <SelectItem
                  value="7d"
                  className="rounded-lg"
                >
                  آخر 7 أيام
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>

        {/* ==================================================
            CHART
        ================================================== */}

        <CardContent
          className="
            relative
            z-10
            px-2
            pt-6
            sm:px-6
            sm:pt-7
          "
        >
          {/* ==================================================
              LEGEND
          ================================================== */}

          <div
            className="
              mb-5
              flex
              flex-wrap
              items-center
              gap-4
              px-2
            "
          >
            <div className="flex items-center gap-2">
              <div
                className="
                  size-2.5
                  rounded-full
                  bg-red-500
                  shadow-md
                  shadow-red-500/40
                "
              />

              <span className="text-xs font-medium text-muted-foreground">
                مستخدمون جدد
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="
                  size-2.5
                  rounded-full
                  bg-rose-500
                  shadow-md
                  shadow-rose-500/40
                "
              />

              <span className="text-xs font-medium text-muted-foreground">
                تسجيلات الكورسات
              </span>
            </div>

            <div
              className="
                mr-auto
                flex
                items-center
                gap-1.5
                text-xs
                text-muted-foreground
              "
            >
              <Activity className="size-3.5 text-red-500" />

              <span>
                نشاط المستخدمين
              </span>
            </div>
          </div>

          <ChartContainer
            config={chartConfig}
            className="
              aspect-auto
              h-[280px]
              w-full
            "
          >
            <AreaChart
              data={filteredData}
              margin={{
                left: 8,
                right: 8,
                top: 5,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="fillUsers"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#ef4444"
                    stopOpacity={0.45}
                  />

                  <stop
                    offset="45%"
                    stopColor="#ef4444"
                    stopOpacity={0.18}
                  />

                  <stop
                    offset="100%"
                    stopColor="#ef4444"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="fillEnrollments"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#f43f5e"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="50%"
                    stopColor="#f43f5e"
                    stopOpacity={0.12}
                  />

                  <stop
                    offset="100%"
                    stopColor="#f43f5e"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="4 6"
                className="stroke-border/30"
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={32}
                tick={{
                  fill: "currentColor",
                  opacity: 0.45,
                  fontSize: 11,
                }}
                tickFormatter={(value) => {
                  const date = new Date(value)

                  return date.toLocaleDateString(
                    "ar-EG",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )
                }}
              />

              <ChartTooltip
                cursor={{
                  stroke: "#ef4444",
                  strokeOpacity: 0.25,
                  strokeDasharray: "4 4",
                }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(
                        value
                      ).toLocaleDateString(
                        "ar-EG",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    }}
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="enrollments"
                type="natural"
                fill="url(#fillEnrollments)"
                stroke="#f43f5e"
                strokeWidth={2}
                activeDot={{
                  r: 5,
                  fill: "#f43f5e",
                  stroke:
                    "var(--background)",
                  strokeWidth: 3,
                }}
                stackId="a"
                animationDuration={900}
              />

              <Area
                dataKey="users"
                type="natural"
                fill="url(#fillUsers)"
                stroke="#ef4444"
                strokeWidth={2.5}
                activeDot={{
                  r: 5,
                  fill: "#ef4444",
                  stroke:
                    "var(--background)",
                  strokeWidth: 3,
                }}
                stackId="a"
                animationDuration={900}
              />
            </AreaChart>
          </ChartContainer>

          {/* ==================================================
              BOTTOM STATUS
          ================================================== */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              border-t
              border-border/40
              pt-4
            "
          >
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  size-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-red-500/10
                  text-red-500
                "
              >
                <UserPlus className="size-3.5" />
              </div>

              <span className="text-xs text-muted-foreground">
                {totalUsers.toLocaleString(
                  "en-US"
                )}{" "}
                مستخدم جديد
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  size-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-rose-500/10
                  text-rose-500
                "
              >
                <GraduationCap className="size-3.5" />
              </div>

              <span className="text-xs text-muted-foreground">
                {totalEnrollments.toLocaleString(
                  "en-US"
                )}{" "}
                تسجيل
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-1.5
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              <span
                className="
                  size-1.5
                  rounded-full
                  bg-green-500
                  shadow-md
                  shadow-green-500/50
                "
              />

              البيانات محدثة
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}