// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
// import { SectionCards } from "@/components/section-cards";
// import data from "./data.json"
// export default function AdminIndexPage(){
//     return(
//         <>
//          <SectionCards />

//                 {/* الرسم البياني */}
//                 <div className="px-4 lg:px-6">
//                   <ChartAreaInteractive />
//                 </div>

//                 {/* الجدول */}
//                 <DataTable data={data} />

//         </>
//     )
// }
import Link from "next/link"

import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  ChefHat,
  Sparkles,
  Users,
  TrendingUp,
  Activity,
  Settings,
} from "lucide-react"
import { requireAdmin } from "@/lib/require-admin"
export default async function AdminPage() {
    await requireAdmin()
  return (
    <div
      dir="rtl"
      className="relative min-h-full overflow-hidden"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -right-40
            -top-40
            size-[500px]
            rounded-full
            bg-red-500/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-40
            size-[500px]
            rounded-full
            bg-rose-500/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            size-[400px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-red-500/5
            blur-[100px]
          "
        />
      </div>

      {/* Main Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        {/* Header */}
        <section className="mb-8">

          <div
            className="
              mb-5
              flex
              items-center
              gap-3
            "
          >
            {/* Logo */}
            <div
              className="
                flex
                size-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-red-500
                via-red-600
                to-rose-600
                text-white
                shadow-xl
                shadow-red-500/25
              "
            >
              <ChefHat className="size-7" />
            </div>

            {/* Brand */}
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                YAKKAN.EG
              </h1>

              <p className="text-sm text-muted-foreground">
                لوحة تحكم المنصة
              </p>
            </div>
          </div>

          {/* Welcome */}
          <div
            className="
              rounded-3xl
              border
              border-border/50
              bg-background/60
              p-6
              shadow-sm
              backdrop-blur-xl
              sm:p-8
            "
          >
            <div
              className="
                mb-4
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-red-500/15
                bg-red-500/5
                px-3
                py-1.5
                text-xs
                font-semibold
                text-red-500
              "
            >
              <Sparkles className="size-3.5" />

              نظام إدارة المنصة
            </div>

            <h2
              className="
                text-3xl
                font-black
                tracking-tight
                sm:text-4xl
              "
            >
              مرحباً بك في لوحة تحكم{" "}
              <span
                className="
                  bg-gradient-to-r
                  from-red-500
                  via-rose-500
                  to-red-600
                  bg-clip-text
                  text-transparent
                "
              >
                YAKKAN.EG
              </span>
            </h2>

            <p
              className="
                mt-4
                max-w-3xl
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
              "
            >
              من هنا يمكنك إدارة محتوى المنصة، متابعة الكورسات،
              مراقبة المستخدمين، والاطلاع على أهم الإحصائيات
              لمتابعة أداء المنصة بشكل مستمر.
            </p>

            {/* Quick Actions */}
            <div
              className="
                mt-6
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >
              {/* Dashboard */}
              <Link
                href="/admin/dashbord"
                className="
                  group
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-red-500
                  to-rose-600
                  px-6
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-red-500/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  hover:shadow-red-500/30
                "
              >
                <BarChart3 className="size-4" />

                لوحة التحكم

                <ArrowLeft
                  className="
                    size-4
                    transition-transform
                    group-hover:-translate-x-1
                  "
                />
              </Link>

              {/* Courses */}
              <Link
                href="/admin/courses"
                className="
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-border/60
                  bg-background/60
                  px-6
                  text-sm
                  font-bold
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-red-500/30
                  hover:bg-red-500/5
                "
              >
                <BookOpen className="size-4 text-red-500" />

                إدارة الكورسات
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Features */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-black">
              ماذا يمكنك أن تفعل؟
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              أهم الأدوات المتاحة لإدارة المنصة
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            <DashboardFeature
              icon={<BarChart3 />}
              title="الإحصائيات"
              description="تابع أداء المنصة والإحصائيات بشكل واضح."
            />

            <DashboardFeature
              icon={<BookOpen />}
              title="الكورسات"
              description="إدارة الكورسات والمحتوى التعليمي."
            />

            <DashboardFeature
              icon={<Users />}
              title="المستخدمون"
              description="متابعة المستخدمين ونشاطهم داخل المنصة."
            />

            <DashboardFeature
              icon={<Settings />}
              title="إدارة المنصة"
              description="تحكم في إعدادات ومكونات المنصة."
            />
          </div>
        </section>

        {/* Status */}
        <section
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <StatusCard
            icon={<Activity />}
            title="حالة المنصة"
            value="تعمل بشكل طبيعي"
            positive
          />

          <StatusCard
            icon={<TrendingUp />}
            title="أداء المنصة"
            value="+12.5%"
            positive
          />

          <StatusCard
            icon={<Users />}
            title="المستخدمون"
            value="نشطون الآن"
          />
        </section>
      </div>
    </div>
  )
}

/* ================================================= */
/* FEATURE CARD */
/* ================================================= */

function DashboardFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-border/50
        bg-background/60
        p-5
        backdrop-blur-xl
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-red-500/20
        hover:shadow-xl
        hover:shadow-red-500/5
      "
    >
      <div
        className="
          mb-4
          flex
          size-11
          items-center
          justify-center
          rounded-xl
          bg-red-500/10
          text-red-500
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-red-500
          group-hover:text-white
        "
      >
        {icon}
      </div>

      <h3 className="font-bold">
        {title}
      </h3>

      <p
        className="
          mt-2
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        {description}
      </p>
    </div>
  )
}

/* ================================================= */
/* STATUS CARD */
/* ================================================= */

function StatusCard({
  icon,
  title,
  value,
  positive = false,
}: {
  icon: React.ReactNode
  title: string
  value: string
  positive?: boolean
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-border/50
        bg-background/60
        p-5
        backdrop-blur-xl
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
          text-red-500
        "
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-muted-foreground">
          {title}
        </p>

        <p
          className={`mt-1 text-sm font-bold ${
            positive
              ? "text-green-600 dark:text-green-400"
              : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}