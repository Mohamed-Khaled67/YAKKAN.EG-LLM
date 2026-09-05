


















// import Link from "next/link"
// import { notFound } from "next/navigation"
// import { headers } from "next/headers"

// import {
//   ArrowRight,
//   BookOpen,
//   CheckCircle2,
//   Clock3,
//   GraduationCap,
//   Layers3,
//   Lock,
//   PlayCircle,
//   ShoppingCart,
//   Sparkles,
// } from "lucide-react"

// import { GetObjectCommand } from "@aws-sdk/client-s3"
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// import EnrollButton from "@/components/enroll-button"

// import { prisma } from "@/lib/db"
// import { auth } from "@/lib/auth"
// import { env } from "@/lib/env"
// import { s3 } from "@/lib/s3-client"

// // ============================================================
// // LABELS
// // ============================================================

// const SUBJECT_NAMES: Record<string, string> = {
//   arabic: "اللغة العربية",
//   english: "اللغة الإنجليزية",
//   french: "اللغة الفرنسية",
//   german: "اللغة الألمانية",
//   mathematics: "الرياضيات",
//   math: "الرياضيات",
//   physics: "الفيزياء",
//   chemistry: "الكيمياء",
//   biology: "الأحياء",
//   geology: "الجيولوجيا",
//   history: "التاريخ",
//   geography: "الجغرافيا",
//   philosophy: "الفلسفة",
//   sociology: "علم الاجتماع",
//   computer: "الحاسب الآلي",
//   "computer-science": "علوم الحاسب",
//   programming: "البرمجة",
//   accounting: "المحاسبة",
//   "financial-accounting": "المحاسبة المالية",
//   economics: "الاقتصاد",
//   statistics: "الإحصاء",
//   science: "العلوم",
//   religious: "التربية الدينية",
//   religion: "التربية الدينية",
// }

// const COURSE_LEVEL_NAMES: Record<string, string> = {
//   BEGINNER: "مبتدئ",
//   INTERMEDIATE: "متوسط",
//   ADVANCED: "متقدم",
// }

// const EDUCATION_TYPE_NAMES: Record<string, string> = {
//   UNIVERSITY: "جامعي",
//   SECONDARY: "ثانوي",
// }

// const ACADEMIC_LEVEL_NAMES: Record<string, string> = {
//   UNIVERSITY_LEVEL_1: "الفرقة الأولى",
//   UNIVERSITY_LEVEL_2: "الفرقة الثانية",
//   UNIVERSITY_LEVEL_3: "الفرقة الثالثة",
//   UNIVERSITY_LEVEL_4: "الفرقة الرابعة",
//   SECONDARY_GRADE_1: "الصف الأول الثانوي",
//   SECONDARY_GRADE_2: "الصف الثاني الثانوي",
//   SECONDARY_GRADE_3: "الصف الثالث الثانوي",
// }

// const SEMESTER_NAMES: Record<string, string> = {
//   FIRST: "الترم الأول",
//   SECOND: "الترم الثاني",
// }

// const SECONDARY_TRACK_NAMES: Record<string, string> = {
//   SCIENCE: "علمي علوم",
//   LITERARY: "أدبي",
//   SCIENCE_SCIENCES: "علمي علوم",
//   SCIENCE_MATH: "علمي رياضة",
// }

// // ============================================================
// // HELPERS
// // ============================================================

// function stripHtml(value: string | null) {
//   if (!value) {
//     return ""
//   }

//   return value
//     .replace(/<br\s*\/?>/gi, " ")
//     .replace(/<\/p>/gi, " ")
//     .replace(/<[^>]*>/g, "")
//     .replace(/&nbsp;/gi, " ")
//     .replace(/&amp;/gi, "&")
//     .replace(/&lt;/gi, "<")
//     .replace(/&gt;/gi, ">")
//     .replace(/&quot;/gi, '"')
//     .replace(/&#39;/gi, "'")
//     .replace(/\s+/g, " ")
//     .trim()
// }

// // ============================================================
// // S3 MEDIA URL
// // ============================================================

// async function getMediaUrl(mediaKey: string | null) {
//   if (!mediaKey) {
//     return null
//   }

//   try {
//     const command = new GetObjectCommand({
//       Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
//       Key: mediaKey,
//     })

//     return await getSignedUrl(s3, command, {
//       expiresIn: 60 * 60,
//     })
//   } catch (error) {
//     console.error(
//       "Failed to generate course media URL:",
//       error
//     )

//     return null
//   }
// }

// // ============================================================
// // DURATION
// // ============================================================

// function formatDuration(seconds: number | null) {
//   if (!seconds || seconds <= 0) {
//     return null
//   }

//   const minutes = Math.floor(seconds / 60)
//   const remainingSeconds = seconds % 60

//   if (minutes >= 60) {
//     const hours = Math.floor(minutes / 60)
//     const remainingMinutes = minutes % 60

//     return `${hours}:${String(
//       remainingMinutes
//     ).padStart(2, "0")}:${String(
//       remainingSeconds
//     ).padStart(2, "0")}`
//   }

//   return `${minutes}:${String(
//     remainingSeconds
//   ).padStart(2, "0")}`
// }

// // ============================================================
// // PAGE
// // ============================================================

// export default async function CourseDetailsPage({
//   params,
// }: {
//   params: Promise<{
//     id: string
//   }>
// }) {
//   const { id } = await params

//   // ==========================================================
//   // AUTHENTICATION
//   //
//   // المستخدم ممكن يشوف صفحة الكورس بدون تسجيل دخول.
//   // لذلك لو مفيش session نكمل عادي.
//   // ==========================================================

//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })

//   const userId = session?.user?.id ?? null

//   // ==========================================================
//   // FETCH COURSE
//   // ==========================================================

//   const course = await prisma.course.findFirst({
//     where: {
//       id,
//       isPublished: true,
//     },

//     include: {
//       subject: true,

//       chapters: {
//         orderBy: {
//           position: "asc",
//         },

//         include: {
//           lessons: {
//             orderBy: {
//               position: "asc",
//             },

//             select: {
//               id: true,
//               title: true,
//               description: true,
//               position: true,
//               duration: true,
//               isFree: true,
//             },
//           },
//         },
//       },
//     },
//   })

//   // ==========================================================
//   // NOT FOUND
//   // ==========================================================

//   if (!course) {
//     notFound()
//   }

//   // ==========================================================
//   // CHECK ENROLLMENT
//   //
//   // مهم جدًا:
//   //
//   // لو الطالب عامل Enrollment للكورس:
//   //
//   // isEnrolled = true
//   //
//   // وبالتالي كل الدروس المدفوعة تفتح له.
//   // ==========================================================

//   const enrollment = userId
//     ? await prisma.enrollment.findUnique({
//         where: {
//           userId_courseId: {
//             userId,
//             courseId: course.id,
//           },
//         },

//         select: {
//           id: true,
//         },
//       })
//     : null

//   const isEnrolled = Boolean(enrollment)

//   // ==========================================================
//   // ACCESS RULE
//   //
//   // Free lesson:
//   //     مفتوح دائمًا
//   //
//   // Enrolled:
//   //     كل الدروس مفتوحة
//   //
//   // Not enrolled:
//   //     الدروس المدفوعة مغلقة
//   // ==========================================================

