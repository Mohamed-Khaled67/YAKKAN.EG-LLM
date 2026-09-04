
// import Link from "next/link";

// import {
//   ArrowLeft,
//   BookOpen,
//   ChevronLeft,
//   Clock3,
//   Gamepad2,
//   GraduationCap,
//   Sparkles,
//   Star,
//   Trophy,
//   Users,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";

// export default function HomePage() {
//   return (
//     <main
//       dir="rtl"
//       className="
//         relative
//         min-h-screen
//         overflow-hidden
//         bg-background
//       "
//     >
//       {/* ================================================= */}
//       {/* BACKGROUND */}
//       {/* ================================================= */}

//       <div className="pointer-events-none absolute inset-0 overflow-hidden">

//         {/* Red Glow */}
//         <div
//           className="
//             absolute
//             right-[-180px]
//             top-[80px]
//             size-[450px]
//             rounded-full
//             bg-red-500/10
//             blur-[130px]
//           "
//         />

//         {/* Rose Glow */}
//         <div
//           className="
//             absolute
//             left-[-180px]
//             top-[480px]
//             size-[430px]
//             rounded-full
//             bg-rose-500/10
//             blur-[130px]
//           "
//         />

//         {/* Orange Glow */}
//         <div
//           className="
//             absolute
//             right-[35%]
//             top-[250px]
//             size-[280px]
//             rounded-full
//             bg-orange-500/5
//             blur-[110px]
//           "
//         />

//         {/* Subtle Gradient */}
//         <div
//           className="
//             absolute
//             inset-0
//             bg-gradient-to-br
//             from-red-500/[0.015]
//             via-transparent
//             to-rose-500/[0.02]
//           "
//         />

//         {/* Grid */}
//         <div
//           className="
//             absolute
//             inset-0
//             opacity-[0.025]
//             [background-image:linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)]
//             [background-size:40px_40px]
//           "
//         />
//       </div>

//       {/* ================================================= */}
//       {/* HERO */}
//       {/* ================================================= */}

//       <section
//         className="
//           relative
//           mx-auto
//           flex
//           min-h-screen
//           max-w-7xl
//           items-center
//           px-5
//           pb-20
//           pt-32
//           lg:px-8
//         "
//       >
//         <div className="grid w-full items-center gap-16 lg:grid-cols-2">

//           {/* ================================================= */}
//           {/* RIGHT CONTENT */}
//           {/* ================================================= */}

//           <div className="text-center lg:text-right">

//             {/* Badge */}

//             <div
//               className="
//                 mb-6
//                 inline-flex
//                 items-center
//                 gap-2
//                 rounded-full
//                 border
//                 border-red-500/20
//                 bg-gradient-to-r
//                 from-red-500/10
//                 to-rose-500/5
//                 px-4
//                 py-2
//                 text-xs
//                 font-semibold
//                 text-red-500
//                 shadow-sm
//                 shadow-red-500/5
//               "
//             >
//               <Sparkles className="size-3.5" />

//               مستقبلك يبدأ بخطوة
//             </div>

//             {/* Heading */}

//             <h1
//               className="
//                 text-4xl
//                 font-black
//                 leading-[1.2]
//                 tracking-tight
//                 sm:text-5xl
//                 lg:text-6xl
//               "
//             >
//               تعلّم بطريقة

//               <span
//                 className="
//                   block
//                   bg-gradient-to-l
//                   from-red-500
//                   via-rose-500
//                   to-orange-500
//                   bg-clip-text
//                   text-transparent
//                 "
//               >
//                 مختلفة تمامًا
//               </span>
//             </h1>

//             {/* Description */}

//             <p
//               className="
//                 mx-auto
//                 mt-6
//                 max-w-xl
//                 text-sm
//                 leading-8
//                 text-muted-foreground
//                 sm:text-base
//                 lg:mx-0
//               "
//             >
//               في YAKKAN-EG مش هتتعلم وبس.
//               هتكتشف مهارات جديدة، تطور نفسك،
//               تستمتع بوقتك، وتبني مستقبلك
//               في مكان واحد.
//             </p>

//             {/* Buttons */}

