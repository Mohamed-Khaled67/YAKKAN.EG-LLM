import { NextResponse } from "next/server"
import {
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/require-admin"
import { s3 } from "@/lib/s3-client"
import { env } from "@/lib/env"

// ============================================================
// GET GALLERY IMAGES
// ============================================================

export async function GET() {
  try {
    await requireAdmin()

    const images =
      await prisma.galleryImage.findMany({
        orderBy: {
          createdAt: "desc",
        },
      })

    const imagesWithUrls =
      await Promise.all(
        images.map(async (image) => {
          try {
            const signedUrl =
              await getSignedUrl(
                s3,
                new GetObjectCommand({
                  Bucket:
                    env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
                  Key: image.key,
                }),
                {
                  expiresIn: 60 * 60,
                }
              )

            return {
              ...image,
              url: signedUrl,
            }
          } catch (error) {
            console.error(
              `Failed to generate URL for ${image.key}:`,
              error
            )

            return {
              ...image,
              url: "",
            }
          }
        })
      )

    return NextResponse.json({
      success: true,
      images: imagesWithUrls,
    })
  } catch (error) {
    console.error(
      "Gallery GET error:",
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

// ============================================================
// CREATE GALLERY IMAGE
// ============================================================

export async function POST(
  request: Request
) {
  try {
    await requireAdmin()

    const body = await request.json()

    const key =
      typeof body.key === "string"
        ? body.key.trim()
        : ""

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : ""

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          error: "مفتاح الصورة غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "تصنيف الصورة غير موجود",
        },
        {
          status: 400,
        }
      )
    }

    // ----------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------

    const image =
      await prisma.galleryImage.create({
        data: {
          key,
          url: "",
          category,
        },
      })

    // ----------------------------------------------------------
    // GENERATE URL FOR RESPONSE
    // ----------------------------------------------------------

    const signedUrl =
      await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket:
            env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
          Key: image.key,
        }),
        {
          expiresIn: 60 * 60,
        }
      )

    return NextResponse.json(
      {
        success: true,
        image: {
          ...image,
          url: signedUrl,
        },
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "Gallery POST error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error: "فشل إضافة الصورة للمعرض",
      },
      {
        status: 500,
      }
    )
  }
}