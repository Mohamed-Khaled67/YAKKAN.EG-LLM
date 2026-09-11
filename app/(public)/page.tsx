
// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// import {
//   Apple,
//   Award,
//   BarChart3,
//   BookOpen,
//   Building2,
//   Bus,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   Gift,
//   GraduationCap,
//   Headphones,
//   Mail,
//   MapPin,
//   Play,
//   PlayCircle,
//   School,
//   Smartphone,
//   Star,
//   Users,
//   X,
//   Quote,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { authClient } from "@/lib/auth-client";

// export default function HomePage() {
//   const { data: session, isPending } = authClient.useSession();

//   const isLoggedIn = !!session?.user;

//   const [testimonialIndex, setTestimonialIndex] = useState(0);

//   // ============================================================
//   // GALLERY STATE
//   // ============================================================

//   const [mediaFilter, setMediaFilter] = useState("الكل");
//   const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
//   const [galleryLoading, setGalleryLoading] = useState(true);

//   // ============================================================
//   // COURSES STATE
//   // ============================================================

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [courseIndex, setCourseIndex] = useState(1);
//   const [coursesLoading, setCoursesLoading] = useState(true);

//   // ============================================================
// // INSTAGRAM ICON
// // ============================================================

// function InstagramIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="size-5"
//       aria-hidden="true"
//     >
//       <rect
//         width="20"
//         height="20"
//         x="2"
//         y="2"
//         rx="5"
//         ry="5"
//       />

//       <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />

//       <line
//         x1="17.5"
//         x2="17.51"
//         y1="6.5"
//         y2="6.5"
//       />
//     </svg>
//   );
// }

// // ============================================================
// // WHATSAPP ICON
// // ============================================================

// function WhatsappIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       className="size-5"
//       aria-hidden="true"
//     >
//       <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.55 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.57 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.13-3.41-8.43ZM12.09 21.73h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.79.99 1.01-3.7-.23-.38a9.83 9.83 0 0 1-1.51-5.21C2.18 6.41 6.62 1.98 12.08 1.98a9.82 9.82 0 0 1 6.98 2.9 9.83 9.83 0 0 1 2.89 6.99c0 5.46-4.43 9.9-9.86 9.9Zm5.43-7.42c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.51-1.79-1.69-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.52.07-.8.37-.28.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
//     </svg>
//   );
// }
//   // ============================================================
//   // LOAD COURSES
//   // ============================================================

//   useEffect(() => {
//     let cancelled = false;

//     const loadCourses = async () => {
//       try {
//         setCoursesLoading(true);

//         const response = await fetch("/api/courses", {
//           method: "GET",
//           cache: "no-store",
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch courses");
//         }

//         const result = await response.json();

//         const items = Array.isArray(result)
//           ? result
//           : Array.isArray(result?.courses)
//             ? result.courses
//             : Array.isArray(result?.data)
//               ? result.data
//               : [];

//         const normalizedCourses: Course[] = items.map(
//           (course: any) => ({
//             id: String(course.id),

//             image:
//               course.mediaUrl ||
//               course.image ||
//               "/course-placeholder.jpg",

//             title:
//               course.title ||
//               "كورس بدون عنوان",

//             doctor:
//               course.doctor?.name ||
//               course.instructor?.name ||
//               course.instructorName ||
//               course.doctor ||
//               "YAKKAN EG",

//             description:
//               course.smallDescription ||
//               course.description ||
//               "اكتشف محتوى الكورس وابدأ رحلة التعلم مع YAKKAN EG.",

//             rating: Number(
//               course.rating ?? 4.7
//             ),

//             reviews: Number(
//               course.reviewsCount ??
//                 course.reviews ??
//                 0
//             ),

//             students: Number(
//               course.studentsCount ??
//                 course.students ??
//                 0
//             ),
//           })
//         );

//         if (!cancelled) {
//           setCourses(normalizedCourses);

//           setCourseIndex(
//             normalizedCourses.length > 1
//               ? 1
//               : 0
//           );
//         }
//       } catch (error) {
//         console.error(
//           "Failed to load courses:",
//           error
//         );

//         if (!cancelled) {
//           setCourses([]);
//           setCourseIndex(0);
//         }
//       } finally {
//         if (!cancelled) {
//           setCoursesLoading(false);
//         }
//       }
//     };

//     loadCourses();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // ============================================================
//   // LOAD GALLERY
//   // ============================================================

//   useEffect(() => {
//     let cancelled = false;

//     const loadGallery = async () => {
//       try {
//         setGalleryLoading(true);

//         const response = await fetch(
//           "/api/gallery",
//           {
//             method: "GET",
//             cache: "no-store",
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             "Failed to fetch gallery"
//           );
//         }

//         const result =
//           await response.json();

//         const images =
//           Array.isArray(result?.images)
//             ? result.images
//             : [];

//         const validImages: GalleryImage[] =
//           images.filter(
//             (image: any) =>
//               image &&
//               typeof image.id === "string" &&
//               typeof image.url === "string" &&
//               image.url.trim() !== "" &&
//               typeof image.category === "string"
//           );

//         if (!cancelled) {
//           setGalleryImages(validImages);
//           setMediaFilter("الكل");
//         }
//       } catch (error) {
//         console.error(
//           "Failed to load gallery:",
//           error
//         );

//         if (!cancelled) {
//           setGalleryImages([]);
//           setMediaFilter("الكل");
//         }
//       } finally {
//         if (!cancelled) {
//           setGalleryLoading(false);
//         }
//       }
//     };

//     loadGallery();

//     const handleVisibilityChange = () => {
//       if (
//         document.visibilityState ===
//         "visible"
//       ) {
//         loadGallery();
//       }
//     };

//     document.addEventListener(
//       "visibilitychange",
//       handleVisibilityChange
//     );

//     return () => {
//       cancelled = true;

//       document.removeEventListener(
//         "visibilitychange",
//         handleVisibilityChange
//       );
//     };
//   }, []);

//   // ============================================================
//   // COURSE NAVIGATION
//   // ============================================================

//   const nextCourse = () => {
//     setCourseIndex((current) =>
//       courses.length
//         ? (current + 1) % courses.length
//         : 0
//     );
//   };

//   const previousCourse = () => {
//     setCourseIndex((current) =>
//       courses.length
//         ? (current - 1 + courses.length) %
//           courses.length
//         : 0
//     );
//   };

//   // ============================================================
//   // WHY US
//   // ============================================================

//   const whyUs = [
//     {
//       icon: <Headphones />,
//       title: "دعم فني",
//       subtitle: "مستمر",
//     },
//     {
//       icon: <BarChart3 />,
//       title: "متابعة تقدم",
//       subtitle: "الطالب",
//     },
//     {
//       icon: <Smartphone />,
//       title: "تطبيق",
//       subtitle: "Iphone و Android",
//     },
//     {
//       icon: <Award />,
//       title: "شهادات",
//       subtitle: "معتمدة",
//     },
//     {
//       icon: <CheckCircle2 />,
//       title: "امتحانات",
//       subtitle: "وتصحيح فوري",
//     },
//     {
//       icon: <PlayCircle />,
//       title: "فيديوهات",
//       subtitle: "بجودة عالية",
//     },
//   ];

//   // ============================================================
//   // STEPS
//   // ============================================================

//   const steps = [
//     {
//       number: "1",
//       title: "إنشاء حساب",
//       text: "سجل بياناتك بسهولة في دقائق معدودة",
//     },
//     {
//       number: "2",
//       title: "ادخال الكود أو شراء الكورس",
//       text: "ادخل الكود أو اختر الكورس المناسب لك",
//     },
//     {
//       number: "3",
//       title: "ابدأ التعلم",
//       text: "استمتع بالمحتوى وتعلم في أي وقت وأي مكان",
//     },
//   ];

//   // ============================================================
//   // TESTIMONIALS
//   // ============================================================

//   const testimonials = [
//     {
//       text: "منصة YAKKAN EG من أفضل المنصات التعليمية اللي جربتها. المحتوى منظم بطريقة واضحة جدًا، وكل كورس بيكون مقسم بشكل يساعدك تتابع تقدمك من غير ما تحس بتشتت. أكثر شيء عجبني هو سهولة الوصول للمحتوى في أي وقت، بالإضافة إلى الاختبارات والمتابعة اللي بتخليك تحس إنك ماشي في رحلة تعليمية حقيقية مش مجرد فيديوهات.",
//     },
//     {
//       text: "تجربة YAKKAN EG مختلفة فعلًا عن فكرة الكورسات التقليدية. المنصة سهلة الاستخدام، وتصميمها مريح، والمحتوى بيتقدم بشكل مرتب يخليك تعرف تبدأ منين وتوصل لإيه في النهاية. وجود الاختبارات والشهادات ومتابعة التقدم بيخلي التعلم أكثر جدية وتحفيزًا، وده شيء فرق معايا جدًا أثناء التعلم.",
//     },
//     {
//       text: "أكثر شيء مميز في المنصة هو إنها مش مجرد مكان لمشاهدة الكورسات، لكنها بتقدم تجربة تعليمية متكاملة. المحتوى واضح، والتنظيم ممتاز، والاختبارات بتساعد على التأكد من فهم المعلومات، بالإضافة إلى إن متابعة التقدم بتشجعك تكمل وتحقق هدفك بدل ما تبدأ كورس وتسيبه في النص.",
//     },
//     {
//       text: "استخدام المنصة كان تجربة مريحة جدًا من البداية. كل شيء واضح وسهل الوصول إليه، سواء الكورسات أو المحتوى أو الاختبارات. أعجبني جدًا الاهتمام بالتفاصيل وطريقة عرض المعلومات، وحسيت إن المنصة معمولة فعلًا علشان تساعد الطالب يتعلم بشكل عملي ومنظم، وليس فقط لمشاهدة المحتوى.",
//     },
//     {
//       text: "YAKKAN EG قدرت تجمع أكثر من شيء مهم في مكان واحد. التعلم، الاختبارات، الشهادات، ومتابعة مستوى التقدم كلها موجودة بشكل منظم. أكثر نقطة إيجابية بالنسبة لي هي إن المنصة بتخليك تشوف تطورك خطوة بخطوة، وده بيخلق إحساس بالإنجاز وبيشجعك تستمر وتكمل الكورسات اللي بدأت فيها.",
//     },
//     {
//       text: "منصة ممتازة جدًا من ناحية التنظيم وسهولة الاستخدام. المحتوى بيتقدم بطريقة بسيطة وواضحة، ومش محتاج تضيع وقت علشان تعرف تستخدم المنصة أو توصل للحاجة اللي محتاجها. وجود الاختبارات والشهادات خلّى التجربة أكثر احترافية، وأصبح عندي إحساس إن كل كورس بخلصه له قيمة حقيقية أقدر أستفيد منها.",
//     },
//     {
//       text: "التجربة بشكل عام كانت احترافية جدًا. المنصة سريعة وسهلة، وتصميمها مريح سواء على الكمبيوتر أو الموبايل. أكثر شيء أعجبني هو الاهتمام بتجربة المستخدم، بداية من اختيار الكورس وحتى متابعة الدروس والاختبارات والحصول على الشهادة. واضح إن الهدف مش مجرد تقديم محتوى، لكن بناء تجربة تعليمية متكاملة.",
//     },
//     {
//       text: "أرشح YAKKAN EG لأي شخص عايز يطور نفسه ويتعلم بطريقة منظمة. المنصة بتوفر بيئة تساعدك على الالتزام والاستمرار، والمحتوى مرتب والاختبارات بتخليك تراجع اللي اتعلمته بشكل عملي. بالإضافة إلى ذلك، سهولة الوصول للكورسات ومتابعة التقدم بتخلي تجربة التعلم أكثر مرونة وتناسب أي شخص عنده جدول مشغول.",
//     },
//   ];

