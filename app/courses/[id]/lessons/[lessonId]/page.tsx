

// import Link from "next/link"
// import { notFound, redirect } from "next/navigation"
// import { headers } from "next/headers"

// import {
//   ArrowLeft,
//   ArrowRight,
//   BookOpen,
//   CheckCircle2,
//   ChevronDown,
//   Clock3,
//   Layers3,
//   Play,
//   PlayCircle,
// } from "lucide-react"

// import { GetObjectCommand } from "@aws-sdk/client-s3"
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// import { prisma } from "@/lib/db"
// import { auth } from "@/lib/auth"
// import { env } from "@/lib/env"
// import { s3 } from "@/lib/s3-client"

// import VideoPlayer from "@/components/video-player"

// // ============================================================
// // TYPES
// // ============================================================

// type PageProps = {
//   params: Promise<{
//     id: string
//     lessonId: string
//   }>
// }

// // ============================================================
// // GET VIDEO SIGNED URL
// // ============================================================

// async function getVideoUrl(videoKey: string | null) {
//   if (!videoKey) {
//     return null
//   }

//   try {
//     const command = new GetObjectCommand({
//       Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
//       Key: videoKey,
//     })

//     const signedUrl = await getSignedUrl(s3, command, {
//       expiresIn: 60 * 60,
//     })

//     return signedUrl
//   } catch (error) {
//     console.error(
//       "Failed to generate lesson video URL:",
//       error
//     )

//     return null
//   }
// }

// // ============================================================
// // LESSON PAGE
// // ============================================================

// export default async function LessonPage({
//   params,
// }: PageProps) {
//   const { id, lessonId } = await params

//   // ==========================================================
//   // AUTHENTICATION
//   // ==========================================================

//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })

//   // ==========================================================
//   // NOT LOGGED IN
//   // ==========================================================

//   if (!session?.user) {
//     redirect(
//       `/login?callbackUrl=${encodeURIComponent(
//         `/courses/${id}/lessons/${lessonId}`
//       )}`
//     )
//   }

//   // ==========================================================
//   // GET COURSE
//   // ==========================================================

//   const course = await prisma.course.findUnique({
//     where: {
//       id,
//     },

//     select: {
//       id: true,
//       price: true,
//       isPublished: true,
//     },
//   })

//   // ==========================================================
//   // COURSE NOT FOUND
//   // ==========================================================

//   if (!course) {
//     notFound()
//   }

//   // ==========================================================
//   // COURSE NOT PUBLISHED
//   // ==========================================================

//   if (!course.isPublished) {
//     notFound()
//   }

//   // ==========================================================
//   // CHECK ENROLLMENT
//   // ==========================================================

//   const enrollment =
//     await prisma.enrollment.findUnique({
//       where: {
//         userId_courseId: {
//           userId: session.user.id,
//           courseId: id,
//         },
//       },

//       select: {
//         id: true,
//       },
//     })

//   // ==========================================================
//   // PAID COURSE WITHOUT ENROLLMENT
//   // ==========================================================

//   if (course.price > 0 && !enrollment) {
//     redirect(`/courses/${id}`)
//   }

//   // ==========================================================
//   // GET LESSON
//   // ==========================================================

//   const lesson =
//     await prisma.lesson.findFirst({
//       where: {
//         id: lessonId,

//         chapter: {
//           courseId: id,
//         },
//       },

//       select: {
//         id: true,
//         title: true,
//         description: true,
//         position: true,
//         duration: true,

//         videoUrl: true,
//         videoKey: true,
//         videoType: true,

//         chapter: {
//           select: {
//             id: true,
//             title: true,
//             position: true,

//             course: {
//               select: {
//                 id: true,
//                 title: true,
//                 isPublished: true,
//               },
//             },
//           },
//         },
//       },
//     })

//   // ==========================================================
//   // NOT FOUND
//   // ==========================================================

//   if (!lesson) {
//     notFound()
//   }

//   // ==========================================================
//   // COURSE NOT PUBLISHED
//   // ==========================================================

//   if (!lesson.chapter.course.isPublished) {
//     notFound()
//   }

//   // ==========================================================
//   // GENERATE SIGNED VIDEO URL
//   //
//   // KEEP THIS EXACT FLOW.
//   // ==========================================================

//   const signedVideoUrl = await getVideoUrl(
//     lesson.videoKey
//   )

//   // ==========================================================
//   // GET ALL CHAPTERS
//   // ==========================================================

//   const chapters =
//     await prisma.chapter.findMany({
//       where: {
//         courseId: id,
//       },

//       orderBy: {
//         position: "asc",
//       },

//       select: {
//         id: true,
//         title: true,
//         position: true,

//         lessons: {
//           orderBy: {
//             position: "asc",
//           },

//           select: {
//             id: true,
//             title: true,
//             position: true,
//             duration: true,
//           },
//         },
//       },
//     })

//   // ==========================================================
//   // FLATTEN LESSONS
//   // ==========================================================

//   const allLessons =
//     chapters.flatMap((chapter) =>
//       chapter.lessons.map((lessonItem) => ({
//         ...lessonItem,
//         chapterId: chapter.id,
//       }))
//     )

//   // ==========================================================
//   // GET USER PROGRESS
//   // ==========================================================

//   const lessonIds = allLessons.map(
//     (item) => item.id
//   )

//   const lessonProgress =
//     lessonIds.length > 0
//       ? await prisma.lessonProgress.findMany({
//           where: {
//             userId: session.user.id,

//             lessonId: {
//               in: lessonIds,
//             },
//           },

//           select: {
//             lessonId: true,
//             progress: true,
//             completed: true,
//           },
//         })
//       : []

//   // ==========================================================
//   // COMPLETED LESSON IDS
//   // ==========================================================

//   const completedLessonIds = new Set(
//     lessonProgress
//       .filter((item) => item.completed)
//       .map((item) => item.lessonId)
//   )

//   // ==========================================================
//   // COURSE PROGRESS
//   // ==========================================================

//   const completedLessonsCount =
//     completedLessonIds.size

//   const totalLessons = allLessons.length

//   const courseProgress =
//     totalLessons > 0
//       ? Math.round(
//           (completedLessonsCount /
//             totalLessons) *
//             100
//         )
//       : 0

