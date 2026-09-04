
// import { z } from "zod"

// // ============================================================
// // FILE CONFIG
// // ============================================================

// const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

// const ACCEPTED_FILE_TYPES = [
//   "image/png",
//   "image/jpeg",
//   "image/webp",
//   "video/mp4",
//   "video/webm",
//   "video/quicktime",
// ] as const

// // ============================================================
// // COURSE SCHEMA
// // ============================================================

// export const courseSchema = z.object({
//   // ==========================================================
//   // BASIC INFORMATION
//   // ==========================================================

//   title: z
//     .string()
//     .min(
//       3,
//       "عنوان الكورس يجب أن يكون 3 أحرف على الأقل"
//     )
//     .max(
//       100,
//       "عنوان الكورس يجب ألا يتجاوز 100 حرف"
//     ),

//   description: z
//     .string()
//     .max(
//       1000,
//       "الوصف يجب ألا يتجاوز 1000 حرف"
//     )
//     .optional(),

//   // ==========================================================
//   // MEDIA FILE
//   // ==========================================================

//   imageFile: z
//     .instanceof(File)
//     .optional()
//     .refine(
//       (file) => {
//         if (!file) return true

//         return file.size <= MAX_FILE_SIZE
//       },
//       {
//         message:
//           "حجم الملف يجب ألا يتجاوز 50MB",
//       }
//     )
//     .refine(
//       (file) => {
//         if (!file) return true

//         return ACCEPTED_FILE_TYPES.includes(
//           file.type as
//             (typeof ACCEPTED_FILE_TYPES)[number]
//         )
//       },
//       {
//         message:
//           "نوع الملف غير مدعوم. المسموح: PNG, JPEG, WEBP, MP4, WEBM, MOV",
//       }
//     ),

//   // ==========================================================
//   // PRICE
//   // ==========================================================

//   price: z
//     .coerce
//     .number()
//     .min(
//       0,
//       "السعر لا يمكن أن يكون أقل من صفر"
//     ),

//   // ==========================================================
//   // EDUCATION SYSTEM
//   // ==========================================================

//   educationType: z.enum([
//     "UNIVERSITY",
//     "SECONDARY",
//   ]),

//   academicLevel: z.enum([
//     "UNIVERSITY_LEVEL_1",
//     "UNIVERSITY_LEVEL_2",
//     "UNIVERSITY_LEVEL_3",
//     "UNIVERSITY_LEVEL_4",
//     "SECONDARY_GRADE_1",
//     "SECONDARY_GRADE_2",
//     "SECONDARY_GRADE_3",
//   ]),

//   semester: z.enum([
//     "FIRST",
//     "SECOND",
//   ]),

//   // ==========================================================
//   // SECONDARY TRACK
//   // ==========================================================

//   secondaryTrack: z
//     .enum([
//       "SCIENCE",
//       "LITERARY",
//       "SCIENCE_SCIENCES",
//       "SCIENCE_MATH",
//     ])
//     .optional(),

//   // ==========================================================
//   // SUBJECT
//   // ==========================================================

//   subject: z
//     .string()
//     .min(
//       1,
//       "اختر المادة"
//     ),

//   // ==========================================================
//   // COURSE LEVEL
//   // ==========================================================

//   courseLevel: z.enum([
//     "BEGINNER",
//     "INTERMEDIATE",
//     "ADVANCED",
//   ]),

//   // ==========================================================
//   // PUBLISH STATUS
//   // ==========================================================

//   isPublished: z.boolean(),
// })

// // ============================================================
// // TYPES
// // ============================================================

// export type CourseFormInput =
//   z.input<typeof courseSchema>

// export type CourseSchemaType =
//   z.output<typeof courseSchema>


// import { z } from "zod"

// // ============================================================
// // FILE CONFIG
// // ============================================================

// const MAX_FILE_SIZE = 50 * 1024 * 1024

// const ACCEPTED_FILE_TYPES = [
//   "image/png",
//   "image/jpeg",
//   "image/webp",
//   "video/mp4",
//   "video/webm",
//   "video/quicktime",
// ] as const

// // ============================================================
// // COURSE SCHEMA
// // ============================================================