//             <div
//               className="
//                 mt-8
//                 flex
//                 flex-col
//                 justify-center
//                 gap-3
//                 sm:flex-row
//                 lg:justify-start
//               "
//             >
//               <Link href="/register">
//                 <Button
//                   size="lg"
//                   className="
//                     h-12
//                     w-full
//                     gap-2
//                     rounded-xl
//                     border-0
//                     bg-gradient-to-r
//                     from-red-500
//                     via-rose-500
//                     to-orange-500
//                     px-7
//                     font-bold
//                     text-white
//                     shadow-xl
//                     shadow-red-500/20
//                     transition-all
//                     duration-300
//                     hover:-translate-y-1
//                     hover:shadow-2xl
//                     hover:shadow-red-500/30
//                     sm:w-auto
//                   "
//                 >
//                   ابدأ رحلتك الآن

//                   <ArrowLeft className="size-4" />
//                 </Button>
//               </Link>

//               <Link href="/courses">
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="
//                     h-12
//                     w-full
//                     gap-2
//                     rounded-xl
//                     border-red-500/20
//                     px-7
//                     font-bold
//                     transition-all
//                     duration-300
//                     hover:border-red-500/40
//                     hover:bg-red-500/5
//                     sm:w-auto
//                   "
//                 >
//                   <BookOpen className="size-4 text-red-500" />

//                   استكشف الكورسات
//                 </Button>
//               </Link>
//             </div>

//             {/* Stats */}

//             <div
//               className="
//                 mx-auto
//                 mt-10
//                 grid
//                 max-w-lg
//                 grid-cols-3
//                 divide-x
//                 divide-border
//                 rounded-2xl
//                 border
//                 border-border/50
//                 bg-background/50
//                 p-4
//                 shadow-lg
//                 shadow-red-500/5
//                 backdrop-blur-xl
//                 lg:mx-0
//               "
//             >
//               <Stat
//                 number="+50"
//                 text="كورس"
//               />

//               <Stat
//                 number="+10K"
//                 text="طالب"
//               />

//               <Stat
//                 number="4.9"
//                 text="تقييم"
//                 icon
//               />
//             </div>
//           </div>

//           {/* ================================================= */}
//           {/* LEFT VISUAL */}
//           {/* ================================================= */}

//           <div
//             className="
//               relative
//               mx-auto
//               flex
//               w-full
//               max-w-[520px]
//               items-center
//               justify-center
//             "
//           >

//             {/* Main Red Glow */}

//             <div
//               className="
//                 absolute
//                 size-[380px]
//                 rounded-full
//                 bg-red-500/15
//                 blur-[110px]
//               "
//             />

//             {/* Secondary Rose Glow */}

//             <div
//               className="
//                 absolute
//                 -right-10
//                 top-10
//                 size-44
//                 rounded-full
//                 bg-rose-500/10
//                 blur-[90px]
//               "
//             />

//             {/* Main Card */}

//             <div
//               className="
//                 relative
//                 flex
//                 aspect-square
//                 w-full
//                 max-w-[430px]
//                 items-center
//                 justify-center
//                 overflow-hidden
//                 rounded-[42px]
//                 border
//                 border-red-500/10
//                 bg-background/70
//                 p-10
//                 shadow-2xl
//                 shadow-red-500/10
//                 backdrop-blur-2xl
//               "
//             >

//               {/* Decorative Gradient */}

//               <div
//                 className="
//                   absolute
//                   inset-0
//                   bg-gradient-to-br
//                   from-red-500/[0.04]
//                   via-transparent
//                   to-orange-500/[0.04]
//                 "
//               />

//               {/* Decorative Large Circle */}

//               <div
//                 className="
//                   absolute
//                   size-[330px]
//                   rounded-full
//                   border
//                   border-red-500/10
//                 "
//               />

//               {/* Decorative Small Circle */}

//               <div
//                 className="
//                   absolute
//                   size-[260px]
//                   rounded-full
//                   border
//                   border-rose-500/10
//                 "
//               />

//               {/* Gradient Ring */}