//   // ==========================================================
//   // CURRENT INDEX
//   // ==========================================================

//   const currentIndex =
//     allLessons.findIndex(
//       (item) => item.id === lesson.id
//     )

//   const currentLessonNumber =
//     currentIndex >= 0
//       ? currentIndex + 1
//       : 1

//   // ==========================================================
//   // PREVIOUS
//   // ==========================================================

//   const previousLesson =
//     currentIndex > 0
//       ? allLessons[currentIndex - 1]
//       : null

//   // ==========================================================
//   // NEXT
//   // ==========================================================

//   const nextLesson =
//     currentIndex >= 0 &&
//     currentIndex < allLessons.length - 1
//       ? allLessons[currentIndex + 1]
//       : null

//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (
//     <main
//       dir="rtl"
//       className="min-h-screen bg-background"
//     >
//       {/* ==================================================== */}
//       {/* TOP HEADER */}
//       {/* ==================================================== */}

//       <header
//         className="
//           sticky
//           top-0
//           z-40
//           border-b
//           border-border/60
//           bg-background/90
//           backdrop-blur-xl
//         "
//       >
//         <div
//           className="
//             mx-auto
//             flex
//             h-16
//             max-w-[1600px]
//             items-center
//             justify-between
//             gap-4
//             px-4
//             sm:px-6
//             lg:px-8
//           "
//         >
//           {/* RIGHT - COURSE */}

//           <div className="flex min-w-0 items-center gap-3">
//             <Link
//               href={`/courses/${id}`}
//               className="
//                 flex
//                 size-10
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-xl
//                 border
//                 border-border
//                 bg-card
//                 text-muted-foreground
//                 transition-all
//                 hover:border-red-500/30
//                 hover:bg-red-500/10
//                 hover:text-red-500
//               "
//             >
//               <ArrowRight className="size-4" />
//             </Link>

//             <div className="min-w-0">
//               <p
//                 className="
//                   text-[10px]
//                   font-bold
//                   uppercase
//                   tracking-wider
//                   text-muted-foreground
//                 "
//               >
//                 الكورس
//               </p>

//               <h1
//                 className="
//                   truncate
//                   text-sm
//                   font-black
//                 "
//               >
//                 {lesson.chapter.course.title}
//               </h1>
//             </div>
//           </div>

//           {/* LEFT - PROGRESS */}

//           <div
//             className="
//               hidden
//               items-center
//               gap-3
//               sm:flex
//             "
//           >
//             <div className="text-left">
//               <p className="text-[10px] font-bold text-muted-foreground">
//                 الدرس
//               </p>

//               <p className="text-sm font-black">
//                 {currentLessonNumber}{" "}
//                 <span className="text-muted-foreground">
//                   / {allLessons.length}
//                 </span>
//               </p>
//             </div>

//             <div
//               className="
//                 flex
//                 size-10
//                 items-center
//                 justify-center
//                 rounded-xl
//                 bg-red-500/10
//                 text-red-500
//               "
//             >
//               <PlayCircle className="size-5" />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ==================================================== */}
//       {/* MAIN */}
//       {/* ==================================================== */}

//       <div
//         className="
//           mx-auto
//           max-w-[1600px]
//           px-4
//           py-5
//           sm:px-6
//           lg:px-8
//           lg:py-8
//         "
//       >
//         <div
//           className="
//             grid
//             gap-6
//             lg:grid-cols-[minmax(0,1fr)_380px]
//             lg:items-start
//           "
//         >
//           {/* ================================================= */}
//           {/* LEFT SIDE */}
//           {/* ================================================= */}

//           <section className="min-w-0">
//             {/* ================================================= */}
//             {/* VIDEO CARD */}
//             {/* ================================================= */}

//             <div
//               className="
//                 overflow-hidden
//                 rounded-[24px]
//                 border
//                 border-border/60
//                 bg-black
//                 shadow-[0_20px_70px_rgba(0,0,0,0.12)]
//               "
//             >
//               {signedVideoUrl ? (
//                 <VideoPlayer
//                   src={signedVideoUrl}
//                   title={lesson.title}
//                   courseId={id}
//                   chapterId={lesson.chapter.id}
//                   lessonId={lesson.id}
//                 />
//               ) : (
//                 <div
//                   className="
//                     flex
//                     aspect-video
//                     items-center
//                     justify-center
//                     bg-zinc-950
//                     px-6
//                   "
//                 >
//                   <div className="text-center text-white">
//                     <div
//                       className="
//                         mx-auto
//                         flex
//                         size-16
//                         items-center
//                         justify-center
//                         rounded-2xl
//                         bg-white/10
//                       "
//                     >
//                       <Play
//                         className="
//                           size-7
//                           text-white/60
//                         "
//                       />
//                     </div>

//                     <p className="mt-5 text-lg font-black">
//                       تعذر تشغيل الفيديو
//                     </p>

//                     <p className="mt-2 text-sm text-white/50">
//                       لم يتم العثور على ملف
//                       الفيديو أو تعذر إنشاء
//                       رابط التشغيل.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* ================================================= */}
//             {/* LESSON HEADER */}
//             {/* ================================================= */}

//             <div
//               className="
//                 mt-6
//                 rounded-[24px]
//                 border
//                 border-border/60
//                 bg-card
//                 p-5
//                 shadow-sm
//                 sm:p-7
//               "
//             >
//               {/* BREADCRUMB */}

//               <div
//                 className="
//                   flex
//                   flex-wrap
//                   items-center
//                   gap-2
//                   text-xs
//                   font-bold
//                   text-muted-foreground
//                 "
//               >
//                 <Link
//                   href={`/courses/${id}`}
//                   className="
//                     transition-colors
//                     hover:text-red-500
//                   "
//                 >
//                   {lesson.chapter.course.title}
//                 </Link>

//                 <span className="opacity-40">
//                   /
//                 </span>

//                 <span>
//                   {lesson.chapter.title}
//                 </span>
//               </div>

//               {/* TITLE */}

