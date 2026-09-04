
// import {
//   BookOpen,
//   Plus,
//   Search,
//   Eye,
//   Pencil,
//   Trash2,
//   GraduationCap,
//   CalendarDays,
//   Layers3,
//   Sparkles,
// } from "lucide-react"

// import Link from "next/link"
// import DeleteCourseButton from "@/components/admin/delete-course-button"
// import { requireAdmin } from "@/lib/require-admin"
// import { adminGetCourses } from "@/app/data/admin/admin-get-courses"

// export default async function CoursesPage() {
//   await requireAdmin()

//   const courses = await adminGetCourses()

//   return (
//     <div
//       dir="rtl"
//       className="min-h-full px-4 pb-10 lg:px-6"
//     >
//       {/* ========================================================= */}
//       {/* HEADER */}
//       {/* ========================================================= */}

//       <div className="mb-7">
//         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

//           <div className="flex items-center gap-4">

//             <div
//               className="
//                 flex
//                 size-14
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-2xl
//                 bg-gradient-to-br
//                 from-red-500
//                 to-rose-600
//                 text-white
//                 shadow-xl
//                 shadow-red-500/20
//               "
//             >
//               <BookOpen className="size-6" />
//             </div>

//             <div>

//               <div className="mb-1.5 flex items-center gap-2">

//                 <span
//                   className="
//                     inline-flex
//                     items-center
//                     gap-1.5
//                     rounded-full
//                     border
//                     border-red-500/20
//                     bg-red-500/10
//                     px-2.5
//                     py-1
//                     text-[10px]
//                     font-bold
//                     text-red-500
//                   "
//                 >
//                   <Sparkles className="size-3" />
//                   إدارة المحتوى
//                 </span>

//               </div>

//               <h1 className="text-2xl font-black">
//                 الكورسات
//               </h1>

//               <p className="mt-1 text-sm text-muted-foreground">
//                 إدارة وتنظيم جميع الكورسات التعليمية
//               </p>

//             </div>
//           </div>

//           <Link
//             href="/admin/courses/create"
//             className="
//               inline-flex
//               h-11
//               items-center
//               justify-center
//               gap-2
//               rounded-xl
//               bg-gradient-to-r
//               from-red-500
//               to-rose-600
//               px-5
//               text-sm
//               font-black
//               text-white
//               shadow-lg
//               shadow-red-500/20
//               transition-all
//               hover:-translate-y-0.5
//               hover:shadow-xl
//               hover:shadow-red-500/25
//             "
//           >
//             <Plus className="size-4" />
//             إضافة كورس
//           </Link>

//         </div>
//       </div>

//       {/* ========================================================= */}
//       {/* MAIN CONTAINER */}
//       {/* ========================================================= */}

//       <div
//         className="
//           overflow-hidden
//           rounded-[28px]
//           border
//           border-border
//           bg-background
//           shadow-[0_15px_50px_rgba(0,0,0,0.05)]
//         "
//       >

//         {/* ======================================================= */}
//         {/* TOP BAR */}
//         {/* ======================================================= */}

//         <div
//           className="
//             border-b
//             border-border
//             bg-muted/[0.12]
//             p-5
//             sm:p-6
//           "
//         >

//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

//             {/* Search */}

//             <div
//               className="
//                 flex
//                 h-12
//                 w-full
//                 items-center
//                 gap-3
//                 rounded-xl
//                 border
//                 border-border
//                 bg-background
//                 px-4
//                 transition
//                 focus-within:border-red-500/50
//                 focus-within:ring-4
//                 focus-within:ring-red-500/10
//                 lg:max-w-md
//               "
//             >
//               <Search className="size-4 shrink-0 text-muted-foreground" />

//               <input
//                 type="text"
//                 placeholder="ابحث عن اسم الكورس..."
//                 className="
//                   w-full
//                   bg-transparent
//                   text-sm
//                   outline-none
//                   placeholder:text-muted-foreground
//                 "
//               />
//             </div>

//             {/* Count */}

//             <div className="flex items-center gap-3">