//               <div
//                 className="
//                   absolute
//                   size-[220px]
//                   rounded-full
//                   bg-gradient-to-br
//                   from-red-500
//                   via-rose-500
//                   to-orange-500
//                   p-[3px]
//                   shadow-2xl
//                   shadow-red-500/25
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     size-full
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-background
//                     p-4
//                   "
//                 >

//                   <img
//                     src="/myLogo.png"
//                     alt="YAKKAN EG"
//                     className="
//                       size-full
//                       rounded-full
//                       object-cover
//                       drop-shadow-2xl
//                     "
//                   />

//                 </div>
//               </div>

//               {/* Top Floating Card */}

//               <div
//                 className="
//                   absolute
//                   right-5
//                   top-7
//                   flex
//                   items-center
//                   gap-2
//                   rounded-2xl
//                   border
//                   border-red-500/10
//                   bg-background/90
//                   px-4
//                   py-3
//                   shadow-xl
//                   shadow-red-500/5
//                   backdrop-blur-xl
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     size-8
//                     items-center
//                     justify-center
//                     rounded-xl
//                     bg-gradient-to-br
//                     from-red-500/15
//                     to-rose-500/10
//                     text-red-500
//                   "
//                 >
//                   <Sparkles className="size-4" />
//                 </div>

//                 <div>

//                   <p className="text-[9px] text-muted-foreground">
//                     منصة تعليمية
//                   </p>

//                   <p className="text-xs font-black">
//                     YAKKAN-EG
//                   </p>

//                 </div>
//               </div>

//               {/* Bottom Floating Card */}

//               <div
//                 className="
//                   absolute
//                   bottom-7
//                   left-5
//                   flex
//                   items-center
//                   gap-3
//                   rounded-2xl
//                   border
//                   border-red-500/10
//                   bg-background/90
//                   px-4
//                   py-3
//                   shadow-xl
//                   shadow-red-500/5
//                   backdrop-blur-xl
//                 "
//               >

//                 <div
//                   className="
//                     flex
//                     size-9
//                     items-center
//                     justify-center
//                     rounded-xl
//                     bg-gradient-to-br
//                     from-rose-500/15
//                     to-orange-500/10
//                     text-rose-500
//                   "
//                 >
//                   <GraduationCap className="size-4" />
//                 </div>

//                 <div>

//                   <p className="text-[9px] text-muted-foreground">
//                     تعلّم • طوّر • استمتع
//                   </p>

//                   <p className="text-xs font-black">
//                     مستقبلك يبدأ هنا
//                   </p>

//                 </div>
//               </div>

//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ================================================= */}
//       {/* FEATURES */}
//       {/* ================================================= */}

//       <section
//         className="
//           relative
//           border-y
//           border-border/40
//           bg-muted/20
//           py-24
//         "
//       >

//         <div className="mx-auto max-w-7xl px-5 lg:px-8">

//           {/* Section Heading */}

//           <div className="mx-auto max-w-2xl text-center">

//             <div
//               className="
//                 mb-3
//                 inline-flex
//                 items-center
//                 gap-2
//                 bg-gradient-to-l
//                 from-red-500
//                 to-rose-500
//                 bg-clip-text
//                 text-xs
//                 font-bold
//                 text-transparent
//               "
//             >
//               <Sparkles className="size-4 text-red-500" />

//               لماذا YAKKAN-EG؟
//             </div>

//             <h2
//               className="
//                 text-3xl
//                 font-black
//                 tracking-tight
//                 sm:text-4xl
//               "
//             >
//               كل ما تحتاجه في مكان واحد
//             </h2>

//             <p
//               className="
//                 mt-4
//                 text-sm
//                 leading-7
//                 text-muted-foreground
//               "
//             >
//               صممنا المنصة عشان تجمع بين التعلم،
//               التطور، والمحتوى الممتع بدون تعقيد.
//             </p>

//           </div>

//           {/* Feature Cards */}

//           <div
//             className="
//               mt-14
//               grid
//               gap-5
//               md:grid-cols-3
//             "
//           >

//             <FeatureCard
//               icon={<BookOpen />}
//               title="تعلم بطريقة عملية"
//               text="كورسات مرتبة ومحتوى عملي يساعدك تطبق اللي بتتعلمه."
//             />