//               <div className="mt-5 flex gap-4">
//                 <div
//                   className="
//                     hidden
//                     size-12
//                     shrink-0
//                     items-center
//                     justify-center
//                     rounded-2xl
//                     bg-red-500
//                     text-white
//                     shadow-lg
//                     shadow-red-500/20
//                     sm:flex
//                   "
//                 >
//                   <PlayCircle className="size-6" />
//                 </div>

//                 <div className="min-w-0">
//                   <p
//                     className="
//                       mb-1
//                       text-xs
//                       font-black
//                       text-red-500
//                     "
//                   >
//                     الدرس {currentLessonNumber}
//                   </p>

//                   <h2
//                     className="
//                       text-2xl
//                       font-black
//                       tracking-tight
//                       sm:text-3xl
//                     "
//                   >
//                     {lesson.title}
//                   </h2>
//                 </div>
//               </div>

//               {/* DESCRIPTION */}

//               {lesson.description && (
//                 <div
//                   className="
//                     mt-7
//                     border-t
//                     border-border/60
//                     pt-6
//                   "
//                 >
//                   <h3 className="text-sm font-black">
//                     عن هذا الدرس
//                   </h3>

//                   <p
//                     className="
//                       mt-3
//                       whitespace-pre-wrap
//                       text-sm
//                       leading-8
//                       text-muted-foreground
//                     "
//                   >
//                     {lesson.description}
//                   </p>
//                 </div>
//               )}

//               {/* META */}

//               <div
//                 className="
//                   mt-6
//                   flex
//                   flex-wrap
//                   gap-2
//                 "
//               >
//                 <div
//                   className="
//                     inline-flex
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
//                   <Layers3 className="size-3.5" />
//                   {lesson.chapter.title}
//                 </div>

//                 {lesson.duration !== null && (
//                   <div
//                     className="
//                       inline-flex
//                       items-center
//                       gap-2
//                       rounded-xl
//                       bg-muted
//                       px-3
//                       py-2
//                       text-xs
//                       font-bold
//                       text-muted-foreground
//                     "
//                   >
//                     <Clock3 className="size-3.5" />

//                     {formatDuration(
//                       lesson.duration
//                     )}
//                   </div>
//                 )}

//                 {completedLessonIds.has(
//                   lesson.id
//                 ) && (
//                   <div
//                     className="
//                       inline-flex
//                       items-center
//                       gap-2
//                       rounded-xl
//                       bg-green-500/10
//                       px-3
//                       py-2
//                       text-xs
//                       font-bold
//                       text-green-600
//                     "
//                   >
//                     <CheckCircle2 className="size-3.5" />
//                     مكتمل
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* ================================================= */}
//             {/* PREVIOUS / NEXT */}
//             {/* ================================================= */}

//             <div
//               className="
//                 mt-5
//                 grid
//                 gap-3
//                 sm:grid-cols-2
//               "
//             >
//               {/* PREVIOUS */}

//               {previousLesson ? (
//                 <Link
//                   href={`/courses/${id}/lessons/${previousLesson.id}`}
//                   className="
//                     group
//                     rounded-[20px]
//                     border
//                     border-border/60
//                     bg-card
//                     p-4
//                     transition-all
//                     hover:-translate-y-0.5
//                     hover:border-red-500/30
//                     hover:shadow-lg
//                   "
//                 >
//                   <div
//                     className="
//                       flex
//                       items-center
//                       justify-between
//                       gap-3
//                     "
//                   >
//                     <div>
//                       <p
//                         className="
//                           text-[10px]
//                           font-black
//                           text-muted-foreground
//                         "
//                       >
//                         الدرس السابق
//                       </p>

//                       <p
//                         className="
//                           mt-1
//                           line-clamp-1
//                           text-sm
//                           font-black
//                         "
//                       >
//                         {previousLesson.title}
//                       </p>
//                     </div>

//                     <div
//                       className="
//                         flex
//                         size-9
//                         shrink-0
//                         items-center
//                         justify-center
//                         rounded-xl
//                         bg-muted
//                         transition-colors
//                         group-hover:bg-red-500/10
//                         group-hover:text-red-500
//                       "
//                     >
//                       <ArrowRight className="size-4" />
//                     </div>
//                   </div>
//                 </Link>
//               ) : (
//                 <div />
//               )}

//               {/* NEXT */}

//               {nextLesson ? (
//                 <Link
//                   href={`/courses/${id}/lessons/${nextLesson.id}`}
//                   className="
//                     group
//                     rounded-[20px]
//                     border
//                     border-red-500/20
//                     bg-red-500/[0.04]
//                     p-4
//                     transition-all
//                     hover:-translate-y-0.5
//                     hover:border-red-500/40
//                     hover:bg-red-500/[0.07]
//                     hover:shadow-lg
//                   "
//                 >
//                   <div
//                     className="
//                       flex
//                       items-center
//                       justify-between
//                       gap-3
//                     "
//                   >
//                     <div>
//                       <p
//                         className="
//                           text-[10px]
//                           font-black
//                           text-red-500
//                         "
//                       >
//                         الدرس التالي
//                       </p>

//                       <p
//                         className="
//                           mt-1
//                           line-clamp-1
//                           text-sm
//                           font-black
//                         "
//                       >
//                         {nextLesson.title}
//                       </p>
//                     </div>

//                     <div
//                       className="
//                         flex
//                         size-9
//                         shrink-0
//                         items-center
//                         justify-center
//                         rounded-xl
//                         bg-red-500
//                         text-white
//                         shadow-md
//                         shadow-red-500/20
//                         transition-transform
//                         group-hover:-translate-x-1
//                       "
//                     >
//                       <ArrowLeft className="size-4" />
//                     </div>
//                   </div>
//                 </Link>
//               ) : (
//                 <div
//                   className="
//                     rounded-[20px]
//                     border
//                     border-green-500/20
//                     bg-green-500/[0.04]
//                     p-4
//                   "
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className="
//                         flex
//                         size-9
//                         items-center
//                         justify-center
//                         rounded-xl
//                         bg-green-500/10
//                         text-green-600
//                       "
//                     >
//                       <CheckCircle2 className="size-5" />
//                     </div>

//                     <div>
//                       <p className="text-[10px] font-black text-green-600">
//                         أحسنت!
//                       </p>