//   const canAccessLesson = (isFree: boolean) => {
//     return isFree || isEnrolled || course.price === 0
//   }

//   // ==========================================================
//   // MEDIA
//   // ==========================================================

//   const mediaUrl = await getMediaUrl(course.mediaKey)

//   // ==========================================================
//   // COUNTS
//   // ==========================================================

//   const chaptersCount = course.chapters.length

//   const lessonsCount = course.chapters.reduce(
//     (total, chapter) =>
//       total + chapter.lessons.length,
//     0
//   )

//   const freeLessonsCount = course.chapters.reduce(
//     (total, chapter) =>
//       total +
//       chapter.lessons.filter(
//         (lesson) => lesson.isFree
//       ).length,
//     0
//   )

//   const lockedLessonsCount = course.chapters.reduce(
//     (total, chapter) =>
//       total +
//       chapter.lessons.filter(
//         (lesson) =>
//           !canAccessLesson(lesson.isFree)
//       ).length,
//     0
//   )

//   // ==========================================================
//   // LABELS
//   // ==========================================================

//   const subjectName =
//     SUBJECT_NAMES[course.subject.code] ||
//     course.subject.name

//   const levelName =
//     COURSE_LEVEL_NAMES[course.level] ||
//     course.level

//   const educationTypeName =
//     EDUCATION_TYPE_NAMES[course.educationType] ||
//     course.educationType

//   const academicLevelName =
//     ACADEMIC_LEVEL_NAMES[course.academicLevel] ||
//     course.academicLevel

//   const semesterName =
//     SEMESTER_NAMES[course.semester] ||
//     course.semester

//   const secondaryTrackName =
//     course.secondaryTrack
//       ? SECONDARY_TRACK_NAMES[
//           course.secondaryTrack
//         ] || course.secondaryTrack
//       : null

//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (
//     <main
//       dir="rtl"
//       className="min-h-screen bg-background"
//     >
//       {/* ======================================================
//           TOP NAV
//       ====================================================== */}

//       <section className="border-b border-border bg-muted/[0.12]">
//         <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
//           <Link
//             href="/courses"
//             className="
//               group
//               inline-flex
//               items-center
//               gap-2
//               rounded-xl
//               px-2
//               py-1.5
//               text-sm
//               font-bold
//               text-muted-foreground
//               transition-all
//               hover:bg-red-500/10
//               hover:text-red-500
//             "
//           >
//             <ArrowRight
//               className="
//                 size-4
//                 transition-transform
//                 group-hover:-translate-x-1
//               "
//             />

//             العودة إلى الكورسات
//           </Link>
//         </div>
//       </section>

//       {/* ======================================================
//           HERO
//       ====================================================== */}

//       <section className="relative overflow-hidden">
//         {/* Decorative background */}

//         <div
//           className="
//             pointer-events-none
//             absolute
//             -right-32
//             -top-32
//             size-96
//             rounded-full
//             bg-red-500/[0.06]
//             blur-3xl
//           "
//         />

//         <div
//           className="
//             pointer-events-none
//             absolute
//             -left-32
//             bottom-0
//             size-96
//             rounded-full
//             bg-red-500/[0.04]
//             blur-3xl
//           "
//         />

//         <div
//           className="
//             relative
//             mx-auto
//             grid
//             max-w-7xl
//             gap-10
//             px-5
//             py-8
//             sm:px-8
//             lg:grid-cols-[1.2fr_0.8fr]
//             lg:gap-14
//             lg:py-14
//           "
//         >
//           {/* ==================================================
//               COURSE INFO
//           ================================================== */}

//           <div className="flex flex-col justify-center">
//             {/* Subject */}

//             <div
//               className="
//                 mb-5
//                 inline-flex
//                 w-fit
//                 items-center
//                 gap-2
//                 rounded-full
//                 border
//                 border-red-500/10
//                 bg-red-500/10
//                 px-3.5
//                 py-2
//                 text-xs
//                 font-black
//                 text-red-500
//               "
//             >
//               <BookOpen className="size-3.5" />

//               {subjectName}
//             </div>

//             {/* Title */}

//             <h1
//               className="
//                 max-w-4xl
//                 text-3xl
//                 font-black
//                 leading-[1.25]
//                 tracking-tight
//                 sm:text-4xl
//                 lg:text-5xl
//               "
//             >
//               {course.title}
//             </h1>

//             {/* Description */}

//             {course.description && (
//               <p
//                 className="
//                   mt-5
//                   max-w-3xl
//                   text-sm
//                   leading-8
//                   text-muted-foreground
//                   sm:text-base
//                 "
//               >
//                 {stripHtml(course.description)}
//               </p>
//             )}

//             {/* Meta */}

//             <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
//               {/* Level */}

//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-2
//                   rounded-2xl
//                   border
//                   border-border
//                   bg-background
//                   px-4
//                   py-3
//                   text-xs
//                   font-bold
//                   shadow-sm
//                 "
//               >
//                 <Clock3 className="size-4 shrink-0 text-red-500" />

//                 {levelName}
//               </div>

//               {/* Education */}

//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-2
//                   rounded-2xl
//                   border
//                   border-border
//                   bg-background
//                   px-4
//                   py-3
//                   text-xs
//                   font-bold
//                   shadow-sm
//                 "
//               >
//                 <GraduationCap className="size-4 shrink-0 text-red-500" />

//                 {educationTypeName}
//               </div>

//               {/* Chapters */}

//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-2
//                   rounded-2xl
//                   border
//                   border-border
//                   bg-background
//                   px-4
//                   py-3
//                   text-xs
//                   font-bold
//                   shadow-sm
//                 "
//               >
//                 <Layers3 className="size-4 shrink-0 text-red-500" />

//                 {chaptersCount} فصل
//               </div>

//               {/* Lessons */}

//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-2
//                   rounded-2xl
//                   border
//                   border-border
//                   bg-background
//                   px-4
//                   py-3
//                   text-xs
//                   font-bold
//                   shadow-sm
//                 "
//               >
//                 <PlayCircle className="size-4 shrink-0 text-red-500" />

//                 {lessonsCount} درس
//               </div>
//             </div>

//             {/* Academic Information */}

//             <div className="mt-4 flex flex-wrap gap-2">
//               <span
//                 className="
//                   rounded-xl
//                   border
//                   border-border
//                   bg-muted
//                   px-3
//                   py-2
//                   text-xs
//                   font-bold
//                   text-muted-foreground
//                 "
//               >
//                 {academicLevelName}
//               </span>

//               <span
//                 className="
//                   rounded-xl
//                   border
//                   border-border
//                   bg-muted
//                   px-3
//                   py-2
//                   text-xs
//                   font-bold
//                   text-muted-foreground
//                 "
//               >
//                 {semesterName}
//               </span>

//               {secondaryTrackName && (
//                 <span
//                   className="
//                     rounded-xl
//                     border
//                     border-border
//                     bg-muted
//                     px-3
//                     py-2
//                     text-xs
//                     font-bold
//                     text-muted-foreground
//                   "
//                 >
//                   {secondaryTrackName}
//                 </span>
//               )}
//             </div>