//             <FeatureCard
//               icon={<Trophy />}
//               title="تابع تقدمك"
//               text="اعرف مستواك، تابع إنجازاتك، واستمر في تطوير نفسك."
//             />

//             <FeatureCard
//               icon={<Gamepad2 />}
//               title="اتعلم واستمتع"
//               text="استراحة ممتعة مع ألعاب وأنشطة ترفيهية داخل المنصة."
//             />

//           </div>

//         </div>
//       </section>

//       {/* ================================================= */}
//       {/* CTA */}
//       {/* ================================================= */}

//       <section className="relative py-24">

//         <div className="mx-auto max-w-7xl px-5 lg:px-8">

//           <div
//             className="
//               relative
//               overflow-hidden
//               rounded-[32px]
//               border
//               border-red-500/15
//               bg-gradient-to-br
//               from-red-500/10
//               via-rose-500/10
//               to-orange-500/10
//               p-8
//               shadow-xl
//               shadow-red-500/5
//               sm:p-12
//             "
//           >

//             {/* CTA Glow */}

//             <div
//               className="
//                 absolute
//                 -left-20
//                 -top-20
//                 size-72
//                 rounded-full
//                 bg-red-500/10
//                 blur-[90px]
//               "
//             />

//             <div
//               className="
//                 absolute
//                 -bottom-20
//                 -right-20
//                 size-64
//                 rounded-full
//                 bg-orange-500/10
//                 blur-[90px]
//               "
//             />

//             <div className="relative grid items-center gap-10 lg:grid-cols-2">

//               {/* CTA Text */}

//               <div>

//                 <div
//                   className="
//                     inline-flex
//                     items-center
//                     gap-2
//                     rounded-full
//                     border
//                     border-red-500/20
//                     bg-red-500/10
//                     px-3
//                     py-1.5
//                     text-[10px]
//                     font-bold
//                     text-red-500
//                   "
//                 >
//                   <BookOpen className="size-3" />

//                   ابدأ التعلم
//                 </div>

//                 <h2
//                   className="
//                     mt-5
//                     text-3xl
//                     font-black
//                     sm:text-4xl
//                   "
//                 >
//                   جاهز تبدأ

//                   <span
//                     className="
//                       bg-gradient-to-l
//                       from-red-500
//                       via-rose-500
//                       to-orange-500
//                       bg-clip-text
//                       text-transparent
//                     "
//                   >
//                     {" "}
//                     رحلتك؟
//                   </span>
//                 </h2>

//                 <p
//                   className="
//                     mt-4
//                     max-w-lg
//                     text-sm
//                     leading-7
//                     text-muted-foreground
//                   "
//                 >
//                   اختار المجال اللي بتحبه،
//                   وابدأ تتعلم خطوة بخطوة مع
//                   YAKKAN-EG.
//                 </p>

//                 <Link href="/register">

//                   <Button
//                     size="lg"
//                     className="
//                       mt-7
//                       gap-2
//                       rounded-xl
//                       border-0
//                       bg-gradient-to-r
//                       from-red-500
//                       via-rose-500
//                       to-orange-500
//                       px-7
//                       font-bold
//                       text-white
//                       shadow-lg
//                       shadow-red-500/20
//                       transition-all
//                       duration-300
//                       hover:-translate-y-1
//                       hover:shadow-xl
//                       hover:shadow-red-500/30
//                     "
//                   >
//                     إنشاء حساب مجاني

//                     <ArrowLeft className="size-4" />
//                   </Button>

//                 </Link>

//               </div>

//               {/* Info Cards */}

//               <div className="grid grid-cols-2 gap-3">

//                 <InfoCard
//                   icon={<Users />}
//                   number="+10K"
//                   text="طالب"
//                 />

//                 <InfoCard
//                   icon={<BookOpen />}
//                   number="+50"
//                   text="كورس"
//                 />

//                 <InfoCard
//                   icon={<Clock3 />}
//                   number="+500"
//                   text="ساعة تعليم"
//                 />

//                 <InfoCard
//                   icon={<Star />}
//                   number="4.9"
//                   text="متوسط التقييم"
//                 />