//                       <p className="mt-1 text-sm font-black">
//                         وصلت إلى نهاية الكورس
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* ================================================= */}
//           {/* RIGHT SIDE - COURSE CONTENT */}
//           {/* ================================================= */}

//           <aside
//             className="
//               h-fit
//               overflow-hidden
//               rounded-[24px]
//               border
//               border-border/60
//               bg-card
//               shadow-sm
//               lg:sticky
//               lg:top-[88px]
//             "
//           >
//             {/* SIDEBAR HEADER */}

//             <div
//               className="
//                 border-b
//                 border-border/60
//                 bg-muted/[0.25]
//                 p-5
//               "
//             >
//               <div
//                 className="
//                   flex
//                   items-center
//                   justify-between
//                   gap-3
//                 "
//               >
//                 <div className="flex items-center gap-3">
//                   <div
//                     className="
//                       flex
//                       size-11
//                       items-center
//                       justify-center
//                       rounded-2xl
//                       bg-red-500
//                       text-white
//                       shadow-lg
//                       shadow-red-500/20
//                     "
//                   >
//                     <BookOpen className="size-5" />
//                   </div>

//                   <div>
//                     <h2 className="text-sm font-black">
//                       محتوى الكورس
//                     </h2>

//                     <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
//                       {chapters.length} فصل •{" "}
//                       {allLessons.length} درس
//                     </p>
//                   </div>
//                 </div>

//                 <div
//                   className="
//                     rounded-xl
//                     bg-background
//                     px-2.5
//                     py-1.5
//                     text-[10px]
//                     font-black
//                     text-muted-foreground
//                   "
//                 >
//                   {currentLessonNumber}/
//                   {allLessons.length}
//                 </div>
//               </div>

//               {/* COURSE PROGRESS */}

//               <div className="mt-5">
//                 <div
//                   className="
//                     mb-2
//                     flex
//                     items-center
//                     justify-between
//                     text-[10px]
//                     font-bold
//                     text-muted-foreground
//                   "
//                 >
//                   <span>
//                     تقدمك في الكورس
//                   </span>

//                   <span className="text-red-500">
//                     {courseProgress}%
//                   </span>
//                 </div>

//                 <div
//                   className="
//                     h-1.5
//                     overflow-hidden
//                     rounded-full
//                     bg-muted
//                   "
//                 >
//                   <div
//                     className="
//                       h-full
//                       rounded-full
//                       bg-red-500
//                       transition-all
//                     "
//                     style={{
//                       width: `${courseProgress}%`,
//                     }}
//                   />
//                 </div>

//                 <p
//                   className="
//                     mt-2
//                     text-[10px]
//                     font-semibold
//                     text-muted-foreground
//                   "
//                 >
//                   أكملت {completedLessonsCount} من{" "}
//                   {totalLessons} درس
//                 </p>
//               </div>
//             </div>

//             {/* CHAPTERS */}

//             <div
//               className="
//                 max-h-[calc(100vh-220px)]
//                 overflow-y-auto
//                 p-3
//               "
//             >
//               {chapters.map(
//                 (chapter, chapterIndex) => {
//                   const chapterHasCurrentLesson =
//                     chapter.lessons.some(
//                       (item) =>
//                         item.id === lesson.id
//                     )

//                   return (
//                     <div
//                       key={chapter.id}
//                       className="
//                         mb-3
//                         overflow-hidden
//                         rounded-2xl
//                         border
//                         border-border/50
//                         last:mb-0
//                       "
//                     >
//                       {/* CHAPTER HEADER */}

//                       <div
//                         className={[
//                           "flex items-center gap-3 px-4 py-3",
//                           chapterHasCurrentLesson
//                             ? "bg-red-500/[0.05]"
//                             : "bg-muted/[0.2]",
//                         ].join(" ")}
//                       >
//                         <div
//                           className={[
//                             "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-black",
//                             chapterHasCurrentLesson
//                               ? "bg-red-500 text-white"
//                               : "bg-muted text-muted-foreground",
//                           ].join(" ")}
//                         >
//                           {chapterIndex + 1}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <p
//                             className="
//                               truncate
//                               text-xs
//                               font-black
//                             "
//                           >
//                             {chapter.title}
//                           </p>

//                           <p
//                             className="
//                               mt-0.5
//                               text-[10px]
//                               font-semibold
//                               text-muted-foreground
//                             "
//                           >
//                             {chapter.lessons.length} درس
//                           </p>
//                         </div>

//                         <ChevronDown
//                           className="
//                             size-4
//                             shrink-0
//                             text-muted-foreground
//                           "
//                         />
//                       </div>

//                       {/* LESSONS */}

//                       <div className="border-t border-border/50 p-1.5">
//                         {chapter.lessons.map(
//                           (
//                             chapterLesson,
//                             index
//                           ) => {
//                             const isCurrent =
//                               chapterLesson.id ===
//                               lesson.id

//                             const isCompleted =
//                               completedLessonIds.has(
//                                 chapterLesson.id
//                               )

//                             return (
//                               <Link
//                                 key={
//                                   chapterLesson.id
//                                 }
//                                 href={`/courses/${id}/lessons/${chapterLesson.id}`}
//                                 className={[
//                                   "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all",
//                                   isCurrent
//                                     ? "bg-red-500 text-white shadow-md shadow-red-500/15"
//                                     : "hover:bg-muted",
//                                 ].join(" ")}
//                               >
//                                 {/* NUMBER */}

//                                 <div
//                                   className={[
//                                     "flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black",
//                                     isCurrent
//                                       ? "bg-white/15 text-white"
//                                       : isCompleted
//                                       ? "bg-green-500/10 text-green-600"
//                                       : "bg-muted text-muted-foreground",
//                                   ].join(" ")}
//                                 >
//                                   {isCurrent ? (
//                                     <Play className="size-3 fill-current" />
//                                   ) : isCompleted ? (
//                                     <CheckCircle2 className="size-4" />
//                                   ) : (
//                                     index + 1
//                                   )}
//                                 </div>

//                                 {/* TITLE */}

//                                 <div className="min-w-0 flex-1">
//                                   <p
//                                     className="
//                                       line-clamp-2
//                                       text-xs
//                                       font-bold
//                                       leading-5
//                                     "
//                                   >
//                                     {
//                                       chapterLesson.title
//                                     }
//                                   </p>

