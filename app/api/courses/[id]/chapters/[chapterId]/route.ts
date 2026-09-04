// import { NextResponse } from "next/server"

// import { prisma } from "@/lib/db"
// import { requireAdmin } from "@/lib/require-admin"

// // ============================================================
// // UPDATE CHAPTER
// // ============================================================

// export async function PUT(
//   request: Request,
//   context: {
//     params: Promise<{
//       id: string
//       chapterId: string
//     }>
//   }
// ) {
//   try {
//     await requireAdmin()

//     const {
//       id,
//       chapterId,
//     } = await context.params

//     if (!id || !chapterId) {
//       return NextResponse.json(
//         {
//           error: "معرف الكورس أو الفصل غير موجود",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     const body = await request.json()

//     const title =
//       typeof body.title === "string"
//         ? body.title.trim()
//         : ""

//     if (!title) {
//       return NextResponse.json(
//         {
//           error: "اسم الفصل مطلوب",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     const chapter =
//       await prisma.chapter.findFirst({
//         where: {
//           id: chapterId,
//           courseId: id,
//         },
//       })

//     if (!chapter) {
//       return NextResponse.json(
//         {
//           error: "الفصل غير موجود",
//         },
//         {
//           status: 404,
//         }
//       )
//     }

//     const updatedChapter =
//       await prisma.chapter.update({
//         where: {
//           id: chapterId,
//         },
//         data: {
//           title,
//         },
//         include: {
//           lessons: {
//             orderBy: {
//               position: "asc",
//             },
//           },
//         },
//       })

//     return NextResponse.json(
//       {
//         success: true,
//         chapter: updatedChapter,
//       },
//       {
//         status: 200,
//       }
//     )
//   } catch (error) {
//     console.error(
//       "Update chapter error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "حدث خطأ أثناء تعديل الفصل",
//       },
//       {
//         status: 500,
//       }
//     )
//   }
// }

// // ============================================================
// // DELETE CHAPTER
// // ============================================================

// export async function DELETE(
//   request: Request,
//   context: {
//     params: Promise<{
//       id: string
//       chapterId: string
//     }>
//   }
// ) {
//   try {
//     await requireAdmin()

//     const {
//       id,
//       chapterId,
//     } = await context.params

//     if (!id || !chapterId) {
//       return NextResponse.json(
//         {
//           error: "معرف الكورس أو الفصل غير موجود",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     const chapter =
//       await prisma.chapter.findFirst({
//         where: {
//           id: chapterId,
//           courseId: id,
//         },
//       })

//     if (!chapter) {
//       return NextResponse.json(
//         {
//           error: "الفصل غير موجود",
//         },
//         {
//           status: 404,
//         }
//       )
//     }

//     await prisma.chapter.delete({
//       where: {
//         id: chapterId,
//       },
//     })

//     return NextResponse.json(
//       {
//         success: true,
//       },
//       {
//         status: 200,
//       }
//     )
//   } catch (error) {
//     console.error(
//       "Delete chapter error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "حدث خطأ أثناء حذف الفصل",
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
// HELPERS
// ============================================================

async function deleteS3Object(
  key: string | null | undefined
) {
  if (
    !key ||
    typeof key !== "string" ||
    !key.startsWith("courses/")
  ) {
    return
  }

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket:
          env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

        Key: key,
      })
    )

    console.log(
      "S3 lesson video deleted:",
      key
    )
  } catch (error) {
    console.error(
      "Failed to delete S3 lesson video:",
      {
        key,
        error,
      }
    )
  }
}

// ============================================================
// UPDATE CHAPTER
// ============================================================

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string
      chapterId: string
    }>
  }
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
    } = await context.params

    if (!id || !chapterId) {
      return NextResponse.json(
        {
          error:
            "معرف الكورس أو الفصل غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // READ BODY
    // ==========================================================

    const body =
      await request.json()

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : ""

    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!title) {
      return NextResponse.json(
        {
          error:
            "اسم الفصل مطلوب",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // CHECK CHAPTER
    // ==========================================================

    const chapter =
      await prisma.chapter.findFirst({
        where: {
          id: chapterId,
          courseId: id,
        },
      })

    if (!chapter) {
      return NextResponse.json(
        {
          error:
            "الفصل غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // UPDATE CHAPTER
    // ==========================================================

    const updatedChapter =
      await prisma.chapter.update({
        where: {
          id: chapterId,
        },

        data: {
          title,
        },

        include: {
          lessons: {
            orderBy: {
              position: "asc",
            },
          },
        },
      })

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        chapter: updatedChapter,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Update chapter error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تعديل الفصل",
      },
      {
        status: 500,
      }
    )
  }
}

// ============================================================
// DELETE CHAPTER
// ============================================================

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string
      chapterId: string
    }>
  }
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
    } = await context.params

    if (!id || !chapterId) {
      return NextResponse.json(
        {
          error:
            "معرف الكورس أو الفصل غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // GET CHAPTER + LESSON VIDEOS
    // ==========================================================

    const chapter =
      await prisma.chapter.findFirst({
        where: {
          id: chapterId,
          courseId: id,
        },

        include: {
          lessons: {
            select: {
              id: true,
              videoKey: true,
            },
          },
        },
      })

    if (!chapter) {
      return NextResponse.json(
        {
          error:
            "الفصل غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // COLLECT VIDEO KEYS
    // ==========================================================

    const videoKeys =
      chapter.lessons
        .map(
          (lesson) =>
            lesson.videoKey
        )
        .filter(
          (
            key
          ): key is string =>
            typeof key ===
              "string" &&
            key.trim().length > 0
        )

    // ==========================================================
    // DELETE FROM DATABASE
    //
    // We delete lessons first so we don't depend
    // on database cascade configuration.
    // ==========================================================

    await prisma.$transaction(
      async (tx) => {
        // ------------------------------------------------------
        // DELETE LESSONS
        // ------------------------------------------------------

        if (
          chapter.lessons.length > 0
        ) {
          await tx.lesson.deleteMany({
            where: {
              chapterId,
            },
          })
        }

        // ------------------------------------------------------
        // DELETE CHAPTER
        // ------------------------------------------------------

        await tx.chapter.delete({
          where: {
            id: chapterId,
          },
        })
      }
    )

    // ==========================================================
    // DELETE VIDEOS FROM S3
    // ==========================================================

    if (videoKeys.length > 0) {
      await Promise.allSettled(
        videoKeys.map(
          (key) =>
            deleteS3Object(key)
        )
      )
    }

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "تم حذف الفصل والفيديوهات المرتبطة به بنجاح",

        deletedVideos:
          videoKeys.length,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Delete chapter error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء حذف الفصل",
      },
      {
        status: 500,
      }
    )
  }
}