//               </div>

//             </div>
//           </div>

//         </div>
//       </section>

//       {/* ================================================= */}
//       {/* FOOTER */}
//       {/* ================================================= */}

//       <footer
//         className="
//           border-t
//           border-border/50
//           py-8
//         "
//       >

//         <div
//           className="
//             mx-auto
//             flex
//             max-w-7xl
//             flex-col
//             items-center
//             justify-between
//             gap-4
//             px-5
//             text-center
//             sm:flex-row
//             sm:text-right
//             lg:px-8
//           "
//         >

//           {/* Footer Logo */}

//           <div className="flex items-center gap-2">

//             <div
//               className="
//                 flex
//                 size-8
//                 items-center
//                 justify-center
//                 overflow-hidden
//                 rounded-lg
//                 border
//                 border-red-500/10
//                 bg-background
//                 p-1
//                 shadow-sm
//               "
//             >

//               <img
//                 src="/myLogo.png"
//                 alt="YAKKAN-EG"
//                 className="
//                   size-full
//                   rounded-md
//                   object-cover
//                 "
//               />

//             </div>

//             <span className="text-sm font-black">
//               YAKKAN-EG
//             </span>

//           </div>

//           <p className="text-[11px] text-muted-foreground">
//             © {new Date().getFullYear()} YAKKAN-EG —
//             كل الحقوق محفوظة
//           </p>

//         </div>
//       </footer>

//     </main>
//   );
// }

// /* ================================================= */
// /* STAT */
// /* ================================================= */

// function Stat({
//   number,
//   text,
//   icon,
// }: {
//   number: string;
//   text: string;
//   icon?: boolean;
// }) {
//   return (
//     <div className="text-center">

//       <div className="flex items-center justify-center gap-1">

//         <span className="text-lg font-black">
//           {number}
//         </span>

//         {icon && (
//           <Star
//             className="
//               size-3
//               fill-orange-400
//               text-orange-400
//             "
//           />
//         )}

//       </div>

//       <p
//         className="
//           mt-0.5
//           text-[9px]
//           text-muted-foreground
//         "
//       >
//         {text}
//       </p>

//     </div>
//   );
// }

// /* ================================================= */
// /* FEATURE CARD */
// /* ================================================= */

// function FeatureCard({
//   icon,
//   title,
//   text,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   text: string;
// }) {
//   return (
//     <div
//       className="
//         group
//         rounded-2xl
//         border
//         border-border/50
//         bg-background/60
//         p-6
//         shadow-sm
//         transition-all
//         duration-300
//         hover:-translate-y-1
//         hover:border-red-500/20
//         hover:shadow-xl
//         hover:shadow-red-500/5
//       "
//     >

//       <div
//         className="
//           flex
//           size-12
//           items-center
//           justify-center
//           rounded-xl
//           bg-gradient-to-br
//           from-red-500/15
//           to-rose-500/10
//           text-red-500
//           transition-all
//           duration-300
//           group-hover:scale-110
//           group-hover:shadow-lg
//           group-hover:shadow-red-500/10
//         "
//       >
//         {icon}
//       </div>

//       <h3
//         className="
//           mt-5
//           text-base
//           font-black
//         "
//       >
//         {title}
//       </h3>

//       <p
//         className="
//           mt-2
//           text-xs
//           leading-7
//           text-muted-foreground
//         "
//       >
//         {text}
//       </p>

//       <div
//         className="
//           mt-5
//           flex
//           items-center
//           gap-1
//           text-[10px]
//           font-bold
//           text-red-500
//         "
//       >
//         اكتشف المزيد

//         <ChevronLeft className="size-3" />
//       </div>

//     </div>
//   );
// }

// /* ================================================= */
// /* INFO CARD */
// /* ================================================= */

// function InfoCard({
//   icon,
//   number,
//   text,
// }: {
//   icon: React.ReactNode;
//   number: string;
//   text: string;
// }) {
//   return (
//     <div
//       className="
//         group
//         rounded-2xl
//         border
//         border-border/50
//         bg-background/60
//         p-5
//         backdrop-blur-xl
//         transition-all
//         duration-300
//         hover:-translate-y-1
//         hover:border-red-500/20
//         hover:shadow-lg
//         hover:shadow-red-500/5
//       "
//     >