//                                   {chapterLesson.duration !==
//                                     null && (
//                                     <p
//                                       className={[
//                                         "mt-1 text-[9px] font-semibold",
//                                         isCurrent
//                                           ? "text-white/60"
//                                           : "text-muted-foreground",
//                                       ].join(" ")}
//                                     >
//                                       {formatDuration(
//                                         chapterLesson.duration
//                                       )}
//                                     </p>
//                                   )}
//                                 </div>

//                                 {/* COMPLETED */}

//                                 {isCompleted &&
//                                   !isCurrent && (
//                                     <CheckCircle2
//                                       className="
//                                         size-4
//                                         shrink-0
//                                         text-green-500
//                                       "
//                                     />
//                                   )}

//                                 {/* CURRENT */}

//                                 {isCurrent && (
//                                   <div
//                                     className="
//                                       size-1.5
//                                       shrink-0
//                                       rounded-full
//                                       bg-white
//                                     "
//                                   />
//                                 )}
//                               </Link>
//                             )
//                           }
//                         )}

//                         {chapter.lessons.length ===
//                           0 && (
//                           <div
//                             className="
//                               px-3
//                               py-4
//                               text-center
//                               text-[10px]
//                               font-semibold
//                               text-muted-foreground
//                             "
//                           >
//                             لا توجد دروس في هذا
//                             الفصل
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )
//                 }
//               )}
//             </div>
//           </aside>
//         </div>
//       </div>
//     </main>
//   )
// }

// // ============================================================
// // FORMAT DURATION
// // ============================================================

// function formatDuration(seconds: number) {
//   if (
//     !Number.isFinite(seconds) ||
//     seconds < 0
//   ) {
//     return "00:00"
//   }

//   const hours = Math.floor(seconds / 3600)

//   const minutes = Math.floor(
//     (seconds % 3600) / 60
//   )

//   const remainingSeconds = Math.floor(
//     seconds % 60
//   )

//   const paddedMinutes = minutes
//     .toString()
//     .padStart(2, "0")

//   const paddedSeconds = remainingSeconds
//     .toString()
//     .padStart(2, "0")

//   if (hours > 0) {
//     return `${hours}:${paddedMinutes}:${paddedSeconds}`
//   }

//   return `${minutes
//     .toString()
//     .padStart(2, "0")}:${paddedSeconds}`
// }










import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Layers3,
  Play,
  PlayCircle,
} from "lucide-react"

import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { env } from "@/lib/env"
import { s3 } from "@/lib/s3-client"

import VideoPlayer from "@/components/video-player"

// ============================================================
// TYPES
// ============================================================

type PageProps = {
  params: Promise<{
    id: string
    lessonId: string
  }>
}

// ============================================================
// GET VIDEO SIGNED URL
// ============================================================

async function getVideoUrl(videoKey: string | null) {
  if (!videoKey) {
    return null
  }

  try {
    const command = new GetObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: videoKey,
    })

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 60,
    })

    return signedUrl
  } catch (error) {
    console.error(
      "Failed to generate lesson video URL:",
      error
    )

    return null
  }
}

// ============================================================
// LESSON PAGE
// ============================================================