//             {/* ==================================================
//                 ENROLLMENT STATUS
//             ================================================== */}

//             {isEnrolled && (
//               <div
//                 className="
//                   mt-6
//                   flex
//                   w-fit
//                   items-center
//                   gap-2
//                   rounded-2xl
//                   border
//                   border-emerald-500/20
//                   bg-emerald-500/10
//                   px-4
//                   py-3
//                   text-xs
//                   font-black
//                   text-emerald-600
//                   dark:text-emerald-400
//                 "
//               >
//                 <CheckCircle2 className="size-4" />

//                 أنت مشترك في هذا الكورس
//               </div>
//             )}

//             {/* Free lessons info */}

//             {!isEnrolled &&
//               freeLessonsCount > 0 && (
//                 <div
//                   className="
//                     mt-6
//                     flex
//                     w-fit
//                     items-center
//                     gap-2
//                     rounded-2xl
//                     border
//                     border-emerald-500/20
//                     bg-emerald-500/10
//                     px-4
//                     py-3
//                     text-xs
//                     font-bold
//                     text-emerald-600
//                     dark:text-emerald-400
//                   "
//                 >
//                   <Sparkles className="size-4" />

//                   يحتوي الكورس على{" "}
//                   {freeLessonsCount}{" "}
//                   {freeLessonsCount === 1
//                     ? "درس مجاني"
//                     : "دروس مجانية"}
//                 </div>
//               )}
//           </div>

//           {/* ==================================================
//               PURCHASE CARD
//           ================================================== */}

//           <div className="lg:sticky lg:top-6 lg:self-start">
//             <div
//               className="
//                 overflow-hidden
//                 rounded-[28px]
//                 border
//                 border-border/70
//                 bg-background
//                 shadow-[0_20px_70px_rgba(0,0,0,0.08)]
//               "
//             >
//               {/* MEDIA */}

//               <div
//                 className="
//                   relative
//                   aspect-video
//                   overflow-hidden
//                   bg-muted
//                 "
//               >
//                 {mediaUrl &&
//                 course.mediaType === "VIDEO" ? (
//                   <video
//                     src={mediaUrl}
//                     controls
//                     className="h-full w-full object-cover"
//                   />
//                 ) : mediaUrl ? (
//                   <img
//                     src={mediaUrl}
//                     alt={course.title}
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div
//                     className="
//                       flex
//                       h-full
//                       w-full
//                       items-center
//                       justify-center
//                       bg-muted
//                     "
//                   >
//                     <BookOpen
//                       className="
//                         size-20
//                         text-muted-foreground/20
//                       "
//                     />
//                   </div>
//                 )}

//                 {/* Course badge */}

//                 <div
//                   className="
//                     absolute
//                     right-4
//                     top-4
//                     flex
//                     items-center
//                     gap-1.5
//                     rounded-full
//                     bg-black/70
//                     px-3
//                     py-1.5
//                     text-[11px]
//                     font-black
//                     text-white
//                     backdrop-blur-md
//                   "
//                 >
//                   <BookOpen className="size-3" />

//                   كورس تعليمي
//                 </div>
//               </div>

//               {/* CARD CONTENT */}

//               <div className="p-5 sm:p-6">
//                 {/* Price */}

//                 <div className="flex items-end justify-between gap-4">
//                   <div>
//                     <p
//                       className="
//                         text-xs
//                         font-bold
//                         text-muted-foreground
//                       "
//                     >
//                       سعر الكورس
//                     </p>

//                     <p
//                       className="
//                         mt-1
//                         text-3xl
//                         font-black
//                         tracking-tight
//                         text-red-500
//                       "
//                     >
//                       {course.price === 0
//                         ? "مجاني"
//                         : `${course.price} ج.م`}
//                     </p>
//                   </div>

//                   <div
//                     className="
//                       flex
//                       size-12
//                       shrink-0
//                       items-center
//                       justify-center
//                       rounded-2xl
//                       bg-red-500/10
//                       text-red-500
//                     "
//                   >
//                     <ShoppingCart className="size-5" />
//                   </div>
//                 </div>

//                 {/* Enrollment Status */}

//                 {isEnrolled && (
//                   <div
//                     className="
//                       mt-4
//                       flex
//                       items-center
//                       gap-2
//                       rounded-xl
//                       bg-emerald-500/10
//                       px-3
//                       py-2.5
//                       text-xs
//                       font-black
//                       text-emerald-600
//                       dark:text-emerald-400
//                     "
//                   >
//                     <CheckCircle2 className="size-4" />

//                     الكورس متاح لك بالكامل
//                   </div>
//                 )}

//                 {/* Divider */}

//                 <div className="my-5 h-px bg-border" />

//                 {/* Course highlights */}

//                 <div className="space-y-3">
//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       text-xs
//                       font-bold
//                     "
//                   >
//                     <CheckCircle2 className="size-4 text-emerald-500" />

//                     محتوى منظم على فصول ودروس
//                   </div>

//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       text-xs
//                       font-bold
//                     "
//                   >
//                     <CheckCircle2 className="size-4 text-emerald-500" />

//                     {isEnrolled
//                       ? "جميع دروس الكورس متاحة لك"
//                       : freeLessonsCount > 0
//                       ? "يمكنك تجربة الدروس المجانية أولًا"
//                       : "محتوى تعليمي متكامل"}
//                   </div>

//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-3
//                       text-xs
//                       font-bold
//                     "
//                   >
//                     <CheckCircle2 className="size-4 text-emerald-500" />

//                     تعلم بالسرعة المناسبة لك
//                   </div>
//                 </div>

//                 {/* Purchase */}

//                 <div className="mt-6">
//                   <EnrollButton
//                     courseId={course.id}
//                     price={course.price}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ======================================================
//           COURSE CONTENT
//       ====================================================== */}

//       <section
//         className="
//           border-t
//           border-border
//           bg-muted/[0.08]
//         "
//       >
//         <div
//           className="
//             mx-auto
//             max-w-5xl
//             px-5
//             py-10
//             sm:px-8
//             lg:py-14
//           "
//         >
//           {/* ==================================================
//               HEADER
//           ================================================== */}

//           <div className="mb-7">
//             <div
//               className="
//                 inline-flex
//                 items-center
//                 gap-2
//                 rounded-full
//                 bg-red-500/10
//                 px-3.5
//                 py-2
//                 text-xs
//                 font-black
//                 text-red-500
//               "
//             >
//               <BookOpen className="size-3.5" />

//               محتوى الكورس
//             </div>

//             <h2
//               className="
//                 mt-4
//                 text-2xl
//                 font-black
//                 tracking-tight
//                 sm:text-3xl
//               "
//             >
//               محتوى الكورس
//             </h2>

//             <p
//               className="
//                 mt-2
//                 text-sm
//                 leading-7
//                 text-muted-foreground
//               "
//             >
//               {chaptersCount} فصل يحتوي على{" "}
//               {lessonsCount} درس
//             </p>
//           </div>

//           {/* ==================================================
//               LEGEND
//           ================================================== */}