//       <div className="flex items-center justify-between">

//         <div
//           className="
//             text-red-500
//             transition-transform
//             duration-300
//             group-hover:scale-110
//           "
//         >
//           {icon}
//         </div>

//         <span className="text-xl font-black">
//           {number}
//         </span>

//       </div>

//       <p
//         className="
//           mt-2
//           text-[10px]
//           text-muted-foreground
//         "
//       >
//         {text}
//       </p>

//     </div>
//   );
// }


























































"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  Clock3,
  Gamepad2,
  GraduationCap,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeInOut",
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeInOut",
    },
  },
};

// ============================================================
// HOME PAGE
// ============================================================

export default function HomePage() {
  // ==========================================================
  // AUTH SESSION
  // ==========================================================

  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main glow */}
        <motion.div
          className="absolute right-[-180px] top-[80px] size-[450px] rounded-full bg-red-500/10 blur-[130px]"
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.65, 0.8, 0.65],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Left glow */}
        <motion.div
          className="absolute left-[-180px] top-[480px] size-[430px] rounded-full bg-rose-500/10 blur-[130px]"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.015] via-transparent to-rose-500/[0.02]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-20 pt-32 lg:px-8">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* ==================================================
              RIGHT CONTENT
          ================================================== */}

          <motion.div
            className="text-center lg:text-right"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}

            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-gradient-to-r from-red-500/10 to-rose-500/5 px-4 py-2 text-xs font-semibold text-red-500 shadow-sm shadow-red-500/5"
            >
              <Sparkles className="size-3.5" />

              مستقبلك يبدأ بخطوة
            </motion.div>

            {/* Heading */}

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-black leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl"
            >
              تعلّم بطريقة

              <span className="block bg-gradient-to-l from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                مختلفة تمامًا
              </span>
            </motion.h1>

            {/* Description */}

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base lg:mx-0"
            >
              في YAKKAN-EG مش هتتعلم وبس. هتكتشف مهارات جديدة، تطور نفسك،
              تستمتع بوقتك، وتبني مستقبلك في مكان واحد.
            </motion.p>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            >
              {/* REGISTER BUTTON */}

              {!isPending && !isLoggedIn && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="h-12 w-full gap-2 rounded-xl border-0 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 px-7 font-bold text-white shadow-xl shadow-red-500/20 transition-shadow duration-300 hover:shadow-2xl hover:shadow-red-500/30 sm:w-auto"
                    >
                      ابدأ رحلتك الآن
                      <ArrowLeft className="size-4" />
                    </Button>
                  </Link>
                </motion.div>
              )}

              {/* COURSES BUTTON */}

              <motion.div
                whileHover={{
                  y: -3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link href="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full gap-2 rounded-xl border-red-500/20 px-7 font-bold transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/5 sm:w-auto"
                  >
                    <BookOpen className="size-4 text-red-500" />
                    استكشف الكورسات
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* ==================================================
                STATS
            ================================================== */}

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-10 grid max-w-lg grid-cols-3 divide-x divide-border rounded-2xl border border-border/50 bg-background/50 p-4 shadow-lg shadow-red-500/5 backdrop-blur-xl lg:mx-0"
            >
              <Stat number="+50" text="كورس" />
              <Stat number="+10K" text="طالب" />
              <Stat number="4.9" text="تقييم" icon />
            </motion.div>
          </motion.div>

          {/* ==================================================
              LEFT VISUAL
          ================================================== */}

          <motion.div
            className="relative mx-auto flex w-full max-w-[520px] items-center justify-center"
            initial={{
              opacity: 0,
              x: -30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: "easeOut",
            }}
          >
            {/* Glow */}

            <div className="absolute size-[380px] rounded-full bg-red-500/15 blur-[110px]" />

            <div className="absolute -right-10 top-10 size-44 rounded-full bg-rose-500/10 blur-[90px]" />

            {/* Main visual */}

            <motion.div
              className="relative flex aspect-square w-full max-w-[430px] items-center justify-center overflow-hidden rounded-[42px] border border-red-500/10 bg-background/70 p-10 shadow-2xl shadow-red-500/10 backdrop-blur-2xl"
              whileHover={{
                y: -4,
                scale: 1.01,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.04] via-transparent to-orange-500/[0.04]" />

              {/* Outer ring */}

              <motion.div
                className="absolute size-[330px] rounded-full border border-red-500/10"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 45,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Inner ring */}

              <motion.div
                className="absolute size-[260px] rounded-full border border-rose-500/10"
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 38,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Logo */}

              <motion.div
                className="absolute size-[220px] rounded-full bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 p-[3px] shadow-2xl shadow-red-500/25"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex size-full items-center justify-center rounded-full bg-background p-4">
                  <img
                    src="/myLogo.png"
                    alt="YAKKAN EG"
                    className="size-full rounded-full object-cover drop-shadow-2xl"
                  />
                </div>
              </motion.div>

              {/* Top floating card */}

              <motion.div
                className="absolute right-5 top-7 flex items-center gap-2 rounded-2xl border border-red-500/10 bg-background/90 px-4 py-3 shadow-xl shadow-red-500/5 backdrop-blur-xl"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 to-rose-500/10 text-red-500">
                  <Sparkles className="size-4" />
                </div>

                <div>
                  <p className="text-[9px] text-muted-foreground">
                    منصة تعليمية
                  </p>

                  <p className="text-xs font-black">YAKKAN-EG</p>
                </div>
              </motion.div>

              {/* Bottom floating card */}

              <motion.div
                className="absolute bottom-7 left-5 flex items-center gap-3 rounded-2xl border border-red-500/10 bg-background/90 px-4 py-3 shadow-xl shadow-red-500/5 backdrop-blur-xl"
                animate={{
                  y: [0, 5, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/15 to-orange-500/10 text-rose-500">
                  <GraduationCap className="size-4" />
                </div>

                <div>
                  <p className="text-[9px] text-muted-foreground">
                    تعلّم • طوّر • استمتع
                  </p>

                  <p className="text-xs font-black">مستقبلك يبدأ هنا</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          FEATURES
      ====================================================== */}

      <section className="relative border-y border-border/40 bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={staggerContainer}
          >
            {/* Label */}

            <motion.div
              variants={fadeUp}
              className="mb-3 inline-flex items-center gap-2 bg-gradient-to-l from-red-500 to-rose-500 bg-clip-text text-xs font-bold text-transparent"
            >
              <Sparkles className="size-4 text-red-500" />
              لماذا YAKKAN-EG؟
            </motion.div>

            {/* Title */}

            <motion.h2
              variants={fadeUp}
              className="text-3xl font-black tracking-tight sm:text-4xl"
            >
              كل ما تحتاجه في مكان واحد
            </motion.h2>

            {/* Description */}

            <motion.p
              variants={fadeUp}
              className="mt-4 text-sm leading-7 text-muted-foreground"
            >
              صممنا المنصة عشان تجمع بين التعلم، التطور، والمحتوى الممتع بدون
              تعقيد.
            </motion.p>
          </motion.div>

          {/* Feature cards */}

          <motion.div
            className="mt-14 grid gap-5 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            variants={staggerContainer}
          >
            <FeatureCard
              icon={<BookOpen />}
              title="تعلم بطريقة عملية"
              text="كورسات مرتبة ومحتوى عملي يساعدك تطبق اللي بتتعلمه."
            />

            <FeatureCard
              icon={<Trophy />}
              title="تابع تقدمك"
              text="اعرف مستواك، تابع إنجازاتك، واستمر في تطوير نفسك."
            />

            <FeatureCard
              icon={<Gamepad2 />}
              title="اتعلم واستمتع"
              text="استراحة ممتعة مع ألعاب وأنشطة ترفيهية داخل المنصة."
            />
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          CTA
      ====================================================== */}

      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.div
            className="relative overflow-hidden rounded-[32px] border border-red-500/15 bg-gradient-to-br from-red-500/10 via-rose-500/10 to-orange-500/10 p-8 shadow-xl shadow-red-500/5 sm:p-12"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.55,
              ease: "easeOut",
            }}
          >
            {/* CTA glows */}

            <div className="absolute -left-20 -top-20 size-72 rounded-full bg-red-500/10 blur-[90px]" />

            <div className="absolute -bottom-20 -right-20 size-64 rounded-full bg-orange-500/10 blur-[90px]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              {/* CTA content */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold text-red-500">
                  <BookOpen className="size-3" />
                  ابدأ التعلم
                </div>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  جاهز تبدأ

                  <span className="bg-gradient-to-l from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                    {" "}
                    رحلتك؟
                  </span>
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                  اختار المجال اللي بتحبه، وابدأ تتعلم خطوة بخطوة مع YAKKAN-EG.
                </p>

                {/* REGISTER CTA */}

                {!isPending && !isLoggedIn && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    <Link href="/register">
                      <Button
                        size="lg"
                        className="mt-7 gap-2 rounded-xl border-0 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 px-7 font-bold text-white shadow-lg shadow-red-500/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-red-500/30"
                      >
                        إنشاء حساب مجاني
                        <ArrowLeft className="size-4" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              {/* Info cards */}

              <motion.div
                className="grid grid-cols-2 gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                variants={staggerContainer}
              >
                <InfoCard
                  icon={<Users />}
                  number="+10K"
                  text="طالب"
                />

                <InfoCard
                  icon={<BookOpen />}
                  number="+50"
                  text="كورس"
                />

                <InfoCard
                  icon={<Clock3 />}
                  number="+500"
                  text="ساعة تعليم"
                />

                <InfoCard
                  icon={<Star />}
                  number="4.9"
                  text="متوسط التقييم"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:text-right lg:px-8">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{
              scale: 1.02,
            }}
          >
            <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg border border-red-500/10 bg-background p-1 shadow-sm">
              <img
                src="/myLogo.png"
                alt="YAKKAN-EG"
                className="size-full rounded-md object-cover"
              />
            </div>

            <span className="text-sm font-black">YAKKAN-EG</span>
          </motion.div>

          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} YAKKAN-EG — كل الحقوق محفوظة
          </p>
        </div>
      </footer>
    </main>
  );
}