//               <div
//                 className="
//                   rounded-xl
//                   border
//                   border-border
//                   bg-background
//                   px-4
//                   py-2.5
//                 "
//               >
//                 <p className="text-[10px] font-bold text-muted-foreground">
//                   إجمالي الكورسات
//                 </p>

//                 <p className="mt-0.5 text-lg font-black">
//                   {courses.length}
//                 </p>
//               </div>

//             </div>

//           </div>

//         </div>

//         {/* ======================================================= */}
//         {/* COURSES */}
//         {/* ======================================================= */}

//         <div className="p-5 sm:p-6">

//           {courses.length === 0 ? (

//             /* =================================================== */
//             /* EMPTY STATE */
//             /* =================================================== */

//             <div
//               className="
//                 flex
//                 min-h-[380px]
//                 flex-col
//                 items-center
//                 justify-center
//                 rounded-2xl
//                 border-2
//                 border-dashed
//                 border-border
//                 bg-muted/[0.12]
//                 px-6
//                 text-center
//               "
//             >

//               <div
//                 className="
//                   flex
//                   size-16
//                   items-center
//                   justify-center
//                   rounded-2xl
//                   bg-red-500/10
//                   text-red-500
//                 "
//               >
//                 <BookOpen className="size-7" />
//               </div>

//               <h2 className="mt-5 text-lg font-black">
//                 لا توجد كورسات حالياً
//               </h2>

//               <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
//                 لم تقم بإضافة أي كورسات حتى الآن.
//                 يمكنك إنشاء أول كورس من خلال الزر بالأسفل.
//               </p>

//               <Link
//                 href="/admin/courses/create"
//                 className="
//                   mt-6
//                   inline-flex
//                   h-11
//                   items-center
//                   gap-2
//                   rounded-xl
//                   bg-red-500
//                   px-5
//                   text-sm
//                   font-bold
//                   text-white
//                   shadow-lg
//                   shadow-red-500/20
//                   transition
//                   hover:bg-red-600
//                 "
//               >
//                 <Plus className="size-4" />
//                 إنشاء أول كورس
//               </Link>

//             </div>

//           ) : (

//             /* =================================================== */
//             /* COURSE GRID */
//             /* =================================================== */

//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 md:grid-cols-2
//                 xl:grid-cols-3
//               "
//             >

//               {courses.map((course) => (

//                 <div
//                   key={course.id}
//                   className="
//                     group
//                     overflow-hidden
//                     rounded-2xl
//                     border
//                     border-border
//                     bg-background
//                     shadow-sm
//                     transition-all
//                     duration-300
//                     hover:-translate-y-1
//                     hover:border-red-500/30
//                     hover:shadow-xl
//                     hover:shadow-black/5
//                   "
//                 >

//                   {/* ================================================= */}
//                   {/* MEDIA */}
//                   {/* ================================================= */}

//                   <div className="relative h-48 overflow-hidden bg-muted">

//                     {course.mediaType === "VIDEO" ? (

//                       <div
//                         className="
//                           flex
//                           size-full
//                           items-center
//                           justify-center
//                           bg-gradient-to-br
//                           from-zinc-900
//                           via-zinc-800
//                           to-zinc-950
//                         "
//                       >
//                         <div
//                           className="
//                             flex
//                             size-14
//                             items-center
//                             justify-center
//                             rounded-full
//                             bg-white/10
//                             text-white
//                             backdrop-blur
//                           "
//                         >
//                           <Eye className="size-6" />
//                         </div>
//                       </div>

//                     ) : course.mediaUrl ? (

//                       <img
//                         src={course.mediaUrl}
//                         alt={course.title}
//                         className="
//                           size-full
//                           object-cover
//                           transition-transform
//                           duration-500
//                           group-hover:scale-105
//                         "
//                       />

//                     ) : (

//                       <div
//                         className="
//                           flex
//                           size-full
//                           items-center
//                           justify-center
//                           bg-gradient-to-br
//                           from-red-500/10
//                           via-background
//                           to-rose-500/10
//                         "
//                       >
//                         <BookOpen className="size-12 text-red-500/30" />
//                       </div>

