
import { NextResponse } from "next/server"

import { z } from "zod"

import { GetObjectCommand } from "@aws-sdk/client-s3"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { auth } from "@/lib/auth"

import { prisma } from "@/lib/db"

import { env } from "@/lib/env"

import { s3 } from "@/lib/s3-client"

// ============================================================
// SUBJECT ARABIC NAMES
// ============================================================

const SUBJECT_NAMES: Record<string, string> = {
  arabic: "اللغة العربية",
  english: "اللغة الإنجليزية",
  french: "اللغة الفرنسية",
  german: "اللغة الألمانية",
  mathematics: "الرياضيات",
  math: "الرياضيات",
  physics: "الفيزياء",
  chemistry: "الكيمياء",
  biology: "الأحياء",
  geology: "الجيولوجيا",
  history: "التاريخ",
  geography: "الجغرافيا",
  philosophy: "الفلسفة",
  sociology: "علم الاجتماع",
  computer: "الحاسب الآلي",
  "computer-science": "علوم الحاسب",
  programming: "البرمجة",
  accounting: "المحاسبة",
  "financial-accounting": "المحاسبة المالية",
  economics: "الاقتصاد",
  statistics: "الإحصاء",
  science: "العلوم",
  religious: "التربية الدينية",
  religion: "التربية الدينية",
}

// ============================================================
// ARABIC LABELS
// ============================================================

const COURSE_LEVEL_NAMES: Record<string, string> = {
  BEGINNER: "مبتدئ",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم",
}

const EDUCATION_TYPE_NAMES: Record<string, string> = {
  UNIVERSITY: "جامعي",
  SECONDARY: "ثانوي",
}

const ACADEMIC_LEVEL_NAMES: Record<string, string> = {
  UNIVERSITY_LEVEL_1: "الفرقة الأولى",
  UNIVERSITY_LEVEL_2: "الفرقة الثانية",
  UNIVERSITY_LEVEL_3: "الفرقة الثالثة",
  UNIVERSITY_LEVEL_4: "الفرقة الرابعة",
  SECONDARY_GRADE_1: "الصف الأول الثانوي",
  SECONDARY_GRADE_2: "الصف الثاني الثانوي",
  SECONDARY_GRADE_3: "الصف الثالث الثانوي",
}

const SEMESTER_NAMES: Record<string, string> = {
  FIRST: "الترم الأول",
  SECOND: "الترم الثاني",
}

const SECONDARY_TRACK_NAMES: Record<string, string> = {
  SCIENCE: "علمي علوم",
  LITERARY: "أدبي",
  SCIENCE_SCIENCES: "علمي علوم",
  SCIENCE_MATH: "علمي رياضة",
}

// ============================================================
// CREATE COURSE SCHEMA
// ============================================================

const createCourseSchema = z.object({
  title: z
    .string()
    .min(
      3,
      "عنوان الكورس يجب أن يكون 3 أحرف على الأقل"
    )
    .max(
      100,
      "عنوان الكورس يجب ألا يتجاوز 100 حرف"
    ),

  description: z
    .string()
    .max(
      1000,
      "الوصف يجب ألا يتجاوز 1000 حرف"
    )
    .nullable()
    .optional(),

  mediaKey: z
    .string()
    .min(
      1,
      "ملف الكورس غير موجود"
    ),

  mediaType: z.enum([
    "IMAGE",
    "VIDEO",
  ]),

  mediaUrl: z
    .string()
    .url()
    .nullable()
    .optional(),

  price: z
    .number()
    .min(
      0,
      "السعر لا يمكن أن يكون أقل من صفر"
    ),

  educationType: z.enum([
    "UNIVERSITY",
    "SECONDARY",
  ]),

  academicLevel: z.enum([
    "UNIVERSITY_LEVEL_1",
    "UNIVERSITY_LEVEL_2",
    "UNIVERSITY_LEVEL_3",
    "UNIVERSITY_LEVEL_4",
    "SECONDARY_GRADE_1",
    "SECONDARY_GRADE_2",
    "SECONDARY_GRADE_3",
  ]),

  semester: z.enum([
    "FIRST",
    "SECOND",
  ]),

  secondaryTrack: z
    .enum([
      "SCIENCE",
      "LITERARY",
      "SCIENCE_SCIENCES",
      "SCIENCE_MATH",
    ])
    .nullable()
    .optional(),

  subjectId: z
    .string()
    .min(
      1,
      "اختر المادة"
    ),

  level: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
  ]),

  isPublished: z.boolean(),
})

// ============================================================
// REMOVE HTML
// ============================================================

function stripHtml(
  html: string | null | undefined
) {
  if (!html) {
    return ""
  }

  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?p>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
}

