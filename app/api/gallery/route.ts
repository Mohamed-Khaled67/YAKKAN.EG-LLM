import { NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { prisma } from "@/lib/db"
import { s3 } from "@/lib/s3-client"
import { env } from "@/lib/env"

// ============================================================
// GET PUBLIC GALLERY IMAGES
// ============================================================

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        try {
          const signedUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({
              Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
              Key: image.key,
            }),
            {
              expiresIn: 60 * 60,
            }
          )

          return {
            id: image.id,
            key: image.key,
            category: image.category,
            createdAt: image.createdAt,
            url: signedUrl,
          }
        } catch (error) {
          console.error(
            `Failed to generate URL for ${image.key}:`,
            error
          )

          return null
        }
      })
    )

    const validImages = imagesWithUrls.filter(
      (image): image is NonNullable<typeof image> =>
        image !== null
    )

    return NextResponse.json({
      success: true,
      images: validImages,
    })
  } catch (error) {
    console.error(
      "Public gallery GET error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error: "فشل جلب صور المعرض",
      },
      {
        status: 500,
      }
    )
  }
}