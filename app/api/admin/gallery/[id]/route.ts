
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
  }>
}

// ============================================================
// DELETE GALLERY IMAGE
// ============================================================

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    await requireAdmin()

    const { id } =
      await context.params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "معرف الصورة غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ========================================================
    // GET IMAGE
    // ========================================================

    const image =
      await prisma.galleryImage.findUnique({
        where: {
          id,
        },
      })

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: "الصورة غير موجودة",
        },
        {
          status: 404,
        }
      )
    }

    // ========================================================
    // SECURITY CHECK
    // ========================================================

    if (
      !image.key.startsWith(
        "courses/images/"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "غير مسموح بحذف هذا الملف",
        },
        {
          status: 403,
        }
      )
    }

    // ========================================================
    // DELETE FROM S3
    // ========================================================

    await s3.send(
      new DeleteObjectCommand({
        Bucket:
          env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
        Key: image.key,
      })
    )

    // ========================================================
    // DELETE FROM DATABASE
    // ========================================================

    await prisma.galleryImage.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "تم حذف الصورة بنجاح",
    })
  } catch (error) {
    console.error(
      "Gallery DELETE error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error: "فشل حذف الصورة",
      },
      {
        status: 500,
      }
    )
  }
}

