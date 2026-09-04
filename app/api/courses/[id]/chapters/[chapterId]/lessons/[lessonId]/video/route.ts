import { NextResponse } from "next/server"
import { headers } from "next/headers"

import {
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

// ============================================================
// TYPES
// ============================================================

type RouteContext = {
  params: Promise<{
    id: string
    lessonId: string
  }>
}

// ============================================================
// GET LESSON VIDEO
// ============================================================

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // ========================================================
    // PARAMS
    // ========================================================

    const { id, lessonId } = await context.params

    if (!id || !lessonId) {
      return NextResponse.json(
        {
          error: "معرف الكورس أو الدرس غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "يجب تسجيل الدخول أولاً",
        },
        {
          status: 401,
        }
      )
    }

    // ========================================================
    // ENROLLMENT
    // ========================================================

    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: id,
          },
        },

        select: {
          id: true,
        },
      })

    if (!enrollment) {
      return NextResponse.json(
        {
          error: "أنت غير مسجل في هذا الكورس",
        },
        {
          status: 403,
        }
      )
    }

    // ========================================================
    // LESSON
    // ========================================================

    const lesson =
      await prisma.lesson.findFirst({
        where: {
          id: lessonId,

          chapter: {
            courseId: id,
          },
        },

        select: {
          id: true,
          title: true,
          videoKey: true,
          videoType: true,

          chapter: {
            select: {
              course: {
                select: {
                  id: true,
                  title: true,
                  isPublished: true,
                },
              },
            },
          },
        },
      })

    if (!lesson) {
      return NextResponse.json(
        {
          error: "الدرس غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    // ========================================================
    // PUBLISHED
    // ========================================================

    if (!lesson.chapter.course.isPublished) {
      return NextResponse.json(
        {
          error: "هذا الكورس غير منشور",
        },
        {
          status: 403,
        }
      )
    }

    // ========================================================
    // VIDEO KEY
    // ========================================================

    if (!lesson.videoKey) {
      return NextResponse.json(
        {
          error: "لا يوجد فيديو لهذا الدرس",
        },
        {
          status: 404,
        }
      )
    }

    // ========================================================
    // CHECK S3 OBJECT
    // ========================================================

    try {
      const headCommand =
        new HeadObjectCommand({
          Bucket:
            env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

          Key: lesson.videoKey,
        })

      await s3.send(headCommand)
    } catch (error) {
      console.error(
        "S3 video does not exist:",
        error
      )

      return NextResponse.json(
        {
          error:
            "ملف الفيديو غير موجود على التخزين. ربما تم حذفه.",
        },
        {
          status: 404,
        }
      )
    }

    // ========================================================
    // SIGNED URL
    // ========================================================

    const command =
      new GetObjectCommand({
        Bucket:
          env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

        Key: lesson.videoKey,
      })

    const signedUrl =
      await getSignedUrl(
        s3,
        command,
        {
          expiresIn: 60 * 10,
        }
      )

    // ========================================================
    // SUCCESS
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        video: {
          url: signedUrl,
          title: lesson.title,
          type:
            lesson.videoType ?? "VIDEO",
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Get lesson video error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء جلب الفيديو",
      },
      {
        status: 500,
      }
    )
  }
}




















// import { NextResponse } from "next/server"
// import { headers } from "next/headers"

// import { GetObjectCommand } from "@aws-sdk/client-s3"
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// import { auth } from "@/lib/auth"
// import { prisma } from "@/lib/db"
// import { env } from "@/lib/env"
// import { s3 } from "@/lib/s3-client"

// // ============================================================
// // TYPES
// // ============================================================

// type RouteContext = {
//   params: Promise<{
//     id: string
//     lessonId: string
//   }>
// }

// // ============================================================
// // GET LESSON VIDEO
// // ============================================================

// export async function GET(
//   request: Request,
//   context: RouteContext
// ) {
//   try {
//     // ==========================================================
//     // PARAMS
//     // ==========================================================