export default async function LessonPage({
  params,
}: PageProps) {
  const { id, lessonId } = await params

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // ==========================================================
  // NOT LOGGED IN
  // ==========================================================

  if (!session?.user) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(
        `/courses/${id}/lessons/${lessonId}`
      )}`
    )
  }

  // ==========================================================
  // GET COURSE
  // ==========================================================

  const course = await prisma.course.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      price: true,
      isPublished: true,
    },
  })

  // ==========================================================
  // COURSE NOT FOUND
  // ==========================================================

  if (!course) {
    notFound()
  }

  // ==========================================================
  // COURSE NOT PUBLISHED
  // ==========================================================

  if (!course.isPublished) {
    notFound()
  }

  // ==========================================================
  // GET LESSON
  //
  // IMPORTANT:
  // We fetch the lesson BEFORE checking enrollment
  // because free lessons inside paid courses must work.
  // ==========================================================

  const lesson =
    await prisma.lesson.findFirst({
      where: {
        id: lessonId,

        chapter: {
          courseId: id,
        },
      },

      select: {
        id: true,
        title: true,
        description: true,
        position: true,
        duration: true,

        videoUrl: true,
        videoKey: true,
        videoType: true,

        // IMPORTANT
        isFree: true,

        chapter: {
          select: {
            id: true,
            title: true,
            position: true,

            course: {
              select: {
                id: true,
                title: true,
                isPublished: true,
              },
            },
          },
        },
      },
    })

  // ==========================================================
  // LESSON NOT FOUND
  // ==========================================================

  if (!lesson) {
    notFound()
  }

  // ==========================================================
  // COURSE NOT PUBLISHED
  // ==========================================================

  if (!lesson.chapter.course.isPublished) {
    notFound()
  }

  // ==========================================================
  // CHECK ENROLLMENT
  // ==========================================================

  const enrollment =
    await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: id,
        },
      },

      select: {
        id: true,
      },
    })

  const isEnrolled = !!enrollment

  // ==========================================================
  // ACCESS CONTROL
  //
  // FREE LESSON:
  // Allowed even if the course is paid.
  //
  // PAID LESSON:
  // Requires enrollment.
  //
  // FREE COURSE:
  // Allowed.
  // ==========================================================

  const canAccessLesson =
    lesson.isFree ||
    isEnrolled ||
    course.price === 0

  if (!canAccessLesson) {
    redirect(`/courses/${id}`)
  }

  // ==========================================================
  // GENERATE SIGNED VIDEO URL
  //
  // KEEP THIS FLOW.
  // ==========================================================

  const signedVideoUrl = await getVideoUrl(
    lesson.videoKey
  )

  // ==========================================================
  // GET ALL CHAPTERS
  // ==========================================================

  const chapters =
    await prisma.chapter.findMany({
      where: {
        courseId: id,
      },

      orderBy: {
        position: "asc",
      },

      select: {
        id: true,
        title: true,
        position: true,

        lessons: {
          orderBy: {
            position: "asc",
          },

          select: {
            id: true,
            title: true,
            position: true,
            duration: true,
            isFree: true,
          },
        },
      },
    })

  // ==========================================================
  // FLATTEN LESSONS
  // ==========================================================

  const allLessons =
    chapters.flatMap((chapter) =>
      chapter.lessons.map((lessonItem) => ({
        ...lessonItem,
        chapterId: chapter.id,
      }))
    )

  // ==========================================================
  // GET USER PROGRESS
  // ==========================================================

  const lessonIds = allLessons.map(
    (item) => item.id
  )

  const lessonProgress =
    lessonIds.length > 0
      ? await prisma.lessonProgress.findMany({
          where: {
            userId: session.user.id,

            lessonId: {
              in: lessonIds,
            },
          },

          select: {
            lessonId: true,
            progress: true,
            completed: true,
          },
        })
      : []

  // ==========================================================
  // COMPLETED LESSON IDS
  // ==========================================================

  const completedLessonIds = new Set(
    lessonProgress
      .filter((item) => item.completed)
      .map((item) => item.lessonId)
  )

  // ==========================================================
  // COURSE PROGRESS
  // ==========================================================

  const completedLessonsCount =
    completedLessonIds.size

  const totalLessons = allLessons.length

  const courseProgress =
    totalLessons > 0
      ? Math.round(
          (completedLessonsCount /
            totalLessons) *
            100
        )
      : 0

  // ==========================================================
  // CURRENT INDEX
  // ==========================================================

  const currentIndex =
    allLessons.findIndex(
      (item) => item.id === lesson.id
    )

  const currentLessonNumber =
    currentIndex >= 0
      ? currentIndex + 1
      : 1

  // ==========================================================
  // PREVIOUS
  // ==========================================================

  const previousLesson =
    currentIndex > 0
      ? allLessons[currentIndex - 1]
      : null

  // ==========================================================
  // NEXT
  // ==========================================================

  const nextLesson =
    currentIndex >= 0 &&
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-background"
    >
      {/* ==================================================== */}
      {/* TOP HEADER */}
      {/* ==================================================== */}

      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-border/60
          bg-background/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            max-w-[1600px]
            items-center
            justify-between
            gap-4
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* RIGHT - COURSE */}

          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/courses/${id}`}
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-card
                text-muted-foreground
                transition-all
                hover:border-red-500/30
                hover:bg-red-500/10
                hover:text-red-500
              "
            >
              <ArrowRight className="size-4" />
            </Link>

            <div className="min-w-0">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-muted-foreground
                "
              >
                الكورس
              </p>

              <h1
                className="
                  truncate
                  text-sm
                  font-black
                "
              >
                {lesson.chapter.course.title}
              </h1>
            </div>
          </div>

          {/* LEFT - PROGRESS */}

          <div
            className="
              hidden
              items-center
              gap-3
              sm:flex
            "
          >
            <div className="text-left">
              <p className="text-[10px] font-bold text-muted-foreground">
                الدرس
              </p>

              <p className="text-sm font-black">
                {currentLessonNumber}{" "}
                <span className="text-muted-foreground">
                  / {allLessons.length}
                </span>
              </p>
            </div>

            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
                text-red-500
              "
            >
              <PlayCircle className="size-5" />
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================== */}
      {/* MAIN */}
      {/* ==================================================== */}

      <div
        className="
          mx-auto
          max-w-[1600px]
          px-4
          py-5
          sm:px-6
          lg:px-8
          lg:py-8
        "
      >
        <div
          className="
            grid
            gap-6
            lg:grid-cols-[minmax(0,1fr)_380px]
            lg:items-start
          "
        >
          {/* ================================================= */}
          {/* LEFT SIDE */}
          {/* ================================================= */}

          <section className="min-w-0">
            {/* ================================================= */}
            {/* VIDEO CARD */}
            {/* ================================================= */}

            <div
              className="
                overflow-hidden
                rounded-[24px]
                border
                border-border/60
                bg-black
                shadow-[0_20px_70px_rgba(0,0,0,0.12)]
              "
            >
              {signedVideoUrl ? (
                <VideoPlayer
                  src={signedVideoUrl}
                  title={lesson.title}
                  courseId={id}
                  chapterId={lesson.chapter.id}
                  lessonId={lesson.id}
                />
              ) : (
                <div
                  className="
                    flex
                    aspect-video
                    items-center
                    justify-center
                    bg-zinc-950
                    px-6
                  "
                >
                  <div className="text-center text-white">
                    <div
                      className="
                        mx-auto
                        flex
                        size-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white/10
                      "
                    >
                      <Play
                        className="
                          size-7
                          text-white/60
                        "
                      />
                    </div>

                    <p className="mt-5 text-lg font-black">
                      تعذر تشغيل الفيديو
                    </p>

                    <p className="mt-2 text-sm text-white/50">
                      لم يتم العثور على ملف
                      الفيديو أو تعذر إنشاء
                      رابط التشغيل.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* LESSON HEADER */}
            {/* ================================================= */}

            <div
              className="
                mt-6
                rounded-[24px]
                border
                border-border/60
                bg-card
                p-5
                shadow-sm
                sm:p-7
              "
            >
              {/* BREADCRUMB */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  text-muted-foreground
                "
              >
                <Link
                  href={`/courses/${id}`}
                  className="
                    transition-colors
                    hover:text-red-500
                  "
                >
                  {lesson.chapter.course.title}
                </Link>

                <span className="opacity-40">
                  /
                </span>

                <span>
                  {lesson.chapter.title}
                </span>
              </div>

              {/* TITLE */}

              <div className="mt-5 flex gap-4">
                <div
                  className="
                    hidden
                    size-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-500
                    text-white
                    shadow-lg
                    shadow-red-500/20
                    sm:flex
                  "
                >
                  <PlayCircle className="size-6" />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      mb-1
                      text-xs
                      font-black
                      text-red-500
                    "
                  >
                    الدرس {currentLessonNumber}
                  </p>

                  <h2
                    className="
                      text-2xl
                      font-black
                      tracking-tight
                      sm:text-3xl
                    "
                  >
                    {lesson.title}
                  </h2>
                </div>
              </div>

              {/* DESCRIPTION */}

              {lesson.description && (
                <div
                  className="
                    mt-7
                    border-t
                    border-border/60
                    pt-6
                  "
                >
                  <h3 className="text-sm font-black">
                    عن هذا الدرس
                  </h3>

                  <p
                    className="
                      mt-3
                      whitespace-pre-wrap
                      text-sm
                      leading-8
                      text-muted-foreground
                    "
                  >
                    {lesson.description}
                  </p>
                </div>
              )}

              {/* META */}

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-2
                "
              >
                <div
                  className="
                    inline-flex
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
                  <Layers3 className="size-3.5" />
                  {lesson.chapter.title}
                </div>

                {lesson.duration !== null && (
                  <div
                    className="
                      inline-flex
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
                    <Clock3 className="size-3.5" />

                    {formatDuration(
                      lesson.duration
                    )}
                  </div>
                )}

                {lesson.isFree && (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-green-500/10
                      px-3
                      py-2
                      text-xs
                      font-bold
                      text-green-600
                    "
                  >
                    <CheckCircle2 className="size-3.5" />
                    درس مجاني
                  </div>
                )}

                {completedLessonIds.has(
                  lesson.id
                ) && (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-green-500/10
                      px-3
                      py-2
                      text-xs
                      font-bold
                      text-green-600
                    "
                  >
                    <CheckCircle2 className="size-3.5" />
                    مكتمل
                  </div>
                )}
              </div>
            </div>

            {/* ================================================= */}
            {/* PREVIOUS / NEXT */}
            {/* ================================================= */}

            <div
              className="
                mt-5
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              {/* PREVIOUS */}

              {previousLesson ? (
                <Link
                  href={`/courses/${id}/lessons/${previousLesson.id}`}
                  className="
                    group
                    rounded-[20px]
                    border
                    border-border/60
                    bg-card
                    p-4
                    transition-all
                    hover:-translate-y-0.5
                    hover:border-red-500/30
                    hover:shadow-lg
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[10px]
                          font-black
                          text-muted-foreground
                        "
                      >
                        الدرس السابق
                      </p>

                      <p
                        className="
                          mt-1
                          line-clamp-1
                          text-sm
                          font-black
                        "
                      >
                        {previousLesson.title}
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-muted
                        transition-colors
                        group-hover:bg-red-500/10
                        group-hover:text-red-500
                      "
                    >
                      <ArrowRight className="size-4" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {/* NEXT */}

              {nextLesson ? (
                <Link
                  href={`/courses/${id}/lessons/${nextLesson.id}`}
                  className="
                    group
                    rounded-[20px]
                    border
                    border-red-500/20
                    bg-red-500/[0.04]
                    p-4
                    transition-all
                    hover:-translate-y-0.5
                    hover:border-red-500/40
                    hover:bg-red-500/[0.07]
                    hover:shadow-lg
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[10px]
                          font-black
                          text-red-500
                        "
                      >
                        الدرس التالي
                      </p>

                      <p
                        className="
                          mt-1
                          line-clamp-1
                          text-sm
                          font-black
                        "
                      >
                        {nextLesson.title}
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-500
                        text-white
                        shadow-md
                        shadow-red-500/20
                        transition-transform
                        group-hover:-translate-x-1
                      "
                    >
                      <ArrowLeft className="size-4" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  className="
                    rounded-[20px]
                    border
                    border-green-500/20
                    bg-green-500/[0.04]
                    p-4
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        size-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-green-500/10
                        text-green-600
                      "
                    >
                      <CheckCircle2 className="size-5" />
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-green-600">
                        أحسنت!
                      </p>

                      <p className="mt-1 text-sm font-black">
                        وصلت إلى نهاية الكورس
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ================================================= */}
          {/* RIGHT SIDE - COURSE CONTENT */}
          {/* ================================================= */}

          <aside
            className="
              h-fit
              overflow-hidden
              rounded-[24px]
              border
              border-border/60
              bg-card
              shadow-sm
              lg:sticky
              lg:top-[88px]
            "
          >
            {/* SIDEBAR HEADER */}

            <div
              className="
                border-b
                border-border/60
                bg-muted/[0.25]
                p-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      size-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-red-500
                      text-white
                      shadow-lg
                      shadow-red-500/20
                    "
                  >
                    <BookOpen className="size-5" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black">
                      محتوى الكورس
                    </h2>

                    <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                      {chapters.length} فصل •{" "}
                      {allLessons.length} درس
                    </p>
                  </div>
                </div>

                <div
                  className="
                    rounded-xl
                    bg-background
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-black
                    text-muted-foreground
                  "
                >
                  {currentLessonNumber}/
                  {allLessons.length}
                </div>
              </div>

              {/* COURSE PROGRESS */}

              <div className="mt-5">
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    text-[10px]
                    font-bold
                    text-muted-foreground
                  "
                >
                  <span>
                    تقدمك في الكورس
                  </span>

                  <span className="text-red-500">
                    {courseProgress}%
                  </span>
                </div>

                <div
                  className="
                    h-1.5
                    overflow-hidden
                    rounded-full
                    bg-muted
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-red-500
                      transition-all
                    "
                    style={{
                      width: `${courseProgress}%`,
                    }}
                  />
                </div>

                <p
                  className="
                    mt-2
                    text-[10px]
                    font-semibold
                    text-muted-foreground
                  "
                >
                  أكملت {completedLessonsCount} من{" "}
                  {totalLessons} درس
                </p>
              </div>
            </div>

            {/* CHAPTERS */}

            <div
              className="
                max-h-[calc(100vh-220px)]
                overflow-y-auto
                p-3
              "
            >
              {chapters.map(
                (chapter, chapterIndex) => {
                  const chapterHasCurrentLesson =
                    chapter.lessons.some(
                      (item) =>
                        item.id === lesson.id
                    )

                  return (
                    <div
                      key={chapter.id}
                      className="
                        mb-3
                        overflow-hidden
                        rounded-2xl
                        border
                        border-border/50
                        last:mb-0
                      "
                    >
                      {/* CHAPTER HEADER */}

                      <div
                        className={[
                          "flex items-center gap-3 px-4 py-3",
                          chapterHasCurrentLesson
                            ? "bg-red-500/[0.05]"
                            : "bg-muted/[0.2]",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-black",
                            chapterHasCurrentLesson
                              ? "bg-red-500 text-white"
                              : "bg-muted text-muted-foreground",
                          ].join(" ")}
                        >
                          {chapterIndex + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              truncate
                              text-xs
                              font-black
                            "
                          >
                            {chapter.title}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[10px]
                              font-semibold
                              text-muted-foreground
                            "
                          >
                            {chapter.lessons.length} درس
                          </p>
                        </div>

                        <ChevronDown
                          className="
                            size-4
                            shrink-0
                            text-muted-foreground
                          "
                        />
                      </div>

                      {/* LESSONS */}

                      <div className="border-t border-border/50 p-1.5">
                        {chapter.lessons.map(
                          (
                            chapterLesson,
                            index
                          ) => {
                            const isCurrent =
                              chapterLesson.id ===
                              lesson.id

                            const isCompleted =
                              completedLessonIds.has(
                                chapterLesson.id
                              )

                            const canOpen =
                              chapterLesson.isFree ||
                              isEnrolled ||
                              course.price === 0

                            // ==================================================
                            // ACCESSIBLE LESSON
                            // ==================================================

                            if (canOpen) {
                              return (
                                <Link
                                  key={
                                    chapterLesson.id
                                  }
                                  href={`/courses/${id}/lessons/${chapterLesson.id}`}
                                  className={[
                                    "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all",
                                    isCurrent
                                      ? "bg-red-500 text-white shadow-md shadow-red-500/15"
                                      : "hover:bg-muted",
                                  ].join(" ")}
                                >
                                  {/* NUMBER */}

                                  <div
                                    className={[
                                      "flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black",
                                      isCurrent
                                        ? "bg-white/15 text-white"
                                        : isCompleted
                                        ? "bg-green-500/10 text-green-600"
                                        : "bg-muted text-muted-foreground",
                                    ].join(" ")}
                                  >
                                    {isCurrent ? (
                                      <Play className="size-3 fill-current" />
                                    ) : isCompleted ? (
                                      <CheckCircle2 className="size-4" />
                                    ) : (
                                      index + 1
                                    )}
                                  </div>

                                  {/* TITLE */}

                                  <div className="min-w-0 flex-1">
                                    <p
                                      className="
                                        line-clamp-2
                                        text-xs
                                        font-bold
                                        leading-5
                                      "
                                    >
                                      {
                                        chapterLesson.title
                                      }
                                    </p>

                                    {chapterLesson.duration !==
                                      null && (
                                      <p
                                        className={[
                                          "mt-1 text-[9px] font-semibold",
                                          isCurrent
                                            ? "text-white/60"
                                            : "text-muted-foreground",
                                        ].join(" ")}
                                      >
                                        {formatDuration(
                                          chapterLesson.duration
                                        )}
                                      </p>
                                    )}
                                  </div>

                                  {/* FREE BADGE */}

                                  {chapterLesson.isFree &&
                                    !isCurrent && (
                                      <span
                                        className="
                                          shrink-0
                                          rounded-md
                                          bg-green-500/10
                                          px-1.5
                                          py-1
                                          text-[8px]
                                          font-black
                                          text-green-600
                                        "
                                      >
                                        مجاني
                                      </span>
                                    )}

                                  {/* COMPLETED */}

                                  {isCompleted &&
                                    !isCurrent && (
                                      <CheckCircle2
                                        className="
                                          size-4
                                          shrink-0
                                          text-green-500
                                        "
                                      />
                                    )}

                                  {/* CURRENT */}

                                  {isCurrent && (
                                    <div
                                      className="
                                        size-1.5
                                        shrink-0
                                        rounded-full
                                        bg-white
                                      "
                                    />
                                  )}
                                </Link>
                              )
                            }

                            // ==================================================
                            // LOCKED LESSON
                            // ==================================================

                            return (
                              <div
                                key={
                                  chapterLesson.id
                                }
                                className="
                                  flex
                                  cursor-not-allowed
                                  items-center
                                  gap-3
                                  rounded-xl
                                  px-3
                                  py-3
                                  opacity-55
                                "
                              >
                                {/* NUMBER */}

                                <div
                                  className="
                                    flex
                                    size-7
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-muted
                                    text-[10px]
                                    font-black
                                    text-muted-foreground
                                  "
                                >
                                  {index + 1}
                                </div>

                                {/* TITLE */}

                                <div className="min-w-0 flex-1">
                                  <p
                                    className="
                                      line-clamp-2
                                      text-xs
                                      font-bold
                                      leading-5
                                      text-muted-foreground
                                    "
                                  >
                                    {
                                      chapterLesson.title
                                    }
                                  </p>

                                  {chapterLesson.duration !==
                                    null && (
                                    <p
                                      className="
                                        mt-1
                                        text-[9px]
                                        font-semibold
                                        text-muted-foreground
                                      "
                                    >
                                      {formatDuration(
                                        chapterLesson.duration
                                      )}
                                    </p>
                                  )}
                                </div>

                                {/* LOCK */}

                                <div
                                  className="
                                    shrink-0
                                    rounded-md
                                    bg-muted
                                    px-1.5
                                    py-1
                                    text-[8px]
                                    font-black
                                    text-muted-foreground
                                  "
                                >
                                  مقفول
                                </div>
                              </div>
                            )
                          }
                        )}

                        {chapter.lessons.length ===
                          0 && (
                          <div
                            className="
                              px-3
                              py-4
                              text-center
                              text-[10px]
                              font-semibold
                              text-muted-foreground
                            "
                          >
                            لا توجد دروس في هذا
                            الفصل
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

// ============================================================
// FORMAT DURATION
// ============================================================

function formatDuration(seconds: number) {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return "00:00"
  }

  const hours = Math.floor(seconds / 3600)

  const minutes = Math.floor(
    (seconds % 3600) / 60
  )

  const remainingSeconds = Math.floor(
    seconds % 60
  )

  const paddedMinutes = minutes
    .toString()
    .padStart(2, "0")

  const paddedSeconds = remainingSeconds
    .toString()
    .padStart(2, "0")

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`
  }

  return `${minutes
    .toString()
    .padStart(2, "0")}:${paddedSeconds}`
}

