


// import { NextResponse } from "next/server"
// import { DeleteObjectCommand } from "@aws-sdk/client-s3"

// import { auth } from "@/lib/auth"
// import { env } from "@/lib/env"
// import { s3 } from "@/lib/s3-client"

// // ============================================================
// // DELETE /api/s3/delete
// // ============================================================

// export async function DELETE(
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
//             "غير مصرح لك بحذف الملفات",
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

//     const key =
//       body?.key

//     // ========================================================
//     // VALIDATE KEY
//     // ========================================================

//     if (
//       !key ||
//       typeof key !== "string"
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "مفتاح الملف غير موجود أو غير صحيح",
//         },
//         {
//           status: 400,
//         }
//       )
//     }

//     // ========================================================
//     // SECURITY CHECK
//     // ========================================================

//     /*
//       الملفات التي يديرها هذا الـ API
//       يجب أن تكون داخل مجلد courses فقط.

//       هذا يمنع استخدام endpoint
//       لحذف أي object آخر من الـ bucket.
//     */

//     if (
//       !key.startsWith(
//         "courses/"
//       )
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             "غير مسموح بحذف هذا الملف",
//         },
//         {
//           status: 403,
//         }
//       )
//     }

//     // ========================================================
//     // DELETE FROM S3
//     // ========================================================

//     const command =
//       new DeleteObjectCommand({
//         Bucket:
//           env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,

//         Key:
//           key,
//       })

//     await s3.send(
//       command
//     )

//     // ========================================================
//     // LOG
//     // ========================================================

//     console.log(
//       "S3 file deleted by admin:",
//       {
//         userId:
//           session.user.id,

//         email:
//           session.user.email,

//         key,
//       }
//     )

//     // ========================================================
//     // RESPONSE
//     // ========================================================

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "تم حذف الملف بنجاح",
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
//       "S3 delete error:",
//       error
//     )

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           "فشل حذف الملف من التخزين",
//       },
//       {
//         status: 500,
//       }
//     )
//   }
// }

























import { NextResponse } from "next/server"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"

import { auth } from "@/lib/auth"
import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

// ============================================================
// DELETE /api/s3/delete
// ============================================================

export async function DELETE(request: Request) {
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
          error: "غير مصرح لك بحذف الملفات",
        },
        { status: 403 }
      )
    }

    // ========================================================
    // READ BODY
    // ========================================================

    const body = await request.json()
    const key = body?.key

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "مفتاح الملف غير موجود أو غير صحيح",
        },
        { status: 400 }
      )
    }

    // ========================================================
    // SECURITY CHECK
    // ========================================================

    if (!key.startsWith("courses/")) {
      return NextResponse.json(
        {
          success: false,
          error: "غير مسموح بحذف هذا الملف",
        },
        { status: 403 }
      )
    }

    // ========================================================
    // DELETE FROM S3
    // ========================================================

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    })

    await s3.send(command)

    console.log(
      "S3 file deleted by admin:",
      {
        userId: session.user.id,
        email: session.user.email,
        key,
      }
    )

    return NextResponse.json(
      {
        success: true,
        message: "تم حذف الملف بنجاح",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("S3 delete error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "فشل حذف الملف من التخزين",
      },
      { status: 500 }
    )
  }
}