// ============================================================
// CREATE S3 SIGNED URL
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
    const command =
      new GetObjectCommand({
        Bucket:
          env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
        Key: mediaKey,
      })

    const signedUrl =
      await getSignedUrl(
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
// GET /api/courses
// ============================================================

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url)

    const search =
      searchParams
        .get("search")
        ?.trim() || ""

    const subjectId =
      searchParams.get(
        "subjectId"
      ) || ""

    const level =
      searchParams.get(
        "level"
      ) || ""

    // ========================================================
    // EDUCATION TYPE
    // ========================================================

    const educationType =
      searchParams.get(
        "educationType"
      ) || ""

    const validEducationTypes = [
      "UNIVERSITY",
      "SECONDARY",
    ] as const

    const selectedEducationType =
      validEducationTypes.includes(
        educationType as (typeof validEducationTypes)[number]
      )
        ? (educationType as (typeof validEducationTypes)[number])
        : undefined

    // ========================================================
    // VALID LEVEL
    // ========================================================

    const validLevels = [
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED",
    ] as const

    const selectedLevel =
      validLevels.includes(
        level as (typeof validLevels)[number]
      )
        ? (level as (typeof validLevels)[number])
        : undefined

    // ========================================================
    // FETCH COURSES
    // ========================================================

    const courses =
      await prisma.course.findMany({
        where: {
          isPublished: true,

          ...(subjectId
            ? {
                subjectId,
              }
            : {}),

          ...(selectedLevel
            ? {
                level:
                  selectedLevel,
              }
            : {}),

          // ==================================================
          // EDUCATION FILTER
          // ==================================================

          ...(selectedEducationType
            ? {
                educationType:
                  selectedEducationType,
              }
            : {}),
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          title: true,
          description: true,
          mediaUrl: true,
          mediaKey: true,
          mediaType: true,
          price: true,
          level: true,
          educationType: true,
          academicLevel: true,
          semester: true,
          secondaryTrack: true,
          isPublished: true,
          createdAt: true,

          subject: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },

          chapters: {
            select: {
              id: true,

              lessons: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })

    // ========================================================
    // FORMAT COURSES
    // ========================================================

    const formattedCourses =
      await Promise.all(
        courses.map(
          async (course) => {
            // ==================================================
            // SUBJECT
            // ==================================================

            const subjectName =
              SUBJECT_NAMES[
                course.subject.code
              ] ||
              course.subject.name

            // ==================================================
            // COUNTS
            // ==================================================

            const chaptersCount =
              course.chapters.length

            const lessonsCount =
              course.chapters.reduce(
                (
                  total,
                  chapter
                ) =>
                  total +
                  chapter.lessons.length,
                0
              )

            // ==================================================
            // MEDIA URL
            // ==================================================

            const generatedMediaUrl =
              await getMediaUrl(
                course.mediaKey,
                course.mediaType
              )

            // ==================================================
            // RETURN
            // ==================================================

            return {
              id:
                course.id,

              title:
                course.title,

              description:
                stripHtml(
                  course.description
                ),

              // IMPORTANT:
              // CourseCard uses mediaUrl

              mediaUrl:
                generatedMediaUrl ??
                course.mediaUrl ??
                null,

              mediaKey:
                course.mediaKey,

              mediaType:
                course.mediaType,

              price:
                Number(course.price),

              // IMPORTANT:
              // Keep original enum

              level:
                course.level,

              levelLabel:
                COURSE_LEVEL_NAMES[
                  course.level
                ] ||
                course.level,

              educationType:
                course.educationType,

              educationTypeLabel:
                EDUCATION_TYPE_NAMES[
                  course.educationType
                ] ||
                course.educationType,

              academicLevel:
                course.academicLevel,

              academicLevelLabel:
                ACADEMIC_LEVEL_NAMES[
                  course.academicLevel
                ] ||
                course.academicLevel,

              semester:
                course.semester,

              semesterLabel:
                SEMESTER_NAMES[
                  course.semester
                ] ||
                course.semester,

              secondaryTrack:
                course.secondaryTrack,

              secondaryTrackLabel:
                course.secondaryTrack
                  ? SECONDARY_TRACK_NAMES[
                      course.secondaryTrack
                    ] ||
                    course.secondaryTrack
                  : null,

              subject: {
                id:
                  course.subject.id,

                name:
                  subjectName,

                code:
                  course.subject.code,
              },

              chaptersCount,

              lessonsCount,
            }
          }
        )
      )

    // ========================================================
    // SEARCH
    // ========================================================

    const filteredCourses =
      search
        ? formattedCourses.filter(
            (course) => {
              const normalizedSearch =
                search.toLocaleLowerCase(
                  "ar"
                )

              const title =
                course.title
                  .toLocaleLowerCase(
                    "ar"
                  )

              const description =
                course.description
                  .toLocaleLowerCase(
                    "ar"
                  )

              const subject =
                course.subject.name
                  .toLocaleLowerCase(
                    "ar"
                  )

              return (
                title.includes(
                  normalizedSearch
                ) ||
                description.includes(
                  normalizedSearch
                ) ||
                subject.includes(
                  normalizedSearch
                )
              )
            }
          )
        : formattedCourses

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        courses:
          filteredCourses,

        count:
          filteredCourses.length,
      },

      {
        status: 200,
      }
    )
  } catch (error) {
    console.error(
      "GET /api/courses error:",
      error
    )

    return NextResponse.json(
      {
        success: false,

        error:
          "حدث خطأ أثناء جلب الكورسات",
      },

      {
        status: 500,
      }
    )
  }
}

