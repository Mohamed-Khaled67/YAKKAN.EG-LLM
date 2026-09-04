
import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

// ============================================================
// CREATE S3 SIGNED MEDIA URL
// ============================================================

async function getMediaUrl(
  mediaKey: string | null,
  mediaType: string | null
) {
  if (!mediaKey) {
    return null
  }

  if (
    mediaType !== "IMAGE" &&
    mediaType !== "VIDEO"
  ) {
    return null
  }

  try {
    const command = new GetObjectCommand({
      Bucket:
        env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: mediaKey,
    })

    const signedUrl = await getSignedUrl(
      s3,
      command,
      {
        expiresIn: 60 * 60,
      }
    )

    return signedUrl
  } catch (error) {
    console.error(
      "Failed to generate S3 media URL:",
      error
    )

    return null
  }
}

// ============================================================
// GET STUDENT DASHBOARD
// ============================================================

export async function GET() {
  try {
    // ==========================================================
    // AUTHENTICATION
    // ==========================================================

    const session =
      await auth.api.getSession({
        headers: await headers(),
      })

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "يجب تسجيل الدخول أولًا",
        },
        {
          status: 401,
        }
      )
    }

    const userId = session.user.id

    // ==========================================================
    // GET ENROLLMENTS
    // ==========================================================

    const enrollments =
      await prisma.enrollment.findMany({
        where: {
          userId,
          course: {
            isPublished: true,
          },
        },

        orderBy: {
          enrolledAt: "desc",
        },

        select: {
          id: true,
          enrolledAt: true,

          course: {
            select: {
              id: true,
              title: true,
              description: true,

              mediaUrl: true,
              mediaKey: true,
              mediaType: true,

              price: true,

              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },

              chapters: {
                orderBy: {
                  position: "asc",
                },

                select: {
                  id: true,
                  title: true,
                  position: true,

                  lessons: {
                    orderBy: {
                      position: "asc",
                    },

                    select: {
                      id: true,
                      title: true,
                      position: true,
                      duration: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

    // ==========================================================
    // FORMAT COURSES
    // ==========================================================

    const courses = await Promise.all(
      enrollments.map(
        async (enrollment) => {
          const course =
            enrollment.course

          // ----------------------------------------------------
          // MEDIA URL
          // ----------------------------------------------------

          const generatedMediaUrl =
            await getMediaUrl(
              course.mediaKey,
              course.mediaType
            )

          // ----------------------------------------------------
          // ALL LESSONS
          // ----------------------------------------------------

          const lessons =
            course.chapters.flatMap(
              (chapter) =>
                chapter.lessons.map(
                  (lesson) => ({
                    ...lesson,
                    chapterId:
                      chapter.id,
                    chapterTitle:
                      chapter.title,
                    chapterPosition:
                      chapter.position,
                  })
                )
            )

          const lessonIds =
            lessons.map(
              (lesson) => lesson.id
            )

          // ----------------------------------------------------
          // PROGRESS
          // ----------------------------------------------------

          const progressRecords =
            lessonIds.length > 0
              ? await prisma.lessonProgress.findMany(
                  {
                    where: {
                      userId,
                      lessonId: {
                        in: lessonIds,
                      },
                    },

                    select: {
                      lessonId: true,
                      progress: true,
                      watchedSeconds:
                        true,
                      completed: true,
                      updatedAt: true,
                    },

                    orderBy: {
                      updatedAt: "desc",
                    },
                  }
                )
              : []

          // ----------------------------------------------------
          // PROGRESS MAP
          // ----------------------------------------------------

          const progressMap =
            new Map(
              progressRecords.map(
                (item) => [
                  item.lessonId,
                  item,
                ]
              )
            )

          // ----------------------------------------------------
          // COURSE PROGRESS
          // ----------------------------------------------------

          const totalLessons =
            lessons.length

          const completedLessons =
            progressRecords.filter(
              (item) =>
                item.completed
            ).length

          const courseProgress =
            totalLessons === 0
              ? 0
              : Math.round(
                  (completedLessons /
                    totalLessons) *
                    100
                )

          // ----------------------------------------------------
          // LAST LESSON
          // ----------------------------------------------------

          const lastProgress =
            progressRecords[0] ??
            null

          let lastLesson = null

          if (lastProgress) {
            const lesson =
              lessons.find(
                (item) =>
                  item.id ===
                  lastProgress.lessonId
              )

            if (lesson) {
              lastLesson = {
                id: lesson.id,
                title: lesson.title,
                duration:
                  lesson.duration,
                chapterId:
                  lesson.chapterId,
                chapterTitle:
                  lesson.chapterTitle,
                progress:
                  lastProgress.progress,
                watchedSeconds:
                  lastProgress.watchedSeconds,
                completed:
                  lastProgress.completed,
              }
            }
          }

          // ----------------------------------------------------
          // FIRST LESSON
          // ----------------------------------------------------

          const firstLesson =
            lessons.length > 0
              ? {
                  id: lessons[0].id,
                  title: lessons[0].title,
                  duration:
                    lessons[0].duration,
                  chapterId:
                    lessons[0].chapterId,
                  chapterTitle:
                    lessons[0].chapterTitle,
                }
              : null

          // ----------------------------------------------------
          // CONTINUE LESSON
          // ----------------------------------------------------

          const continueLesson =
            lastLesson ??
            firstLesson

          // ----------------------------------------------------
          // SUBJECT
          // ----------------------------------------------------

          const subjectName =
            course.subject?.name ??
            "غير محدد"

          // ----------------------------------------------------
          // RETURN
          // ----------------------------------------------------

          return {
            enrollmentId:
              enrollment.id,

            enrolledAt:
              enrollment.enrolledAt,

            course: {
              id: course.id,

              title:
                course.title,

              description:
                course.description,

              // IMPORTANT:
              // Generate a fresh signed URL
              // from the S3 media key.
              mediaUrl:
                generatedMediaUrl ??
                course.mediaUrl ??
                null,

              mediaKey:
                course.mediaKey,

              mediaType:
                course.mediaType,

              price: Number(
                course.price
              ),

              subject: {
                id:
                  course.subject.id,

                name:
                  subjectName,

                code:
                  course.subject.code,
              },
            },

            totalLessons,

            completedLessons,

            progress:
              courseProgress,

            lastLesson,

            continueLesson,
          }
        }
      )
    )

    // ==========================================================
    // GLOBAL STATS
    // ==========================================================

    const totalCourses =
      courses.length

    const completedCourses =
      courses.filter(
        (course) =>
          course.totalLessons >
            0 &&
          course.progress === 100
      ).length

    const overallProgress =
      totalCourses === 0
        ? 0
        : Math.round(
            courses.reduce(
              (total, course) =>
                total +
                course.progress,
              0
            ) / totalCourses
          )

    // ==========================================================
    // LAST COURSE / LESSON
    // ==========================================================

    const lastCourse =
      courses.find(
        (course) =>
          course.lastLesson !==
          null
      ) ?? null

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        success: true,

        stats: {
          totalCourses,
          completedCourses,
          overallProgress,
        },

        courses,

        lastCourse,
      },

      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "GET /api/dashboard error:",
      error
    )

    return NextResponse.json(
      {
        success: false,

        error:
          "حدث خطأ أثناء تحميل لوحة الطالب",
      },

      {
        status: 500,
      }
    )
  }
}

























































// import { NextResponse } from "next/server"
// import { headers } from "next/headers"

// import { auth } from "@/lib/auth"
// import { prisma } from "@/lib/db"

// // ============================================================
// // GET STUDENT DASHBOARD
// // ============================================================

// export async function GET() {
//   try {
//     // ==========================================================
//     // AUTHENTICATION
//     // ==========================================================

//     const session = await auth.api.getSession({
//       headers: await headers(),
//     })

//     if (!session?.user) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "يجب تسجيل الدخول أولًا",
//         },
//         {
//           status: 401,
//         }
//       )
//     }

//     const userId = session.user.id

//     // ==========================================================
//     // GET ENROLLMENTS
//     // ==========================================================

//     const enrollments =
//       await prisma.enrollment.findMany({
//         where: {
//           userId,
//           course: {
//             isPublished: true,
//           },
//         },

//         orderBy: {
//           enrolledAt: "desc",
//         },

//         select: {
//           id: true,
//           enrolledAt: true,

//           course: {
//             select: {
//               id: true,
//               title: true,
//               description: true,
//               mediaUrl: true,
//               mediaKey: true,
//               mediaType: true,
//               price: true,

//               subject: {
//                 select: {
//                   id: true,
//                   name: true,
//                   code: true,
//                 },
//               },

//               chapters: {
//                 orderBy: {
//                   position: "asc",
//                 },

//                 select: {
//                   id: true,
//                   title: true,
//                   position: true,

//                   lessons: {
//                     orderBy: {
//                       position: "asc",
//                     },

//                     select: {
//                       id: true,
//                       title: true,
//                       position: true,
//                       duration: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       })

//     // ==========================================================
//     // FORMAT COURSES
//     // ==========================================================

//     const courses = await Promise.all(
//       enrollments.map(async (enrollment) => {
//         const course = enrollment.course

//         // ------------------------------------------------------
//         // ALL LESSONS
//         // ------------------------------------------------------

//         const lessons = course.chapters.flatMap(
//           (chapter) =>
//             chapter.lessons.map((lesson) => ({
//               ...lesson,
//               chapterId: chapter.id,
//               chapterTitle: chapter.title,
//               chapterPosition: chapter.position,
//             }))
//         )

//         const lessonIds = lessons.map(
//           (lesson) => lesson.id
//         )

//         // ------------------------------------------------------
//         // PROGRESS
//         // ------------------------------------------------------

//         const progressRecords =
//           lessonIds.length > 0
//             ? await prisma.lessonProgress.findMany({
//                 where: {
//                   userId,
//                   lessonId: {
//                     in: lessonIds,
//                   },
//                 },

//                 select: {
//                   lessonId: true,
//                   progress: true,
//                   watchedSeconds: true,
//                   completed: true,
//                   updatedAt: true,
//                 },

//                 orderBy: {
//                   updatedAt: "desc",
//                 },
//               })
//             : []

//         // ------------------------------------------------------
//         // PROGRESS MAP
//         // ------------------------------------------------------

//         const progressMap = new Map(
//           progressRecords.map((item) => [
//             item.lessonId,
//             item,
//           ])
//         )

//         // ------------------------------------------------------
//         // COURSE PROGRESS
//         // ------------------------------------------------------

//         const totalLessons = lessons.length

//         const completedLessons =
//           progressRecords.filter(
//             (item) => item.completed
//           ).length

//         const courseProgress =
//           totalLessons === 0
//             ? 0
//             : Math.round(
//                 (completedLessons /
//                   totalLessons) *
//                   100
//               )

//         // ------------------------------------------------------
//         // LAST LESSON
//         // ------------------------------------------------------

//         const lastProgress =
//           progressRecords[0] ?? null

//         let lastLesson = null

//         if (lastProgress) {
//           const lesson = lessons.find(
//             (item) =>
//               item.id ===
//               lastProgress.lessonId
//           )

//           if (lesson) {
//             lastLesson = {
//               id: lesson.id,
//               title: lesson.title,
//               duration: lesson.duration,
//               chapterId: lesson.chapterId,
//               chapterTitle:
//                 lesson.chapterTitle,
//               progress:
//                 lastProgress.progress,
//               watchedSeconds:
//                 lastProgress.watchedSeconds,
//               completed:
//                 lastProgress.completed,
//             }
//           }
//         }

//         // ------------------------------------------------------
//         // FIRST LESSON
//         // ------------------------------------------------------

//         const firstLesson =
//           lessons.length > 0
//             ? {
//                 id: lessons[0].id,
//                 title: lessons[0].title,
//                 duration:
//                   lessons[0].duration,
//                 chapterId:
//                   lessons[0].chapterId,
//                 chapterTitle:
//                   lessons[0].chapterTitle,
//               }
//             : null

//         // ------------------------------------------------------
//         // CONTINUE LESSON
//         // ------------------------------------------------------

//         const continueLesson =
//           lastLesson ?? firstLesson

//         // ------------------------------------------------------
//         // SUBJECT
//         // ------------------------------------------------------

//         const subjectName =
//           course.subject?.name ??
//           "غير محدد"

//         // ------------------------------------------------------
//         // RETURN
//         // ------------------------------------------------------

//         return {
//           enrollmentId:
//             enrollment.id,

//           enrolledAt:
//             enrollment.enrolledAt,

//           course: {
//             id: course.id,
//             title: course.title,
//             description:
//               course.description,
//             mediaUrl:
//               course.mediaUrl,
//             mediaKey:
//               course.mediaKey,
//             mediaType:
//               course.mediaType,
//             price: Number(
//               course.price
//             ),

//             subject: {
//               id:
//                 course.subject.id,
//               name:
//                 subjectName,
//               code:
//                 course.subject.code,
//             },
//           },

//           totalLessons,

//           completedLessons,

//           progress:
//             courseProgress,

//           lastLesson,

//           continueLesson,
//         }
//       })
//     )

//     // ==========================================================
//     // GLOBAL STATS
//     // ==========================================================

//     const totalCourses =
//       courses.length

//     const completedCourses =
//       courses.filter(
//         (course) =>
//           course.totalLessons > 0 &&
//           course.progress === 100
//       ).length

//     const overallProgress =
//       totalCourses === 0
//         ? 0
//         : Math.round(
//             courses.reduce(
//               (total, course) =>
//                 total +
//                 course.progress,
//               0
//             ) / totalCourses
//           )

//     // ==========================================================
//     // LAST COURSE / LESSON
//     // ==========================================================

//     const lastCourse =
//       courses.find(
//         (course) =>
//           course.lastLesson !==
//           null
//       ) ?? null

//     // ==========================================================
//     // RESPONSE
//     // ==========================================================

//     return NextResponse.json(
//       {
//         success: true,

//         stats: {
//           totalCourses,
//           completedCourses,
//           overallProgress,
//         },

//         courses,

//         lastCourse,
//       },
//       {
//         status: 200,
//       }
//     )
//   } catch (error) {
//     console.error(
//       "GET /api/dashboard error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           "حدث خطأ أثناء تحميل لوحة الطالب",
//       },
//       {
//         status: 500,
//       }
//     )
//   }
// }

