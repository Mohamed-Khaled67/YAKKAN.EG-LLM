// import { NextResponse } from "next/server"
// import { z } from "zod"
// import { PutObjectCommand } from "@aws-sdk/client-s3"
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
// import { v4 as uuidv4 } from "uuid"

// import { auth } from "@/lib/auth"
// import { s3 } from "@/lib/s3-client"
// import { env } from "@/lib/env"

// // ============================================================
// // CONSTANTS
// // ============================================================

// const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024

// const allowedImageTypes = [
//   "image/png",
//   "image/jpeg",
//   "image/webp",
// ] as const

// const allowedVideoTypes = [
//   "video/mp4",
//   "video/webm",
//   "video/quicktime",
// ] as const

// // ============================================================
// // SCHEMA
// // ============================================================

// const fileUploadSchema = z.object({
//   fileName: z
//     .string()
//     .min(
//       1,
//       "File name is required"
//     ),

//   contentType: z
//     .string()
//     .min(
//       1,
//       "Content type is required"
//     ),

//   size: z
//     .number()
//     .positive(
//       "File size is required"
//     ),

//   isImage: z.boolean(),
// })

// // ============================================================
// // POST /api/s3/upload
// // ============================================================

// export async function POST(
//   request: Request
// ) {
//   try {
//     // ========================================================
//     // AUTHENTICATION
//     // ========================================================

//     const session =
//       await auth.api.getSession({
//         headers: request.headers,
//       })

//     // ========================================================
//     // NOT LOGGED IN
//     // ========================================================

//     if (!session) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "يجب تسجيل الدخول أولاً",
//         },
//         {
//           status: 401,
//         }
//       )
//     }

//     // ========================================================
//     // ADMIN AUTHORIZATION
//     // ========================================================

//     if (
//       session.user.role !== "admin"
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "غير مصرح لك برفع الملفات",
//         },
//         {
//           status: 403,
//         }
//       )
//     }

//     // ========================================================
//     // READ BODY
//     // ========================================================

//     const body =
//       await request.json()

//     // ========================================================
//     // VALIDATE BODY
//     // ========================================================

//     const validation =
//       fileUploadSchema.safeParse(body)

