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

export function SectionCards() {
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

      {/* =========================
          إجمالي الإيرادات
      ========================= */}
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
        {/* Gradient Effect */}
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
                  group-hover:bg-red-500/15
                "
              >
                <ActivityIcon className="size-5" />
              </div>

              <div>
                <CardDescription className="text-sm">
                  إجمالي الإيرادات
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
                  $1,250.00
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
                +12.5%
              </Badge>
            </CardAction>

          </div>
        </CardHeader>

        <CardFooter className="relative flex-col items-start gap-1.5 text-sm">

          <div className="flex items-center gap-2 font-medium">
            <span>الإيرادات في ارتفاع هذا الشهر</span>
            <TrendingUpIcon className="size-4 text-red-500" />
          </div>

          <div className="text-muted-foreground">
            مقارنة بآخر 6 أشهر
          </div>

        </CardFooter>
      </Card>


      {/* =========================
          عملاء جدد
      ========================= */}
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
            transition-all duration-500
            group-hover:bg-rose-500/20
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
                  1,234
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
                <TrendingDownIcon className="size-3.5" />
                -20%
              </Badge>

            </CardAction>

          </div>

        </CardHeader>

        <CardFooter className="relative flex-col items-start gap-1.5 text-sm">

          <div className="flex items-center gap-2 font-medium">

            <span>
              انخفاض بنسبة 20% خلال هذه الفترة
            </span>

            <TrendingDownIcon className="size-4 text-red-500" />

          </div>

          <div className="text-muted-foreground">
            يحتاج معدل اكتساب المستخدمين إلى اهتمام
          </div>

        </CardFooter>

      </Card>


      {/* =========================
          الحسابات النشطة
      ========================= */}
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
            transition-all duration-500
            group-hover:bg-red-600/20
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
                  45,678
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
                +12.5%
              </Badge>

            </CardAction>

          </div>

        </CardHeader>

        <CardFooter className="relative flex-col items-start gap-1.5 text-sm">

          <div className="flex items-center gap-2 font-medium">

            <span>
              معدل تفاعل قوي من المستخدمين
            </span>

            <TrendingUpIcon className="size-4 text-red-500" />

          </div>

          <div className="text-muted-foreground">
            التفاعل يتجاوز الأهداف المحددة
          </div>

        </CardFooter>

      </Card>


      {/* =========================
          معدل النمو
      ========================= */}
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
                <GraduationCapIcon className="size-5" />
              </div>

              <div>

                <CardDescription className="text-sm">
                  معدل النمو
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
                  4.5%
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
                +4.5%
              </Badge>

            </CardAction>

          </div>

        </CardHeader>

        <CardFooter className="relative flex-col items-start gap-1.5 text-sm">

          <div className="flex items-center gap-2 font-medium">

            <span>
              نمو مستقر ومستمر
            </span>

            <TrendingUpIcon className="size-4 text-red-500" />

          </div>

          <div className="text-muted-foreground">
            الأداء يتوافق مع توقعات النمو
          </div>

        </CardFooter>

      </Card>

    </div>
  )
}