//                     )}

//                     {/* Overlay */}

//                     <div
//                       className="
//                         pointer-events-none
//                         absolute
//                         inset-0
//                         bg-gradient-to-t
//                         from-black/50
//                         via-transparent
//                         to-transparent
//                       "
//                     />

//                     {/* Status */}

//                     <div className="absolute right-3 top-3">

//                       {course.isPublished ? (

//                         <span
//                           className="
//                             inline-flex
//                             items-center
//                             gap-1.5
//                             rounded-full
//                             border
//                             border-emerald-400/20
//                             bg-emerald-500/90
//                             px-2.5
//                             py-1
//                             text-[10px]
//                             font-bold
//                             text-white
//                             shadow-lg
//                             backdrop-blur
//                           "
//                         >
//                           <span className="size-1.5 rounded-full bg-white" />
//                           منشور
//                         </span>

//                       ) : (

//                         <span
//                           className="
//                             inline-flex
//                             items-center
//                             gap-1.5
//                             rounded-full
//                             border
//                             border-white/20
//                             bg-black/60
//                             px-2.5
//                             py-1
//                             text-[10px]
//                             font-bold
//                             text-white
//                             backdrop-blur
//                           "
//                         >
//                           مسودة
//                         </span>

//                       )}

//                     </div>

//                     {/* Price */}

//                     <div className="absolute bottom-3 left-3">

//                       <div
//                         className="
//                           rounded-lg
//                           bg-black/60
//                           px-3
//                           py-1.5
//                           text-xs
//                           font-black
//                           text-white
//                           backdrop-blur-md
//                         "
//                       >
//                         {Number(course.price).toLocaleString("ar-EG")} جنيه
//                       </div>

//                     </div>

//                   </div>

//                   {/* ================================================= */}
//                   {/* CONTENT */}
//                   {/* ================================================= */}

//                   <div className="p-5">

//                     {/* Title */}

//                     <h2
//                       className="
//                         line-clamp-2
//                         min-h-[48px]
//                         text-base
//                         font-black
//                         leading-6
//                         transition-colors
//                         group-hover:text-red-500
//                       "
//                     >
//                       {course.title}
//                     </h2>

//                     {/* Subject */}

//                     <div className="mt-4 flex items-center gap-2">

//                       <div
//                         className="
//                           flex
//                           size-8
//                           shrink-0
//                           items-center
//                           justify-center
//                           rounded-lg
//                           bg-red-500/10
//                           text-red-500
//                         "
//                       >
//                         <BookOpen className="size-4" />
//                       </div>

//                       <div className="min-w-0">

//                         <p className="text-[10px] font-bold text-muted-foreground">
//                           المادة
//                         </p>

//                         <p className="truncate text-xs font-bold">
//                           {course.subject?.name ?? "غير محدد"}
//                         </p>

//                       </div>

//                     </div>

//                     {/* ================================================= */}
//                     {/* INFO GRID */}
//                     {/* ================================================= */}

//                     <div
//                       className="
//                         mt-5
//                         grid
//                         grid-cols-2
//                         gap-2
//                       "
//                     >

//                       {/* ================================================= */}
//                       {/* EDUCATION TYPE */}
//                       {/* ================================================= */}

//                       <div
//                         className="
//                           rounded-xl
//                           border
//                           border-border
//                           bg-muted/[0.18]
//                           p-3
//                         "
//                       >

//                         <div className="flex items-center gap-2">

//                           <GraduationCap className="size-3.5 text-red-500" />

//                           <span className="text-[10px] font-bold text-muted-foreground">
//                             المرحلة
//                           </span>

//                         </div>

//                         <p className="mt-1 text-xs font-black">
//                           {getEducationLabel(
//                             course.educationType
//                           )}
//                         </p>

//                       </div>

//                       {/* ================================================= */}
//                       {/* ACADEMIC LEVEL */}
//                       {/* ================================================= */}

//                       <div
//                         className="
//                           rounded-xl
//                           border
//                           border-border
//                           bg-muted/[0.18]
//                           p-3
//                         "
//                       >