//   // ============================================================
//   // GALLERY CATEGORY HELPERS
//   // ============================================================

//   const galleryCategoryLabels: Record<
//     string,
//     string
//   > = {
//     GRADUATION: "حفلات التخرج",
//     GRADUATION_PARTY: "حفلات التخرج",
//     GRADUATION_PARTIES: "حفلات التخرج",
//     GRADUATIONS: "حفلات التخرج",

//     EVENTS: "حفلات التخرج",
//     EVENT: "حفلات التخرج",
//     PARTIES: "حفلات التخرج",
//     PARTY: "حفلات التخرج",

//     TRIPS: "الرحلات",
//     TRIP: "الرحلات",

//     COURSES: "الكورسات",
//     COURSE: "الكورسات",

//     "حفلات التخرج": "حفلات التخرج",
//     الحفلات: "حفلات التخرج",
//     الرحلات: "الرحلات",
//     الكورسات: "الكورسات",
//   };

//   const getGalleryCategoryLabel = (
//     category: string
//   ) => {
//     const normalized =
//       category.trim().toUpperCase();

//     return (
//       galleryCategoryLabels[normalized] ||
//       galleryCategoryLabels[category] ||
//       category
//     );
//   };

//   // ============================================================
//   // AVAILABLE GALLERY CATEGORIES
//   // ============================================================

//   const availableGalleryCategories =
//     useMemo(() => {
//       const uniqueCategories =
//         Array.from(
//           new Set(
//             galleryImages.map(
//               (image) => image.category
//             )
//           )
//         );

//       const orderedLabels = [
//         "حفلات التخرج",
//         "الرحلات",
//         "الكورسات",
//       ];

//       const result: GalleryCategoryOption[] =
//         [];

//       for (const label of orderedLabels) {
//         const matchingCategory =
//           uniqueCategories.find(
//             (category) =>
//               getGalleryCategoryLabel(
//                 category
//               ) === label
//           );

//         if (matchingCategory) {
//           result.push({
//             key: matchingCategory,
//             label,
//           });
//         }
//       }

//       for (const category of uniqueCategories) {
//         const alreadyAdded =
//           result.some(
//             (item) =>
//               item.key === category
//           );

//         if (!alreadyAdded) {
//           result.push({
//             key: category,
//             label:
//               getGalleryCategoryLabel(
//                 category
//               ),
//           });
//         }
//       }

//       return result;
//     }, [galleryImages]);

//   // ============================================================
//   // FILTERED GALLERY
//   // ============================================================

//   const filteredGalleryImages =
//     useMemo(() => {
//       if (mediaFilter === "الكل") {
//         return galleryImages;
//       }

//       return galleryImages.filter(
//         (image) =>
//           image.category === mediaFilter
//       );
//     }, [
//       galleryImages,
//       mediaFilter,
//     ]);

//   // ============================================================
//   // KEEP FILTER VALID
//   // ============================================================

//   useEffect(() => {
//     if (mediaFilter === "الكل") {
//       return;
//     }

//     const categoryStillExists =
//       availableGalleryCategories.some(
//         (category) =>
//           category.key === mediaFilter
//       );

//     if (!categoryStillExists) {
//       setMediaFilter("الكل");
//     }
//   }, [
//     mediaFilter,
//     availableGalleryCategories,
//   ]);

//   // ============================================================
//   // TESTIMONIAL NAVIGATION
//   // ============================================================

//   const nextTestimonial = () => {
//     setTestimonialIndex(
//       (current) =>
//         (current + 1) %
//         testimonials.length
//     );
//   };

//   const previousTestimonial = () => {
//     setTestimonialIndex(
//       (current) =>
//         (current - 1 + testimonials.length) %
//         testimonials.length
//     );
//   };

//   // ============================================================
//   // PAGE
//   // ============================================================

//   return (
//     <main
//       dir="rtl"
//       className="min-h-screen overflow-hidden bg-[#fcfcfd] text-[#18181b] antialiased transition-colors dark:bg-[#08090b] dark:text-white"
//     >
//       {/* ========================================================
//           HERO
//       ======================================================== */}

//       <section className="relative overflow-hidden bg-[#f7f7f8] dark:bg-[#0b0c0f]">
//         <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#C8102E]/10 blur-3xl dark:bg-[#C8102E]/15" />

//         <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-[#C8102E]/5 blur-3xl dark:bg-[#C8102E]/10" />

//         <div className="mx-auto grid min-h-[570px] max-w-[1500px] items-center gap-8 px-5 py-12 lg:grid-cols-2 lg:px-10 lg:py-16">
//           <motion.div
//             initial={{
//               opacity: 0,
//               x: 40,
//             }}
//             animate={{
//               opacity: 1,
//               x: 0,
//             }}
//             transition={{
//               duration: 0.7,
//             }}
//             className="order-1 text-center lg:order-1 lg:text-right"
//           >
//             <p className="mb-4 text-sm font-extrabold tracking-[0.18em] text-[#C8102E]">
//               منصة YAKKAN EG التعليمية
//             </p>

//             <h1 className="text-4xl font-black leading-[1.16] tracking-[-0.03em] sm:text-5xl lg:text-[64px]">
//               تعلم بذكاء...
//               <br />

//               <span className="text-[#C8102E]">
//                 وابدأ رحلتك نحو النجاح
//               </span>
//             </h1>

//             <p className="mx-auto mt-6 max-w-[650px] text-lg leading-9 text-[#444] dark:text-gray-300 lg:mx-0">
//               منصة YAKKAN EG تجمع بين التعليم الإلكتروني والامتحانات
//               والشهادات والرحلات التعليمية في مكان واحد.
//             </p>

//             <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
//               {!isPending && !isLoggedIn && (
//                 <Link href="/register">
//                   <Button className="h-12 w-full rounded-xl bg-[#C8102E] px-9 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(200,16,46,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#a80d27] hover:shadow-[0_14px_34px_rgba(200,16,46,0.28)] sm:w-auto">
//                     ابدأ الآن
//                   </Button>
//                 </Link>
//               )}

//               <Link href="/courses">
//                 <Button
//                   variant="outline"
//                   className="h-12 w-full rounded-xl border border-black/10 bg-white/70 px-8 text-sm font-extrabold text-[#18181b] shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#C8102E]/30 hover:bg-white hover:text-[#C8102E] dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:border-[#C8102E]/40 dark:hover:bg-white/[0.07] dark:hover:text-[#ff5a73] sm:w-auto"
//                 >
//                   تصفح الكورسات

//                   <BookOpen className="mr-2 size-5" />
//                 </Button>
//               </Link>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{
//               opacity: 0,
//               x: -40,
//             }}
//             animate={{
//               opacity: 1,
//               x: 0,
//             }}
//             transition={{
//               duration: 0.8,
//             }}
//             className="order-2 flex items-center justify-center lg:order-2"
//           >
//             <img
//               src="/hero.jpeg"
//               alt="YAKKAN EG"
//               className="block w-full max-w-[720px] object-contain dark:hidden"
//             />

//             <img
//               src="/hero2.jpeg"
//               alt="YAKKAN EG"
//               className="hidden w-full max-w-[720px] object-contain dark:block"
//             />
//           </motion.div>
//         </div>
//       </section>

//       {/* ========================================================
//           STATS
//       ======================================================== */}

//       <section className="relative z-10 mx-auto -mt-8 max-w-[1450px] px-5 lg:px-10">
//         <div className="grid overflow-hidden rounded-2xl border border-black/[0.06] bg-white/95 shadow-[0_20px_60px_rgba(24,24,27,0.09)] backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#111216]/95 dark:shadow-black/30 sm:grid-cols-3 lg:grid-cols-5">
//           <Stat
//             icon={<Users />}
//             number="20,000+"
//             label="طالب"
//           />

//           <Stat
//             icon={<BookOpen />}
//             number="350+"
//             label="كورس"
//           />

//           <Stat
//             icon={<GraduationCap />}
//             number="150+"
//             label="دكتور"
//           />

//           <Stat
//             icon={<Award />}
//             number="5000+"
//             label="شهادة"
//           />

//           <Stat
//             icon={
//               <span className="text-4xl">
//                 ☺
//               </span>
//             }
//             number="98%"
//             label="نسبة رضا"
//           />
//         </div>
//       </section>

//       {/* ========================================================
//           CATEGORIES
//       ======================================================== */}

//       <section className="mx-auto max-w-[1450px] px-5 py-10 lg:px-10">
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
//           <Category
//             icon={<Gift />}
//             title="حفلات التخرج"
//           />

//           <Category
//             icon={<Bus />}
//             title="الرحلات"
//           />

//           <Category
//             icon={<Building2 />}
//             title="المعاهد"
//           />

//           <Category
//             icon={<School />}
//             title="المدارس"
//           />

//           <Category
//             icon={<GraduationCap />}
//             title="الجامعات"
//           />

//           <Category
//             icon={<BookOpen />}
//             title="الكورسات"
//           />
//         </div>
//       </section>

//       {/* ========================================================
//           WHY US
//       ======================================================== */}

//       <section className="bg-[#f7f7f8] py-24 dark:bg-[#0b0c0f]">
//         <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
//           <SectionTitle title="لماذا تختار YAKKAN EG ؟" />

//           <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
//             {whyUs.map((item) => (
//               <WhyCard
//                 key={item.title}
//                 icon={item.icon}
//                 title={item.title}
//                 subtitle={item.subtitle}
//               />
//             ))}
//           </div>

//           <SectionTitle
//             title="كيف تبدأ ؟"
//             className="mt-24"
//           />

//           <div className="mt-12 grid gap-5 lg:grid-cols-3">
//             {steps.map((step) => (
//               <Step
//                 key={step.number}
//                 number={step.number}
//                 title={step.title}
//                 text={step.text}
//               />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ========================================================
//           FEATURED COURSES
//       ======================================================== */}

//       <section className="py-24">
//         <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
//           <div className="flex items-center justify-between">
//             <SectionTitle
//               title="الكورسات المميزة"
//               align="right"
//             />

//             <Link
//               href="/courses"
//               className="font-bold text-[#C8102E] hover:underline"
//             >
//               عرض جميع الكورسات
//             </Link>
//           </div>

//           <div className="mt-10">
//             {coursesLoading ? (
//               <div className="grid min-h-[520px] place-items-center rounded-[28px] border border-black/[0.06] bg-[#fafafa] dark:border-white/[0.06] dark:bg-[#111216]">
//                 <div className="flex flex-col items-center gap-4 text-center">
//                   <div className="size-10 animate-spin rounded-full border-2 border-black/10 border-t-[#C8102E] dark:border-white/10 dark:border-t-[#C8102E]" />

//                   <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
//                     جاري تحميل الكورسات...
//                   </p>
//                 </div>
//               </div>
//             ) : courses.length === 0 ? (
//               <div className="grid min-h-[260px] place-items-center rounded-[28px] border border-dashed border-black/10 bg-[#fafafa] text-center dark:border-white/10 dark:bg-[#111216]">
//                 <div>
//                   <BookOpen className="mx-auto size-10 text-[#C8102E]" />

//                   <p className="mt-4 font-bold">
//                     لا توجد كورسات متاحة حاليًا
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="relative">
//                 <div className="pointer-events-none absolute inset-x-[10%] top-1/2 h-48 -translate-y-1/2 rounded-full bg-[#C8102E]/[0.07] blur-3xl dark:bg-[#C8102E]/[0.10]" />

