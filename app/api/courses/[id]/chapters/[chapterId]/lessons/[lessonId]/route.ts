
// import { NextResponse } from "next/server"
// import { DeleteObjectCommand } from "@aws-sdk/client-s3"

// import { prisma } from "@/lib/db"
// import { requireAdmin } from "@/lib/require-admin"
// import { env } from "@/lib/env"
// import { s3 } from "@/lib/s3-client"

// // ============================================================
// // TYPES
// // ============================================================

// type RouteContext = {
//   params: Promise<{
//     id: string
//     chapterId: string
//     lessonId: string
//   }>
// }

// // ============================================================
// // DELETE VIDEO FROM S3
// // ============================================================

// async function deleteVideoFromS3(
//   videoKey: string | null | undefined
// ) {
//   if (!videoKey) {
//     return
//   }

//   // Security check
//   if (!videoKey.startsWith("courses/videos/")) {
//     console.warn(
//       "Blocked S3 delete for invalid video key:",
//       videoKey
//     )

//     return
//   }

//   const command =
//     new DeleteObjectCommand({
//       Bucket:
//         env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

//       Key: videoKey,
//     })

//   await s3.send(command)

//   console.log(
//     "Lesson video deleted from S3:",
//     videoKey
//   )
// }

// // ============================================================
// // UPDATE LESSON
// // ============================================================

// export async function PUT(
//   request: Request,
//   context: RouteContext
// ) {
//   try {
//     // ==========================================================
//     // ADMIN PROTECTION
//     // ==========================================================

//     await requireAdmin()

//     // ==========================================================
//     // GET PARAMS
//     // ==========================================================

//     const {
//       id,
//       chapterId,
//       lessonId,
//     } = await context.params

//     if (
//       !id ||
//       !chapterId ||
//       !lessonId
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "معرف الكورس أو الفصل أو الدرس غير موجود",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     // ==========================================================
//     // READ BODY
//     // ==========================================================

//     const body =
//       await request.json()

//     const title =
//       typeof body.title === "string"
//         ? body.title.trim()
//         : ""

//     const description =
//       typeof body.description === "string"
//         ? body.description.trim()
//         : ""

//     const videoUrl =
//       typeof body.videoUrl === "string"
//         ? body.videoUrl.trim()
//         : ""

//     const videoKey =
//       typeof body.videoKey === "string"
//         ? body.videoKey.trim()
//         : ""

//     const videoType =
//       body.videoType === "VIDEO"
//         ? "VIDEO"
//         : null

//     // ==========================================================
//     // VALIDATE TITLE
//     // ==========================================================

//     if (!title) {
//       return NextResponse.json(
//         {
//           error:
//             "اسم الدرس مطلوب",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     // ==========================================================
//     // VALIDATE VIDEO DATA
//     // ==========================================================

//     if (videoUrl && !videoKey) {
//       return NextResponse.json(
//         {
//           error:
//             "مفتاح الفيديو غير موجود",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     if (videoKey && !videoUrl) {
//       return NextResponse.json(
//         {
//           error:
//             "رابط الفيديو غير موجود",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     if (
//       videoKey &&
//       !videoKey.startsWith(
//         "courses/videos/"
//       )
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "مسار الفيديو غير مسموح به",
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

//           chapterId,

//           chapter: {
//             courseId: id,
//           },
//         },

//         select: {
//           id: true,
//           title: true,
//           description: true,
//           videoUrl: true,
//           videoKey: true,
//           videoType: true,
//           position: true,
//           chapterId: true,
//         },
//       })

//     if (!lesson) {
//       return NextResponse.json(
//         {
//           error:
//             "الدرس غير موجود داخل هذا الفصل",
//         },
//         {
//           status: 404,
//         }
//       )
//     }

//     // ==========================================================
//     // DETECT VIDEO CHANGE
//     // ==========================================================

//     const oldVideoKey =
//       lesson.videoKey

//     const newVideoKey =
//       videoKey || null

//     const videoChanged =
//       oldVideoKey !== newVideoKey

//     // ==========================================================
//     // UPDATE LESSON
//     // ==========================================================

//     const updatedLesson =
//       await prisma.lesson.update({
//         where: {
//           id: lessonId,
//         },

//         data: {
//           title,

//           description:
//             description || null,

//           videoUrl:
//             videoUrl || null,

//           videoKey:
//             newVideoKey,

//           videoType:
//             newVideoKey
//               ? videoType
//               : null,
//         },
//       })

//     // ==========================================================
//     // DELETE OLD VIDEO
//     // ==========================================================

//     /*
//       مهم:

//       بنحذف الفيديو القديم فقط بعد نجاح
//       تحديث الـ Lesson في قاعدة البيانات.

//       لو مفيش فيديو جديد، وكان القديم موجود،
//       فهذا يعني أن المستخدم حذف الفيديو.
//     */