// ============================================================
// POST /api/courses
// ADMIN ONLY
// ============================================================

export async function POST(
  request: Request
) {
  try {
    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const session =
      await auth.api.getSession({
        headers:
          request.headers,
      })

    if (!session) {
      return NextResponse.json(
        {
          success: false,

          error:
            "يجب تسجيل الدخول أولاً",
        },

        {
          status: 401,
        }
      )
    }

    // ========================================================
    // ADMIN
    // ========================================================

    if (
      session.user.role !==
      "admin"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "غير مصرح لك بتنفيذ هذا الإجراء",
        },

        {
          status: 403,
        }
      )
    }

    // ========================================================
    // BODY
    // ========================================================

    const body =
      await request.json()

    console.log(
      "Create course body:",
      body
    )

    // ========================================================
    // VALIDATION
    // ========================================================

    const validation =
      createCourseSchema.safeParse(
        body
      )

    if (
      !validation.success
    ) {
      console.error(
        "Create course validation error:",
        validation.error.flatten()
      )

      return NextResponse.json(
        {
          success: false,

          error:
            "بيانات الكورس غير صحيحة",

          details:
            validation.error.flatten(),
        },

        {
          status: 400,
        }
      )
    }

    const data =
      validation.data

    // ========================================================
    // SECONDARY TRACK VALIDATION
    // ========================================================

    const requiresTrack =
      data.educationType ===
        "SECONDARY" &&
      (
        data.academicLevel ===
          "SECONDARY_GRADE_2" ||
        data.academicLevel ===
          "SECONDARY_GRADE_3"
      )

    if (
      requiresTrack &&
      !data.secondaryTrack
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "يجب اختيار الشعبة",
        },

        {
          status: 400,
        }
      )
    }

    // ========================================================
    // SUBJECT
    // ========================================================

    let subject =
      await prisma.subject.findUnique(
        {
          where: {
            code:
              data.subjectId,
          },
        }
      )

    // ========================================================
    // CREATE SUBJECT
    // ========================================================

    if (!subject) {
      const arabicName =
        SUBJECT_NAMES[
          data.subjectId
        ] ||
        data.subjectId

      subject =
        await prisma.subject.create(
          {
            data: {
              code:
                data.subjectId,

              name:
                arabicName,
            },
          }
        )
    }

    // ========================================================
    // CREATE COURSE
    // ========================================================

    const course =
      await prisma.course.create({
        data: {
          title:
            data.title,

          description:
            data.description ??
            null,

          mediaKey:
            data.mediaKey,

          mediaType:
            data.mediaType,

          mediaUrl:
            data.mediaUrl ??
            null,

          price:
            data.price,

          educationType:
            data.educationType,

          academicLevel:
            data.academicLevel,

          semester:
            data.semester,

          secondaryTrack:
            data.secondaryTrack ??
            null,

          subjectId:
            subject.id,

          level:
            data.level,

          isPublished:
            data.isPublished,
        },

        include: {
          subject: true,
        },
      })

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "تم إنشاء الكورس بنجاح",

        course,
      },

      {
        status: 201,
      }
    )
  } catch (error) {
    console.error(
      "Create course error:",
      error
    )

    // ========================================================
    // UNIQUE ERROR
    // ========================================================

    if (
      error &&
      typeof error ===
        "object" &&
      "code" in error &&
      error.code ===
        "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,

          error:
            "هذه المادة موجودة بالفعل",
        },

        {
          status: 409,
        }
      )
    }

    return NextResponse.json(
      {
        success: false,

        error:
          "حدث خطأ أثناء إنشاء الكورس",
      },

      {
        status: 500,
      }
    )
  }
}










































































