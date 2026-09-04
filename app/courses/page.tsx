// "use client"
// import { useEffect, useMemo, useState } from "react"
// import {
//   BookOpen,
//   ChevronDown,
//   Search,
//   SlidersHorizontal,
//   X,
// } from "lucide-react"

// import CourseCard, {
//   type CourseCardData,
// } from "@/components/courses/course-card"

// // ============================================================
// // TYPES
// // ============================================================

// type EducationType =
//   | "ALL"
//   | "UNIVERSITY"
//   | "SECONDARY"

// interface CoursesApiResponse {
//   success: boolean
//   courses?: CourseCardData[]
//   error?: string
// }

// // ============================================================
// // LABELS
// // ============================================================

// const educationTypeLabels: Record<
//   EducationType,
//   string
// > = {
//   ALL: "كل أنواع التعليم",
//   UNIVERSITY: "جامعي",
//   SECONDARY: "ثانوي",
// }

// // ============================================================
// // SUBJECT TRANSLATIONS
// // ============================================================

// const subjectLabels: Record<string, string> = {
//   arabic: "اللغة العربية",
//   mathematics: "الرياضيات",
//   math: "الرياضيات",
//   physics: "الفيزياء",
//   chemistry: "الكيمياء",
//   biology: "الأحياء",
//   english: "اللغة الإنجليزية",
//   french: "اللغة الفرنسية",
//   german: "اللغة الألمانية",
//   computer: "الحاسب الآلي",
//   computer_science: "علوم الحاسب",
//   programming: "البرمجة",
//   history: "التاريخ",
//   geography: "الجغرافيا",
//   philosophy: "الفلسفة",
//   psychology: "علم النفس",
//   statistics: "الإحصاء",
//   science: "العلوم",
// }

// // ============================================================
// // HELPERS
// // ============================================================

// function cleanHtml(
//   value: string | null | undefined
// ) {
//   if (!value) {
//     return ""
//   }

//   return value
//     .replace(/<[^>]*>/g, " ")
//     .replace(/&nbsp;/gi, " ")
//     .replace(/&amp;/gi, "&")
//     .replace(/&lt;/gi, "<")
//     .replace(/&gt;/gi, ">")
//     .replace(/&quot;/gi, '"')
//     .replace(/&#39;/gi, "'")
//     .replace(/\s+/g, " ")
//     .trim()
// }

// function getSubjectLabel(
//   subject: CourseCardData["subject"]
// ) {
//   if (!subject) {
//     return "غير محدد"
//   }

//   const code =
//     subject.code?.toLowerCase().trim()

//   const name =
//     subject.name?.trim()

//   if (
//     code &&
//     subjectLabels[code]
//   ) {
//     return subjectLabels[code]
//   }

//   return name || "غير محدد"
// }

// // ============================================================
// // PAGE
// // ============================================================

// export default function CoursesPage() {
//   // ==========================================================
//   // DATA
//   // ==========================================================

//   const [courses, setCourses] =
//     useState<CourseCardData[]>([])

//   const [loading, setLoading] =
//     useState(true)

//   const [error, setError] =
//     useState<string | null>(null)

//   // ==========================================================
//   // FILTERS
//   // ==========================================================

//   const [search, setSearch] =
//     useState("")

//   const [subject, setSubject] =
//     useState("ALL")

//   // ==========================================================
//   // EDUCATION TYPE
//   // بدل مستوى الكورس
//   // ==========================================================

//   const [educationType, setEducationType] =
//     useState<EducationType>("ALL")

//   // ==========================================================
//   // FETCH COURSES
//   // ==========================================================

//   useEffect(() => {
//     let mounted = true

//     const fetchCourses = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const response =
//           await fetch("/api/courses", {
//             method: "GET",
//             cache: "no-store",
//           })

//         const data =
//           (await response.json()) as CoursesApiResponse

//         if (
//           !response.ok ||
//           !data.success
//         ) {
//           throw new Error(
//             data.error ||
//               "فشل تحميل الكورسات"
//           )
//         }

//         if (!mounted) {
//           return
//         }

