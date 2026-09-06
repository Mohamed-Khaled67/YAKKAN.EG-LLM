"use client"

import * as React from "react"

import {
  ChartAreaInteractive,
  type DashboardChartItem,
} from "@/components/chart-area-interactive"

import {
  SectionCards,
  type DashboardStats,
} from "@/components/section-cards"

// ============================================================
// TYPES
// ============================================================

interface DashboardResponse {
  stats: DashboardStats
  chart: DashboardChartItem[]
}

// ============================================================
// COMPONENT
// ============================================================

export default function AdminDashboardPage() {
  const [data, setData] =
    React.useState<DashboardResponse | null>(
      null
    )

  const [loading, setLoading] =
    React.useState(true)

  const [error, setError] =
    React.useState<string | null>(null)

  // ==========================================================
  // FETCH DASHBOARD
  // ==========================================================

  const fetchDashboard = React.useCallback(
    async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          "/api/admin/dashboard",
          {
            method: "GET",
            cache: "no-store",
          }
        )

        if (!response.ok) {
          throw new Error(
            "Failed to fetch dashboard"
          )
        }

        const result =
          (await response.json()) as DashboardResponse

        setData(result)
      } catch (error) {
        console.error(
          "Dashboard fetch error:",
          error
        )

        setError(
          "حدث خطأ أثناء تحميل بيانات لوحة التحكم"
        )
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // ==========================================================
  // INITIAL FETCH
  // ==========================================================

  React.useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div
        dir="rtl"
        className="space-y-6 px-4 lg:px-6"
      >
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  h-[190px]
                  animate-pulse
                  rounded-2xl
                  bg-muted/50
                "
              />
            )
          )}
        </div>

        <div
          className="
            h-[500px]
            animate-pulse
            rounded-3xl
            bg-muted/50
          "
        />
      </div>
    )
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !data) {
    return (
      <div
        dir="rtl"
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
          px-4
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/5
            px-6
            py-5
            text-center
          "
        >
          <p className="font-semibold text-red-600">
            {error ??
              "تعذر تحميل بيانات لوحة التحكم"}
          </p>

          <button
            onClick={fetchDashboard}
            className="
              mt-4
              rounded-xl
              bg-red-500
              px-5
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-600
            "
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  return (
    <div
      dir="rtl"
      className="space-y-6"
    >
      <SectionCards
        stats={data.stats}
      />

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive
          data={data.chart}
        />
      </div>
    </div>
  )
}