//           <div
//             className="
//               mb-6
//               flex
//               flex-wrap
//               items-center
//               gap-3
//               rounded-2xl
//               border
//               border-border
//               bg-background
//               p-4
//             "
//           >
//             {/* FREE */}

//             <div
//               className="
//                 flex
//                 items-center
//                 gap-2
//                 rounded-xl
//                 bg-emerald-500/10
//                 px-3
//                 py-2
//                 text-xs
//                 font-bold
//                 text-emerald-600
//                 dark:text-emerald-400
//               "
//             >
//               <PlayCircle className="size-4" />

//               درس مجاني
//             </div>

//             {/* OPEN AFTER ENROLLMENT */}

//             {isEnrolled && (
//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-2
//                   rounded-xl
//                   bg-emerald-500/10
//                   px-3
//                   py-2
//                   text-xs
//                   font-bold
//                   text-emerald-600
//                   dark:text-emerald-400
//                 "
//               >
//                 <CheckCircle2 className="size-4" />

//                 جميع الدروس متاحة لك
//               </div>
//             )}

//             {/* LOCKED */}

//             {!isEnrolled &&
//               course.price > 0 &&
//               lockedLessonsCount > 0 && (
//                 <div
//                   className="
//                     flex
//                     items-center
//                     gap-2
//                     rounded-xl
//                     bg-muted
//                     px-3
//                     py-2
//                     text-xs
//                     font-bold
//                     text-muted-foreground
//                   "
//                 >
//                   <Lock className="size-4" />

//                   درس مغلق
//                 </div>
//               )}

//             {/* NOTE */}

//             <p className="mr-auto text-[11px] font-semibold text-muted-foreground">
//               {isEnrolled
//                 ? "يمكنك الآن مشاهدة جميع دروس الكورس."
//                 : "يمكنك مشاهدة الدروس المجانية بدون شراء الكورس."}
//             </p>
//           </div>

//           {/* ==================================================
//               CHAPTERS
//           ================================================== */}

//           <div className="space-y-5">
//             {course.chapters.map(
//               (chapter, chapterIndex) => (
//                 <div
//                   key={chapter.id}
//                   className="
//                     overflow-hidden
//                     rounded-2xl
//                     border
//                     border-border
//                     bg-background
//                     shadow-sm
//                     transition-shadow
//                     hover:shadow-md
//                   "
//                 >
//                   {/* ==================================================
//                       CHAPTER HEADER
//                   ================================================== */}

//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-4
//                       border-b
//                       border-border
//                       bg-muted/[0.25]
//                       px-5
//                       py-4
//                       sm:px-6
//                     "
//                   >
//                     <div
//                       className="
//                         flex
//                         size-11
//                         shrink-0
//                         items-center
//                         justify-center
//                         rounded-2xl
//                         bg-red-500/10
//                         text-sm
//                         font-black
//                         text-red-500
//                       "
//                     >
//                       {String(
//                         chapterIndex + 1
//                       ).padStart(2, "0")}
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <p
//                         className="
//                           mb-0.5
//                           text-[10px]
//                           font-black
//                           uppercase
//                           tracking-wider
//                           text-muted-foreground
//                         "
//                       >
//                         الفصل {chapterIndex + 1}
//                       </p>

//                       <h3
//                         className="
//                           truncate
//                           text-sm
//                           font-black
//                           sm:text-base
//                         "
//                       >
//                         {chapter.title}
//                       </h3>
//                     </div>

//                     <div
//                       className="
//                         shrink-0
//                         rounded-xl
//                         bg-background
//                         px-3
//                         py-2
//                         text-[11px]
//                         font-bold
//                         text-muted-foreground
//                       "
//                     >
//                       {chapter.lessons.length} درس
//                     </div>
//                   </div>

//                   {/* ==================================================
//                       LESSONS
//                   ================================================== */}

//                   <div>
//                     {chapter.lessons.length === 0 ? (
//                       <div
//                         className="
//                           px-6
//                           py-7
//                           text-center
//                           text-xs
//                           font-semibold
//                           text-muted-foreground
//                         "
//                       >
//                         لا توجد دروس في هذا الفصل
//                         حاليًا.
//                       </div>
//                     ) : (
//                       chapter.lessons.map(
//                         (lesson, lessonIndex) => {
//                           const duration =
//                             formatDuration(
//                               lesson.duration
//                             )

//                           const canAccess =
//                             canAccessLesson(
//                               lesson.isFree
//                             )

//                           {/* ==================================================
//                               ACCESSIBLE LESSON
//                           ================================================== */}

//                           if (canAccess) {
//                             return (
//                               <Link
//                                 key={lesson.id}
//                                 href={`/courses/${course.id}/lessons/${lesson.id}`}
//                                 className="
//                                   group
//                                   flex
//                                   items-center
//                                   gap-3
//                                   border-b
//                                   border-border/60
//                                   px-5
//                                   py-4
//                                   transition-all
//                                   last:border-b-0
//                                   hover:bg-emerald-500/[0.035]
//                                   sm:gap-4
//                                   sm:px-6
//                                 "
//                               >
//                                 {/* PLAY */}

//                                 <div
//                                   className="
//                                     flex
//                                     size-10
//                                     shrink-0
//                                     items-center
//                                     justify-center
//                                     rounded-xl
//                                     bg-emerald-500/10
//                                     text-emerald-600
//                                     transition-all
//                                     group-hover:scale-105
//                                     group-hover:bg-emerald-500
//                                     group-hover:text-white
//                                     dark:text-emerald-400
//                                   "
//                                 >
//                                   <PlayCircle className="size-4.5" />
//                                 </div>

//                                 {/* LESSON INFO */}

//                                 <div className="min-w-0 flex-1">
//                                   <div
//                                     className="
//                                       flex
//                                       min-w-0
//                                       items-center
//                                       gap-2
//                                     "
//                                   >
//                                     <p
//                                       className="
//                                         min-w-0
//                                         truncate
//                                         text-sm
//                                         font-bold
//                                         transition-colors
//                                         group-hover:text-emerald-600
//                                         dark:group-hover:text-emerald-400
//                                       "
//                                     >
//                                       {lessonIndex +
//                                         1}
//                                       .{" "}
//                                       {lesson.title}
//                                     </p>
//                                   </div>

//                                   {lesson.description && (
//                                     <p
//                                       className="
//                                         mt-1
//                                         line-clamp-1
//                                         text-xs
//                                         text-muted-foreground
//                                       "
//                                     >
//                                       {stripHtml(
//                                         lesson.description
//                                       )}
//                                     </p>
//                                   )}
//                                 </div>

//                                 {/* BADGE */}

//                                 <span
//                                   className="
//                                     shrink-0
//                                     rounded-full
//                                     bg-emerald-500/10
//                                     px-2.5
//                                     py-1.5
//                                     text-[10px]
//                                     font-black
//                                     text-emerald-600
//                                     dark:text-emerald-400
//                                   "
//                                 >
//                                   {lesson.isFree
//                                     ? "مجاني"
//                                     : "متاح"}
//                                 </span>

//                                 {/* DURATION */}

