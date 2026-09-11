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
    typeof key !== "string"
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
      "S3 / Tigris object deleted:",
      key
    )
  } catch (error) {
    console.error(
      "Failed to delete S3 / Tigris object:",
      {
        key,
        error,
      }
    )

    throw error
  }
}

// ============================================================
// UPDATE COURSE
// ============================================================

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    // ==========================================================
    // ADMIN PROTECTION
    // ==========================================================

    await requireAdmin()

    // ==========================================================
    // GET COURSE ID
    // ==========================================================

    const { id } =
      await context.params

    if (!id) {
      return NextResponse.json(
        {
          error:
            "معرف الكورس غير موجود",
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

    const {
      title,
      description,
      mediaKey,
      mediaType,
      price,
      educationType,
      academicLevel,
      semester,
      secondaryTrack,
      subjectId,
      level,
      isPublished,
    } = body

    // ==========================================================
    // BASIC VALIDATION
    // ==========================================================

    if (
      !title ||
      typeof title !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "اسم الكورس مطلوب",
        },
        {
          status: 400,
        }
      )
    }

    if (
      !subjectId ||
      typeof subjectId !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "المادة مطلوبة",
        },
        {
          status: 400,
        }
      )
    }

    if (
      price === undefined ||
      typeof price !== "number" ||
      Number.isNaN(price) ||
      price < 0
    ) {
      return NextResponse.json(
        {
          error:
            "السعر غير صحيح",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // CHECK COURSE
    // ==========================================================

    const existingCourse =
      await prisma.course.findUnique({
        where: {
          id,
        },
      })

    if (!existingCourse) {
      return NextResponse.json(
        {
          error:
            "الكورس غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // CHECK SUBJECT
    //
    // subjectId القادم من الفورم هو CODE
    // وليس UUID الخاص بجدول Subject.
    // ==========================================================

    const subject =
      await prisma.subject.findUnique({
        where: {
          code: subjectId,
        },
      })

    if (!subject) {
      return NextResponse.json(
        {
          error:
            "المادة غير موجودة",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // PREPARE MEDIA
    // ==========================================================

    const newMediaKey =
      typeof mediaKey === "string" &&
      mediaKey.trim()
        ? mediaKey.trim()
        : existingCourse.mediaKey

    const newMediaType =
      mediaType === "IMAGE" ||
      mediaType === "VIDEO"
        ? mediaType
        : existingCourse.mediaType

    // ==========================================================
    // UPDATE COURSE
    // ==========================================================

    const course =
      await prisma.course.update({
        where: {
          id,
        },

        data: {
          title:
            title.trim(),

          description:
            typeof description ===
              "string" &&
            description.trim()
              ? description
              : null,

          // ====================================================
          // MEDIA
          // ====================================================

          mediaKey:
            newMediaKey,

          mediaType:
            newMediaType,

          // ====================================================
          // COURSE DETAILS
          // ====================================================

          price,

          educationType,

          academicLevel,

          semester,

          secondaryTrack:
            secondaryTrack || null,

          level,

          isPublished:
            Boolean(isPublished),

          // ====================================================
          // SUBJECT
          // ====================================================

          subject: {
            connect: {
              id: subject.id,
            },
          },
        },

        include: {
          subject: true,
        },
      })

    // ==========================================================
    // DELETE OLD MEDIA
    //
    // Only if the course actually received a different file.
    // ==========================================================

    const mediaChanged =
      existingCourse.mediaKey &&
      newMediaKey &&
      existingCourse.mediaKey !==
        newMediaKey

    if (mediaChanged) {
      try {
        await deleteS3Object(
          existingCourse.mediaKey
        )
      } catch (error) {
        console.error(
          "Old course media could not be deleted:",
          error
        )
      }
    }

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        course,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Update course error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تعديل الكورس",
      },
      {
        status: 500,
      }
    )
  }
}

// ============================================================
// DELETE COURSE
// ============================================================

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    // ==========================================================
    // ADMIN PROTECTION
    // ==========================================================

    await requireAdmin()

    // ==========================================================
    // GET COURSE ID
    // ==========================================================

    const { id } =
      await context.params

    if (!id) {
      return NextResponse.json(
        {
          error:
            "معرف الكورس غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ==========================================================
    // GET COURSE
    //
    // Get:
    // - Course mediaKey
    // - All chapters
    // - All lessons
    // - All lesson videoKeys
    // ==========================================================

    const course =
      await prisma.course.findUnique({
        where: {
          id,
        },

        include: {
          chapters: {
            include: {
              lessons: {
                select: {
                  id: true,
                  videoKey: true,
                },
              },
            },
          },
        },
      })

    // ==========================================================
    // COURSE NOT FOUND
    // ==========================================================

    if (!course) {
      return NextResponse.json(
        {
          error:
            "الكورس غير موجود",
        },
        {
          status: 404,
        }
      )
    }

    // ==========================================================
    // COLLECT ALL Tigris / S3 KEYS
    // ==========================================================

    const s3Keys =
      new Set<string>()

    // ==========================================================
    // COURSE MEDIA
    // ==========================================================

    if (
      course.mediaKey &&
      typeof course.mediaKey === "string" &&
      course.mediaKey.trim()
    ) {
      s3Keys.add(
        course.mediaKey.trim()
      )
    }

    // ==========================================================
    // LESSON VIDEOS
    // ==========================================================

    for (
      const chapter of course.chapters
    ) {
      for (
        const lesson of chapter.lessons
      ) {
        if (
          lesson.videoKey &&
          typeof lesson.videoKey === "string" &&
          lesson.videoKey.trim()
        ) {
          s3Keys.add(
            lesson.videoKey.trim()
          )
        }
      }
    }

    // ==========================================================
    // CONVERT SET TO ARRAY
    // ==========================================================

    const keysToDelete =
      Array.from(s3Keys)

    // ==========================================================
    // DEBUG LOG
    // ==========================================================

    console.log(
      "Files scheduled for deletion:",
      {
        courseId: id,
        totalFiles:
          keysToDelete.length,
        keys: keysToDelete,
      }
    )

    // ==========================================================
    // DELETE DATABASE DATA
    //
    // Lessons
    // ↓
    // Chapters
    // ↓
    // Course
    // ==========================================================

    await prisma.$transaction(
      async (tx) => {
        // ======================================================
        // COLLECT CHAPTER IDS
        // ======================================================

        const chapterIds =
          course.chapters.map(
            (chapter) =>
              chapter.id
          )

        // ======================================================
        // DELETE LESSONS
        // ======================================================

        if (
          chapterIds.length > 0
        ) {
          await tx.lesson.deleteMany({
            where: {
              chapterId: {
                in: chapterIds,
              },
            },
          })

          // ====================================================
          // DELETE CHAPTERS
          // ====================================================

          await tx.chapter.deleteMany({
            where: {
              id: {
                in: chapterIds,
              },
            },
          })
        }

        // ======================================================
        // DELETE COURSE
        // ======================================================

        await tx.course.delete({
          where: {
            id,
          },
        })
      }
    )

    // ==========================================================
    // DELETE ALL FILES FROM TIGRIS / S3
    // ==========================================================

    const deleteResults =
      await Promise.allSettled(
        keysToDelete.map(
          async (key) => {
            await deleteS3Object(
              key
            )

            return key
          }
        )
      )

    // ==========================================================
    // COUNT RESULTS
    // ==========================================================

    const successfulDeletes =
      deleteResults.filter(
        (result) =>
          result.status ===
          "fulfilled"
      )

    const failedDeletes =
      deleteResults.filter(
        (result) =>
          result.status ===
          "rejected"
      )

    // ==========================================================
    // FAILED FILE DETAILS
    // ==========================================================

    const failedKeys =
      failedDeletes.map(
        (_, index) =>
          keysToDelete[index]
      )

    // ==========================================================
    // LOG CLEANUP RESULT
    // ==========================================================

    console.log(
      "Tigris cleanup completed:",
      {
        courseId: id,

        totalFiles:
          keysToDelete.length,

        successfulDeletes:
          successfulDeletes.length,

        failedDeletes:
          failedDeletes.length,
      }
    )

    // ==========================================================
    // RESPONSE
    // ==========================================================

    if (
      failedDeletes.length > 0
    ) {
      return NextResponse.json(
        {
          success: true,

          message:
            "تم حذف الكورس من قاعدة البيانات، لكن فشل حذف بعض الملفات من Tigris",

          deletedFiles:
            successfulDeletes.length,

          failedFiles:
            failedDeletes.length,

          totalFiles:
            keysToDelete.length,

          failedKeys,
        },
        {
          status: 207,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "تم حذف الكورس وجميع ملفاته بنجاح",

        deletedFiles:
          successfulDeletes.length,

        failedFiles:
          0,

        totalFiles:
          keysToDelete.length,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "Delete course error:",
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء حذف الكورس",
      },
      {
        status: 500,
      }
    )
  }
}













// import { NextResponse } from "next/server"
// import { DeleteObjectCommand } from "@aws-sdk/client-s3"

// import { prisma } from "@/lib/db"
// import { requireAdmin } from "@/lib/require-admin"
// import { env } from "@/lib/env"
// import { s3 } from "@/lib/s3-client"

// // ============================================================
// // HELPERS
// // ============================================================

// async function deleteS3Object(
//   key: string | null | undefined
// ) {
//   if (
//     !key ||
//     typeof key !== "string" ||
//     !key.startsWith("courses/")
//   ) {
//     return
//   }

//   try {
//     await s3.send(
//       new DeleteObjectCommand({
//         Bucket:
//           env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

//         Key: key,
//       })
//     )

//     console.log(
//       "S3 course media deleted:",
//       key
//     )
//   } catch (error) {
//     console.error(
//       "Failed to delete S3 course media:",
//       {
//         key,
//         error,
//       }
//     )
//   }
// }

// // ============================================================
// // UPDATE COURSE
// // ============================================================

// export async function PUT(
//   request: Request,
//   context: {
//     params: Promise<{
//       id: string
//     }>
//   }
// ) {
//   try {
//     // ==========================================================
//     // ADMIN PROTECTION
//     // ==========================================================

//     await requireAdmin()

//     // ==========================================================
//     // GET COURSE ID
//     // ==========================================================

//     const { id } =
//       await context.params

//     if (!id) {
//       return NextResponse.json(
//         {
//           error:
//             "معرف الكورس غير موجود",
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

//     const {
//       title,
//       description,
//       mediaKey,
//       mediaType,
//       price,
//       educationType,
//       academicLevel,
//       semester,
//       secondaryTrack,
//       subjectId,
//       level,
//       isPublished,
//     } = body

//     // ==========================================================
//     // BASIC VALIDATION
//     // ==========================================================

//     if (
//       !title ||
//       typeof title !== "string"
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "اسم الكورس مطلوب",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     if (
//       !subjectId ||
//       typeof subjectId !== "string"
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "المادة مطلوبة",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     if (
//       price === undefined ||
//       typeof price !== "number" ||
//       Number.isNaN(price) ||
//       price < 0
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "السعر غير صحيح",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     // ==========================================================
//     // CHECK COURSE
//     // ==========================================================

//     const existingCourse =
//       await prisma.course.findUnique({
//         where: {
//           id,
//         },
//       })

//     if (!existingCourse) {
//       return NextResponse.json(
//         {
//           error:
//             "الكورس غير موجود",
//         },
//         {
//           status: 404,
//         }
//       )
//     }

//     // ==========================================================
//     // CHECK SUBJECT
//     //
//     // subjectId القادم من الفورم هو CODE
//     // وليس UUID الخاص بجدول Subject.
//     // ==========================================================

//     const subject =
//       await prisma.subject.findUnique({
//         where: {
//           code: subjectId,
//         },
//       })

//     if (!subject) {
//       return NextResponse.json(
//         {
//           error:
//             "المادة غير موجودة",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     // ==========================================================
//     // PREPARE MEDIA
//     // ==========================================================

//     const newMediaKey =
//       typeof mediaKey === "string" &&
//       mediaKey.trim()
//         ? mediaKey.trim()
//         : existingCourse.mediaKey

//     const newMediaType =
//       mediaType === "IMAGE" ||
//       mediaType === "VIDEO"
//         ? mediaType
//         : existingCourse.mediaType

//     // ==========================================================
//     // UPDATE COURSE
//     // ==========================================================

//     const course =
//       await prisma.course.update({
//         where: {
//           id,
//         },

//         data: {
//           title:
//             title.trim(),

//           description:
//             typeof description ===
//               "string" &&
//             description.trim()
//               ? description
//               : null,

//           // ====================================================
//           // MEDIA
//           // ====================================================

//           mediaKey:
//             newMediaKey,

//           mediaType:
//             newMediaType,

//           // ====================================================
//           // COURSE DETAILS
//           // ====================================================

//           price,

//           educationType,

//           academicLevel,

//           semester,

//           secondaryTrack:
//             secondaryTrack || null,

//           level,

//           isPublished:
//             Boolean(isPublished),

//           // ====================================================
//           // SUBJECT
//           // ====================================================

//           subject: {
//             connect: {
//               id: subject.id,
//             },
//           },
//         },

//         include: {
//           subject: true,
//         },
//       })

//     // ==========================================================
//     // DELETE OLD MEDIA
//     //
//     // Only if the course actually received a different file.
//     // ==========================================================

//     const mediaChanged =
//       existingCourse.mediaKey &&
//       newMediaKey &&
//       existingCourse.mediaKey !==
//         newMediaKey

//     if (mediaChanged) {
//       await deleteS3Object(
//         existingCourse.mediaKey
//       )
//     }

//     // ==========================================================
//     // RESPONSE
//     // ==========================================================

//     return NextResponse.json(
//       {
//         success: true,
//         course,
//       },
//       {
//         status: 200,
//       }
//     )
//   } catch (error) {
//     console.error(
//       "Update course error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "حدث خطأ أثناء تعديل الكورس",
//       },
//       {
//         status: 500,
//       }
//     )
//   }
// }

// // ============================================================
// // DELETE COURSE
// // ============================================================

// export async function DELETE(
//   request: Request,
//   context: {
//     params: Promise<{
//       id: string
//     }>
//   }
// ) {
//   try {
//     // ==========================================================
//     // ADMIN PROTECTION
//     // ==========================================================

//     await requireAdmin()

//     // ==========================================================
//     // GET COURSE ID
//     // ==========================================================

//     const { id } =
//       await context.params

//     if (!id) {
//       return NextResponse.json(
//         {
//           error:
//             "معرف الكورس غير موجود",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     // ==========================================================
//     // GET COURSE
//     // ==========================================================

//     const course =
//       await prisma.course.findUnique({
//         where: {
//           id,
//         },

//         include: {
//           chapters: {
//             include: {
//               lessons: {
//                 select: {
//                   id: true,
//                   videoKey: true,
//                 },
//               },
//             },
//           },
//         },
//       })

//     if (!course) {
//       return NextResponse.json(
//         {
//           error:
//             "الكورس غير موجود",
//         },
//         {
//           status: 404,
//         }
//       )
//     }

//     // ==========================================================
//     // COLLECT ALL S3 KEYS
//     // ==========================================================

//     const s3Keys =
//       new Set<string>()

//     // ----------------------------------------------------------
//     // COURSE MEDIA
//     // ----------------------------------------------------------

//     if (
//       course.mediaKey &&
//       course.mediaKey.startsWith(
//         "courses/"
//       )
//     ) {
//       s3Keys.add(
//         course.mediaKey
//       )
//     }

//     // ----------------------------------------------------------
//     // LESSON VIDEOS
//     // ----------------------------------------------------------

//     for (
//       const chapter of course.chapters
//     ) {
//       for (
//         const lesson of chapter.lessons
//       ) {
//         if (
//           lesson.videoKey &&
//           lesson.videoKey.startsWith(
//             "courses/"
//           )
//         ) {
//           s3Keys.add(
//             lesson.videoKey
//           )
//         }
//       }
//     }

//     const keysToDelete =
//       Array.from(s3Keys)

//     // ==========================================================
//     // DELETE COURSE DATA
//     //
//     // Delete lessons first, then chapters,
//     // then the course itself.
//     // ==========================================================

//     await prisma.$transaction(
//       async (tx) => {
//         // ------------------------------------------------------
//         // COLLECT CHAPTER IDS
//         // ------------------------------------------------------

//         const chapterIds =
//           course.chapters.map(
//             (chapter) =>
//               chapter.id
//           )

//         // ------------------------------------------------------
//         // DELETE LESSONS
//         // ------------------------------------------------------

//         if (
//           chapterIds.length > 0
//         ) {
//           await tx.lesson.deleteMany({
//             where: {
//               chapterId: {
//                 in: chapterIds,
//               },
//             },
//           })

//           // ----------------------------------------------------
//           // DELETE CHAPTERS
//           // ----------------------------------------------------

//           await tx.chapter.deleteMany({
//             where: {
//               id: {
//                 in: chapterIds,
//               },
//             },
//           })
//         }

//         // ------------------------------------------------------
//         // DELETE COURSE
//         // ------------------------------------------------------

//         await tx.course.delete({
//           where: {
//             id,
//           },
//         })
//       }
//     )

//     // ==========================================================
//     // DELETE ALL FILES FROM S3
//     // ==========================================================

//     if (
//       keysToDelete.length > 0
//     ) {
//       const results =
//         await Promise.allSettled(
//           keysToDelete.map(
//             (key) =>
//               deleteS3Object(key)
//           )
//         )

//       const failedDeletes =
//         results.filter(
//           (result) =>
//             result.status ===
//             "rejected"
//         ).length

//       console.log(
//         "Course S3 cleanup:",
//         {
//           courseId: id,
//           totalFiles:
//             keysToDelete.length,
//           failedDeletes,
//         }
//       )
//     }

//     // ==========================================================
//     // RESPONSE
//     // ==========================================================

//     return NextResponse.json(
//       {
//         success: true,

//         message:
//           "تم حذف الكورس وجميع ملفاته بنجاح",

//         deletedFiles:
//           keysToDelete.length,
//       },
//       {
//         status: 200,
//       }
//     )
//   } catch (error) {
//     console.error(
//       "Delete course error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "حدث خطأ أثناء حذف الكورس",
//       },
//       {
//         status: 500,
//       }
//     )
//   }
// }