//         const safeCourses =
//           Array.isArray(data.courses)
//             ? data.courses
//             : []

//         setCourses(safeCourses)
//       } catch (error) {
//         console.error(
//           "Fetch courses error:",
//           error
//         )

//         if (!mounted) {
//           return
//         }

//         setCourses([])

//         setError(
//           error instanceof Error
//             ? error.message
//             : "حدث خطأ أثناء تحميل الكورسات"
//         )
//       } finally {
//         if (mounted) {
//           setLoading(false)
//         }
//       }
//     }

//     fetchCourses()

//     return () => {
//       mounted = false
//     }
//   }, [])

//   // ==========================================================
//   // PREPARE COURSES
//   // ==========================================================

//   const preparedCourses =
//     useMemo(() => {
//       return courses.map(
//         (course) => ({
//           ...course,

//           // تنظيف الوصف من HTML
//           description:
//             course.description
//               ? cleanHtml(
//                   course.description
//                 )
//               : null,

//           // تحويل اسم المادة للعربي
//           subject: {
//             ...course.subject,

//             name: getSubjectLabel(
//               course.subject
//             ),
//           },
//         })
//       )
//     }, [courses])

//   // ==========================================================
//   // SUBJECTS
//   // ==========================================================

//   const subjects = useMemo(() => {
//     const map = new Map<
//       string,
//       string
//     >()

//     courses.forEach((course) => {
//       if (
//         course.subject?.code
//       ) {
//         const code =
//           course.subject.code

//         const name =
//           getSubjectLabel(
//             course.subject
//           )

//         map.set(
//           code,
//           name
//         )
//       }
//     })

//     return Array.from(
//       map.entries()
//     )
//   }, [courses])

//   // ==========================================================
//   // FILTERED COURSES
//   // ==========================================================

//   const filteredCourses =
//     useMemo(() => {
//       const normalizedSearch =
//         search
//           .trim()
//           .toLowerCase()

//       return preparedCourses.filter(
//         (course) => {
//           // --------------------------------------------------
//           // SEARCH
//           // --------------------------------------------------

//           const title =
//             course.title
//               ?.toLowerCase() ?? ""

//           const description =
//             course.description
//               ?.toLowerCase() ?? ""

//           const subjectName =
//             course.subject?.name
//               ?.toLowerCase() ?? ""

//           const matchesSearch =
//             !normalizedSearch ||
//             title.includes(
//               normalizedSearch
//             ) ||
//             description.includes(
//               normalizedSearch
//             ) ||
//             subjectName.includes(
//               normalizedSearch
//             )

//           // --------------------------------------------------
//           // SUBJECT
//           // --------------------------------------------------

//           const matchesSubject =
//             subject === "ALL" ||
//             course.subject?.code ===
//               subject

//           // --------------------------------------------------
//           // EDUCATION TYPE
//           // --------------------------------------------------

//           const matchesEducationType =
//             educationType === "ALL" ||
//             course.educationType ===  educationType
             

//           // --------------------------------------------------
//           // FINAL RESULT
//           // --------------------------------------------------

//           return (
//             matchesSearch &&
//             matchesSubject &&
//             matchesEducationType
//           )
//         }
//       )
//     }, [
//       preparedCourses,
//       search,
//       subject,
//       educationType,
//     ])

//   // ==========================================================
//   // FILTER STATE
//   // ==========================================================

//   const hasFilters =
//     search.trim() !== "" ||
//     subject !== "ALL" ||
//     educationType !== "ALL"

//   // ==========================================================
//   // CLEAR FILTERS
//   // ==========================================================

//   const clearFilters = () => {
//     setSearch("")
//     setSubject("ALL")
//     setEducationType("ALL")
//   }

//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (
//     <main
//       dir="rtl"
//       className="
//         min-h-screen
//         bg-background
//       "
//     >
//       {/* ================================================== */}
//       {/* HERO */}
//       {/* ================================================== */}

//       <section
//         className="
//           border-b
//           border-border
//           bg-muted/[0.15]
//         "
//       >
//         <div
//           className="
//             mx-auto
//             max-w-7xl
//             px-5
//             py-14
//             sm:px-8
//             lg:py-20
//           "
//         >
//           <div className="max-w-2xl">
//             {/* BADGE */}

