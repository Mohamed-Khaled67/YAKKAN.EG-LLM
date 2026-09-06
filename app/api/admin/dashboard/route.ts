import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"

// ============================================================
// GET ADMIN DASHBOARD STATS
// ============================================================

export async function GET() {
  try {
    // ==========================================================
    // ADMIN PROTECTION
    // ==========================================================

    await requireAdmin()

    // ==========================================================
    // DATES
    // ==========================================================

    const now = new Date()

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )

    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )

    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    )

    const endOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )

    const chartStartDate = new Date(today)
    chartStartDate.setDate(chartStartDate.getDate() - 89)

    // ==========================================================
    // MAIN STATS
    // ==========================================================

    const [
      totalUsers,
      totalAdmins,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      totalLessons,
      totalNewUsers,
      activeSessions,
      currentMonthEnrollments,
      previousMonthEnrollments,
      revenueResult,
    ] = await Promise.all([
      // --------------------------------------------------------
      // USERS
      // --------------------------------------------------------

      prisma.user.count(),

      prisma.user.count({
        where: {
          role: {
            in: ["ADMIN", "admin"],
          },
        },
      }),

      // --------------------------------------------------------
      // COURSES
      // --------------------------------------------------------

      prisma.course.count(),

      prisma.course.count({
        where: {
          isPublished: true,
        },
      }),

      // --------------------------------------------------------
      // ENROLLMENTS
      // --------------------------------------------------------

      prisma.enrollment.count(),

      // --------------------------------------------------------
      // LESSONS
      // --------------------------------------------------------

      prisma.lesson.count(),

      // --------------------------------------------------------
      // NEW USERS THIS MONTH
      // --------------------------------------------------------

      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
          },
          role: {
            notIn: ["ADMIN", "admin"],
          },
        },
      }),

      // --------------------------------------------------------
      // ACTIVE SESSIONS
      // --------------------------------------------------------

      prisma.session.count({
        where: {
          expiresAt: {
            gt: now,
          },
        },
          }),

      // --------------------------------------------------------
      // CURRENT MONTH ENROLLMENTS
      // --------------------------------------------------------

      prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: startOfCurrentMonth,
          },
        },
      }),

      // --------------------------------------------------------
      // PREVIOUS MONTH ENROLLMENTS
      // --------------------------------------------------------

      prisma.enrollment.count({
        where: {
          enrolledAt: {
            gte: startOfPreviousMonth,
            lt: endOfPreviousMonth,
          },
        },
      }),

      // --------------------------------------------------------
      // REVENUE
      // --------------------------------------------------------

      prisma.payment.aggregate({
        where: {
          status: "PAID",
        },
        _sum: {
          amount: true,
        },
      }),
    ])

    // ==========================================================
    // STUDENTS
    // ==========================================================

    const totalStudents = totalUsers - totalAdmins

    // ==========================================================
    // GROWTH
    // ==========================================================

    let enrollmentGrowth = 0

    if (previousMonthEnrollments === 0) {
      enrollmentGrowth =
        currentMonthEnrollments > 0 ? 100 : 0
    } else {
      enrollmentGrowth =
        ((currentMonthEnrollments -
          previousMonthEnrollments) /
          previousMonthEnrollments) *
        100
    }

    // ==========================================================
    // CHART DATA
    // ==========================================================

    const [newUsersForChart, enrollmentsForChart] =
      await Promise.all([
        prisma.user.findMany({
          where: {
            createdAt: {
              gte: chartStartDate,
            },
            role: {
              notIn: ["ADMIN", "admin"],
            },
          },
          select: {
            createdAt: true,
          },
        }),

        prisma.enrollment.findMany({
          where: {
            enrolledAt: {
              gte: chartStartDate,
            },
          },
          select: {
            enrolledAt: true,
          },
        }),
      ])

    // ==========================================================
    // BUILD DAILY CHART
    // ==========================================================

    const chartData: {
      date: string
      users: number
      enrollments: number
    }[] = []

    for (let i = 0; i < 90; i++) {
      const date = new Date(chartStartDate)

      date.setDate(chartStartDate.getDate() + i)

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")

      const dateKey = `${year}-${month}-${day}`

      const usersCount = newUsersForChart.filter(
        (user) => {
          const userDate = new Date(user.createdAt)

          const userYear = userDate.getFullYear()
          const userMonth = String(
            userDate.getMonth() + 1
          ).padStart(2, "0")
          const userDay = String(
            userDate.getDate()
          ).padStart(2, "0")

          return (
            `${userYear}-${userMonth}-${userDay}` ===
            dateKey
          )
        }
      ).length

      const enrollmentsCount =
        enrollmentsForChart.filter(
          (enrollment) => {
            const enrollmentDate = new Date(
              enrollment.enrolledAt
            )

            const enrollmentYear =
              enrollmentDate.getFullYear()

            const enrollmentMonth = String(
              enrollmentDate.getMonth() + 1
            ).padStart(2, "0")

            const enrollmentDay = String(
              enrollmentDate.getDate()
            ).padStart(2, "0")

            return (
              `${enrollmentYear}-${enrollmentMonth}-${enrollmentDay}` ===
              dateKey
            )
          }
        ).length

      chartData.push({
        date: dateKey,
        users: usersCount,
        enrollments: enrollmentsCount,
      })
    }

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json({
      stats: {
        totalStudents,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalLessons,
        newUsers: totalNewUsers,
        activeSessions,
        revenue: revenueResult._sum.amount ?? 0,
        currentMonthEnrollments,
        previousMonthEnrollments,
        enrollmentGrowth,
      },

      chart: chartData,
    })
  } catch (error) {
    console.error(
      "ADMIN DASHBOARD ERROR:",
      error
    )

    return NextResponse.json(
      {
        message: "حدث خطأ أثناء جلب بيانات لوحة التحكم",
      },
      {
        status: 500,
      }
    )
  }
}