//                                 {duration && (
//                                   <span
//                                     className="
//                                       hidden
//                                       shrink-0
//                                       text-[11px]
//                                       font-semibold
//                                       text-muted-foreground
//                                       sm:block
//                                     "
//                                   >
//                                     {duration}
//                                   </span>
//                                 )}

//                                 {/* ARROW */}

//                                 <ArrowRight
//                                   className="
//                                     size-4
//                                     shrink-0
//                                     text-muted-foreground/40
//                                     transition-all
//                                     group-hover:-translate-x-1
//                                     group-hover:text-emerald-500
//                                   "
//                                 />
//                               </Link>
//                             )
//                           }

//                           {/* ==================================================
//                               LOCKED LESSON
//                           ================================================== */}

//                           return (
//                             <div
//                               key={lesson.id}
//                               className="
//                                 flex
//                                 cursor-not-allowed
//                                 items-center
//                                 gap-3
//                                 border-b
//                                 border-border/60
//                                 px-5
//                                 py-4
//                                 opacity-75
//                                 last:border-b-0
//                                 sm:gap-4
//                                 sm:px-6
//                               "
//                             >
//                               {/* LOCK ICON */}

//                               <div
//                                 className="
//                                   flex
//                                   size-10
//                                   shrink-0
//                                   items-center
//                                   justify-center
//                                   rounded-xl
//                                   bg-muted
//                                   text-muted-foreground
//                                 "
//                               >
//                                 <Lock className="size-4" />
//                               </div>

//                               {/* LESSON INFO */}

//                               <div className="min-w-0 flex-1">
//                                 <p
//                                   className="
//                                     truncate
//                                     text-sm
//                                     font-bold
//                                     text-muted-foreground
//                                   "
//                                 >
//                                   {lessonIndex +
//                                     1}
//                                   .{" "}
//                                   {lesson.title}
//                                 </p>

//                                 {lesson.description && (
//                                   <p
//                                     className="
//                                       mt-1
//                                       line-clamp-1
//                                       text-xs
//                                       text-muted-foreground/70
//                                     "
//                                   >
//                                     {stripHtml(
//                                       lesson.description
//                                     )}
//                                   </p>
//                                 )}
//                               </div>

//                               {/* LOCKED BADGE */}

//                               <span
//                                 className="
//                                   flex
//                                   shrink-0
//                                   items-center
//                                   gap-1.5
//                                   rounded-full
//                                   bg-muted
//                                   px-2.5
//                                   py-1.5
//                                   text-[10px]
//                                   font-black
//                                   text-muted-foreground
//                                 "
//                               >
//                                 <Lock className="size-3" />

//                                 مغلق
//                               </span>

//                               {/* DURATION */}

//                               {duration && (
//                                 <span
//                                   className="
//                                     hidden
//                                     shrink-0
//                                     text-[11px]
//                                     font-semibold
//                                     text-muted-foreground/60
//                                     sm:block
//                                   "
//                                 >
//                                   {duration}
//                                 </span>
//                               )}
//                             </div>
//                           )
//                         }
//                       )
//                     )}
//                   </div>
//                 </div>
//               )
//             )}
//           </div>

//           {/* ==================================================
//               BOTTOM NOTE
//           ================================================== */}

//           {!isEnrolled &&
//             freeLessonsCount > 0 &&
//             course.price > 0 && (
//               <div
//                 className="
//                   mt-7
//                   rounded-2xl
//                   border
//                   border-red-500/15
//                   bg-red-500/[0.045]
//                   p-5
//                 "
//               >
//                 <div className="flex items-start gap-3">
//                   <div
//                     className="
//                       flex
//                       size-10
//                       shrink-0
//                       items-center
//                       justify-center
//                       rounded-xl
//                       bg-red-500/10
//                       text-red-500
//                     "
//                   >
//                     <ShoppingCart className="size-4" />
//                   </div>

//                   <div>
//                     <h3 className="text-sm font-black">
//                       هل تريد الوصول إلى جميع الدروس؟
//                     </h3>

//                     <p
//                       className="
//                         mt-1
//                         text-xs
//                         leading-6
//                         text-muted-foreground
//                       "
//                     >
//                       قم بشراء الكورس للوصول إلى
//                       جميع الدروس والمحتوى الكامل.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//           {/* ==================================================
//               ENROLLED SUCCESS NOTE
//           ================================================== */}

//           {isEnrolled && (
//             <div
//               className="
//                 mt-7
//                 rounded-2xl
//                 border
//                 border-emerald-500/20
//                 bg-emerald-500/[0.05]
//                 p-5
//               "
//             >
//               <div className="flex items-start gap-3">
//                 <div
//                   className="
//                     flex
//                     size-10
//                     shrink-0
//                     items-center
//                     justify-center
//                     rounded-xl
//                     bg-emerald-500/10
//                     text-emerald-600
//                     dark:text-emerald-400
//                   "
//                 >
//                   <CheckCircle2 className="size-5" />
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-black">
//                     الكورس متاح بالكامل 🎉
//                   </h3>

//                   <p
//                     className="
//                       mt-1
//                       text-xs
//                       leading-6
//                       text-muted-foreground
//                     "
//                   >
//                     تم تسجيلك في الكورس بنجاح،
//                     ويمكنك الآن مشاهدة جميع الدروس
//                     المتاحة لك.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </main>
//   )
// }

























import Link from "next/link"
import { notFound } from "next/navigation"
import { headers } from "next/headers"

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  Lock,
  PlayCircle,
  ShoppingCart,
  Sparkles,
} from "lucide-react"

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import EnrollButton from "@/components/enroll-button"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

// ============================================================
// LABELS
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
// HELPERS
// ============================================================

function stripHtml(value: string | null) {
  if (!value) {
    return ""
  }

  return value
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
// S3 MEDIA URL
// ============================================================

async function getMediaUrl(mediaKey: string | null) {
  if (!mediaKey) {
    return null
  }

  try {
    const command = new GetObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: mediaKey,
    })

    return await getSignedUrl(s3, command, {
      expiresIn: 60 * 60,
    })
  } catch (error) {
    console.error(
      "Failed to generate course media URL:",
      error
    )

    return null
  }
}

// ============================================================
// DURATION
// ============================================================

function formatDuration(seconds: number | null) {
  if (!seconds || seconds <= 0) {
    return null
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return `${hours}:${String(
      remainingMinutes
    ).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`
  }

  return `${minutes}:${String(
    remainingSeconds
  ).padStart(2, "0")}`
}