//             <div
//               className="
//                 mb-4
//                 inline-flex
//                 items-center
//                 gap-2
//                 rounded-full
//                 border
//                 border-red-500/20
//                 bg-red-500/10
//                 px-3
//                 py-1.5
//                 text-xs
//                 font-bold
//                 text-red-500
//               "
//             >
//               <BookOpen className="size-3.5" />

//               كورسات YAKKAN
//             </div>

//             {/* TITLE */}

//             <h1
//               className="
//                 text-3xl
//                 font-black
//                 leading-tight
//                 sm:text-4xl
//                 lg:text-5xl
//               "
//             >
//               اتعلم مهارات جديدة
//               <br />

//               <span className="text-red-500">
//                 وطور مستواك
//               </span>
//             </h1>

//             {/* DESCRIPTION */}

//             <p
//               className="
//                 mt-5
//                 max-w-xl
//                 text-sm
//                 leading-7
//                 text-muted-foreground
//                 sm:text-base
//               "
//             >
//               اكتشف الكورسات المتاحة
//               واختر المحتوى المناسب
//               لمستواك ودراستك.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ================================================== */}
//       {/* CONTENT */}
//       {/* ================================================== */}

//       <section
//         className="
//           mx-auto
//           max-w-7xl
//           px-5
//           py-8
//           sm:px-8
//           lg:py-10
//         "
//       >
//         {/* ================================================= */}
//         {/* SEARCH + FILTERS */}
//         {/* ================================================= */}

//         <div
//           className="
//             rounded-2xl
//             border
//             border-border
//             bg-background
//             p-4
//             shadow-sm
//             sm:p-5
//           "
//         >
//           <div
//             className="
//               flex
//               flex-col
//               gap-3
//               lg:flex-row
//               lg:items-center
//             "
//           >
//             {/* SEARCH */}

//             <div
//               className="
//                 relative
//                 min-w-0
//                 flex-1
//               "
//             >
//               <Search
//                 className="
//                   absolute
//                   right-4
//                   top-1/2
//                   size-4
//                   -translate-y-1/2
//                   text-muted-foreground
//                 "
//               />

//               <input
//                 value={search}
//                 onChange={(event) =>
//                   setSearch(
//                     event.target.value
//                   )
//                 }
//                 placeholder="ابحث عن كورس أو مادة..."
//                 className="
//                   h-12
//                   w-full
//                   rounded-xl
//                   border
//                   border-border
//                   bg-muted/[0.15]
//                   pr-11
//                   pl-10
//                   text-sm
//                   outline-none
//                   transition
//                   focus:border-red-500
//                   focus:ring-4
//                   focus:ring-red-500/10
//                 "
//               />

//               {search && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setSearch("")
//                   }
//                   className="
//                     absolute
//                     left-3
//                     top-1/2
//                     flex
//                     size-7
//                     -translate-y-1/2
//                     items-center
//                     justify-center
//                     rounded-lg
//                     text-muted-foreground
//                     hover:bg-muted
//                     hover:text-foreground
//                   "
//                   aria-label="مسح البحث"
//                 >
//                   <X className="size-4" />
//                 </button>
//               )}
//             </div>

//             {/* SUBJECT */}

//             <div className="relative">
//               <SlidersHorizontal
//                 className="
//                   absolute
//                   right-4
//                   top-1/2
//                   z-10
//                   size-4
//                   -translate-y-1/2
//                   text-muted-foreground
//                 "
//               />

//               <select
//                 value={subject}
//                 onChange={(event) =>
//                   setSubject(
//                     event.target.value
//                   )
//                 }
//                 className="
//                   h-12
//                   w-full
//                   min-w-[190px]
//                   cursor-pointer
//                   appearance-none
//                   rounded-xl
//                   border
//                   border-border
//                   bg-muted/[0.15]
//                   px-10
//                   text-sm
//                   font-semibold
//                   outline-none
//                   transition
//                   focus:border-red-500
//                   focus:ring-4
//                   focus:ring-red-500/10
//                 "
//               >
//                 <option value="ALL">
//                   كل المواد
//                 </option>