//     const { id, lessonId } =
//       await context.params

//     console.log("========================================")
//     console.log("GET LESSON VIDEO")
//     console.log("Course ID:", id)
//     console.log("Lesson ID:", lessonId)
//     console.log("========================================")

//     if (!id || !lessonId) {
//       return NextResponse.json(
//         {
//           error:
//             "معرف الكورس أو الدرس غير موجود",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     // ==========================================================
//     // AUTHENTICATION
//     // ==========================================================

//     const session =
//       await auth.api.getSession({
//         headers: await headers(),
//       })

//     console.log(
//       "Session exists:",
//       !!session?.user
//     )

//     if (!session?.user) {
//       return NextResponse.json(
//         {
//           error:
//             "يجب تسجيل الدخول أولاً",
//         },
//         {
//           status: 401,
//         }
//       )
//     }

//     console.log(
//       "User ID:",
//       session.user.id
//     )

//     // ==========================================================
//     // CHECK ENROLLMENT
//     // ==========================================================

//     const enrollment =
//       await prisma.enrollment.findUnique({
//         where: {
//           userId_courseId: {
//             userId: session.user.id,
//             courseId: id,
//           },
//         },

//         select: {
//           id: true,
//         },
//       })

//     console.log(
//       "Enrollment:",
//       enrollment
//     )

//     if (!enrollment) {
//       return NextResponse.json(
//         {
//           error:
//             "أنت غير مسجل في هذا الكورس",
//         },
//         {
//           status: 403,
//         }
//       )
//     }

//     // ==========================================================
//     // FIND LESSON
//     // ==========================================================

//     const lesson =
//       await prisma.lesson.findFirst({
//         where: {
//           id: lessonId,

//           chapter: {
//             courseId: id,
//           },
//         },

//         select: {
//           id: true,
//           title: true,
//           videoKey: true,
//           videoType: true,

//           chapter: {
//             select: {
//               course: {
//                 select: {
//                   id: true,
//                   title: true,
//                   isPublished: true,
//                 },
//               },
//             },
//           },
//         },
//       })

//     console.log(
//       "Lesson found:",
//       !!lesson
//     )

//     // ==========================================================
//     // LESSON NOT FOUND
//     // ==========================================================

//     if (!lesson) {
//       return NextResponse.json(
//         {
//           error: "الدرس غير موجود",
//         },
//         {
//           status: 404,
//         }
//       )
//     }

//     // ==========================================================
//     // COURSE NOT PUBLISHED
//     // ==========================================================

//     if (
//       !lesson.chapter.course.isPublished
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "هذا الكورس غير منشور",
//         },
//         {
//           status: 403,
//         }
//       )
//     }

//     // ==========================================================
//     // VIDEO KEY NOT FOUND
//     // ==========================================================

//     if (!lesson.videoKey) {
//       return NextResponse.json(
//         {
//           error:
//             "لا يوجد فيديو لهذا الدرس",
//         },
//         {
//           status: 404,
//         }
//       )
//     }

//     // ==========================================================
//     // GENERATE SIGNED URL
//     // ==========================================================

//     const command =
//       new GetObjectCommand({
//         Bucket:
//           env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

//         Key: lesson.videoKey,
//       })

//     const signedUrl =
//       await getSignedUrl(
//         s3,
//         command,
//         {
//           expiresIn: 60 * 10,
//         }
//       )

//     // ==========================================================
//     // SUCCESS
//     // ==========================================================

//     console.log(
//       "Signed URL generated successfully"
//     )

//     return NextResponse.json(
//       {
//         success: true,

//         video: {
//           url: signedUrl,
//           title: lesson.title,
//           type: lesson.videoType,
//         },
//       },
//       {
//         status: 200,
//       }
//     )
//   } catch (error) {
//     console.error(
//       "Get lesson video error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "حدث خطأ أثناء جلب الفيديو",
//       },
//       {
//         status: 500,
//       }
//     )
//   }
// }