// ============================================================
// PAGE
// ============================================================

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user?.id ?? null

  // ==========================================================
  // FETCH COURSE
  // ==========================================================

  const course = await prisma.course.findFirst({
    where: {
      id,
      isPublished: true,
    },

    include: {
      subject: true,

      chapters: {
        orderBy: {
          position: "asc",
        },

        include: {
          lessons: {
            orderBy: {
              position: "asc",
            },

            select: {
              id: true,
              title: true,
              description: true,
              position: true,
              duration: true,
              isFree: true,
            },
          },
        },
      },
    },
  })

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!course) {
    notFound()
  }

  // ==========================================================
  // CHECK ENROLLMENT
  // ==========================================================

  const enrollment = userId
    ? await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },

        select: {
          id: true,
        },
      })
    : null

  const isEnrolled = Boolean(enrollment)

  // ==========================================================
  // FIRST LESSON
  //
  // نستخدم أول درس في الكورس كزر "ابدأ التعلم الآن"
  // للمستخدم المسجل بالفعل.
  // ==========================================================

  const firstLesson =
    course.chapters.length > 0
      ? course.chapters
          .flatMap((chapter) => chapter.lessons)
          .at(0)
      : null

  // ==========================================================
  // ACCESS RULE
  //
  // Free lesson:
  //     مفتوح دائمًا
  //
  // Enrolled:
  //     كل الدروس مفتوحة
  //
  // Free course:
  //     كل الدروس مفتوحة
  //
  // Not enrolled:
  //     الدروس المدفوعة مغلقة
  // ==========================================================

  const canAccessLesson = (isFree: boolean) => {
    return (
      isFree ||
      isEnrolled ||
      course.price === 0
    )
  }

  // ==========================================================
  // MEDIA
  // ==========================================================

  const mediaUrl = await getMediaUrl(
    course.mediaKey
  )

  // ==========================================================
  // COUNTS
  // ==========================================================

  const chaptersCount =
    course.chapters.length

  const lessonsCount =
    course.chapters.reduce(
      (total, chapter) =>
        total + chapter.lessons.length,
      0
    )

  const freeLessonsCount =
    course.chapters.reduce(
      (total, chapter) =>
        total +
        chapter.lessons.filter(
          (lesson) => lesson.isFree
        ).length,
      0
    )

  const lockedLessonsCount =
    course.chapters.reduce(
      (total, chapter) =>
        total +
        chapter.lessons.filter(
          (lesson) =>
            !canAccessLesson(lesson.isFree)
        ).length,
      0
    )

  // ==========================================================
  // LABELS
  // ==========================================================

  const subjectName =
    SUBJECT_NAMES[course.subject.code] ||
    course.subject.name

  const levelName =
    COURSE_LEVEL_NAMES[course.level] ||
    course.level

  const educationTypeName =
    EDUCATION_TYPE_NAMES[
      course.educationType
    ] || course.educationType

  const academicLevelName =
    ACADEMIC_LEVEL_NAMES[
      course.academicLevel
    ] || course.academicLevel

  const semesterName =
    SEMESTER_NAMES[course.semester] ||
    course.semester

  const secondaryTrackName =
    course.secondaryTrack
      ? SECONDARY_TRACK_NAMES[
          course.secondaryTrack
        ] || course.secondaryTrack
      : null

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-background"
    >
      {/* ======================================================
          TOP NAV
      ====================================================== */}

      <section className="border-b border-border bg-muted/[0.12]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
          <Link
            href="/courses"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-xl
              px-2
              py-1.5
              text-sm
              font-bold
              text-muted-foreground
              transition-all
              hover:bg-red-500/10
              hover:text-red-500
            "
          >
            <ArrowRight
              className="
                size-4
                transition-transform
                group-hover:-translate-x-1
              "
            />

            العودة إلى الكورسات
          </Link>
        </div>
      </section>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">
        {/* Decorative background */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            size-96
            rounded-full
            bg-red-500/[0.06]
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-32
            bottom-0
            size-96
            rounded-full
            bg-red-500/[0.04]
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            grid
            max-w-7xl
            gap-10
            px-5
            py-8
            sm:px-8
            lg:grid-cols-[1.2fr_0.8fr]
            lg:gap-14
            lg:py-14
          "
        >
          {/* ==================================================
              COURSE INFO
          ================================================== */}

          <div className="flex flex-col justify-center">
            {/* Subject */}

            <div
              className="
                mb-5
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-red-500/10
                bg-red-500/10
                px-3.5
                py-2
                text-xs
                font-black
                text-red-500
              "
            >
              <BookOpen className="size-3.5" />
              {subjectName}
            </div>

            {/* Title */}

            <h1
              className="
                max-w-4xl
                text-3xl
                font-black
                leading-[1.25]
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              {course.title}
            </h1>

            {/* Description */}

            {course.description && (
              <p
                className="
                  mt-5
                  max-w-3xl
                  text-sm
                  leading-8
                  text-muted-foreground
                  sm:text-base
                "
              >
                {stripHtml(course.description)}
              </p>
            )}

            {/* Meta */}

            <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              {/* Level */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-border
                  bg-background
                  px-4
                  py-3
                  text-xs
                  font-bold
                  shadow-sm
                "
              >
                <Clock3 className="size-4 shrink-0 text-red-500" />
                {levelName}
              </div>

              {/* Education */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-border
                  bg-background
                  px-4
                  py-3
                  text-xs
                  font-bold
                  shadow-sm
                "
              >
                <GraduationCap className="size-4 shrink-0 text-red-500" />
                {educationTypeName}
              </div>

              {/* Chapters */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-border
                  bg-background
                  px-4
                  py-3
                  text-xs
                  font-bold
                  shadow-sm
                "
              >
                <Layers3 className="size-4 shrink-0 text-red-500" />
                {chaptersCount} فصل
              </div>

              {/* Lessons */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-border
                  bg-background
                  px-4
                  py-3
                  text-xs
                  font-bold
                  shadow-sm
                "
              >
                <PlayCircle className="size-4 shrink-0 text-red-500" />
                {lessonsCount} درس
              </div>
            </div>

            {/* Academic Information */}

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className="
                  rounded-xl
                  border
                  border-border
                  bg-muted
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-muted-foreground
                "
              >
                {academicLevelName}
              </span>

              <span
                className="
                  rounded-xl
                  border
                  border-border
                  bg-muted
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-muted-foreground
                "
              >
                {semesterName}
              </span>

              {secondaryTrackName && (
                <span
                  className="
                    rounded-xl
                    border
                    border-border
                    bg-muted
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-muted-foreground
                  "
                >
                  {secondaryTrackName}
                </span>
              )}
            </div>

            {/* ==================================================
                ENROLLMENT STATUS
            ================================================== */}

            {isEnrolled && (
              <div
                className="
                  mt-6
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  px-4
                  py-3
                  text-xs
                  font-black
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                <CheckCircle2 className="size-4" />
                أنت مشترك في هذا الكورس
              </div>
            )}

            {/* Free lessons info */}

            {!isEnrolled &&
              freeLessonsCount > 0 && (
                <div
                  className="
                    mt-6
                    flex
                    w-fit
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-4
                    py-3
                    text-xs
                    font-bold
                    text-emerald-600
                    dark:text-emerald-400
                  "
                >
                  <Sparkles className="size-4" />

                  يحتوي الكورس على{" "}

                  {freeLessonsCount}{" "}

                  {freeLessonsCount === 1
                    ? "درس مجاني"
                    : "دروس مجانية"}
                </div>
              )}
          </div>

          {/* ==================================================
              PURCHASE CARD
          ================================================== */}

          <div className="lg:sticky lg:top-6 lg:self-start">
            <div
              className="
                overflow-hidden
                rounded-[28px]
                border
                border-border/70
                bg-background
                shadow-[0_20px_70px_rgba(0,0,0,0.08)]
              "
            >
              {/* MEDIA */}

              <div
                className="
                  relative
                  aspect-video
                  overflow-hidden
                  bg-muted
                "
              >
                {mediaUrl &&
                course.mediaType === "VIDEO" ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      bg-muted
                    "
                  >
                    <BookOpen
                      className="
                        size-20
                        text-muted-foreground/20
                      "
                    />
                  </div>
                )}

                {/* Course badge */}

                <div
                  className="
                    absolute
                    right-4
                    top-4
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-black/70
                    px-3
                    py-1.5
                    text-[11px]
                    font-black
                    text-white
                    backdrop-blur-md
                  "
                >
                  <BookOpen className="size-3" />
                  كورس تعليمي
                </div>
              </div>

              {/* CARD CONTENT */}

              <div className="p-5 sm:p-6">
                {/* Price */}

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p
                      className="
                        text-xs
                        font-bold
                        text-muted-foreground
                      "
                    >
                      سعر الكورس
                    </p>

                    <p
                      className="
                        mt-1
                        text-3xl
                        font-black
                        tracking-tight
                        text-red-500
                      "
                    >
                      {course.price === 0
                        ? "مجاني"
                        : `${course.price} ج.م`}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      size-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-red-500/10
                      text-red-500
                    "
                  >
                    <ShoppingCart className="size-5" />
                  </div>
                </div>

                {/* ==================================================
                    ENROLLED STATUS
                ================================================== */}

                {isEnrolled && (
                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-emerald-500/10
                      px-3
                      py-2.5
                      text-xs
                      font-black
                      text-emerald-600
                      dark:text-emerald-400
                    "
                  >
                    <CheckCircle2 className="size-4" />

                    الكورس متاح لك بالكامل
                  </div>
                )}

                {/* Divider */}

                <div className="my-5 h-px bg-border" />

                {/* Course highlights */}

                <div className="space-y-3">
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-xs
                      font-bold
                    "
                  >
                    <CheckCircle2 className="size-4 text-emerald-500" />

                    محتوى منظم على فصول ودروس
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-xs
                      font-bold
                    "
                  >
                    <CheckCircle2 className="size-4 text-emerald-500" />

                    {isEnrolled
                      ? "جميع دروس الكورس متاحة لك"
                      : freeLessonsCount > 0
                      ? "يمكنك تجربة الدروس المجانية أولًا"
                      : "محتوى تعليمي متكامل"}
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-xs
                      font-bold
                    "
                  >
                    <CheckCircle2 className="size-4 text-emerald-500" />

                    تعلم بالسرعة المناسبة لك
                  </div>
                </div>

                {/* ==================================================
                    PURCHASE / LEARNING BUTTON
                ================================================== */}

                <div className="mt-6">
                  {!isEnrolled ? (
                    /*
                     * المستخدم غير مسجل:
                     * يظهر زر الشراء / التسجيل.
                     */
                    <EnrollButton
                      courseId={course.id}
                      price={course.price}
                    />
                  ) : firstLesson ? (
                    /*
                     * المستخدم مسجل بالفعل:
                     * لا نظهر زر الشراء مرة أخرى.
                     * بدلًا منه نعرض زر بدء التعلم.
                     */
                    <Link
                      href={`/courses/${course.id}/lessons/${firstLesson.id}`}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-emerald-500
                        px-5
                        py-3.5
                        text-sm
                        font-black
                        text-white
                        shadow-lg
                        shadow-emerald-500/20
                        transition-all
                        hover:bg-emerald-600
                        hover:shadow-xl
                        hover:shadow-emerald-500/25
                        active:scale-[0.98]
                      "
                    >
                      <PlayCircle className="size-5" />

                      ابدأ التعلم الآن

                      <ArrowRight
                        className="
                          size-4
                          transition-transform
                          group-hover:-translate-x-1
                        "
                      />
                    </Link>
                  ) : (
                    /*
                     * المستخدم مسجل ولكن لا يوجد دروس حاليًا.
                     */
                    <div
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-emerald-500/10
                        px-5
                        py-3.5
                        text-sm
                        font-black
                        text-emerald-600
                        dark:text-emerald-400
                      "
                    >
                      <CheckCircle2 className="size-5" />

                      أنت مشترك بالفعل
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          COURSE CONTENT
      ====================================================== */}

      <section
        className="
          border-t
          border-border
          bg-muted/[0.08]
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
            px-5
            py-10
            sm:px-8
            lg:py-14
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-7">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-red-500/10
                px-3.5
                py-2
                text-xs
                font-black
                text-red-500
              "
            >
              <BookOpen className="size-3.5" />

              محتوى الكورس
            </div>

            <h2
              className="
                mt-4
                text-2xl
                font-black
                tracking-tight
                sm:text-3xl
              "
            >
              محتوى الكورس
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              {chaptersCount} فصل يحتوي على{" "}
              {lessonsCount} درس
            </p>
          </div>

          {/* ==================================================
              LEGEND
          ================================================== */}

          <div
            className="
              mb-6
              flex
              flex-wrap
              items-center
              gap-3
              rounded-2xl
              border
              border-border
              bg-background
              p-4
            "
          >
            {/* FREE */}

            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-emerald-500/10
                px-3
                py-2
                text-xs
                font-bold
                text-emerald-600
                dark:text-emerald-400
              "
            >
              <PlayCircle className="size-4" />

              درس مجاني
            </div>

            {/* OPEN AFTER ENROLLMENT */}

            {isEnrolled && (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-emerald-500/10
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                <CheckCircle2 className="size-4" />

                جميع الدروس متاحة لك
              </div>
            )}

            {/* LOCKED */}

            {!isEnrolled &&
              course.price > 0 &&
              lockedLessonsCount > 0 && (
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-muted
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-muted-foreground
                  "
                >
                  <Lock className="size-4" />

                  درس مغلق
                </div>
              )}

            {/* NOTE */}

            <p className="mr-auto text-[11px] font-semibold text-muted-foreground">
              {isEnrolled
                ? "يمكنك الآن مشاهدة جميع دروس الكورس."
                : "يمكنك مشاهدة الدروس المجانية بدون شراء الكورس."}
            </p>
          </div>

          {/* ==================================================
              CHAPTERS
          ================================================== */}

          <div className="space-y-5">
            {course.chapters.map(
              (chapter, chapterIndex) => (
                <div
                  key={chapter.id}
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    shadow-sm
                    transition-shadow
                    hover:shadow-md
                  "
                >
                  {/* ==================================================
                      CHAPTER HEADER
                  ================================================== */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      border-b
                      border-border
                      bg-muted/[0.25]
                      px-5
                      py-4
                      sm:px-6
                    "
                  >
                    <div
                      className="
                        flex
                        size-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-red-500/10
                        text-sm
                        font-black
                        text-red-500
                      "
                    >
                      {String(
                        chapterIndex + 1
                      ).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          mb-0.5
                          text-[10px]
                          font-black
                          uppercase
                          tracking-wider
                          text-muted-foreground
                        "
                      >
                        الفصل {chapterIndex + 1}
                      </p>

                      <h3
                        className="
                          truncate
                          text-sm
                          font-black
                          sm:text-base
                        "
                      >
                        {chapter.title}
                      </h3>
                    </div>

                    <div
                      className="
                        shrink-0
                        rounded-xl
                        bg-background
                        px-3
                        py-2
                        text-[11px]
                        font-bold
                        text-muted-foreground
                      "
                    >
                      {chapter.lessons.length} درس
                    </div>
                  </div>

                  {/* ==================================================
                      LESSONS
                  ================================================== */}

                  <div>
                    {chapter.lessons.length === 0 ? (
                      <div
                        className="
                          px-6
                          py-7
                          text-center
                          text-xs
                          font-semibold
                          text-muted-foreground
                        "
                      >
                        لا توجد دروس في هذا الفصل
                        حاليًا.
                      </div>
                    ) : (
                      chapter.lessons.map(
                        (lesson, lessonIndex) => {
                          const duration =
                            formatDuration(
                              lesson.duration
                            )

                          const canAccess =
                            canAccessLesson(
                              lesson.isFree
                            )

                          {/* ==================================================
                              ACCESSIBLE LESSON
                          ================================================== */}

                          if (canAccess) {
                            return (
                              <Link
                                key={lesson.id}
                                href={`/courses/${course.id}/lessons/${lesson.id}`}
                                className="
                                  group
                                  flex
                                  items-center
                                  gap-3
                                  border-b
                                  border-border/60
                                  px-5
                                  py-4
                                  transition-all
                                  last:border-b-0
                                  hover:bg-emerald-500/[0.035]
                                  sm:gap-4
                                  sm:px-6
                                "
                              >
                                {/* PLAY */}

                                <div
                                  className="
                                    flex
                                    size-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-emerald-500/10
                                    text-emerald-600
                                    transition-all
                                    group-hover:scale-105
                                    group-hover:bg-emerald-500
                                    group-hover:text-white
                                    dark:text-emerald-400
                                  "
                                >
                                  <PlayCircle className="size-4.5" />
                                </div>

                                {/* LESSON INFO */}

                                <div className="min-w-0 flex-1">
                                  <div
                                    className="
                                      flex
                                      min-w-0
                                      items-center
                                      gap-2
                                    "
                                  >
                                    <p
                                      className="
                                        min-w-0
                                        truncate
                                        text-sm
                                        font-bold
                                        transition-colors
                                        group-hover:text-emerald-600
                                        dark:group-hover:text-emerald-400
                                      "
                                    >
                                      {lessonIndex +
                                        1}
                                      .{" "}
                                      {lesson.title}
                                    </p>
                                  </div>

                                  {lesson.description && (
                                    <p
                                      className="
                                        mt-1
                                        line-clamp-1
                                        text-xs
                                        text-muted-foreground
                                      "
                                    >
                                      {stripHtml(
                                        lesson.description
                                      )}
                                    </p>
                                  )}
                                </div>

                                {/* BADGE */}

                                <span
                                  className="
                                    shrink-0
                                    rounded-full
                                    bg-emerald-500/10
                                    px-2.5
                                    py-1.5
                                    text-[10px]
                                    font-black
                                    text-emerald-600
                                    dark:text-emerald-400
                                  "
                                >
                                  {lesson.isFree
                                    ? "مجاني"
                                    : "متاح"}
                                </span>

                                {/* DURATION */}

                                {duration && (
                                  <span
                                    className="
                                      hidden
                                      shrink-0
                                      text-[11px]
                                      font-semibold
                                      text-muted-foreground
                                      sm:block
                                    "
                                  >
                                    {duration}
                                  </span>
                                )}

                                {/* ARROW */}

                                <ArrowRight
                                  className="
                                    size-4
                                    shrink-0
                                    text-muted-foreground/40
                                    transition-all
                                    group-hover:-translate-x-1
                                    group-hover:text-emerald-500
                                  "
                                />
                              </Link>
                            )
                          }

                          {/* ==================================================
                              LOCKED LESSON
                          ================================================== */}

                          return (
                            <div
                              key={lesson.id}
                              className="
                                flex
                                cursor-not-allowed
                                items-center
                                gap-3
                                border-b
                                border-border/60
                                px-5
                                py-4
                                opacity-75
                                last:border-b-0
                                sm:gap-4
                                sm:px-6
                              "
                            >
                              {/* LOCK ICON */}

                              <div
                                className="
                                  flex
                                  size-10
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-muted
                                  text-muted-foreground
                                "
                              >
                                <Lock className="size-4" />
                              </div>

                              {/* LESSON INFO */}

                              <div className="min-w-0 flex-1">
                                <p
                                  className="
                                    truncate
                                    text-sm
                                    font-bold
                                    text-muted-foreground
                                  "
                                >
                                  {lessonIndex +
                                    1}
                                  .{" "}
                                  {lesson.title}
                                </p>

                                {lesson.description && (
                                  <p
                                    className="
                                      mt-1
                                      line-clamp-1
                                      text-xs
                                      text-muted-foreground/70
                                    "
                                  >
                                    {stripHtml(
                                      lesson.description
                                    )}
                                  </p>
                                )}
                              </div>

                              {/* LOCKED BADGE */}

                              <span
                                className="
                                  flex
                                  shrink-0
                                  items-center
                                  gap-1.5
                                  rounded-full
                                  bg-muted
                                  px-2.5
                                  py-1.5
                                  text-[10px]
                                  font-black
                                  text-muted-foreground
                                "
                              >
                                <Lock className="size-3" />

                                مغلق
                              </span>

                              {/* DURATION */}

                              {duration && (
                                <span
                                  className="
                                    hidden
                                    shrink-0
                                    text-[11px]
                                    font-semibold
                                    text-muted-foreground/60
                                    sm:block
                                  "
                                >
                                  {duration}
                                </span>
                              )}
                            </div>
                          )
                        }
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* ==================================================
              BOTTOM NOTE
          ================================================== */}

          {!isEnrolled &&
            freeLessonsCount > 0 &&
            course.price > 0 && (
              <div
                className="
                  mt-7
                  rounded-2xl
                  border
                  border-red-500/15
                  bg-red-500/[0.045]
                  p-5
                "
              >
                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex
                      size-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-500/10
                      text-red-500
                    "
                  >
                    <ShoppingCart className="size-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-black">
                      هل تريد الوصول إلى جميع الدروس؟
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-6
                        text-muted-foreground
                      "
                    >
                      قم بشراء الكورس للوصول إلى
                      جميع الدروس والمحتوى الكامل.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* ==================================================
              ENROLLED SUCCESS NOTE
          ================================================== */}

          {isEnrolled && (
            <div
              className="
                mt-7
                rounded-2xl
                border
                border-emerald-500/20
                bg-emerald-500/[0.05]
                p-5
              "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-500/10
                    text-emerald-600
                    dark:text-emerald-400
                  "
                >
                  <CheckCircle2 className="size-5" />
                </div>

                <div>
                  <h3 className="text-sm font-black">
                    الكورس متاح بالكامل 🎉
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-6
                      text-muted-foreground
                    "
                  >
                    تم تسجيلك في الكورس بنجاح،
                    ويمكنك الآن مشاهدة جميع الدروس
                    المتاحة لك.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}