//                         <div className="flex items-center gap-2">

//                           <Layers3 className="size-3.5 text-red-500" />

//                           <span className="text-[10px] font-bold text-muted-foreground">
//                             المستوى الدراسي
//                           </span>

//                         </div>

//                         <p className="mt-1 text-xs font-black">
//                           {getAcademicLevelLabel(
//                             course.academicLevel
//                           )}
//                         </p>

//                       </div>

//                     </div>

//                     {/* ================================================= */}
//                     {/* FOOTER */}
//                     {/* ================================================= */}

//                     <div
//                       className="
//                         mt-5
//                         flex
//                         items-center
//                         justify-between
//                         border-t
//                         border-border
//                         pt-4
//                       "
//                     >

//                       <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">

//                         <CalendarDays className="size-3.5" />

//                         <span>
//                           {formatDate(course.createdAt)}
//                         </span>

//                       </div>

//                       <div className="flex items-center gap-1.5">

//                         {/* View */}

//                         <Link
//                           href={`/admin/courses/${course.id}`}
//                           title="عرض الكورس"
//                           className="
//                             flex
//                             size-8
//                             items-center
//                             justify-center
//                             rounded-lg
//                             border
//                             border-border
//                             bg-background
//                             text-muted-foreground
//                             transition
//                             hover:border-blue-500/30
//                             hover:bg-blue-500/10
//                             hover:text-blue-500
//                           "
//                         >
//                           <Eye className="size-3.5" />
//                         </Link>

//                         {/* Edit */}

//                         <Link
//                           href={`/admin/courses/${course.id}/edit`}
//                           title="تعديل الكورس"
//                           className="
//                             flex
//                             size-8
//                             items-center
//                             justify-center
//                             rounded-lg
//                             border
//                             border-border
//                             bg-background
//                             text-muted-foreground
//                             transition
//                             hover:border-amber-500/30
//                             hover:bg-amber-500/10
//                             hover:text-amber-500
//                           "
//                         >
//                           <Pencil className="size-3.5" />
//                         </Link>

//                         {/* Delete */}

//                         <DeleteCourseButton
//   courseId={course.id}
//   courseTitle={course.title}
// />

//                       </div>

//                     </div>

//                   </div>

//                 </div>

//               ))}

//             </div>

//           )}

//         </div>

//       </div>

//       {/* ========================================================= */}
//       {/* FOOTER */}
//       {/* ========================================================= */}

//       <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">

//         <Sparkles className="size-3 text-red-500" />

//         <span>
//           YAKKAN.EG — إدارة الكورسات التعليمية
//         </span>

//       </div>
         
//     </div>
//   )
// }

// /* ============================================================= */
// /* EDUCATION LABEL */
// /* ============================================================= */

// function getEducationLabel(
//   value: string
// ) {
//   switch (value) {
//     case "UNIVERSITY":
//       return "التعليم الجامعي"

//     case "SECONDARY":
//       return "الثانوية العامة"

//     default:
//       return value
//   }
// }

// /* ============================================================= */
// /* ACADEMIC LEVEL LABEL */
// /* ============================================================= */

// function getAcademicLevelLabel(
//   value: string
// ) {
//   switch (value) {

//     // ==========================================================
//     // UNIVERSITY
//     // ==========================================================

//     case "UNIVERSITY_LEVEL_1":
//       return "المستوى الأول"

//     case "UNIVERSITY_LEVEL_2":
//       return "المستوى الثاني"

//     case "UNIVERSITY_LEVEL_3":
//       return "المستوى الثالث"

//     case "UNIVERSITY_LEVEL_4":
//       return "المستوى الرابع"

//     // ==========================================================
//     // SECONDARY
//     // ==========================================================

//     case "SECONDARY_GRADE_1":
//       return "الصف الأول الثانوي"

//     case "SECONDARY_GRADE_2":
//       return "الصف الثاني الثانوي"

//     case "SECONDARY_GRADE_3":
//       return "الصف الثالث الثانوي"

//     default:
//       return value
//   }
// }