//     if (!validation.success) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "بيانات الملف غير صحيحة",
//           details:
//             validation.error.flatten(),
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     const {
//       fileName,
//       contentType,
//       size,
//       isImage,
//     } = validation.data

//     // ========================================================
//     // CHECK FILE SIZE
//     // ========================================================

//     if (
//       size > MAX_FILE_SIZE
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "حجم الملف لا يمكن أن يتجاوز 1GB",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     // ========================================================
//     // CHECK FILE TYPE
//     // ========================================================

//     const allowedTypes =
//       isImage
//         ? allowedImageTypes
//         : allowedVideoTypes

//     if (
//       !allowedTypes.includes(
//         contentType as never
//       )
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "نوع الملف غير مسموح به",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     // ========================================================
//     // GENERATE SAFE FILE NAME
//     // ========================================================

//     const safeFileName =
//       fileName
//         .replace(
//           /[^a-zA-Z0-9._-]/g,
//           "-"
//         )
//         .replace(
//           /-+/g,
//           "-"
//         )

//     // ========================================================
//     // SELECT FOLDER
//     // ========================================================

//     const folder =
//       isImage
//         ? "courses/images"
//         : "courses/videos"

//     // ========================================================
//     // GENERATE UNIQUE KEY
//     // ========================================================

//     const key =
//       `${folder}/${uuidv4()}-${safeFileName}`

//     // ========================================================
//     // CREATE S3 COMMAND
//     // ========================================================

//     const command =
//       new PutObjectCommand({
//         Bucket:
//           env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

//         Key:
//           key,

//         ContentType:
//           contentType,

//         ContentLength:
//           size,
//       })

//     // ========================================================
//     // GENERATE PRESIGNED URL
//     // ========================================================

//     const presignedUrl =
//       await getSignedUrl(
//         s3,
//         command,
//         {
//           expiresIn:
//             60 * 6,
//         }
//       )

//     // ========================================================
//     // LOG
//     // ========================================================

//     console.log(
//       "S3 upload URL generated by admin:",
//       {
//         userId:
//           session.user.id,

//         email:
//           session.user.email,

//         key,
//         contentType,
//         size,
//       }
//     )

//     // ========================================================
//     // RESPONSE
//     // ========================================================

//     return NextResponse.json(
//       {
//         success: true,
//         presignedUrl,
//         key,
//       },
//       {
//         status: 200,
//       }
//     )
//   } catch (error) {
//     // ========================================================
//     // ERROR
//     // ========================================================

//     console.error(
//       "S3 upload error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           "فشل إنشاء رابط رفع الملف",
//       },
//       {
//         status: 500,
//       }
//     )
//   }
// }
























import { NextResponse } from "next/server"
import { z } from "zod"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from "uuid"

import { auth } from "@/lib/auth"
import { s3 } from "@/lib/s3-client"
import { env } from "@/lib/env"

// ============================================================
// CONSTANTS
// ============================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024

const allowedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const

const allowedVideoTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const

// ============================================================
// SCHEMA
// ============================================================

const fileUploadSchema = z.object({
  fileName: z
    .string()
    .min(1, "File name is required"),

  contentType: z
    .string()
    .min(1, "Content type is required"),

  size: z
    .number()
    .positive("File size is required"),

  isImage: z.boolean(),
})

// ============================================================
// POST /api/s3/upload
// ============================================================

export async function POST(request: Request) {
  try {
    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "يجب تسجيل الدخول أولاً",
        },
        { status: 401 }
      )
    }

    // ========================================================
    // ADMIN AUTHORIZATION
    // ========================================================

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "غير مصرح لك برفع الملفات",
        },
        { status: 403 }
      )
    }

    // ========================================================
    // READ + VALIDATE BODY
    // ========================================================

    const body = await request.json()
    const validation = fileUploadSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "بيانات الملف غير صحيحة",
          details: validation.error.flatten(),
        },
        { status: 400 }
      )
    }

    const {
      fileName,
      contentType,
      size,
      isImage,
    } = validation.data

    // ========================================================
    // CHECK FILE SIZE
    // ========================================================

    if (size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "حجم الملف لا يمكن أن يتجاوز 5GB",
        },
        { status: 400 }
      )
    }

    // ========================================================
    // CHECK FILE TYPE
    // ========================================================

    const allowedTypes = isImage
      ? allowedImageTypes
      : allowedVideoTypes

    if (!allowedTypes.includes(contentType as never)) {
      return NextResponse.json(
        {
          success: false,
          error: "نوع الملف غير مسموح به",
        },
        { status: 400 }
      )
    }

    // ========================================================
    // SAFE FILE NAME
    // ========================================================

    const safeFileName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")

    // ========================================================
    // SELECT FOLDER
    // ========================================================

    const folder = isImage
      ? "courses/images"
      : "courses/videos"

    // ========================================================
    // UNIQUE KEY
    // ========================================================

    const key = `${folder}/${uuidv4()}-${safeFileName}`

    // ========================================================
    // CREATE S3 COMMAND
    // ========================================================

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    })

    // ========================================================
    // PRESIGNED URL
    // ========================================================

    const presignedUrl = await getSignedUrl(
      s3,
      command,
      { expiresIn: 60 * 6 }
    )

    console.log(
      "S3 upload URL generated by admin:",
      {
        userId: session.user.id,
        email: session.user.email,
        key,
        contentType,
        size,
      }
    )

    return NextResponse.json(
      {
        success: true,
        presignedUrl,
        key,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("S3 upload error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "فشل إنشاء رابط رفع الملف",
      },
      { status: 500 }
    )
  }
}