//                 {subjects.map(
//                   ([code, name]) => (
//                     <option
//                       key={code}
//                       value={code}
//                     >
//                       {name}
//                     </option>
//                   )
//                 )}
//               </select>

//               <ChevronDown
//                 className="
//                   pointer-events-none
//                   absolute
//                   left-4
//                   top-1/2
//                   size-4
//                   -translate-y-1/2
//                   text-muted-foreground
//                 "
//               />
//             </div>

//             {/* ================================================= */}
//             {/* EDUCATION TYPE */}
//             {/* ================================================= */}

//             <div className="relative">
//               <select
//                 value={educationType}
//                 onChange={(event) =>
//                   setEducationType(
//                     event.target
//                       .value as EducationType
//                   )
//                 }
//                 className="
//                   h-12
//                   w-full
//                   min-w-[180px]
//                   cursor-pointer
//                   appearance-none
//                   rounded-xl
//                   border
//                   border-border
//                   bg-muted/[0.15]
//                   px-5
//                   pl-10
//                   text-sm
//                   font-semibold
//                   outline-none
//                   transition
//                   focus:border-red-500
//                   focus:ring-4
//                   focus:ring-red-500/10
//                 "
//               >
//                 {Object.entries(
//                   educationTypeLabels
//                 ).map(
//                   ([value, label]) => (
//                     <option
//                       key={value}
//                       value={value}
//                     >
//                       {label}
//                     </option>
//                   )
//                 )}
//               </select>

//               <ChevronDown
//                 className="
//                   pointer-events-none
//                   absolute
//                   left-4
//                   top-1/2
//                   size-4
//                   -translate-y-1/2
//                   text-muted-foreground
//                 "
//               />
//             </div>

//             {/* CLEAR */}

//             {hasFilters && (
//               <button
//                 type="button"
//                 onClick={
//                   clearFilters
//                 }
//                 className="
//                   h-12
//                   shrink-0
//                   rounded-xl
//                   border
//                   border-red-500/20
//                   bg-red-500/5
//                   px-4
//                   text-xs
//                   font-bold
//                   text-red-500
//                   transition
//                   hover:bg-red-500/10
//                 "
//               >
//                 مسح الفلاتر
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ================================================= */}
//         {/* RESULT HEADER */}
//         {/* ================================================= */}

//         <div
//           className="
//             mb-6
//             mt-8
//             flex
//             items-center
//             justify-between
//             gap-4
//           "
//         >
//           <div>
//             <h2 className="text-xl font-black">
//               الكورسات
//             </h2>

//             <p className="mt-1 text-xs text-muted-foreground">
//               {loading
//                 ? "جاري تحميل الكورسات..."
//                 : `${filteredCourses.length} كورس متاح`}
//             </p>
//           </div>
//         </div>

//         {/* ================================================= */}
//         {/* LOADING */}
//         {/* ================================================= */}

//         {loading && (
//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               sm:grid-cols-2
//               xl:grid-cols-3
//             "
//           >
//             {Array.from({
//               length: 6,
//             }).map((_, index) => (
//               <div
//                 key={index}
//                 className="
//                   overflow-hidden
//                   rounded-2xl
//                   border
//                   border-border
//                   bg-background
//                 "
//               >
//                 <div
//                   className="
//                     aspect-video
//                     animate-pulse
//                     bg-muted
//                   "
//                 />

//                 <div className="space-y-3 p-5">
//                   <div
//                     className="
//                       h-5
//                       w-3/4
//                       animate-pulse
//                       rounded-lg
//                       bg-muted
//                     "
//                   />

//                   <div
//                     className="
//                       h-4
//                       w-full
//                       animate-pulse
//                       rounded-lg
//                       bg-muted
//                     "
//                   />

//                   <div
//                     className="
//                       h-4
//                       w-1/2
//                       animate-pulse
//                       rounded-lg
//                       bg-muted
//                     "
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ================================================= */}
//         {/* ERROR */}
//         {/* ================================================= */}