//                 <AnimatePresence
//                   mode="wait"
//                   initial={false}
//                 >
//                   <motion.div
//                     key={`${courseIndex}-${courses.length}`}
//                     initial={{
//                       opacity: 0,
//                       x: 30,
//                     }}
//                     animate={{
//                       opacity: 1,
//                       x: 0,
//                     }}
//                     exit={{
//                       opacity: 0,
//                       x: -30,
//                     }}
//                     transition={{
//                       duration: 0.35,
//                       ease: "easeOut",
//                     }}
//                     className="relative flex min-h-[450px] items-center justify-center gap-3 overflow-visible px-0 py-6 sm:gap-4 md:min-h-[500px] md:gap-6 md:px-8 lg:gap-8"
//                   >
//                     {getVisibleCourses(
//                       courses,
//                       courseIndex
//                     ).map(
//                       (
//                         course,
//                         position
//                       ) => (
//                         <CourseCard
//                           key={`${course.id}-${position}`}
//                           course={course}
//                           position={position}
//                           onClick={() =>
//                             setCourseIndex(
//                               courses.indexOf(
//                                 course
//                               )
//                             )
//                           }
//                         />
//                       )
//                     )}
//                   </motion.div>
//                 </AnimatePresence>

//                 {courses.length > 1 && (
//                   <>
//                     <button
//                       type="button"
//                       onClick={previousCourse}
//                       aria-label="الكورس السابق"
//                       className="absolute right-0 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.06] bg-white/95 text-[#C8102E] shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur transition-all hover:-translate-y-1/2 hover:scale-105 hover:bg-[#C8102E] hover:text-white dark:border-white/[0.08] dark:bg-[#18191e]/95"
//                     >
//                       <ChevronRight className="size-6" />
//                     </button>

//                     <button
//                       type="button"
//                       onClick={nextCourse}
//                       aria-label="الكورس التالي"
//                       className="absolute left-0 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.06] bg-white/95 text-[#C8102E] shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur transition-all hover:-translate-y-1/2 hover:scale-105 hover:bg-[#C8102E] hover:text-white dark:border-white/[0.08] dark:bg-[#18191e]/95"
//                     >
//                       <ChevronLeft className="size-6" />
//                     </button>
//                   </>
//                 )}

//                 {courses.length > 1 && (
//                   <div className="mt-2 flex justify-center gap-2">
//                     {courses.map(
//                       (course, index) => (
//                         <button
//                           key={course.id}
//                           type="button"
//                           aria-label={`الانتقال إلى ${course.title}`}
//                           onClick={() =>
//                             setCourseIndex(
//                               index
//                             )
//                           }
//                           className={`h-1.5 rounded-full transition-all duration-300 ${
//                             index ===
//                             courseIndex
//                               ? "w-8 bg-[#C8102E]"
//                               : "w-1.5 bg-black/15 hover:bg-black/30 dark:bg-white/15 dark:hover:bg-white/30"
//                           }`}
//                         />
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ========================================================
//           TESTIMONIALS
//       ======================================================== */}

//       <section className="relative overflow-hidden bg-[#f7f7f8] py-24 dark:bg-[#0b0c0f]">
//         {/* Decorative background */}

//         <div className="pointer-events-none absolute -right-40 top-20 size-96 rounded-full bg-[#C8102E]/[0.05] blur-3xl dark:bg-[#C8102E]/[0.08]" />

//         <div className="pointer-events-none absolute -left-40 bottom-0 size-96 rounded-full bg-[#C8102E]/[0.04] blur-3xl dark:bg-[#C8102E]/[0.06]" />

//         <div className="relative mx-auto max-w-[1500px] px-5 lg:px-10">
//           <SectionTitle title="آراء الطلاب" />

//           <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-gray-500 dark:text-gray-400">
//             تجارب وآراء من مجتمع YAKKAN EG
//           </p>

//           <div className="relative mx-auto mt-12 max-w-[1150px] px-2 sm:px-12">
//             {/* Main testimonial card */}

//             <div className="relative overflow-hidden rounded-[32px] border border-black/[0.05] bg-white shadow-[0_25px_80px_rgba(24,24,27,0.08)] dark:border-white/[0.07] dark:bg-[#111216] dark:shadow-black/30">
//               {/* Top accent */}

//               <div className="absolute inset-x-0 top-0 h-1 bg-[#C8102E]" />

//               <AnimatePresence
//                 mode="wait"
//                 initial={false}
//               >
//                 <motion.div
//                   key={testimonialIndex}
//                   initial={{
//                     opacity: 0,
//                     y: 20,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   exit={{
//                     opacity: 0,
//                     y: -20,
//                   }}
//                   transition={{
//                     duration: 0.35,
//                     ease: "easeOut",
//                   }}
//                   className="relative px-7 py-12 text-center sm:px-16 sm:py-16"
//                 >
//                   {/* Quote icon */}

//                   <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#C8102E]/10 text-[#C8102E] dark:bg-[#C8102E]/15">
//                     <Quote className="size-8 fill-current" />
//                   </div>

//                   {/* Stars */}

//                   <div className="mt-7 flex justify-center gap-1.5">
//                     {[1, 2, 3, 4, 5].map(
//                       (star) => (
//                         <Star
//                           key={star}
//                           className="size-5 fill-[#ffbd00] text-[#ffbd00]"
//                         />
//                       )
//                     )}
//                   </div>

//                   {/* Text */}

//                   <p className="mx-auto mt-8 max-w-[900px] text-base font-medium leading-9 text-[#3f3f46] sm:text-lg sm:leading-10 dark:text-gray-200">
//                     "
//                     {
//                       testimonials[
//                         testimonialIndex
//                       ].text
//                     }
//                     "
//                   </p>

//                   {/* Bottom label */}

//                   <div className="mx-auto mt-9 flex w-fit items-center gap-3 rounded-full border border-black/[0.06] bg-[#fafafa] px-5 py-2.5 dark:border-white/[0.07] dark:bg-white/[0.04]">
//                     <div className="size-2 rounded-full bg-[#C8102E]" />

//                     <span className="text-xs font-black text-gray-600 dark:text-gray-300">
//                       تجربة من مجتمع YAKKAN EG
//                     </span>
//                   </div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>

//             {/* Previous */}

//             <button
//               type="button"
//               onClick={previousTestimonial}
//               aria-label="الرأي السابق"
//               className="absolute right-0 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#C8102E] text-white shadow-[0_12px_30px_rgba(200,16,46,0.25)] transition-all hover:scale-110 hover:bg-[#a80d27] sm:right-0 sm:size-14"
//             >
//               <ChevronRight className="size-6 sm:size-7" />
//             </button>

//             {/* Next */}

//             <button
//               type="button"
//               onClick={nextTestimonial}
//               aria-label="الرأي التالي"
//               className="absolute left-0 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#C8102E] text-white shadow-[0_12px_30px_rgba(200,16,46,0.25)] transition-all hover:scale-110 hover:bg-[#a80d27] sm:left-0 sm:size-14"
//             >
//               <ChevronLeft className="size-6 sm:size-7" />
//             </button>
//           </div>

//           {/* Indicators */}

//           <div className="mt-8 flex items-center justify-center gap-2">
//             {testimonials.map(
//               (_, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   aria-label={`الانتقال إلى الرأي ${index + 1}`}
//                   onClick={() =>
//                     setTestimonialIndex(
//                       index
//                     )
//                   }
//                   className={`h-1.5 rounded-full transition-all duration-300 ${
//                     index ===
//                     testimonialIndex
//                       ? "w-9 bg-[#C8102E]"
//                       : "w-1.5 bg-black/15 hover:bg-black/30 dark:bg-white/15 dark:hover:bg-white/30"
//                   }`}
//                 />
//               )
//             )}
//           </div>

//           {/* Counter */}

//           <div className="mt-4 text-center text-xs font-bold text-gray-400">
//             {String(
//               testimonialIndex + 1
//             ).padStart(2, "0")}{" "}
//             /{" "}
//             {String(
//               testimonials.length
//             ).padStart(2, "0")}
//           </div>
//         </div>
//       </section>

//       {/* ========================================================
//           APP DOWNLOAD
//       ======================================================== */}

//       <section className="py-24">
//         <div className="mx-auto grid max-w-[1450px] items-center gap-12 px-5 lg:grid-cols-2 lg:px-10">
//           <motion.div
//             initial={{
//               opacity: 0,
//               x: 40,
//             }}
//             whileInView={{
//               opacity: 1,
//               x: 0,
//             }}
//             viewport={{
//               once: true,
//             }}
//             className="text-center lg:text-right"
//           >
//             <h2 className="text-3xl font-black sm:text-4xl">
//               حمل تطبيق{" "}
//               <span className="text-[#C8102E]">
//                 YAKKAN EG
//               </span>{" "}
//               الآن
//             </h2>

//             <p className="mt-6 text-lg leading-9 text-[#52525b] dark:text-[#b7b7c0]">
//               تعلم في أي وقت ومن أي مكان.
//               <br />
//               تجربة تعليمية متكاملة بين يديك.
//             </p>

//             <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
//               <AppButton
//                 icon={<Apple />}
//                 title="App Store"
//               />

