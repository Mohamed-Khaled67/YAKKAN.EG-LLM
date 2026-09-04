
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
  Monitor,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react"

/* ================================================= */
/* DATA */
/* ================================================= */

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },

  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },

  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

/* ================================================= */
/* CHART CONFIG */
/* ================================================= */

const chartConfig = {
  desktop: {
    label: "سطح المكتب",
    color: "#ef4444",
  },

  mobile: {
    label: "الهاتف",
    color: "#f43f5e",
  },
} satisfies ChartConfig

/* ================================================= */
/* COMPONENT */
/* ================================================= */

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()

  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  /* ================================================= */
  /* FILTER DATA */
  /* ================================================= */

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)

    const referenceDate = new Date("2024-06-30")

    let daysToSubtract = 90

    if (timeRange === "30d") {
      daysToSubtract = 30
    }

    if (timeRange === "7d") {
      daysToSubtract = 7
    }

    const startDate = new Date(referenceDate)

    startDate.setDate(
      startDate.getDate() - daysToSubtract
    )

    return date >= startDate
  })

  /* ================================================= */
  /* TOTAL */
  /* ================================================= */

  const totalVisitors = filteredData.reduce(
    (total, item) =>
      total + item.desktop + item.mobile,
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

        {/* ================================================= */}
        {/* BACKGROUND GLOW */}
        {/* ================================================= */}

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

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

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

            {/* Icon */}

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
                group-hover:shadow-red-500/40
              "
            >
              <BarChart3 className="size-5" />
            </div>

            {/* Title */}

            <div className="space-y-1">

              <CardTitle
                className="
                  text-base
                  font-black
                  tracking-tight
                "
              >
                إحصائيات الزوار
              </CardTitle>

              <CardDescription>
                <span className="hidden @[540px]/card:block">
                  إجمالي الزوار خلال الفترة المحددة
                </span>

                <span className="@[540px]/card:hidden">
                  إحصائيات الزوار
                </span>
              </CardDescription>

            </div>

          </div>

          {/* Total */}

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
                <Users className="size-4" />
              </div>

              <div>

                <p className="text-[11px] text-muted-foreground">
                  إجمالي الزوار
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
                  {totalVisitors.toLocaleString("en-US")}
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

              <span dir="ltr">
                +12.5%
              </span>

            </div>

          </div>

          {/* Filters */}

          <CardAction className="top-5">

            <ToggleGroup
              multiple={false}
              value={timeRange ? [timeRange] : []}
              onValueChange={(value) => {
                setTimeRange(value[0] ?? "90d")
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

            {/* Mobile Select */}

            <Select
              value={timeRange}
              onValueChange={(value) => {
                if (value !== null) {
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

        {/* ================================================= */}
        {/* CHART */}
        {/* ================================================= */}

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

          {/* Legend */}

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
                سطح المكتب
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
                الهاتف
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

          {/* Chart */}

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

              {/* GRADIENTS */}

              <defs>

                <linearGradient
                  id="fillDesktop"
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
                  id="fillMobile"
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

              {/* GRID */}

              <CartesianGrid
                vertical={false}
                strokeDasharray="4 6"
                className="stroke-border/30"
              />

              {/* X AXIS */}

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

              {/* TOOLTIP */}

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

              {/* MOBILE */}

              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                stroke="#f43f5e"
                strokeWidth={2}
                activeDot={{
                  r: 5,
                  fill: "#f43f5e",
                  stroke: "var(--background)",
                  strokeWidth: 3,
                }}
                stackId="a"
                animationDuration={900}
              />

              {/* DESKTOP */}

              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="#ef4444"
                strokeWidth={2.5}
                activeDot={{
                  r: 5,
                  fill: "#ef4444",
                  stroke: "var(--background)",
                  strokeWidth: 3,
                }}
                stackId="a"
                animationDuration={900}
              />

            </AreaChart>

          </ChartContainer>

          {/* Bottom Status */}

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
                <Monitor className="size-3.5" />
              </div>

              <span className="text-xs text-muted-foreground">
                سطح المكتب
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
                <Smartphone className="size-3.5" />
              </div>

              <span className="text-xs text-muted-foreground">
                الهاتف
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