//         {!loading && error && (
//           <div
//             className="
//               rounded-2xl
//               border
//               border-red-500/20
//               bg-red-500/5
//               px-6
//               py-16
//               text-center
//             "
//           >
//             <div
//               className="
//                 mx-auto
//                 flex
//                 size-16
//                 items-center
//                 justify-center
//                 rounded-2xl
//                 bg-red-500/10
//                 text-red-500
//               "
//             >
//               <BookOpen className="size-7" />
//             </div>

//             <h3
//               className="
//                 mt-5
//                 text-base
//                 font-black
//               "
//             >
//               حصل خطأ أثناء تحميل الكورسات
//             </h3>

//             <p
//               className="
//                 mx-auto
//                 mt-2
//                 max-w-md
//                 text-sm
//                 leading-6
//                 text-muted-foreground
//               "
//             >
//               {error}
//             </p>

//             <button
//               type="button"
//               onClick={() =>
//                 window.location.reload()
//               }
//               className="
//                 mt-6
//                 rounded-xl
//                 bg-red-500
//                 px-5
//                 py-2.5
//                 text-xs
//                 font-bold
//                 text-white
//                 transition
//                 hover:bg-red-600
//               "
//             >
//               إعادة المحاولة
//             </button>
//           </div>
//         )}

//         {/* ================================================= */}
//         {/* EMPTY */}
//         {/* ================================================= */}

//         {!loading &&
//           !error &&
//           filteredCourses.length ===
//             0 && (
//             <div
//               className="
//                 rounded-2xl
//                 border-2
//                 border-dashed
//                 border-border
//                 px-6
//                 py-20
//                 text-center
//               "
//             >
//               <div
//                 className="
//                   mx-auto
//                   flex
//                   size-16
//                   items-center
//                   justify-center
//                   rounded-2xl
//                   bg-red-500/10
//                   text-red-500
//                 "
//               >
//                 <Search className="size-7" />
//               </div>

//               <h3
//                 className="
//                   mt-5
//                   text-base
//                   font-black
//                 "
//               >
//                 مفيش كورسات مطابقة
//               </h3>

//               <p
//                 className="
//                   mx-auto
//                   mt-2
//                   max-w-md
//                   text-sm
//                   leading-6
//                   text-muted-foreground
//                 "
//               >
//                 جرّب تغير كلمة البحث
//                 أو الفلاتر عشان تلاقي
//                 الكورس اللي بتدور عليه.
//               </p>

//               {hasFilters && (
//                 <button
//                   type="button"
//                   onClick={
//                     clearFilters
//                   }
//                   className="
//                     mt-6
//                     rounded-xl
//                     bg-red-500
//                     px-5
//                     py-2.5
//                     text-xs
//                     font-bold
//                     text-white
//                     transition
//                     hover:bg-red-600
//                   "
//                 >
//                   مسح الفلاتر
//                 </button>
//               )}
//             </div>
//           )}

//         {/* ================================================= */}
//         {/* COURSES */}
//         {/* ================================================= */}

//         {!loading &&
//           !error &&
//           filteredCourses.length >
//             0 && (
//             <div
//               className="
//                 grid
//                 grid-cols-1
//                 gap-5
//                 sm:grid-cols-2
//                 xl:grid-cols-3
//               "
//             >
//               {filteredCourses.map(
//                 (course) => (
//                   <CourseCard
//                     key={course.id}
//                     course={course}
//                   />
//                 )
//               )}
//             </div>
//           )}
//       </section>
//     </main>
//   )
// }






















"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
} from "lucide-react"

import CourseCard, {
  type CourseCardData,
} from "@/components/courses/course-card"

// ============================================================
// TYPES
// ============================================================

type EducationType =
  | "ALL"
  | "UNIVERSITY"
  | "SECONDARY"

interface CoursesApiResponse {
  success: boolean
  courses?: CourseCardData[]
  error?: string
}

// ============================================================
// LABELS
// ============================================================

const educationTypeLabels: Record<
  EducationType,
  string
> = {
  ALL: "كل أنواع التعليم",
  UNIVERSITY: "جامعي",
  SECONDARY: "ثانوي",
}