//               <AppButton
//                 icon={<Play />}
//                 title="Google Play"
//               />
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{
//               opacity: 0,
//               x: -40,
//             }}
//             whileInView={{
//               opacity: 1,
//               x: 0,
//             }}
//             viewport={{
//               once: true,
//             }}
//             className="flex justify-center"
//           >
//             <img
//               src="/Mobile development-bro.svg"
//               alt="YAKKAN EG App"
//               className="w-full max-w-[700px] object-contain"
//             />
//           </motion.div>
//         </div>
//       </section>

//       {/* ========================================================
//           MEDIA GALLERY
//       ======================================================== */}

//       {!galleryLoading &&
//         galleryImages.length > 0 && (
//           <section className="bg-[#f7f7f8] py-24 dark:bg-[#0b0c0f]">
//             <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
//               <SectionTitle title="معرض الصور والفيديوهات" />

//               {/* FILTERS */}

//               <div className="mt-9 flex flex-wrap justify-center gap-3">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setMediaFilter("الكل")
//                   }
//                   className={`rounded-xl border px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
//                     mediaFilter === "الكل"
//                       ? "border-[#C8102E] bg-[#C8102E] text-white shadow-[0_8px_22px_rgba(200,16,46,0.18)]"
//                       : "border-black/[0.06] bg-white text-[#52525b] shadow-sm hover:border-[#C8102E]/20 hover:bg-white hover:text-[#C8102E] dark:border-white/[0.07] dark:bg-[#111216] dark:text-white dark:hover:bg-white/[0.07]"
//                   }`}
//                 >
//                   الكل
//                 </button>

//                 {availableGalleryCategories.map(
//                   (category) => (
//                     <button
//                       key={category.key}
//                       type="button"
//                       onClick={() =>
//                         setMediaFilter(
//                           category.key
//                         )
//                       }
//                       className={`rounded-xl border px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
//                         mediaFilter ===
//                         category.key
//                           ? "border-[#C8102E] bg-[#C8102E] text-white shadow-[0_8px_22px_rgba(200,16,46,0.18)]"
//                           : "border-black/[0.06] bg-white text-[#52525b] shadow-sm hover:border-[#C8102E]/20 hover:bg-white hover:text-[#C8102E] dark:border-white/[0.07] dark:bg-[#111216] dark:text-white dark:hover:bg-white/[0.07]"
//                       }`}
//                     >
//                       {category.label}
//                     </button>
//                   )
//                 )}
//               </div>

//               {/* GALLERY */}

//               <div
//                 className="
//                   mt-9
//                   max-h-[720px]
//                   overflow-y-auto
//                   overflow-x-hidden
//                   rounded-[24px]
//                   pr-1
//                   [scrollbar-width:thin]
//                 "
//               >
//                 <motion.div
//                   layout
//                   className="grid grid-cols-2 gap-4 lg:grid-cols-4"
//                 >
//                   <AnimatePresence mode="popLayout">
//                     {filteredGalleryImages.map(
//                       (item) => (
//                         <motion.div
//                           layout
//                           key={item.id}
//                           initial={{
//                             opacity: 0,
//                             scale: 0.95,
//                           }}
//                           animate={{
//                             opacity: 1,
//                             scale: 1,
//                           }}
//                           exit={{
//                             opacity: 0,
//                             scale: 0.95,
//                           }}
//                           transition={{
//                             duration: 0.25,
//                           }}
//                           className="
//                             group
//                             relative
//                             h-[190px]
//                             overflow-hidden
//                             rounded-2xl
//                             border
//                             border-black/[0.06]
//                             bg-white
//                             shadow-[0_8px_25px_rgba(24,24,27,0.05)]
//                             sm:h-[220px]
//                             lg:h-[250px]
//                             dark:border-white/[0.07]
//                             dark:bg-[#111216]
//                           "
//                         >
//                           {/* ==================================================
//                               IMAGE
//                           ================================================== */}

//                           <img
//                             src={item.url}
//                             alt={getGalleryCategoryLabel(
//                               item.category
//                             )}
//                             loading="lazy"
//                             decoding="async"
//                             className="
//                               block
//                               h-full
//                               w-full
//                               object-cover
//                               transition-transform
//                               duration-500
//                               ease-out
//                               group-hover:scale-105
//                             "
//                           />

//                           {/* ==================================================
//                               CATEGORY BADGE ONLY
                              
//                               لا يوجد هنا أي Overlay أو PlayCircle
//                               ================================================== */}

//                           <div
//                             className="
//                               absolute
//                               right-3
//                               top-3
//                               rounded-full
//                               bg-black/60
//                               px-3
//                               py-1.5
//                               text-xs
//                               font-bold
//                               text-white
//                               backdrop-blur-md
//                             "
//                           >
//                             {getGalleryCategoryLabel(
//                               item.category
//                             )}
//                           </div>
//                         </motion.div>
//                       )
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               </div>

//               {/* EMPTY FILTER */}

//               {filteredGalleryImages.length ===
//                 0 && (
//                 <div className="mt-9 rounded-2xl border border-dashed border-black/10 bg-white py-16 text-center dark:border-white/10 dark:bg-[#111216]">
//                   <p className="font-bold text-gray-500 dark:text-gray-400">
//                     لا توجد صور في هذا التصنيف حاليًا
//                   </p>
//                 </div>
//               )}
//             </div>
//           </section>
//         )}

//       {/* ========================================================
//           FOOTER
//       ======================================================== */}

      
// {/* ========================================================
//     FOOTER
// ======================================================== */}

// <footer className="border-t border-black/[0.06] bg-white dark:border-white/[0.07] dark:bg-[#08090b]">
//   <div className="mx-auto max-w-[1200px] px-5 py-14 lg:px-10">
//     <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:text-right">

//       {/* ============================================================ */}
//       {/* BRAND */}
//       {/* ============================================================ */}

//       <div className="text-center md:text-right">
//         <div className="flex items-center justify-center gap-2.5 md:justify-start">

//           {/* LOGO - SAME AS NAVBAR */}
//           <Link
//             href="/"
//             className="group relative flex shrink-0 items-center"
//           >
//             <div
//               className="
//                 relative
//                 flex
//                 size-10
//                 shrink-0
//                 items-center
//                 justify-center
//                 overflow-hidden
//                 rounded-xl
//                 border
//                 border-red-500/15
//                 bg-background
//                 p-1
//                 shadow-lg
//                 shadow-red-500/10
//                 transition-all
//                 duration-300
//                 group-hover:scale-105
//                 group-hover:border-red-500/30
//                 group-hover:shadow-xl
//                 group-hover:shadow-red-500/20
//               "
//             >
//               <div
//                 className="
//                   absolute
//                   inset-0
//                   rounded-xl
//                   bg-gradient-to-br
//                   from-red-500/20
//                   via-rose-500/10
//                   to-orange-500/20
//                 "
//               />

//               <img
//                 src="/myLogo.png"
//                 alt="YAKKAN-EG"
//                 className="
//                   relative
//                   z-10
//                   size-full
//                   rounded-lg
//                   object-cover
//                 "
//               />
//             </div>
//           </Link>

//           {/* BRAND NAME */}
//           <div>
//             <h3
//               className="
//                 bg-gradient-to-l
//                 from-red-500
//                 via-rose-500
//                 to-orange-500
//                 bg-clip-text
//                 text-2xl
//                 font-black
//                 tracking-tight
//                 text-transparent
//               "
//             >
//               YAKKAN-EG
//             </h3>

//             <p className="mt-0.5 text-xs font-semibold text-[#71717a] dark:text-[#a1a1aa]">
//               تعلم • تطور • استمتع
//             </p>
//           </div>
//         </div>

//         <p className="mt-4 max-w-[450px] text-sm leading-7 text-[#71717a] dark:text-[#a1a1aa]">
//           تعلم بذكاء وابدأ رحلتك نحو النجاح مع YAKKAN EG.
//         </p>
//       </div>

//       {/* ============================================================ */}
//       {/* SOCIAL */}
//       {/* ============================================================ */}

//       <div className="text-center">
//         <h3 className="text-base font-black">
//           تواصل معنا
//         </h3>

//         <div className="mt-4 flex items-center justify-center gap-3">

//           {/* FACEBOOK */}
//           <a
//             href="#"
//             aria-label="Facebook"
//             className="
//               flex
//               size-11
//               items-center
//               justify-center
//               rounded-xl
//               border
//               border-black/[0.06]
//               bg-[#fafafa]
//               text-[#18181b]
//               shadow-sm
//               transition-all
//               duration-300
//               hover:-translate-y-1
//               hover:border-[#C8102E]/20
//               hover:bg-[#C8102E]
//               hover:text-white
//               hover:shadow-[0_10px_25px_rgba(200,16,46,0.18)]
//               dark:border-white/[0.07]
//               dark:bg-[#111216]
//               dark:text-white
//             "
//           >
//             <FacebookIcon />
//           </a>

//           {/* INSTAGRAM */}
//           <a
//             href="#"
//             aria-label="Instagram"
//             className="
//               flex
//               size-11
//               items-center
//               justify-center
//               rounded-xl
//               border
//               border-black/[0.06]
//               bg-[#fafafa]
//               text-[#18181b]
//               shadow-sm
//               transition-all
//               duration-300
//               hover:-translate-y-1
//               hover:border-[#C8102E]/20
//               hover:bg-[#C8102E]
//               hover:text-white
//               hover:shadow-[0_10px_25px_rgba(200,16,46,0.18)]
//               dark:border-white/[0.07]
//               dark:bg-[#111216]
//               dark:text-white
//             "
//           >
//             <InstagramIcon />
//           </a>

//           {/* WHATSAPP */}
//           <a
//             href="#"
//             aria-label="WhatsApp"
//             className="
//               flex
//               size-11
//               items-center
//               justify-center
//               rounded-xl
//               border
//               border-black/[0.06]
//               bg-[#fafafa]
//               text-[#18181b]
//               shadow-sm
//               transition-all
//               duration-300
//               hover:-translate-y-1
//               hover:border-[#C8102E]/20
//               hover:bg-[#C8102E]
//               hover:text-white
//               hover:shadow-[0_10px_25px_rgba(200,16,46,0.18)]
//               dark:border-white/[0.07]
//               dark:bg-[#111216]
//               dark:text-white
//             "
//           >
//             <WhatsappIcon />
//           </a>

//           {/* X */}
//           <a
//             href="#"
//             aria-label="X"
//             className="
//               flex
//               size-11
//               items-center
//               justify-center
//               rounded-xl
//               border
//               border-black/[0.06]
//               bg-[#fafafa]
//               text-[#18181b]
//               shadow-sm
//               transition-all
//               duration-300
//               hover:-translate-y-1
//               hover:border-[#C8102E]/20
//               hover:bg-[#C8102E]
//               hover:text-white
//               hover:shadow-[0_10px_25px_rgba(200,16,46,0.18)]
//               dark:border-white/[0.07]
//               dark:bg-[#111216]
//               dark:text-white
//             "
//           >
//             <X className="size-5" />
//           </a>

//         </div>
//       </div>
//     </div>

//     {/* ============================================================ */}
//     {/* COPYRIGHT */}
//     {/* ============================================================ */}

//     <div className="mt-10 border-t border-black/[0.06] pt-6 text-center text-sm text-[#71717a] dark:border-white/[0.08] dark:text-[#a1a1aa]">
//       © {new Date().getFullYear()}{" "}
//       <span className="font-bold text-[#C8102E]">
//         YAKKAN EG
//       </span>{" "}
//       - جميع الحقوق محفوظة.
//     </div>
//   </div>
// </footer>


//     </main>
//   );
// }

// // ============================================================
// // TYPES
// // ============================================================

// type GalleryImage = {
//   id: string;
//   url: string;
//   category: string;
//   createdAt?: string;
//   key?: string;
// };

// type GalleryCategoryOption = {
//   key: string;
//   label: string;
// };

// type Course = {
//   id: string;
//   image: string;
//   title: string;
//   doctor: string;
//   description: string;
//   rating: number;
//   reviews: number;
//   students: number;
//   __single?: boolean;
// };

// // ============================================================
// // STAT
// // ============================================================

// function Stat({
//   icon,
//   number,
//   label,
// }: {
//   icon: React.ReactNode;
//   number: string;
//   label: string;
// }) {
//   return (
//     <motion.div
//       whileHover={{
//         y: -3,
//       }}
//       className="flex items-center justify-center gap-3 border-black/5 px-5 py-5 dark:border-white/5 lg:border-l"
//     >
//       <div className="text-[#C8102E] transition-transform duration-300 group-hover:scale-110">
//         {icon}
//       </div>

//       <div>
//         <div className="text-2xl font-black">
//           {number}
//         </div>

//         <div className="text-sm text-gray-600 dark:text-gray-400">
//           {label}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // ============================================================
// // CATEGORY
// // ============================================================

// function Category({
//   icon,
//   title,
// }: {
//   icon: React.ReactNode;
//   title: string;
// }) {
//   return (
//     <motion.div
//       whileHover={{
//         y: -5,
//       }}
//       className="group flex min-h-[108px] flex-col items-center justify-center rounded-2xl border border-black/[0.05] bg-white p-4 shadow-[0_8px_28px_rgba(24,24,27,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C8102E]/15 hover:shadow-[0_16px_40px_rgba(24,24,27,0.08)] dark:border-white/[0.06] dark:bg-[#111216] dark:shadow-black/20"
//     >
//       <div className="text-[#C8102E] transition-transform duration-300 group-hover:scale-110">
//         {icon}
//       </div>

//       <span className="mt-2 text-sm font-bold">
//         {title}
//       </span>
//     </motion.div>
//   );
// }

// // ============================================================
// // WHY CARD
// // ============================================================

// function WhyCard({
//   icon,
//   title,
//   subtitle,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   subtitle: string;
// }) {
//   return (
//     <motion.div
//       whileHover={{
//         y: -5,
//       }}
//       className="group relative flex min-h-[155px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-black/[0.05] bg-white px-4 py-7 text-center shadow-[0_10px_35px_rgba(24,24,27,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8102E]/15 hover:shadow-[0_18px_45px_rgba(24,24,27,0.09)] dark:border-white/[0.06] dark:bg-[#111216] dark:shadow-black/20"
//     >
//       <div className="text-[#C8102E] transition-transform duration-300 group-hover:scale-110">
//         {icon}
//       </div>

//       <div className="mt-3 text-base font-bold leading-7">
//         {title}
//         <br />
//         {subtitle}
//       </div>
//     </motion.div>
//   );
// }

// // ============================================================
// // STEP
// // ============================================================

// function Step({
//   number,
//   title,
//   text,
// }: {
//   number: string;
//   title: string;
//   text: string;
// }) {
//   return (
//     <motion.div
//       whileHover={{
//         y: -4,
//       }}
//       className="group flex items-center gap-5 rounded-2xl border border-black/[0.05] bg-white p-6 shadow-[0_10px_30px_rgba(24,24,27,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C8102E]/15 hover:shadow-[0_18px_42px_rgba(24,24,27,0.08)] dark:border-white/[0.06] dark:bg-[#111216] dark:shadow-black/20"
//     >
//       <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#C8102E] text-2xl font-black text-white shadow-[0_10px_24px_rgba(200,16,46,0.22)]">
//         {number}
//       </div>

//       <div>
//         <h3 className="text-lg font-black">
//           {title}
//         </h3>

//         <p className="mt-1 text-sm leading-7 text-gray-600 dark:text-gray-400">
//           {text}
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// // ============================================================
// // COURSE CARD
// // ============================================================

// function CourseCard({
//   course,
//   position,
//   onClick,
// }: {
//   course: Course;
//   position: number;
//   onClick: () => void;
// }) {
//   const isCenter =
//     position === 1 || course.__single;

//   return (
//     <Link
//       href={`/courses/${course.id}`}
//       onClick={onClick}
//       className={`${
//         course.__single
//           ? "w-[74vw] max-w-[360px]"
//           : position === 1
//             ? "w-[74vw] max-w-[360px] md:w-[46%] lg:w-[390px]"
//             : "block w-[22vw] max-w-[120px] md:w-[31%] md:max-w-[330px]"
//       } shrink-0`}
//     >
//       <motion.article
//         animate={{
//           scale: isCenter ? 1.04 : 0.91,
//           opacity: isCenter ? 1 : 0.55,
//           y: isCenter ? -8 : 8,
//         }}
//         whileHover={{
//           scale: isCenter ? 1.06 : 0.94,
//           opacity: 1,
//           y: isCenter ? -12 : 4,
//         }}
//         transition={{
//           type: "spring",
//           stiffness: 260,
//           damping: 24,
//         }}
//         className={`group relative flex h-[400px] flex-col overflow-hidden rounded-[26px] border bg-white shadow-[0_18px_50px_rgba(24,24,27,0.07)] dark:bg-[#111216] dark:shadow-black/25 ${
//           isCenter
//             ? "border-[#C8102E]/20 shadow-[0_28px_70px_rgba(200,16,46,0.16)] dark:border-[#C8102E]/30"
//             : "border-black/[0.06] dark:border-white/[0.07]"
//         }`}
//       >
//         <div className="relative shrink-0 overflow-hidden">
//           <img
//             src={course.image}
//             alt={course.title}
//             className="h-[175px] w-full object-cover transition duration-700 group-hover:scale-[1.05]"
//           />

//           <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

//           {isCenter && (
//             <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#C8102E] shadow-lg backdrop-blur">
//               كورس مميز
//             </div>
//           )}
//         </div>

//         <div className="flex flex-1 flex-col p-4">
//           <div>
//             <h3 className="line-clamp-2 min-h-[52px] text-lg font-black leading-6 tracking-tight">
//               {course.title}
//             </h3>

//             <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
//               {course.doctor}
//             </p>

//             <p className="mt-2 line-clamp-2 min-h-[40px] text-xs leading-5 text-gray-600 dark:text-gray-400">
//               {course.description}
//             </p>
//           </div>

//           <div className="mt-auto">
//             <div className="mt-auto pt-3">
//               <div className="flex h-10 items-center justify-center rounded-xl bg-[#C8102E] text-sm font-black text-white shadow-[0_8px_24px_rgba(200,16,46,0.18)] transition-all group-hover:-translate-y-0.5 group-hover:bg-[#a80d27] group-hover:shadow-[0_12px_30px_rgba(200,16,46,0.24)]">
//                 عرض الكورس
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.article>
//     </Link>
//   );
// }

// // ============================================================
// // VISIBLE COURSES
// // ============================================================

// function getVisibleCourses(
//   courses: Course[],
//   currentIndex: number
// ) {
//   if (courses.length === 1) {
//     return [
//       {
//         ...courses[0],
//         __single: true,
//       },
//     ];
//   }

//   if (courses.length === 2) {
//     const current =
//       courses[currentIndex];

//     const other =
//       courses[
//         (currentIndex + 1) %
//           courses.length
//       ];

//     return [
//       {
//         ...other,
//         __single: false,
//       },
//       {
//         ...current,
//         __single: true,
//       },
//     ];
//   }

//   return [
//     courses[
//       (currentIndex - 1 + courses.length) %
//         courses.length
//     ],

//     courses[currentIndex],

//     courses[
//       (currentIndex + 1) %
//         courses.length
//     ],
//   ];
// }

// // ============================================================
// // APP BUTTON
// // ============================================================

// function AppButton({
//   icon,
//   title,
// }: {
//   icon: React.ReactNode;
//   title: string;
// }) {
//   return (
//     <button
//       type="button"
//       className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3 text-[#18181b] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C8102E]/25 hover:text-[#C8102E] hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:border-[#C8102E]/30 dark:hover:text-[#ff5a73]"
//     >
//       {icon}

//       <span className="font-semibold">
//         {title}
//       </span>
//     </button>
//   );
// }







// // ============================================================
// // FACEBOOK ICON
// // ============================================================

// function FacebookIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       className="size-5"
//       aria-hidden="true"
//     >
//       <path d="M14 8h3V4h-3c-2.76 0-5 2.24-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.55.45-1 1-1Z" />
//     </svg>
//   );
// }

// // ============================================================
// // SECTION TITLE
// // ============================================================

// function SectionTitle({
//   title,
//   align = "center",
//   className = "",
// }: {
//   title: string;
//   align?: "center" | "right";
//   className?: string;
// }) {
//   return (
//     <h2
//       className={`text-3xl font-black tracking-tight sm:text-4xl ${
//         align === "center"
//           ? "text-center"
//           : "text-right"
//       } ${className}`}
//     >
//       {title}
//     </h2>
//   );
// }











































"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Apple,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Bus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gift,
  GraduationCap,
  Headphones,
  Play,
  PlayCircle,
  School,
  Smartphone,
  Star,
  Users,
  X,
  Quote,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

/* ============================================================
   TYPES
============================================================ */

type GalleryImage = {
  id: string;
  url: string;
  category: string;
  createdAt?: string;
  key?: string;
};

type GalleryCategoryOption = {
  key: string;
  label: string;
};

type Course = {
  id: string;
  image: string;
  title: string;
  doctor: string;
  description: string;
  rating: number;
  reviews: number;
  students: number;
  __single?: boolean;
};

/* ============================================================
   PAGE
============================================================ */

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  /* ==========================================================
     COURSES
  ========================================================== */

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseIndex, setCourseIndex] = useState(1);
  const [coursesLoading, setCoursesLoading] = useState(true);

  /* ==========================================================
     GALLERY
  ========================================================== */

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [mediaFilter, setMediaFilter] = useState("الكل");

  /* ==========================================================
     LOAD COURSES
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      try {
        setCoursesLoading(true);

        const response = await fetch("/api/courses", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const result = await response.json();

        const items = Array.isArray(result)
          ? result
          : Array.isArray(result?.courses)
            ? result.courses
            : Array.isArray(result?.data)
              ? result.data
              : [];

        const normalized: Course[] = items.map((course: any) => ({
          id: String(course.id),

          image:
            course.mediaUrl ||
            course.image ||
            "/course-placeholder.jpg",

          title:
            course.title ||
            "كورس بدون عنوان",

          doctor:
            course.doctor?.name ||
            course.instructor?.name ||
            course.instructorName ||
            course.doctor ||
            "YAKKAN EG",

          description:
            course.smallDescription ||
            course.description ||
            "اكتشف محتوى الكورس وابدأ رحلة التعلم مع YAKKAN EG.",

          rating: Number(course.rating ?? 4.7),

          reviews: Number(
            course.reviewsCount ??
              course.reviews ??
              0
          ),

          students: Number(
            course.studentsCount ??
              course.students ??
              0
          ),
        }));

        if (!cancelled) {
          setCourses(normalized);
          setCourseIndex(normalized.length > 1 ? 1 : 0);
        }
      } catch (error) {
        console.error("Failed to load courses:", error);

        if (!cancelled) {
          setCourses([]);
          setCourseIndex(0);
        }
      } finally {
        if (!cancelled) {
          setCoursesLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     LOAD GALLERY
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      try {
        setGalleryLoading(true);

        const response = await fetch("/api/gallery", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch gallery");
        }

        const result = await response.json();

        const images = Array.isArray(result?.images)
          ? result.images
          : [];

        const validImages: GalleryImage[] = images.filter(
          (image: any) =>
            image &&
            typeof image.id === "string" &&
            typeof image.url === "string" &&
            image.url.trim() !== "" &&
            typeof image.category === "string"
        );

        if (!cancelled) {
          setGalleryImages(validImages);
          setMediaFilter("الكل");
        }
      } catch (error) {
        console.error("Failed to load gallery:", error);

        if (!cancelled) {
          setGalleryImages([]);
          setMediaFilter("الكل");
        }
      } finally {
        if (!cancelled) {
          setGalleryLoading(false);
        }
      }
    }

    loadGallery();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadGallery();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      cancelled = true;

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const nextCourse = () => {
    setCourseIndex((current) =>
      courses.length
        ? (current + 1) % courses.length
        : 0
    );
  };

  const previousCourse = () => {
    setCourseIndex((current) =>
      courses.length
        ? (current - 1 + courses.length) %
          courses.length
        : 0
    );
  };

  /* ==========================================================
     DATA
  ========================================================== */

  const stats = [
    {
      icon: <Users />,
      number: "20K+",
      label: "طالب",
    },
    {
      icon: <BookOpen />,
      number: "350+",
      label: "كورس",
    },
    {
      icon: <GraduationCap />,
      number: "150+",
      label: "دكتور ومدرب",
    },
    {
      icon: <Award />,
      number: "5K+",
      label: "شهادة",
    },
    {
      icon: <Star />,
      number: "98%",
      label: "رضا الطلاب",
    },
  ];

  const categories = [
    {
      icon: <Gift />,
      title: "حفلات التخرج",
      text: "لحظات تستحق أن تُحفظ",
    },
    {
      icon: <Bus />,
      title: "الرحلات",
      text: "تعلم واكتشف في كل رحلة",
    },
    {
      icon: <Building2 />,
      title: "المعاهد",
      text: "تجربة تعليمية متكاملة",
    },
    {
      icon: <School />,
      title: "المدارس",
      text: "تعليم أسهل وأكثر تنظيمًا",
    },
    {
      icon: <GraduationCap />,
      title: "الجامعات",
      text: "طور مهاراتك الأكاديمية",
    },
    {
      icon: <BookOpen />,
      title: "الكورسات",
      text: "تعلم مهارات جديدة",
    },
  ];

  const whyUs = [
    {
      icon: <Headphones />,
      title: "دعم فني",
      text: "موجودين لمساعدتك باستمرار",
    },
    {
      icon: <BarChart3 />,
      title: "متابعة التقدم",
      text: "اعرف مستواك وتطورك دائمًا",
    },
    {
      icon: <Smartphone />,
      title: "تعلم من أي مكان",
      text: "تجربة مريحة على جميع الأجهزة",
    },
    {
      icon: <Award />,
      title: "شهادات",
      text: "وثق إنجازك بعد إتمام التعلم",
    },
    {
      icon: <CheckCircle2 />,
      title: "اختبارات",
      text: "اختبر فهمك واحصل على تقييمك",
    },
    {
      icon: <PlayCircle />,
      title: "فيديوهات عالية الجودة",
      text: "محتوى واضح وسهل المتابعة",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "أنشئ حسابك",
      text: "سجل بياناتك بسهولة وابدأ رحلتك التعليمية.",
    },
    {
      number: "02",
      title: "اختر الكورس",
      text: "ادخل الكود أو اختر الكورس المناسب لأهدافك.",
    },
    {
      number: "03",
      title: "ابدأ التعلم",
      text: "تابع دروسك واختباراتك وراقب تقدمك.",
    },
  ];

  const testimonials = [
    "منصة YAKKAN EG من أفضل المنصات التعليمية اللي جربتها. المحتوى منظم جدًا وسهولة متابعة التقدم خلت تجربة التعلم مختلفة تمامًا.",
    "تجربة YAKKAN EG مختلفة فعلًا عن الكورسات التقليدية. التصميم مريح والمحتوى مرتب والاختبارات والشهادات بتخلي التعلم أكثر جدية.",
    "أكثر شيء مميز في المنصة إنها مش مجرد مكان لمشاهدة الكورسات، لكنها بتقدم تجربة تعليمية متكاملة ومنظمة.",
    "استخدام المنصة كان مريح جدًا من البداية. كل شيء واضح وسهل الوصول، وحسيت إن المنصة معمولة فعلًا علشان تساعد الطالب.",
    "YAKKAN EG قدرت تجمع التعلم والاختبارات والشهادات ومتابعة التقدم في مكان واحد بشكل منظم.",
    "منصة ممتازة جدًا من ناحية التنظيم وسهولة الاستخدام. المحتوى واضح والاختبارات والشهادات أضافت قيمة حقيقية للتجربة.",
    "التجربة بشكل عام احترافية جدًا. المنصة سريعة وسهلة سواء على الكمبيوتر أو الموبايل.",
    "أرشح YAKKAN EG لأي شخص عايز يطور نفسه ويتعلم بطريقة منظمة ومرنة.",
  ];

  /* ==========================================================
     GALLERY HELPERS
  ========================================================== */

  const galleryCategoryLabels: Record<string, string> = {
    GRADUATION: "حفلات التخرج",
    GRADUATION_PARTY: "حفلات التخرج",
    GRADUATION_PARTIES: "حفلات التخرج",
    GRADUATIONS: "حفلات التخرج",
    EVENTS: "حفلات التخرج",
    EVENT: "حفلات التخرج",
    PARTIES: "حفلات التخرج",
    PARTY: "حفلات التخرج",

    TRIPS: "الرحلات",
    TRIP: "الرحلات",

    COURSES: "الكورسات",
    COURSE: "الكورسات",

    "حفلات التخرج": "حفلات التخرج",
    الحفلات: "حفلات التخرج",
    الرحلات: "الرحلات",
    الكورسات: "الكورسات",
  };

  const getGalleryCategoryLabel = (category: string) => {
    const normalized = category.trim().toUpperCase();

    return (
      galleryCategoryLabels[normalized] ||
      galleryCategoryLabels[category] ||
      category
    );
  };

  const availableGalleryCategories = useMemo(() => {
    const unique = Array.from(
      new Set(
        galleryImages.map(
          (image) => image.category
        )
      )
    );

    const ordered = [
      "حفلات التخرج",
      "الرحلات",
      "الكورسات",
    ];

    const result: GalleryCategoryOption[] = [];

    for (const label of ordered) {
      const match = unique.find(
        (category) =>
          getGalleryCategoryLabel(category) ===
          label
      );

      if (match) {
        result.push({
          key: match,
          label,
        });
      }
    }

    for (const category of unique) {
      if (
        !result.some(
          (item) => item.key === category
        )
      ) {
        result.push({
          key: category,
          label: getGalleryCategoryLabel(
            category
          ),
        });
      }
    }

    return result;
  }, [galleryImages]);

  const filteredGalleryImages = useMemo(() => {
    if (mediaFilter === "الكل") {
      return galleryImages;
    }

    return galleryImages.filter(
      (image) =>
        image.category === mediaFilter
    );
  }, [galleryImages, mediaFilter]);

  useEffect(() => {
    if (mediaFilter === "الكل") return;

    const exists =
      availableGalleryCategories.some(
        (category) =>
          category.key === mediaFilter
      );

    if (!exists) {
      setMediaFilter("الكل");
    }
  }, [
    mediaFilter,
    availableGalleryCategories,
  ]);

  /* ==========================================================
     TESTIMONIAL NAVIGATION
  ========================================================== */

  const nextTestimonial = () => {
    setTestimonialIndex(
      (current) =>
        (current + 1) % testimonials.length
    );
  };

  const previousTestimonial = () => {
    setTestimonialIndex(
      (current) =>
        (current - 1 + testimonials.length) %
        testimonials.length
    );
  };

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-[#FAFAFA] text-[#222222] antialiased dark:bg-[#08090b] dark:text-white"
    >
      {/* ======================================================
          HERO
      ====================================================== */}

     <section className="relative isolate pt-5 overflow-hidden bg-[#f6f6f7] dark:bg-[#0b0c0f]">
  {/* Background circles */}

  <div className="pointer-events-none absolute -right-48 -top-48 -z-10 size-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,16,46,0.17),rgba(200,16,46,0.05)_42%,transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle,rgba(200,16,46,0.22),rgba(200,16,46,0.06)_42%,transparent_72%)]" />

  <div className="pointer-events-none absolute -bottom-64 -left-48 -z-10 size-[650px] rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.10),rgba(200,16,46,0.04)_42%,transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(201,162,39,0.08),rgba(200,16,46,0.05)_42%,transparent_72%)]" />

  <div
    className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] dark:opacity-[0.035]"
    style={{
      backgroundImage:
        "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
      backgroundSize: "52px 52px",
    }}
  />

  <div className="mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-10">
    <div className="grid min-h-[620px] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16">
      {/* TEXT */}

   <motion.div
  initial={{
    opacity: 0,
    x: 35,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: 0.7,
    ease: "easeOut",
  }}
  className="text-center lg:text-right"