// /* ============================================================= */
// /* COURSE LEVEL LABEL */
// /* ============================================================= */

// function getLevelLabel(
//   value: string
// ) {
//   switch (value) {
//     case "BEGINNER":
//       return "مبتدئ"

//     case "INTERMEDIATE":
//       return "متوسط"

//     case "ADVANCED":
//       return "متقدم"

//     default:
//       return value
//   }
// }

// /* ============================================================= */
// /* DATE */
// /* ============================================================= */

// function formatDate(
//   date: Date | string
// ) {
//   return new Intl.DateTimeFormat(
//     "ar-EG",
//     {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     }
//   ).format(new Date(date))
// }











import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  GraduationCap,
  CalendarDays,
  Layers3,
  Sparkles,
} from "lucide-react"

import Link from "next/link"

import DeleteCourseButton from "@/components/admin/delete-course-button"
import { requireAdmin } from "@/lib/require-admin"
import { adminGetCourses } from "@/app/data/admin/admin-get-courses"

export default async function CoursesPage() {
  await requireAdmin()

  const courses = await adminGetCourses()

  return (
    <div
      dir="rtl"
      className="min-h-full px-4 pb-10 lg:px-6"
    >
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div className="mb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                size-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-red-500
                to-rose-600
                text-white
                shadow-xl
                shadow-red-500/20
              "
            >
              <BookOpen className="size-6" />
            </div>

            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    text-red-500
                  "
                >
                  <Sparkles className="size-3" />
                  إدارة المحتوى
                </span>
              </div>

              <h1 className="text-2xl font-black">
                الكورسات
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                إدارة وتنظيم جميع الكورسات التعليمية
              </p>
            </div>
          </div>

          <Link
            href="/admin/courses/create"
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-red-500
              to-rose-600
              px-5
              text-sm
              font-black
              text-white
              shadow-lg
              shadow-red-500/20
              transition-all
              hover:-translate-y-0.5
              hover:shadow-xl
              hover:shadow-red-500/25
            "
          >
            <Plus className="size-4" />
            إضافة كورس
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN CONTAINER */}
      {/* ========================================================= */}

      <div
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-border
          bg-background
          shadow-[0_15px_50px_rgba(0,0,0,0.05)]
        "
      >
        {/* ======================================================= */}
        {/* TOP BAR */}
        {/* ======================================================= */}

        <div
          className="
            border-b
            border-border
            bg-muted/[0.12]
            p-5
            sm:p-6
          "
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}

            <div
              className="
                flex
                h-12
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-border
                bg-background
                px-4
                transition
                focus-within:border-red-500/50
                focus-within:ring-4
                focus-within:ring-red-500/10
                lg:max-w-md
              "
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />

              <input
                type="text"
                placeholder="ابحث عن اسم الكورس..."
                className="
                  w-full
                  bg-transparent
                  text-sm
                  outline-none
                  placeholder:text-muted-foreground
                "
              />
            </div>

            {/* Count */}

            <div className="flex items-center gap-3">
              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-4
                  py-2.5
                "
              >
                <p className="text-[10px] font-bold text-muted-foreground">
                  إجمالي الكورسات
                </p>

                <p className="mt-0.5 text-lg font-black">
                  {courses.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* COURSES */}
        {/* ======================================================= */}

        <div className="p-5 sm:p-6">
          {courses.length === 0 ? (
            /* =================================================== */
            /* EMPTY STATE */
            /* =================================================== */

            <div
              className="
                flex
                min-h-[380px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                border-border
                bg-muted/[0.12]
                px-6
                text-center
              "
            >
              <div
                className="
                  flex
                  size-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-red-500/10
                  text-red-500
                "
              >
                <BookOpen className="size-7" />
              </div>

              <h2 className="mt-5 text-lg font-black">
                لا توجد كورسات حالياً
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                لم تقم بإضافة أي كورسات حتى الآن.
                يمكنك إنشاء أول كورس من خلال الزر بالأسفل.
              </p>

              <Link
                href="/admin/courses/create"
                className="
                  mt-6
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-red-500/20
                  transition
                  hover:bg-red-600
                "
              >
                <Plus className="size-4" />
                إنشاء أول كورس
              </Link>
            </div>
          ) : (
            /* =================================================== */
            /* COURSE GRID */
            /* =================================================== */

            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-red-500/30
                    hover:shadow-xl
                    hover:shadow-black/5
                  "
                >
                  {/* ================================================= */}
                  {/* MEDIA */}
                  {/* ================================================= */}

                  <div className="relative h-48 overflow-hidden bg-muted">
                    {course.mediaType === "VIDEO" ? (
                      <div
                        className="
                          flex
                          size-full
                          items-center
                          justify-center
                          bg-gradient-to-br
                          from-zinc-900
                          via-zinc-800
                          to-zinc-950
                        "
                      >
                        <div
                          className="
                            flex
                            size-14
                            items-center
                            justify-center
                            rounded-full
                            bg-white/10
                            text-white
                            backdrop-blur
                          "
                        >
                          <Eye className="size-6" />
                        </div>
                      </div>
                    ) : course.mediaUrl ? (
                      <img
                        src={course.mediaUrl}
                        alt={course.title}
                        className="
                          size-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          size-full
                          items-center
                          justify-center
                          bg-gradient-to-br
                          from-red-500/10
                          via-background
                          to-rose-500/10
                        "
                      >
                        <BookOpen className="size-12 text-red-500/30" />
                      </div>
                    )}

                    {/* Overlay */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/50
                        via-transparent
                        to-transparent
                      "
                    />

                    {/* Status */}

                    <div className="absolute right-3 top-3">
                      {course.isPublished ? (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-emerald-400/20
                            bg-emerald-500/90
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            text-white
                            shadow-lg
                            backdrop-blur
                          "
                        >
                          <span className="size-1.5 rounded-full bg-white" />
                          منشور
                        </span>
                      ) : (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-white/20
                            bg-black/60
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            text-white
                            backdrop-blur
                          "
                        >
                          مسودة
                        </span>
                      )}
                    </div>

                    {/* Price */}

                    <div className="absolute bottom-3 left-3">
                      <div
                        className="
                          rounded-lg
                          bg-black/60
                          px-3
                          py-1.5
                          text-xs
                          font-black
                          text-white
                          backdrop-blur-md
                        "
                      >
                        {Number(course.price).toLocaleString("ar-EG")} جنيه
                      </div>
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* CONTENT */}
                  {/* ================================================= */}

                  <div className="p-5">
                    {/* Title */}

                    <h2
                      className="
                        line-clamp-2
                        min-h-[48px]
                        text-base
                        font-black
                        leading-6
                        transition-colors
                        group-hover:text-red-500
                      "
                    >
                      {course.title}
                    </h2>

                    {/* Subject */}

                    <div className="mt-4 flex items-center gap-2">
                      <div
                        className="
                          flex
                          size-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-red-500/10
                          text-red-500
                        "
                      >
                        <BookOpen className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground">
                          المادة
                        </p>

                        <p className="truncate text-xs font-bold">
                          {course.subject?.name ?? "غير محدد"}
                        </p>
                      </div>
                    </div>

                    {/* ================================================= */}
                    {/* INFO GRID */}
                    {/* ================================================= */}

                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-2
                      "
                    >
                      {/* EDUCATION TYPE */}

                      <div
                        className="
                          rounded-xl
                          border
                          border-border
                          bg-muted/[0.18]
                          p-3
                        "
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="size-3.5 text-red-500" />

                          <span className="text-[10px] font-bold text-muted-foreground">
                            المرحلة
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-black">
                          {getEducationLabel(
                            course.educationType
                          )}
                        </p>
                      </div>

                      {/* ACADEMIC LEVEL */}

                      <div
                        className="
                          rounded-xl
                          border
                          border-border
                          bg-muted/[0.18]
                          p-3
                        "
                      >
                        <div className="flex items-center gap-2">
                          <Layers3 className="size-3.5 text-red-500" />

                          <span className="text-[10px] font-bold text-muted-foreground">
                            المستوى الدراسي
                          </span>
                        </div>

                        <p className="mt-1 text-xs font-black">
                          {getAcademicLevelLabel(
                            course.academicLevel
                          )}
                        </p>
                      </div>
                    </div>

                    {/* ================================================= */}
                    {/* FOOTER */}
                    {/* ================================================= */}

                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        border-t
                        border-border
                        pt-4
                      "
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <CalendarDays className="size-3.5" />

                        <span>
                          {formatDate(course.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* ================================================= */}
                        {/* CURRICULUM */}
                        {/* ================================================= */}

                        <Link
                          href={`/admin/courses/${course.id}/curriculum`}
                          title="إدارة محتوى الكورس"
                          className="
                            flex
                            h-8
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-red-500/20
                            bg-red-500/10
                            px-2.5
                            text-[10px]
                            font-bold
                            text-red-500
                            transition
                            hover:border-red-500/30
                            hover:bg-red-500
                            hover:text-white
                          "
                        >
                          <BookOpen className="size-3.5" />
                          المحتوى
                        </Link>

                        {/* ================================================= */}
                        {/* VIEW */}
                        {/* ================================================= */}

                        <Link
                          href={`/admin/courses/${course.id}`}
                          title="عرض الكورس"
                          className="
                            flex
                            size-8
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            bg-background
                            text-muted-foreground
                            transition
                            hover:border-blue-500/30
                            hover:bg-blue-500/10
                            hover:text-blue-500
                          "
                        >
                          <Eye className="size-3.5" />
                        </Link>

                        {/* ================================================= */}
                        {/* EDIT */}
                        {/* ================================================= */}

                        <Link
                          href={`/admin/courses/${course.id}/edit`}
                          title="تعديل الكورس"
                          className="
                            flex
                            size-8
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            bg-background
                            text-muted-foreground
                            transition
                            hover:border-amber-500/30
                            hover:bg-amber-500/10
                            hover:text-amber-500
                          "
                        >
                          <Pencil className="size-3.5" />
                        </Link>

                        {/* ================================================= */}
                        {/* DELETE */}
                        {/* ================================================= */}

                        <DeleteCourseButton
                          courseId={course.id}
                          courseTitle={course.title}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <Sparkles className="size-3 text-red-500" />

        <span>
          YAKKAN.EG — إدارة الكورسات التعليمية
        </span>
      </div>
    </div>
  )
}

/* ============================================================= */
/* EDUCATION LABEL */
/* ============================================================= */

function getEducationLabel(value: string) {
  switch (value) {
    case "UNIVERSITY":
      return "التعليم الجامعي"

    case "SECONDARY":
      return "الثانوية العامة"

    default:
      return value
  }
}

/* ============================================================= */
/* ACADEMIC LEVEL LABEL */
/* ============================================================= */

function getAcademicLevelLabel(value: string) {
  switch (value) {
    // ==========================================================
    // UNIVERSITY
    // ==========================================================

    case "UNIVERSITY_LEVEL_1":
      return "المستوى الأول"

    case "UNIVERSITY_LEVEL_2":
      return "المستوى الثاني"

    case "UNIVERSITY_LEVEL_3":
      return "المستوى الثالث"

    case "UNIVERSITY_LEVEL_4":
      return "المستوى الرابع"

    // ==========================================================
    // SECONDARY
    // ==========================================================

    case "SECONDARY_GRADE_1":
      return "الصف الأول الثانوي"

    case "SECONDARY_GRADE_2":
      return "الصف الثاني الثانوي"

    case "SECONDARY_GRADE_3":
      return "الصف الثالث الثانوي"

    default:
      return value
  }
}

/* ============================================================= */
/* COURSE LEVEL LABEL */
/* ============================================================= */

function getLevelLabel(value: string) {
  switch (value) {
    case "BEGINNER":
      return "مبتدئ"

    case "INTERMEDIATE":
      return "متوسط"

    case "ADVANCED":
      return "متقدم"

    default:
      return value
  }
}

/* ============================================================= */
/* DATE */
/* ============================================================= */

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}