//     if (
//       videoChanged &&
//       oldVideoKey &&
//       oldVideoKey !== newVideoKey
//     ) {
//       try {
//         await deleteVideoFromS3(
//           oldVideoKey
//         )
//       } catch (s3Error) {
//         /*
//           قاعدة البيانات اتحدثت بالفعل،
//           لذلك لا نرجع 500 للمستخدم.

//           نسجل الخطأ فقط عشان نقدر
//           نعالج الـ object القديم لاحقًا.
//         */

//         console.error(
//           "Failed to delete old lesson video from S3:",
//           s3Error
//         )
//       }
//     }

//     // ==========================================================
//     // SUCCESS
//     // ==========================================================

//     return NextResponse.json(
//       {
//         success: true,
//         lesson: updatedLesson,
//       },
//       {
//         status: 200,
//       }
//     )
//   } catch (error) {
//     // ==========================================================
//     // ERROR
//     // ==========================================================

//     console.error(
//       "Update lesson error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "حدث خطأ أثناء تعديل الدرس",
//       },
//       {
//         status: 500,
//       }
//     )
//   }
// }

// // ============================================================
// // DELETE LESSON
// // ============================================================

// export async function DELETE(
//   request: Request,
//   context: RouteContext
// ) {
//   try {
//     // ==========================================================
//     // ADMIN PROTECTION
//     // ==========================================================

//     await requireAdmin()

//     // ==========================================================
//     // GET PARAMS
//     // ==========================================================

//     const {
//       id,
//       chapterId,
//       lessonId,
//     } = await context.params

//     if (
//       !id ||
//       !chapterId ||
//       !lessonId
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "معرف الكورس أو الفصل أو الدرس غير موجود",
//         },
//         {
//           status: 400,
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

//           chapterId,

//           chapter: {
//             courseId: id,
//           },
//         },

//         select: {
//           id: true,
//           title: true,
//           videoKey: true,
//         },
//       })

//     if (!lesson) {
//       return NextResponse.json(
//         {
//           error:
//             "الدرس غير موجود داخل هذا الفصل",
//         },
//         {
//           status: 404,
//         }
//       )
//     }

//     // ==========================================================
//     // DELETE LESSON FROM DATABASE
//     // ==========================================================

//     await prisma.lesson.delete({
//       where: {
//         id: lessonId,
//       },
//     })

//     // ==========================================================
//     // DELETE VIDEO FROM S3
//     // ==========================================================

//     if (lesson.videoKey) {
//       try {
//         await deleteVideoFromS3(
//           lesson.videoKey
//         )
//       } catch (s3Error) {
//         /*
//           الدرس اتحذف بالفعل من DB.

//           لذلك لا نرجع Error للمستخدم،
//           ونكتفي بتسجيل الخطأ.
//         */

//         console.error(
//           "Failed to delete lesson video from S3:",
//           s3Error
//         )
//       }
//     }

//     // ==========================================================
//     // SUCCESS
//     // ==========================================================

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "تم حذف الدرس والفيديو بنجاح",
//       },
//       {
//         status: 200,
//       }
//     )
//   } catch (error) {
//     // ==========================================================
//     // ERROR
//     // ==========================================================

//     console.error(
//       "Delete lesson error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "حدث خطأ أثناء حذف الدرس",
//       },
//       {
//         status: 500,
//       }
//     )
//   }
// }




















import { NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

// ============================================================
// TYPES
// ============================================================

type RouteContext = {
  params: Promise<{
    id: string
    chapterId: string
    lessonId: string
  }>
}

// ============================================================
// DELETE VIDEO FROM S3
// ============================================================

async function deleteVideoFromS3(
  videoKey: string | null | undefined
) {
  if (!videoKey) {
    return
  }

  // Security check
  if (!videoKey.startsWith("courses/videos/")) {
    console.warn(
      "Blocked S3 delete for invalid video key:",
      videoKey
    )

    return
  }

  const command =
    new DeleteObjectCommand({
      Bucket:
        env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

      Key: videoKey,
    })

  await s3.send(command)

  console.log(
    "Lesson video deleted from S3:",
    videoKey
  )
}

// ============================================================
// UPDATE LESSON
// ============================================================

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    // ==========================================================
    // ADMIN PROTECTION
    // ==========================================================

    await requireAdmin()

    // ==========================================================
    // GET PARAMS
    // ==========================================================

    const {
      id,
      chapterId,
      lessonId,
    } = await context.params

    if (
      !id ||
      !chapterId ||
      !lessonId
    ) {
      return NextResponse.json(
        {
          error:
            "معرف الكورس أو الفصل أو الدرس غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // READ BODY
    // ==========================================================

    const body = await request.json()

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : ""

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : ""

    const videoUrl =
      typeof body.videoUrl === "string"
        ? body.videoUrl.trim()
        : ""

    const videoKey =
      typeof body.videoKey === "string"
        ? body.videoKey.trim()
        : ""

    const videoType =
      body.videoType === "VIDEO"
        ? "VIDEO"
        : null

    // ==========================================================
    // FREE LESSON
    // ==========================================================

    const isFree =
      typeof body.isFree === "boolean"
        ? body.isFree
        : false

    // ==========================================================
    // VALIDATE TITLE
    // ==========================================================

    if (!title) {
      return NextResponse.json(
        {
          error: "اسم الدرس مطلوب",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // VALIDATE VIDEO DATA
    // ==========================================================

    if (videoUrl && !videoKey) {
      return NextResponse.json(
        {
          error: "مفتاح الفيديو غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    if (videoKey && !videoUrl) {
      return NextResponse.json(
        {
          error: "رابط الفيديو غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    if (
      videoKey &&
      !videoKey.startsWith("courses/videos/")
    ) {
      return NextResponse.json(
        {
          error: "مسار الفيديو غير مسموح به",
        },
        {
          status: 403,
        }
      )
    }

    // ==========================================================
    // FIND LESSON
    // ==========================================================

    const lesson =
      await prisma.lesson.findFirst({
        where: {
          id: lessonId,

          chapterId,

          chapter: {
            courseId: id,
          },
        },

        select: {
          id: true,
          title: true,
          description: true,
          videoUrl: true,
          videoKey: true,
          videoType: true,
          position: true,
          chapterId: true,
        },
      })

    if (!lesson) {
      return NextResponse.json(
        {
          error:
            "الدرس غير موجود داخل هذا الفصل",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // DETECT VIDEO CHANGE
    // ==========================================================

    const oldVideoKey =
      lesson.videoKey

    const newVideoKey =
      videoKey || null

    const videoChanged =
      oldVideoKey !== newVideoKey

    // ==========================================================
    // UPDATE LESSON
    // ==========================================================

    const updatedLesson =
      await prisma.lesson.update({
        where: {
          id: lessonId,
        },

        data: {
          title,

          description:
            description || null,

          videoUrl:
            videoUrl || null,

          videoKey:
            newVideoKey,

          videoType:
            newVideoKey
              ? videoType
              : null,

          // IMPORTANT:
          // Update free/paid status
          isFree,
        },
      })

    // ==========================================================
    // DELETE OLD VIDEO
    // ==========================================================

    /*
      مهم:

      بنحذف الفيديو القديم فقط بعد نجاح
      تحديث الـ Lesson في قاعدة البيانات.

      لو مفيش فيديو جديد، وكان القديم موجود،
      فهذا يعني أن المستخدم حذف الفيديو.
    */

    if (
      videoChanged &&
      oldVideoKey &&
      oldVideoKey !== newVideoKey
    ) {
      try {
        await deleteVideoFromS3(
          oldVideoKey
        )
      } catch (s3Error) {
        /*
          قاعدة البيانات اتحدثت بالفعل،
          لذلك لا نرجع 500 للمستخدم.

          نسجل الخطأ فقط عشان نقدر
          نعالج الـ object القديم لاحقًا.
        */

        console.error(
          "Failed to delete old lesson video from S3:",
          s3Error
        )
      }
    }

    // ==========================================================
    // SUCCESS
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        lesson: updatedLesson,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    // ==========================================================
    // ERROR
    // ==========================================================

    console.error(
      "Update lesson error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تعديل الدرس",
      },
      {
        status: 500,
      }
    )
  }
}

// ============================================================
// DELETE LESSON
// ============================================================

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    // ==========================================================
    // ADMIN PROTECTION
    // ==========================================================

    await requireAdmin()

    // ==========================================================
    // GET PARAMS
    // ==========================================================

    const {
      id,
      chapterId,
      lessonId,
    } = await context.params

    if (
      !id ||
      !chapterId ||
      !lessonId
    ) {
      return NextResponse.json(
        {
          error:
            "معرف الكورس أو الفصل أو الدرس غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // FIND LESSON
    // ==========================================================

    const lesson =
      await prisma.lesson.findFirst({
        where: {
          id: lessonId,

          chapterId,

          chapter: {
            courseId: id,
          },
        },

        select: {
          id: true,
          title: true,
          videoKey: true,
        },
      })

    if (!lesson) {
      return NextResponse.json(
        {
          error:
            "الدرس غير موجود داخل هذا الفصل",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // DELETE LESSON FROM DATABASE
    // ==========================================================

    await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    })

    // ==========================================================
    // DELETE VIDEO FROM S3
    // ==========================================================

    if (lesson.videoKey) {
      try {
        await deleteVideoFromS3(
          lesson.videoKey
        )
      } catch (s3Error) {
        /*
          الدرس اتحذف بالفعل من DB.

          لذلك لا نرجع Error للمستخدم،
          ونكتفي بتسجيل الخطأ.
        */

        console.error(
          "Failed to delete lesson video from S3:",
          s3Error
        )
      }
    }

    // ==========================================================
    // SUCCESS
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        message:
          "تم حذف الدرس والفيديو بنجاح",
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    // ==========================================================
    // ERROR
    // ==========================================================

    console.error(
      "Delete lesson error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء حذف الدرس",
      },
      {
        status: 500,
      }
    )
  }
}