>
  {/* Badge */}
  <div className="mb-5 flex justify-center lg:justify-start">
    <div className="inline-flex items-center gap-2 rounded-full border border-[#C8102E]/15 bg-white/80 px-4 py-2 text-xs font-bold text-[#C8102E] shadow-sm backdrop-blur-xl dark:border-[#C8102E]/20 dark:bg-white/[0.04] dark:text-[#ff7185]">
      <span className="relative flex size-2">
        <span className="absolute size-full animate-ping rounded-full bg-[#C8102E]/35" />
        <span className="relative size-2 rounded-full bg-[#C8102E]" />
      </span>

      مستقبل التعليم يبدأ من هنا
    </div>
  </div>

  {/* Eyebrow */}
  <p className="mb-3 text-xs font-bold text-[#C8102E] sm:text-sm">
    منصة YAKKAN EG التعليمية
  </p>

  {/* Main Heading */}
  <h1 className="text-[30px] font-black sm:text-[36px] lg:text-[44px] xl:text-[50px]">
  <span className="inline-block leading-[1.25]">
    تعلّم بذكاء...
  </span>

  <br />

  <span className="mt-1 inline-block leading-[1.4] bg-gradient-to-l from-[#A80D27] via-[#C8102E] to-[#e94b67] bg-clip-text text-transparent">
    وابدأ رحلتك نحو النجاح
  </span>