// ============================================================
// SUBJECT TRANSLATIONS
// ============================================================

const subjectLabels: Record<string, string> = {
  arabic: "اللغة العربية",
  mathematics: "الرياضيات",
  math: "الرياضيات",
  physics: "الفيزياء",
  chemistry: "الكيمياء",
  biology: "الأحياء",
  english: "اللغة الإنجليزية",
  french: "اللغة الفرنسية",
  german: "اللغة الألمانية",
  computer: "الحاسب الآلي",
  computer_science: "علوم الحاسب",
  programming: "البرمجة",
  history: "التاريخ",
  geography: "الجغرافيا",
  philosophy: "الفلسفة",
  psychology: "علم النفس",
  statistics: "الإحصاء",
  science: "العلوم",
}

// ============================================================
// HELPERS
// ============================================================

function cleanHtml(
  value: string | null | undefined
) {
  if (!value) {
    return ""
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function getSubjectLabel(
  subject: CourseCardData["subject"]
) {
  if (!subject) {
    return "غير محدد"
  }

  const code =
    subject.code?.toLowerCase().trim()

  const name =
    subject.name?.trim()

  if (
    code &&
    subjectLabels[code]
  ) {
    return subjectLabels[code]
  }

  return name || "غير محدد"
}

// ============================================================
// PAGE
// ============================================================

export default function CoursesPage() {
  // ==========================================================
  // DATA
  // ==========================================================

  const [courses, setCourses] =
    useState<CourseCardData[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [search, setSearch] =
    useState("")

  const [subject, setSubject] =
    useState("ALL")

  const [educationType, setEducationType] =
    useState<EducationType>("ALL")

  // ==========================================================
  // FETCH COURSES
  // ==========================================================

  useEffect(() => {
    let mounted = true

    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)

        const response =
          await fetch("/api/courses", {
            method: "GET",
            cache: "no-store",
          })

        const data =
          (await response.json()) as CoursesApiResponse

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
              "فشل تحميل الكورسات"
          )
        }

        if (!mounted) {
          return
        }

        const safeCourses =
          Array.isArray(data.courses)
            ? data.courses
            : []

        setCourses(safeCourses)
      } catch (error) {
        console.error(
          "Fetch courses error:",
          error
        )

        if (!mounted) {
          return
        }

        setCourses([])

        setError(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحميل الكورسات"
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchCourses()

    return () => {
      mounted = false
    }
  }, [])

  // ==========================================================
  // PREPARE COURSES
  // ==========================================================

  const preparedCourses =
    useMemo(() => {
      return courses.map(
        (course) => ({
          ...course,

          description:
            course.description
              ? cleanHtml(
                  course.description
                )
              : null,

          subject: {
            ...course.subject,

            name: getSubjectLabel(
              course.subject
            ),
          },
        })
      )
    }, [courses])

  // ==========================================================
  // SUBJECTS
  // ==========================================================

  const subjects = useMemo(() => {
    const map = new Map<
      string,
      string
    >()

    courses.forEach((course) => {
      if (
        course.subject?.code
      ) {
        const code =
          course.subject.code

        const name =
          getSubjectLabel(
            course.subject
          )

        map.set(
          code,
          name
        )
      }
    })

    return Array.from(
      map.entries()
    )
  }, [courses])

  // ==========================================================
  // FILTERED COURSES
  // ==========================================================

  const filteredCourses =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase()

      return preparedCourses.filter(
        (course) => {
          const title =
            course.title
              ?.toLowerCase() ?? ""

          const description =
            course.description
              ?.toLowerCase() ?? ""

          const subjectName =
            course.subject?.name
              ?.toLowerCase() ?? ""

          const matchesSearch =
            !normalizedSearch ||
            title.includes(
              normalizedSearch
            ) ||
            description.includes(
              normalizedSearch
            ) ||
            subjectName.includes(
              normalizedSearch
            )

          const matchesSubject =
            subject === "ALL" ||
            course.subject?.code ===
              subject

          const matchesEducationType =
            educationType === "ALL" ||
            course.educationType ===
              educationType

          return (
            matchesSearch &&
            matchesSubject &&
            matchesEducationType
          )
        }
      )
    }, [
      preparedCourses,
      search,
      subject,
      educationType,
    ])

  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const hasFilters =
    search.trim() !== "" ||
    subject !== "ALL" ||
    educationType !== "ALL"

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearch("")
    setSubject("ALL")
    setEducationType("ALL")
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        overflow-hidden
        bg-background
      "
    >
      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-border
          bg-muted/[0.15]
        "
      >
        {/* Subtle background glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            top-10
            size-72
            rounded-full
            bg-red-500/[0.06]
            blur-[100px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -left-32
            bottom-0
            size-64
            rounded-full
            bg-rose-500/[0.05]
            blur-[100px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-7xl
            px-5
            py-10
            sm:px-8
            sm:py-14
            lg:py-16
          "
        >
          {/* ==================================================
              BACK TO HOME
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
            className="mb-8"
          >
            <motion.a
              href="/"
              whileHover={{
                x: 4,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-border
                bg-background
                px-4
                py-2.5
                text-xs
                font-bold
                text-muted-foreground
                shadow-sm
                transition-colors
                hover:border-red-500/20
                hover:bg-red-500/5
                hover:text-red-500
              "
            >
              <ArrowRight className="size-4" />

              الصفحة الرئيسية
            </motion.a>
          </motion.div>

          {/* ==================================================
              HERO CONTENT
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: "easeOut",
            }}
            className="max-w-2xl"
          >
            {/* BADGE */}

            <motion.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-red-500/20
                bg-red-500/10
                px-3
                py-1.5
                text-xs
                font-bold
                text-red-500
              "
            >
              <BookOpen className="size-3.5" />

              كورسات YAKKAN
            </motion.div>

            {/* TITLE */}

            <h1
              className="
                text-3xl
                font-black
                leading-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              اتعلم مهارات جديدة
              <br />

              <span className="text-red-500">
                وطور مستواك
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-5
                max-w-xl
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
              "
            >
              اكتشف الكورسات المتاحة
              واختر المحتوى المناسب
              لمستواك ودراستك.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-8
          sm:px-8
          lg:py-10
        "
      >
        {/* =================================================
            SEARCH + FILTERS
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="
            rounded-2xl
            border
            border-border
            bg-background
            p-4
            shadow-sm
            sm:p-5
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
              lg:items-center
            "
          >
            {/* SEARCH */}

            <div
              className="
                relative
                min-w-0
                flex-1
              "
            >
              <Search
                className="
                  absolute
                  right-4
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="ابحث عن كورس أو مادة..."
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-muted/[0.15]
                  pr-11
                  pl-10
                  text-sm
                  outline-none
                  transition
                  focus:border-red-500
                  focus:ring-4
                  focus:ring-red-500/10
                "
              />

              {search && (
                <motion.button
                  type="button"
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={() =>
                    setSearch("")
                  }
                  className="
                    absolute
                    left-3
                    top-1/2
                    flex
                    size-7
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-muted-foreground
                    transition-colors
                    hover:bg-muted
                    hover:text-foreground
                  "
                  aria-label="مسح البحث"
                >
                  <X className="size-4" />
                </motion.button>
              )}
            </div>

            {/* SUBJECT */}

            <div className="relative">
              <SlidersHorizontal
                className="
                  absolute
                  right-4
                  top-1/2
                  z-10
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <select
                value={subject}
                onChange={(event) =>
                  setSubject(
                    event.target.value
                  )
                }
                className="
                  h-12
                  w-full
                  min-w-[190px]
                  cursor-pointer
                  appearance-none
                  rounded-xl
                  border
                  border-border
                  bg-muted/[0.15]
                  px-10
                  text-sm
                  font-semibold
                  outline-none
                  transition
                  focus:border-red-500
                  focus:ring-4
                  focus:ring-red-500/10
                "
              >
                <option value="ALL">
                  كل المواد
                </option>

                {subjects.map(
                  ([code, name]) => (
                    <option
                      key={code}
                      value={code}
                    >
                      {name}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />
            </div>

            {/* EDUCATION TYPE */}

            <div className="relative">
              <select
                value={educationType}
                onChange={(event) =>
                  setEducationType(
                    event.target
                      .value as EducationType
                  )
                }
                className="
                  h-12
                  w-full
                  min-w-[180px]
                  cursor-pointer
                  appearance-none
                  rounded-xl
                  border
                  border-border
                  bg-muted/[0.15]
                  px-5
                  pl-10
                  text-sm
                  font-semibold
                  outline-none
                  transition
                  focus:border-red-500
                  focus:ring-4
                  focus:ring-red-500/10
                "
              >
                {Object.entries(
                  educationTypeLabels
                ).map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />
            </div>

            {/* CLEAR */}

            {hasFilters && (
              <motion.button
                type="button"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={clearFilters}
                className="
                  h-12
                  shrink-0
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/5
                  px-4
                  text-xs
                  font-bold
                  text-red-500
                  transition
                  hover:bg-red-500/10
                "
              >
                مسح الفلاتر
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* =================================================
            RESULT HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="
            mb-6
            mt-8
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h2 className="text-xl font-black">
              الكورسات
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {loading
                ? "جاري تحميل الكورسات..."
                : `${filteredCourses.length} كورس متاح`}
            </p>
          </div>
        </motion.div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-background
                "
              >
                <div
                  className="
                    aspect-video
                    animate-pulse
                    bg-muted
                  "
                />

                <div className="space-y-3 p-5">
                  <div
                    className="
                      h-5
                      w-3/4
                      animate-pulse
                      rounded-lg
                      bg-muted
                    "
                  />

                  <div
                    className="
                      h-4
                      w-full
                      animate-pulse
                      rounded-lg
                      bg-muted
                    "
                  />

                  <div
                    className="
                      h-4
                      w-1/2
                      animate-pulse
                      rounded-lg
                      bg-muted
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/5
              px-6
              py-16
              text-center
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.35,
                delay: 0.05,
                ease: "easeOut",
              }}
              className="
                mx-auto
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
            </motion.div>

            <h3
              className="
                mt-5
                text-base
                font-black
              "
            >
              حصل خطأ أثناء تحميل الكورسات
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {error}
            </p>

            <motion.button
              type="button"
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() =>
                window.location.reload()
              }
              className="
                mt-6
                rounded-xl
                bg-red-500
                px-5
                py-2.5
                text-xs
                font-bold
                text-white
                transition
                hover:bg-red-600
              "
            >
              إعادة المحاولة
            </motion.button>
          </motion.div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredCourses.length ===
            0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="
                rounded-2xl
                border-2
                border-dashed
                border-border
                px-6
                py-20
                text-center
              "
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.05,
                  ease: "easeOut",
                }}
                className="
                  mx-auto
                  flex
                  size-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-red-500/10
                  text-red-500
                "
              >
                <Search className="size-7" />
              </motion.div>

              <h3
                className="
                  mt-5
                  text-base
                  font-black
                "
              >
                مفيش كورسات مطابقة
              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                جرّب تغير كلمة البحث
                أو الفلاتر عشان تلاقي
                الكورس اللي بتدور عليه.
              </p>

              {hasFilters && (
                <motion.button
                  type="button"
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={clearFilters}
                  className="
                    mt-6
                    rounded-xl
                    bg-red-500
                    px-5
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-red-600
                  "
                >
                  مسح الفلاتر
                </motion.button>
              )}
            </motion.div>
          )}

        {/* =================================================
            COURSES
        ================================================= */}

        {!loading &&
          !error &&
          filteredCourses.length > 0 && (
            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                xl:grid-cols-3
              "
            >
              {filteredCourses.map(
                (course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.08,
                    }}
                    transition={{
                      duration: 0.4,
                      delay:
                        Math.min(
                          index * 0.05,
                          0.2
                        ),
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -4,
                    }}
                  >
                    <CourseCard
                      course={course}
                    />
                  </motion.div>
                )
              )}
            </div>
          )}
      </section>
    </main>
  )
}