// export const courseSchema = z.object({
//   title: z
//     .string()
//     .min(3, "عنوان الكورس يجب أن يكون 3 أحرف على الأقل")
//     .max(100, "عنوان الكورس يجب ألا يتجاوز 100 حرف"),

//   description: z
//     .string()
//     .max(1000, "الوصف يجب ألا يتجاوز 1000 حرف")
//     .optional(),

//   // الملف يستخدم داخل الفورم فقط
//   imageFile: z
//     .instanceof(File)
//     .optional()
//     .refine(
//       (file) => {
//         if (!file) return true
//         return file.size <= MAX_FILE_SIZE
//       },
//       {
//         message: "حجم الملف يجب ألا يتجاوز 50MB",
//       }
//     )
//     .refine(
//       (file) => {
//         if (!file) return true

//         return ACCEPTED_FILE_TYPES.includes(
//           file.type as (typeof ACCEPTED_FILE_TYPES)[number]
//         )
//       },
//       {
//         message:
//           "نوع الملف غير مدعوم. المسموح: PNG, JPEG, WEBP, MP4, WEBM, MOV",
//       }
//     ),

//   price: z
//     .coerce
//     .number()
//     .min(0, "السعر لا يمكن أن يكون أقل من صفر"),

//   educationType: z.enum([
//     "UNIVERSITY",
//     "SECONDARY",
//   ]),

//   academicLevel: z.enum([
//     "UNIVERSITY_LEVEL_1",
//     "UNIVERSITY_LEVEL_2",
//     "UNIVERSITY_LEVEL_3",
//     "UNIVERSITY_LEVEL_4",

//     "SECONDARY_GRADE_1",
//     "SECONDARY_GRADE_2",
//     "SECONDARY_GRADE_3",
//   ]),

//   semester: z.enum([
//     "FIRST",
//     "SECOND",
//   ]),

//   secondaryTrack: z
//     .enum([
//       "SCIENCE",
//       "LITERARY",
//       "SCIENCE_SCIENCES",
//       "SCIENCE_MATH",
//     ])
//     .optional(),

//   subject: z
//     .string()
//     .min(1, "اختر المادة"),

//   courseLevel: z.enum([
//     "BEGINNER",
//     "INTERMEDIATE",
//     "ADVANCED",
//   ]),

//   isPublished: z.boolean(),
// })

// // ============================================================
// // TYPES
// // ============================================================

// export type CourseFormInput =
//   z.input<typeof courseSchema>

// export type CourseSchemaType =
//   z.output<typeof courseSchema>









import { z } from "zod"

// ============================================================
// COURSE SCHEMA
// ============================================================

export const courseSchema = z.object({
  // ==========================================================
  // BASIC INFORMATION
  // ==========================================================

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
    .optional(),

  // ==========================================================
  // MEDIA
  // ==========================================================

  mediaFile: z
    .custom<File>(
      (value) => {
        if (
          typeof File === "undefined"
        ) {
          return false
        }

        return value instanceof File
      },
      {
        message:
          "يجب اختيار صورة أو فيديو للكورس",
      }
    )
    .optional(),

  // ==========================================================
  // PRICE
  // ==========================================================

  price: z
    .number()
    .min(
      0,
      "السعر لا يمكن أن يكون أقل من صفر"
    ),

  // ==========================================================
  // EDUCATION
  // ==========================================================

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

  // ==========================================================
  // SECONDARY TRACK
  // ==========================================================

  secondaryTrack: z
    .enum([
      "SCIENCE",
      "LITERARY",
      "SCIENCE_SCIENCES",
      "SCIENCE_MATH",
    ])
    .optional(),

  // ==========================================================
  // SUBJECT
  // ==========================================================

  subject: z
    .string()
    .min(
      1,
      "اختر المادة"
    ),

  // ==========================================================
  // COURSE LEVEL
  // ==========================================================

  courseLevel: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
  ]),

  // ==========================================================
  // PUBLISH
  // ==========================================================

  isPublished: z.boolean(),
})

// ============================================================
// TYPES
// ============================================================

export type CourseFormInput =
  z.input<typeof courseSchema>

export type CourseSchemaType =
  z.output<typeof courseSchema>