// ============================================================
// STAT
// ============================================================

function Stat({
  number,
  text,
  icon,
}: {
  number: string;
  text: string;
  icon?: boolean;
}) {
  return (
    <motion.div
      className="text-center"
      whileHover={{
        scale: 1.03,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <div className="flex items-center justify-center gap-1">
        <span className="text-lg font-black">{number}</span>

        {icon && <Star className="size-3 fill-orange-400 text-orange-400" />}
      </div>

      <p className="mt-0.5 text-[9px] text-muted-foreground">{text}</p>
    </motion.div>
  );
}

// ============================================================
// FEATURE CARD
// ============================================================

function FeatureCard({
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
      variants={cardAnimation}
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="group rounded-2xl border border-border/50 bg-background/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-red-500/20 hover:shadow-xl hover:shadow-red-500/5"
    >
      <motion.div
        className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 to-rose-500/10 text-red-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/10"
        whileHover={{
          scale: 1.08,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        {icon}
      </motion.div>

      <h3 className="mt-5 text-base font-black">{title}</h3>

      <p className="mt-2 text-xs leading-7 text-muted-foreground">{text}</p>

      <motion.div
        className="mt-5 flex items-center gap-1 text-[10px] font-bold text-red-500"
        whileHover={{
          x: -3,
        }}
      >
        اكتشف المزيد

        <ChevronLeft className="size-3" />
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
  icon,
  number,
  text,
}: {
  icon: React.ReactNode;
  number: string;
  text: string;
}) {
  return (
    <motion.div
      variants={cardAnimation}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="group rounded-2xl border border-border/50 bg-background/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/5"
    >
      <div className="flex items-center justify-between">
        <motion.div
          className="text-red-500"
          whileHover={{
            scale: 1.1,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          {icon}
        </motion.div>

        <span className="text-xl font-black">{number}</span>
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground">{text}</p>
    </motion.div>
  );
}