</h1>

  {/* Description */}
  <p className="mx-auto mt-5 max-w-[620px] text-[15px] font-medium leading-7 text-[#62626a] sm:text-base sm:leading-8 lg:mx-0 dark:text-[#b8b8c0]">
    منصة YAKKAN EG تجمع بين التعليم الإلكتروني
    والامتحانات والشهادات والرحلات التعليمية
    في تجربة واحدة مصممة لتساعدك على التعلم
    والتطور وتحقيق أهدافك.
  </p>

  {/* Actions */}
  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
    {!isPending && !isLoggedIn && (
      <Link href="/register">
        <Button
          className="
            h-11 w-full rounded-xl
            bg-[#C8102E] px-8
            text-sm font-bold text-white
            shadow-[0_12px_30px_rgba(200,16,46,0.20)]
            transition-all duration-300
            hover:-translate-y-0.5
            hover:bg-[#A80D27]
            hover:shadow-[0_16px_35px_rgba(200,16,46,0.26)]
            sm:w-auto
          "
        >
          ابدأ رحلتك
        </Button>
      </Link>
    )}

    <Link href="/courses">
      <Button
        variant="outline"
        className="
          h-11 w-full rounded-xl
          border-black/10
          bg-white/75 px-7
          text-sm font-bold
          shadow-sm backdrop-blur
          transition-all duration-300
          hover:-translate-y-0.5
          hover:border-[#C8102E]/25
          hover:bg-white
          hover:text-[#C8102E]
          dark:border-white/10
          dark:bg-white/[0.04]
          dark:text-white
          dark:hover:bg-white/[0.07]
          dark:hover:text-[#ff7185]
          sm:w-auto
        "
      >
        تصفح الكورسات
        <BookOpen className="mr-2 size-4" />
      </Button>
    </Link>
  </div>

  {/* Trust points */}
  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-bold text-[#777780] lg:justify-start dark:text-[#9999a3]">
    <span className="flex items-center gap-1.5">
      <CheckCircle2 className="size-3.5 text-[#C8102E]" />
      محتوى تعليمي متنوع
    </span>

    <span className="hidden h-3 w-px bg-black/10 sm:block dark:bg-white/10" />

    <span className="flex items-center gap-1.5">
      <CheckCircle2 className="size-3.5 text-[#C8102E]" />
      شهادات معتمدة
    </span>
  </div>
</motion.div>

      {/* VISUAL */}

      <motion.div
        initial={{
          opacity: 0,
          x: -35,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="flex justify-center"
      >
        <div className="relative flex aspect-square w-full max-w-[510px] items-center justify-center">
          <div className="absolute inset-[5%] rounded-full bg-[#C8102E]/[0.035] blur-3xl dark:bg-[#C8102E]/[0.07]" />

          <div className="absolute inset-[7%] rounded-full border border-[#C8102E]/10 bg-white/35 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.02]" />

          <div className="absolute inset-[16%] rounded-full border border-dashed border-[#C8102E]/15 dark:border-[#C8102E]/20" />

          <div className="absolute inset-[26%] rounded-full border border-[#C8102E]/10 dark:border-white/[0.06]" />

          {/* Main card */}

          <div className="relative z-10 w-[63%] overflow-hidden rounded-[30px] border border-black/[0.06] bg-white/95 p-5 shadow-[0_35px_90px_rgba(0,0,0,0.10)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#131417]/95 dark:shadow-[0_35px_90px_rgba(0,0,0,0.35)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-[#C8102E]" />

                <span className="text-xs font-black text-gray-500 dark:text-gray-400">
                  YAKKAN EG
                </span>
              </div>

              <span className="rounded-full bg-[#C8102E]/10 px-2.5 py-1 text-[9px] font-black text-[#C8102E]">
                تعليم أونلاين
              </span>
            </div>

            <div className="rounded-2xl border border-black/[0.05] p-3 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20">
                  <Play className="size-4 fill-current" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="h-2.5 w-[72%] rounded-full bg-black/[0.08] dark:bg-white/[0.08]" />

                  <div className="mt-2 h-2 w-[42%] rounded-full bg-black/[0.05] dark:bg-white/[0.06]" />
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-black/[0.05] p-3 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C9A227]/10 text-[#C9A227]">
                  <Award className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="h-2.5 w-[62%] rounded-full bg-black/[0.08] dark:bg-white/[0.08]" />

                  <div className="mt-2 h-2 w-[36%] rounded-full bg-black/[0.05] dark:bg-white/[0.06]" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-[10px] font-black">
                <span className="text-gray-500 dark:text-gray-400">
                  تقدمك في التعلم
                </span>

                <span className="text-[#C8102E]">
                  78%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.07]">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#A80D27] to-[#C8102E]" />
              </div>
            </div>
          </div>

          {/* Top floating */}

          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[5%] top-[14%] z-20 rounded-2xl border border-black/[0.06] bg-white/90 px-4 py-3 shadow-xl shadow-black/5 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#15161a]/90"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
                <BookOpen className="size-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                  كورسات متنوعة
                </p>

                <p className="text-xs font-black">
                  تعلم • تطور • نجاح
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bottom floating */}

          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[12%] left-[4%] z-20 rounded-2xl border border-black/[0.06] bg-white/95 px-4 py-3 shadow-xl shadow-black/5 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#15161a]/95"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20">
                <GraduationCap className="size-5" />
              </div>

              <div>
                <p className="text-lg font-black">
                  +20K
                </p>

                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                  طالب على المنصة
                </p>
              </div>
            </div>
          </motion.div>

          <div className="absolute left-[16%] top-[20%] size-3 rounded-full bg-[#C8102E]/30" />

          <div className="absolute bottom-[19%] right-[15%] size-2 rounded-full bg-[#C9A227]/50" />
        </div>
      </motion.div>
    </div>

    {/* ====================================================
        STATS
    ==================================================== */}
  </div>
</section>

      {/* ======================================================
          CATEGORIES
      ====================================================== */}

      <section className="mx-auto max-w-[1450px] px-5 pb-20 pt-28 lg:px-10">
        <SectionTitle
          title="كل ما تحتاجه في مكان واحد"
          subtitle="تجربة تعليمية تجمع بين التعلم، التطوير والأنشطة المختلفة"
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Category
              key={category.title}
              icon={category.icon}
              title={category.title}
              text={category.text}
            />
          ))}
        </div>
      </section>

      {/* ======================================================
          WHY YAKKAN
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#f3f3f4] py-24 dark:bg-[#0b0c0f]">
        <div className="pointer-events-none absolute -right-48 top-0 size-[500px] rounded-full bg-[#C8102E]/[0.045] blur-3xl dark:bg-[#C8102E]/[0.07]" />

        <div className="pointer-events-none absolute -left-48 bottom-0 size-[500px] rounded-full bg-[#C9A227]/[0.035] blur-3xl" />

        <div className="relative mx-auto max-w-[1450px] px-5 lg:px-10">
          <SectionTitle
            title="لماذا تختار YAKKAN EG؟"
            subtitle="كل التفاصيل مصممة لتخلي رحلة التعلم أبسط وأفضل"
          />

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {whyUs.map((item) => (
              <WhyCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                text={item.text}
              />
            ))}
          </div>

          {/* HOW IT WORKS */}

          <div className="mt-28">
            <SectionTitle
              title="كيف تبدأ؟"
              subtitle="ثلاث خطوات بسيطة وتكون جاهز تبدأ رحلتك"
            />

            <div className="relative mt-12 grid gap-5 lg:grid-cols-3">
              <div className="pointer-events-none absolute right-[16%] left-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-[#C8102E]/20 to-transparent lg:block" />

              {steps.map((step) => (
                <Step
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  text={step.text}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          COURSES
      ====================================================== */}

      <section className="relative py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8102E]/[0.025] blur-3xl dark:bg-[#C8102E]/[0.05]" />

        <div className="relative mx-auto max-w-[1450px] px-5 lg:px-10">
          <div className="flex items-end justify-between gap-5">
            <SectionTitle
              title="الكورسات المميزة"
              subtitle="اختار المحتوى المناسب وابدأ التعلم"
              align="right"
            />

            <Link
              href="/courses"
              className="hidden shrink-0 text-sm font-black text-[#C8102E] transition hover:text-[#A80D27] sm:block"
            >
              عرض جميع الكورسات
              <span className="mr-1">←</span>
            </Link>
          </div>

          <div className="mt-10">
            {coursesLoading ? (
              <div className="grid min-h-[400px] place-items-center rounded-[28px] border border-black/[0.06] bg-white dark:border-white/[0.06] dark:bg-[#111216]">
                <div className="flex flex-col items-center gap-4">
                  <div className="size-9 animate-spin rounded-full border-2 border-black/10 border-t-[#C8102E] dark:border-white/10 dark:border-t-[#C8102E]" />

                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    جاري تحميل الكورسات...
                  </p>
                </div>
              </div>
            ) : courses.length === 0 ? (
              <div className="grid min-h-[250px] place-items-center rounded-[28px] border border-dashed border-black/10 bg-white text-center dark:border-white/10 dark:bg-[#111216]">
                <div>
                  <BookOpen className="mx-auto size-10 text-[#C8102E]" />

                  <p className="mt-4 font-black">
                    لا توجد كورسات متاحة حاليًا
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="pointer-events-none absolute inset-x-[15%] top-1/2 h-40 -translate-y-1/2 rounded-full bg-[#C8102E]/[0.055] blur-3xl dark:bg-[#C8102E]/[0.09]" />

                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  <motion.div
                    key={`${courseIndex}-${courses.length}`}
                    initial={{
                      opacity: 0,
                      x: 25,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -25,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className="relative flex min-h-[430px] items-center justify-center gap-3 overflow-visible px-0 py-6 sm:gap-5 md:px-10 lg:gap-8"
                  >
                    {getVisibleCourses(
                      courses,
                      courseIndex
                    ).map(
                      (course, position) => (
                        <CourseCard
                          key={`${course.id}-${position}`}
                          course={course}
                          position={position}
                          onClick={() =>
                            setCourseIndex(
                              courses.indexOf(
                                course
                              )
                            )
                          }
                        />
                      )
                    )}
                  </motion.div>
                </AnimatePresence>

                {courses.length > 1 && (
                  <>
                    <CourseArrow
                      direction="right"
                      onClick={previousCourse}
                    />

                    <CourseArrow
                      direction="left"
                      onClick={nextCourse}
                    />
                  </>
                )}

                {courses.length > 1 && (
                  <div className="mt-2 flex justify-center gap-1.5">
                    {courses.map(
                      (course, index) => (
                        <button
                          key={course.id}
                          type="button"
                          aria-label={`الانتقال إلى ${course.title}`}
                          onClick={() =>
                            setCourseIndex(index)
                          }
                          className={`h-1.5 rounded-full transition-all ${
                            index === courseIndex
                              ? "w-8 bg-[#C8102E]"
                              : "w-1.5 bg-black/15 hover:bg-black/30 dark:bg-white/15"
                          }`}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-7 text-center sm:hidden">
            <Link
              href="/courses"
              className="text-sm font-black text-[#C8102E]"
            >
              عرض جميع الكورسات ←
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          TESTIMONIALS
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#f3f3f4] py-24 dark:bg-[#0b0c0f]">
        <div className="pointer-events-none absolute -right-40 top-10 size-96 rounded-full bg-[#C8102E]/[0.045] blur-3xl dark:bg-[#C8102E]/[0.07]" />

        <div className="relative mx-auto max-w-[1200px] px-5 lg:px-10">
          <SectionTitle
            title="آراء الطلاب"
            subtitle="تجارب حقيقية من مجتمع YAKKAN EG"
          />

          <div className="relative mx-auto mt-10 max-w-[1000px] px-2 sm:px-10">
            <div className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_25px_70px_rgba(24,24,27,0.07)] dark:border-white/[0.07] dark:bg-[#111216] dark:shadow-black/30">
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.div
                  key={testimonialIndex}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -15,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="px-7 py-10 text-center sm:px-14 sm:py-12"
                >
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#C8102E]/10 text-[#C8102E] dark:bg-[#C8102E]/15">
                    <Quote className="size-7 fill-current" />
                  </div>

                  <div className="mt-6 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          className="size-4 fill-[#C9A227] text-[#C9A227]"
                        />
                      )
                    )}
                  </div>

                  <p className="mx-auto mt-6 max-w-[820px] text-base font-medium leading-8 text-[#4b4b54] sm:text-lg sm:leading-9 dark:text-[#d2d2d8]">
                    “
                    {testimonials[testimonialIndex]}
                    ”
                  </p>

                  <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-black/[0.06] bg-[#fafafa] px-4 py-2 dark:border-white/[0.07] dark:bg-white/[0.04]">
                    <span className="size-2 rounded-full bg-[#C8102E]" />

                    <span className="text-xs font-black text-gray-500 dark:text-gray-300">
                      طالب من مجتمع YAKKAN EG
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={previousTestimonial}
              aria-label="الرأي السابق"
              className="absolute right-0 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20 transition hover:scale-105 hover:bg-[#A80D27] sm:size-12"
            >
              <ChevronRight className="size-5" />
            </button>

            <button
              type="button"
              onClick={nextTestimonial}
              aria-label="الرأي التالي"
              className="absolute left-0 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20 transition hover:scale-105 hover:bg-[#A80D27] sm:size-12"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>

          <div className="mt-7 flex justify-center gap-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`الانتقال إلى الرأي ${index + 1}`}
                onClick={() =>
                  setTestimonialIndex(index)
                }
                className={`h-1.5 rounded-full transition-all ${
                  index === testimonialIndex
                    ? "w-8 bg-[#C8102E]"
                    : "w-1.5 bg-black/15 dark:bg-white/15"
                }`}
              />
            ))}
          </div>

          <p className="mt-3 text-center text-[11px] font-bold text-gray-400">
            {String(testimonialIndex + 1).padStart(
              2,
              "0"
            )}{" "}
            /{" "}
            {String(testimonials.length).padStart(
              2,
              "0"
            )}
          </p>
        </div>
      </section>

      {/* ======================================================
          APP CTA
      ====================================================== */}

      <section className="py-24">
        <div className="mx-auto max-w-[1350px] px-5 lg:px-10">
          <div className="relative overflow-hidden rounded-[34px] bg-[#151515] px-7 py-12 text-white shadow-[0_30px_90px_rgba(0,0,0,0.18)] sm:px-12 lg:px-16">
            <div className="pointer-events-none absolute -right-32 -top-40 size-[480px] rounded-full bg-[#C8102E]/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-48 -left-32 size-[430px] rounded-full bg-[#C9A227]/10 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <motion.div
                initial={{
                  opacity: 0,
                  x: 30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                className="text-center lg:text-right"
              >
                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black text-[#ff7186]">
                  تعلم أينما كنت
                </span>

                <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                  حمل تطبيق{" "}
                  <span className="text-[#ff526e]">
                    YAKKAN EG
                  </span>
                  <br />
                  وخلي التعلم معاك دائمًا
                </h2>

                <p className="mt-5 max-w-[560px] text-sm leading-8 text-white/65 sm:text-base">
                  تابع الكورسات، راقب تقدمك، واكمل رحلتك
                  التعليمية من أي مكان وفي أي وقت.
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <AppButton
                    icon={<Apple className="size-5" />}
                    title="App Store"
                  />

                  <AppButton
                    icon={<Play className="size-5 fill-current" />}
                    title="Google Play"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  x: -30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                className="flex justify-center"
              >
                <img
                  src="/Mobile development-bro.svg"
                  alt="YAKKAN EG App"
                  className="max-h-[370px] w-full max-w-[570px] object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          GALLERY
      ====================================================== */}

      {!galleryLoading &&
        galleryImages.length > 0 && (
          <section className="bg-[#f3f3f4] py-24 dark:bg-[#0b0c0f]">
            <div className="mx-auto max-w-[1450px] px-5 lg:px-10">
              <SectionTitle
                title="من مجتمع YAKKAN EG"
                subtitle="لحظات وتجارب من عالمنا التعليمي"
              />

              <div className="mt-9 flex flex-wrap justify-center gap-2">
                <GalleryFilter
                  active={mediaFilter === "الكل"}
                  onClick={() =>
                    setMediaFilter("الكل")
                  }
                >
                  الكل
                </GalleryFilter>

                {availableGalleryCategories.map(
                  (category) => (
                    <GalleryFilter
                      key={category.key}
                      active={
                        mediaFilter ===
                        category.key
                      }
                      onClick={() =>
                        setMediaFilter(
                          category.key
                        )
                      }
                    >
                      {category.label}
                    </GalleryFilter>
                  )
                )}
              </div>

              <div className="mt-8 max-h-[700px] overflow-y-auto overflow-x-hidden rounded-[28px] pr-1 [scrollbar-width:thin]">
                <motion.div
                  layout
                  className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredGalleryImages.map(
                      (item) => (
                        <motion.div
                          layout
                          key={item.id}
                          initial={{
                            opacity: 0,
                            scale: 0.96,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.96,
                          }}
                          transition={{
                            duration: 0.25,
                          }}
                          className="group relative h-[180px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm sm:h-[210px] lg:h-[245px] dark:border-white/[0.07] dark:bg-[#111216]"
                        >
                          <img
                            src={item.url}
                            alt={getGalleryCategoryLabel(
                              item.category
                            )}
                            loading="lazy"
                            decoding="async"
                            className="block size-full object-cover transition duration-700 group-hover:scale-105"
                          />

                          <div className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur-md">
                            {getGalleryCategoryLabel(
                              item.category
                            )}
                          </div>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {filteredGalleryImages.length === 0 && (
                <div className="mt-8 rounded-2xl border border-dashed border-black/10 bg-white py-14 text-center dark:border-white/10 dark:bg-[#111216]">
                  <p className="font-bold text-gray-500 dark:text-gray-400">
                    لا توجد صور في هذا التصنيف حاليًا
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-black/[0.06] bg-white dark:border-white/[0.07] dark:bg-[#08090b]">
        <div className="mx-auto max-w-[1250px] px-5 py-14 lg:px-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_0.6fr]">
            {/* BRAND */}

            <div className="text-center md:text-right">
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="relative flex size-11 items-center justify-center overflow-hidden rounded-xl border border-[#C8102E]/15 bg-[#fafafa] p-1 shadow-sm dark:bg-[#111216]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E]/20 via-transparent to-[#C9A227]/15" />

                  <img
                    src="/myLogo.png"
                    alt="YAKKAN-EG"
                    className="relative z-10 size-full rounded-lg object-cover"
                  />
                </div>

                <div className="text-right">
                  <h3 className="bg-gradient-to-l from-[#A80D27] via-[#C8102E] to-[#e44b66] bg-clip-text text-2xl font-black text-transparent">
                    YAKKAN-EG
                  </h3>

                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    تعلم • تطور • استمتع
                  </p>
                </div>
              </Link>

              <p className="mx-auto mt-4 max-w-[500px] text-sm leading-7 text-gray-500 md:mx-0 dark:text-gray-400">
                تعلم بذكاء وابدأ رحلتك نحو النجاح مع
                YAKKAN EG.
              </p>
            </div>

            {/* SOCIAL */}

            <div className="text-center md:text-right">
              <h3 className="text-sm font-black">
                تواصل معنا
              </h3>

              <div className="mt-4 flex justify-center gap-2 md:justify-start">
                <SocialButton label="Facebook">
                  <FacebookIcon />
                </SocialButton>

                <SocialButton label="Instagram">
                  <InstagramIcon />
                </SocialButton>

                <SocialButton label="WhatsApp">
                  <WhatsappIcon />
                </SocialButton>

                <SocialButton label="X">
                  <X className="size-5" />
                </SocialButton>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-black/[0.06] pt-6 text-center text-xs font-medium text-gray-500 dark:border-white/[0.07] dark:text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="font-black text-[#C8102E]">
              YAKKAN EG
            </span>{" "}
            - جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ============================================================
   STAT
============================================================ */

function Stat({
  icon,
  number,
  label,
  isLast,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
  isLast: boolean;
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className={`flex items-center justify-center gap-3 px-4 py-5 ${
        !isLast
          ? "border-b border-black/[0.05] lg:border-b-0 lg:border-l"
          : ""
      } dark:border-white/[0.06]`}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
        {icon}
      </div>

      <div>
        <div className="text-xl font-black sm:text-2xl">
          {number}
        </div>

        <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   CATEGORY
============================================================ */

function Category({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_28px_rgba(24,24,27,0.035)] transition-all hover:border-[#C8102E]/15 hover:shadow-[0_15px_40px_rgba(24,24,27,0.07)] dark:border-white/[0.06] dark:bg-[#111216]"
    >
      <div className="pointer-events-none absolute -left-8 -top-8 size-24 rounded-full bg-[#C8102E]/[0.05] blur-2xl transition group-hover:bg-[#C8102E]/[0.10]" />

      <div className="relative flex size-11 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E] transition group-hover:scale-105">
        {icon}
      </div>

      <h3 className="relative mt-4 text-sm font-black">
        {title}
      </h3>

      <p className="relative mt-1 text-[11px] font-medium leading-5 text-gray-500 dark:text-gray-400">
        {text}
      </p>
    </motion.div>
  );
}

/* ============================================================
   WHY CARD
============================================================ */

function WhyCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="group relative overflow-hidden rounded-2xl border border-black/[0.05] bg-white p-5 text-center shadow-sm transition-all hover:border-[#C8102E]/15 hover:shadow-[0_15px_40px_rgba(24,24,27,0.07)] dark:border-white/[0.06] dark:bg-[#111216]"
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#C8102E]/10 text-[#C8102E] transition group-hover:scale-105">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black">
        {title}
      </h3>

      <p className="mt-1 text-[11px] font-medium leading-5 text-gray-500 dark:text-gray-400">
        {text}
      </p>
    </motion.div>
  );
}

/* ============================================================
   STEP
============================================================ */

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="relative rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-[#111216]"
    >
      <div className="flex items-start gap-4">
        <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#C8102E] text-lg font-black text-white shadow-[0_10px_25px_rgba(200,16,46,0.20)]">
          {number}
        </div>

        <div>
          <h3 className="text-base font-black">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
            {text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({
  course,
  position,
  onClick,
}: {
  course: Course;
  position: number;
  onClick: () => void;
}) {
  const isCenter =
    position === 1 || course.__single;

  return (
    <Link
      href={`/courses/${course.id}`}
      onClick={onClick}
      className={
        course.__single
          ? "w-[76vw] max-w-[350px] shrink-0"
          : position === 1
            ? "w-[76vw] max-w-[350px] shrink-0 md:w-[46%] lg:w-[380px]"
            : "w-[22vw] max-w-[120px] shrink-0 md:w-[30%] md:max-w-[300px]"
      }
    >
      <motion.article
        animate={{
          scale: isCenter ? 1.03 : 0.91,
          opacity: isCenter ? 1 : 0.48,
          y: isCenter ? -5 : 8,
        }}
        whileHover={{
          scale: isCenter ? 1.05 : 0.94,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 24,
        }}
        className={`group flex h-[375px] flex-col overflow-hidden rounded-[25px] border bg-white shadow-[0_15px_45px_rgba(24,24,27,0.06)] dark:bg-[#111216] ${
          isCenter
            ? "border-[#C8102E]/20 shadow-[0_25px_65px_rgba(200,16,46,0.13)] dark:border-[#C8102E]/30"
            : "border-black/[0.06] dark:border-white/[0.07]"
        }`}
      >
        <div className="relative shrink-0 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="h-[160px] w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

          {isCenter && (
            <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black text-[#C8102E] shadow-lg">
              كورس مميز
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 min-h-[48px] text-base font-black leading-6">
            {course.title}
          </h3>

          <p className="mt-1 text-[11px] font-bold text-gray-500 dark:text-gray-400">
            {course.doctor}
          </p>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
            {course.description}
          </p>

          <div className="mt-auto pt-4">
            <div className="flex h-10 items-center justify-center rounded-xl bg-[#C8102E] text-xs font-black text-white transition group-hover:bg-[#A80D27]">
              عرض الكورس
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

/* ============================================================
   VISIBLE COURSES
============================================================ */

function getVisibleCourses(
  courses: Course[],
  currentIndex: number
) {
  if (courses.length === 1) {
    return [
      {
        ...courses[0],
        __single: true,
      },
    ];
  }

  if (courses.length === 2) {
    const current = courses[currentIndex];

    const other =
      courses[
        (currentIndex + 1) % courses.length
      ];

    return [
      {
        ...other,
        __single: false,
      },
      {
        ...current,
        __single: true,
      },
    ];
  }

  return [
    courses[
      (currentIndex - 1 + courses.length) %
        courses.length
    ],
    courses[currentIndex],
    courses[
      (currentIndex + 1) % courses.length
    ],
  ];
}

/* ============================================================
   COURSE ARROW
============================================================ */

function CourseArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isRight = direction === "right";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        isRight
          ? "الكورس السابق"
          : "الكورس التالي"
      }
      className={`absolute ${
        isRight ? "right-0" : "left-0"
      } top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.06] bg-white/95 text-[#C8102E] shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur transition hover:scale-105 hover:bg-[#C8102E] hover:text-white dark:border-white/[0.08] dark:bg-[#18191e]`}
    >
      {isRight ? (
        <ChevronRight className="size-5" />
      ) : (
        <ChevronLeft className="size-5" />
      )}
    </button>
  );
}

/* ============================================================
   APP BUTTON
============================================================ */

function AppButton({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-5 py-3 text-white transition hover:-translate-y-0.5 hover:bg-white/[0.12]"
    >
      {icon}

      <span className="text-sm font-black">
        {title}
      </span>
    </button>
  );
}

/* ============================================================
   GALLERY FILTER
============================================================ */

function GalleryFilter({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-5 py-2.5 text-xs font-black transition ${
        active
          ? "border-[#C8102E] bg-[#C8102E] text-white shadow-[0_8px_22px_rgba(200,16,46,0.18)]"
          : "border-black/[0.06] bg-white text-gray-600 hover:border-[#C8102E]/20 hover:text-[#C8102E] dark:border-white/[0.07] dark:bg-[#111216] dark:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   SOCIAL BUTTON
============================================================ */

function SocialButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-xl border border-black/[0.06] bg-[#fafafa] text-[#222] transition hover:-translate-y-1 hover:border-[#C8102E]/20 hover:bg-[#C8102E] hover:text-white dark:border-white/[0.07] dark:bg-[#111216] dark:text-white"
    >
      {children}
    </a>
  );
}

/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({
  title,
  subtitle,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "right";
}) {
  return (
    <div
      className={
        align === "right"
          ? "text-right"
          : "text-center"
      }
    >
      <div
        className={`mb-4 flex items-center gap-3 ${
          align === "center"
            ? "justify-center"
            : "justify-start"
        }`}
      >
        <span className="h-px w-8 bg-[#C8102E]" />

        <span className="size-1.5 rounded-full bg-[#C9A227]" />

        <span className="h-px w-8 bg-[#C8102E]" />
      </div>

      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   FACEBOOK
============================================================ */

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M14 8h3V4h-3c-2.76 0-5 2.24-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.55.45-1 1-1Z" />
    </svg>
  );
}

/* ============================================================
   INSTAGRAM
============================================================ */

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <rect
        width="20"
        height="20"
        x="2"
        y="2"
        rx="5"
        ry="5"
      />

      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />

      <line
        x1="17.5"
        x2="17.51"
        y1="6.5"
        y2="6.5"
      />
    </svg>
  );
}

/* ============================================================
   WHATSAPP
============================================================ */

function WhatsappIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.55 0 .23 5.31.23 11.84c0 2.09.55 4.13 1.6 5.93L.13 24l6.38-1.67a11.82 11.82 0 0 0 5.57 1.42h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.13-3.41-8.43ZM12.09 21.73h-.01a9.85 9.85 0 0 1-5.02-1.38l-.36-.21-3.79.99 1.01-3.7-.23-.38a9.83 9.83 0 0 1-1.51-5.21C2.18 6.41 6.62 1.98 12.08 1.98a9.82 9.82 0 0 1 6.98 2.9 9.83 9.83 0 0 1 2.89 6.99c0 5.46-4.43 9.9-9.86 9.9Zm5.43-7.42c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.51-1.79-1.69-2.09-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.52.07-.8.37-.28.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
    </svg>
  );
}