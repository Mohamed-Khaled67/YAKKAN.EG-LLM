"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  
  Mail,
  MapPin,
  Play,
  PlayCircle,
  School,
  Smartphone,
  Star,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const RED = "#d90429";

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;

  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [mediaFilter, setMediaFilter] = useState("الكل");

  // ============================================================
  // DATA
  // ============================================================

  const whyUs = [
    {
      icon: <Headphones />,
      title: "دعم فني",
      subtitle: "مستمر",
    },
    {
      icon: <BarChart3 />,
      title: "متابعة تقدم",
      subtitle: "الطالب",
    },
    {
      icon: <Smartphone />,
      title: "تطبيق",
      subtitle: "Iphone و Android",
    },
    {
      icon: <Award />,
      title: "شهادات",
      subtitle: "معتمدة",
    },
    {
      icon: <CheckCircle2 />,
      title: "امتحانات",
      subtitle: "وتصحيح فوري",
    },
    {
      icon: <PlayCircle />,
      title: "فيديوهات",
      subtitle: "بجودة عالية",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "إنشاء حساب",
      text: "سجل بياناتك بسهولة في دقائق معدودة",
    },
    {
      number: "2",
      title: "ادخال الكود أو شراء الكورس",
      text: "ادخل الكود أو اختر الكورس المناسب لك",
    },
    {
      number: "3",
      title: "ابدأ التعلم",
      text: "استمتع بالمحتوى وتعلم في أي وقت وأي مكان",
    },
  ];

  const courses = [
    {
      image: "/course-1.jpg",
      title: "مبادئ المحاسبة",
      doctor: "د. محمد احمد",
    },
    {
      image: "/course-2.jpg",
      title: "إدارة الأعمال",
      doctor: "د. أشرف احمد",
    },
    {
      image: "/course-3.jpg",
      title: "الاقتصاد",
      doctor: "د. أحمد سعيد",
    },
    {
      image: "/course-4.jpg",
      title: "التسويق",
      doctor: "د. عمر توفيق",
    },
  ];

  const testimonials = [
    {
      name: "مريم حسن",
      details: "الفرقة الرابعة\nجامعة القاهرة",
      image: "/student-1.jpg",
      text: "بعد ما خلصت أكتر من كورس من المنصة، مستوايا اتطور بشكل ملحوظ. أنصح أي حد يجربها ويطور مهاراته.",
    },
    {
      name: "أحمد محمد",
      details: "طالب جامعي",
      image: "/student-2.jpg",
      text: "المحتوى منظم وسهل، والمتابعة المستمرة خلتني ملتزم بالتعلم وأنجزت الكورسات اللي بدأت فيها.",
    },
    {
      name: "سارة علي",
      details: "طالبة جامعية",
      image: "/student-3.jpg",
      text: "تجربة ممتازة، خصوصًا الاختبارات والشهادات وسهولة الوصول للمحتوى من أي مكان.",
    },
  ];

  const mediaItems = [
    {
      image: "/media-1.jpg",
      type: "الرحلات",
    },
    {
      image: "/media-2.jpg",
      type: "الرحلات",
    },
    {
      image: "/media-3.jpg",
      type: "الرحلات",
    },
    {
      image: "/media-4.jpg",
      type: "الرحلات",
    },
    {
      image: "/media-5.jpg",
      type: "الكورسات",
    },
    {
      image: "/media-6.jpg",
      type: "الحفلات",
    },
    {
      image: "/media-7.jpg",
      type: "الرحلات",
    },
    {
      image: "/media-8.jpg",
      type: "الكورسات",
    },
  ];

  const filteredMedia =
    mediaFilter === "الكل"
      ? mediaItems
      : mediaItems.filter((item) => item.type === mediaFilter);

  const nextTestimonial = () => {
    setTestimonialIndex(
      (current) => (current + 1) % testimonials.length,
    );
  };

  const previousTestimonial = () => {
    setTestimonialIndex(
      (current) =>
        (current - 1 + testimonials.length) % testimonials.length,
    );
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-white text-[#202020] transition-colors dark:bg-[#0d0d0f] dark:text-white"
    >
      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="relative overflow-hidden bg-[#fafafa] dark:bg-[#111113]">
        <div className="mx-auto grid min-h-[570px] max-w-[1500px] items-center gap-8 px-5 py-12 lg:grid-cols-2 lg:px-10 lg:py-16">

          {/* ====================================================
              TEXT
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="order-1 text-center lg:order-1 lg:text-right"
          >
            <p className="mb-3 text-lg font-bold text-[#d90429]">
              منصة YAKKAN EG التعليمية
            </p>

            <h1 className="text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl lg:text-[58px]">
              تعلم بذكاء...
              <br />

              <span className="text-[#d90429]">
                وابدأ رحلتك نحو النجاح
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-[650px] text-lg leading-9 text-[#444] dark:text-gray-300 lg:mx-0">
              منصة YAKKAN EG تجمع بين التعليم الإلكتروني والامتحانات
              والشهادات والرحلات التعليمية في مكان واحد.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              {!isPending && !isLoggedIn && (
                <Link href="/register">
                  <Button className="h-12 w-full rounded-lg bg-[#d90429] px-9 text-base font-bold text-white hover:bg-[#bd0324] sm:w-auto">
                    ابدأ الآن
                  </Button>
                </Link>
              )}

              <Link href="/courses">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-lg border-2 border-[#d90429] bg-transparent px-8 text-base font-bold text-[#d90429] hover:bg-[#d90429]/5 dark:text-[#ff4d6d] sm:w-auto"
                >
                  تصفح الكورسات
                  <BookOpen className="mr-2 size-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* ====================================================
              HERO IMAGE
          ==================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 flex items-center justify-center lg:order-2"
          >
            {/* Light Mode */}
            <img
              src="/hero.jpeg"
              alt="YAKKAN EG"
              className="block w-full max-w-[720px] object-contain dark:hidden"
            />

            {/* Dark Mode */}
            <img
              src="/hero2.jpeg"
              alt="YAKKAN EG"
              className="hidden w-full max-w-[720px] object-contain dark:block"
            />
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          STATS
      ======================================================== */}

      <section className="relative z-10 mx-auto -mt-3 max-w-[1450px] px-5 lg:px-10">
        <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_5px_30px_rgba(0,0,0,0.06)] dark:bg-[#18181b] dark:shadow-black/30 sm:grid-cols-3 lg:grid-cols-5">
          <Stat
            icon={<Users />}
            number="20,000+"
            label="طالب"
          />

          <Stat
            icon={<BookOpen />}
            number="350+"
            label="كورس"
          />

          <Stat
            icon={<GraduationCap />}
            number="150+"
            label="دكتور"
          />

          <Stat
            icon={<Award />}
            number="5000+"
            label="شهادة"
          />

          <Stat
            icon={<span className="text-4xl">☺</span>}
            number="98%"
            label="نسبة رضا"
          />
        </div>
      </section>

      {/* ========================================================
          CATEGORIES
      ======================================================== */}

      <section className="mx-auto max-w-[1450px] px-5 py-6 lg:px-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Category
            icon={<Gift />}
            title="حفلات التخرج"
          />

          <Category
            icon={<Bus />}
            title="الرحلات"
          />

          <Category
            icon={<Building2 />}
            title="المعاهد"
          />

          <Category
            icon={<School />}
            title="المدارس"
          />

          <Category
            icon={<GraduationCap />}
            title="الجامعات"
          />

          <Category
            icon={<BookOpen />}
            title="الكورسات"
          />
        </div>
      </section>

      {/* ========================================================
          WHY US
      ======================================================== */}

      <section className="bg-[#fafafa] py-20 dark:bg-[#111113]">
        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
          <SectionTitle title="لماذا تختار YAKKAN EG ؟" />

          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
            {whyUs.map((item) => (
              <WhyCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
              />
            ))}
          </div>

          {/* HOW TO START */}

          <SectionTitle
            title="كيف تبدأ ؟"
            className="mt-24"
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
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
      </section>

      {/* ========================================================
          FEATURED COURSES
      ======================================================== */}

      <section className="py-20">
        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
          <div className="flex items-center justify-between">
            <SectionTitle
              title="الكورسات المميزة"
              align="right"
            />

            <Link
              href="/courses"
              className="font-bold text-[#d90429] hover:underline"
            >
              عرض جميع الكورسات
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard
                key={course.title}
                image={course.image}
                title={course.title}
                doctor={course.doctor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          TESTIMONIALS
      ======================================================== */}

      <section className="overflow-hidden bg-[#fafafa] py-20 dark:bg-[#111113]">
        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
          <SectionTitle title="آراء الطلاب" />

          <div className="relative mx-auto mt-12 max-w-[1150px]">
            <div className="overflow-hidden rounded-3xl bg-white shadow-[0_5px_30px_rgba(0,0,0,0.04)] dark:bg-[#18181b]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{
                    opacity: 0,
                    x: 30,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -30,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="min-h-[320px] px-8 py-12 text-center sm:px-20"
                >
                  <div className="flex justify-center gap-1 text-[#ffbd00]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="size-7 fill-current"
                      />
                    ))}
                  </div>

                  <p className="mx-auto mt-8 max-w-[850px] text-lg leading-9 text-[#333] dark:text-gray-200">
                    "{testimonials[testimonialIndex].text}"
                  </p>

                  <div className="mt-8 flex items-center justify-center gap-4">
                    <img
                      src={testimonials[testimonialIndex].image}
                      alt={testimonials[testimonialIndex].name}
                      className="size-16 rounded-full object-cover"
                    />

                    <div className="text-right">
                      <h3 className="font-black">
                        {testimonials[testimonialIndex].name}
                      </h3>

                      <p className="mt-1 whitespace-pre-line text-sm text-gray-500">
                        {testimonials[testimonialIndex].details}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={previousTestimonial}
              aria-label="الرأي السابق"
              className="absolute right-2 top-1/2 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#e96f89] text-white shadow-lg transition hover:scale-105"
            >
              <ChevronRight className="size-7" />
            </button>

            {/* NEXT */}

            <button
              type="button"
              onClick={nextTestimonial}
              aria-label="الرأي التالي"
              className="absolute left-2 top-1/2 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#e96f89] text-white shadow-lg transition hover:scale-105"
            >
              <ChevronLeft className="size-7" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          APP DOWNLOAD
      ======================================================== */}

      <section className="py-16">
        <div className="mx-auto grid max-w-[1450px] items-center gap-12 px-5 lg:grid-cols-2 lg:px-10">
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            className="text-center lg:text-right"
          >
            <h2 className="text-3xl font-black sm:text-4xl">
              حمل تطبيق{" "}
              <span className="text-[#d90429]">
                YAKKAN EG
              </span>{" "}
              الآن
            </h2>

            <p className="mt-6 text-lg leading-9 text-[#444] dark:text-gray-300">
              تعلم في أي وقت ومن أي مكان.
              <br />
              تجربة تعليمية متكاملة بين يديك.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
              <AppButton
                icon={<Apple />}
                title="App Store"
              />

              <AppButton
                icon={<Play />}
                title="Google Play"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            className="flex justify-center"
          >
            <img
              src="/app.png"
              alt="YAKKAN EG App"
              className="w-full max-w-[700px] object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          MEDIA GALLERY
      ======================================================== */}

      <section className="bg-[#fafafa] py-20 dark:bg-[#111113]">
        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
          <SectionTitle title="معرض الصور والفيديوهات" />

          {/* FILTERS */}

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {[
              "الكل",
              "الحفلات",
              "الرحلات",
              "الكورسات",
            ].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setMediaFilter(filter)}
                className={`rounded-lg px-6 py-2.5 text-sm font-bold transition ${
                  mediaFilter === filter
                    ? "bg-[#d90429] text-white"
                    : "bg-white text-[#333] shadow-sm hover:bg-gray-100 dark:bg-[#18181b] dark:text-white dark:hover:bg-[#222225]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* IMAGES */}

          <motion.div
            layout
            className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            <AnimatePresence>
              {filteredMedia.map((item, index) => (
                <motion.div
                  layout
                  key={`${item.image}-${index}`}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  className="group relative overflow-hidden rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.type}
                    className="aspect-[1.7] w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
                    <div className="flex size-14 items-center justify-center rounded-full bg-white/90 text-[#d90429]">
                      <PlayCircle className="size-8" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <footer className="border-t border-black/10 bg-white dark:border-white/10 dark:bg-[#0d0d0f]">
        <div className="mx-auto max-w-[1250px] px-5 py-16 lg:px-10">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}

            <div>
              <h3 className="text-lg font-black text-[#d90429]">
                YAKKAN EG
              </h3>

              <p className="mt-5 text-sm leading-8 text-gray-600 dark:text-gray-400">
                منصة تعليمية متكاملة تقدم أفضل الدورات التدريبية
                والفعاليات والرحلات التعليمية وحفلات التخرج،
                لمساعدتك على تطوير مهاراتك وتحقيق أهدافك في سوق العمل.
              </p>

              <div className="mt-6 flex gap-3">
                <SocialIcon icon={<FacebookIcon />} />
                <SocialIcon icon={<YoutubeIcon />} />
                <SocialIcon icon={<X />} />
              </div>
            </div>

            {/* QUICK LINKS */}

            <div>
              <h3 className="font-black">
                روابط سريعة
              </h3>

              <FooterLink
                href="/"
                text="الرئيسية"
              />

              <FooterLink
                href="/courses"
                text="الكورسات"
              />

              <FooterLink
                href="/events"
                text="الفعاليات"
              />

              <FooterLink
                href="/trips"
                text="الرحلات"
              />

              <FooterLink
                href="/graduation"
                text="حفلات التخرج"
              />
            </div>

            {/* SERVICES */}

            <div>
              <h3 className="font-black">
                خدماتنا
              </h3>

              <FooterLink
                href="/courses"
                text="الدورات التدريبية"
              />

              <FooterLink
                href="/lectures"
                text="المحاضرات"
              />

              <FooterLink
                href="/exams"
                text="الاختبارات"
              />

              <FooterLink
                href="/certificates"
                text="الشهادات"
              />

              <FooterLink
                href="/support"
                text="الدعم الفني"
              />
            </div>

            {/* CONTACT */}

            <div>
              <h3 className="font-black">
                تواصل معنا
              </h3>

              <ContactRow
                icon={<PhoneIcon />}
                text="20+ 7890 456 123"
              />

              <ContactRow
                icon={<Mail />}
                text="info@yakkaneg.com"
              />

              <ContactRow
                icon={<MapPin />}
                text="القاهرة - مصر"
              />
            </div>
          </div>

          {/* COPYRIGHT */}

          <div className="mt-14 border-t border-black/10 pt-7 text-center text-sm text-gray-500 dark:border-white/10">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-[#d90429]">
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
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="flex items-center justify-center gap-3 border-black/5 px-5 py-5 dark:border-white/5 lg:border-l"
    >
      <div className="text-[#d90429]">
        {icon}
      </div>

      <div>
        <div className="text-2xl font-black">
          {number}
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
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
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="flex min-h-[95px] flex-col items-center justify-center rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-[#18181b]"
    >
      <div className="text-[#d90429]">
        {icon}
      </div>

      <span className="mt-2 text-sm font-bold">
        {title}
      </span>
    </motion.div>
  );
}

/* ============================================================
   WHY CARD
============================================================ */

function WhyCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="flex min-h-[140px] flex-col items-center justify-center rounded-xl bg-white px-4 py-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:bg-[#18181b]"
    >
      <div className="text-[#d90429]">
        {icon}
      </div>

      <div className="mt-3 text-base font-bold leading-7">
        {title}
        <br />
        {subtitle}
      </div>
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
      className="flex items-center gap-5 rounded-xl bg-white p-6 shadow-sm dark:bg-[#18181b]"
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#d90429] text-2xl font-black text-white">
        {number}
      </div>

      <div>
        <h3 className="text-lg font-black">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-7 text-gray-600 dark:text-gray-400">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({
  image,
  title,
  doctor,
}: {
  image: string;
  title: string;
  doctor: string;
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:shadow-lg dark:border-white/10 dark:bg-[#18181b]"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="aspect-[1.55] w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="text-xl font-black">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {doctor}
        </p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            4.7

            <Star className="size-4 fill-[#ffca28] text-[#ffca28]" />

            <span>
              (1670)
            </span>
          </span>

          <span className="flex items-center gap-1">
            <Users className="size-4 text-[#ffca28]" />
            400 طالب
          </span>
        </div>

        <Button className="mt-4 w-full rounded-lg bg-[#d90429] font-bold text-white hover:bg-[#bd0324]">
          اشترك الآن
        </Button>
      </div>
    </motion.div>
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
      className="flex items-center gap-2 rounded-lg border-2 border-[#d90429] px-6 py-2.5 text-[#d90429] transition hover:bg-[#d90429]/5 dark:text-[#ff4d6d]"
    >
      {icon}

      <span className="font-semibold">
        {title}
      </span>
    </button>
  );
}

/* ============================================================
   SOCIAL ICON
============================================================ */

function SocialIcon({
  icon,
}: {
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex size-10 items-center justify-center rounded-full bg-[#fafafa] transition hover:bg-[#d90429] hover:text-white dark:bg-[#18181b]"
    >
      {icon}
    </button>
  );
}

/* ============================================================
   FOOTER LINK
============================================================ */

function FooterLink({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="mt-3 block text-sm text-gray-600 transition hover:text-[#d90429] dark:text-gray-400"
    >
      {text}
    </Link>
  );
}

/* ============================================================
   CONTACT ROW
============================================================ */

function ContactRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="mt-5 flex items-center gap-3 text-sm">
      <span className="flex size-9 items-center justify-center rounded-full bg-[#fafafa] text-[#d90429] dark:bg-[#18181b]">
        {icon}
      </span>

      <span dir="ltr">
        {text}
      </span>
    </div>
  );
}

/* ============================================================
   PHONE ICON
============================================================ */

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-4"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

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

function YoutubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

/* ============================================================
   SECTION TITLE
============================================================ */

function SectionTitle({
  title,
  align = "center",
  className = "",
}: {
  title: string;
  align?: "center" | "right";
  className?: string;
}) {
  return (
    <h2
      className={`text-3xl font-black tracking-tight sm:text-4xl ${
        align === "center"
          ? "text-center"
          : "text-right"
      } ${className}`}
    >
      {title}
    </h2>
  );
}

// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";

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
// import { authClient } from "@/lib/auth-client";

// // ============================================================
// // HOME PAGE
// // ============================================================

// export default function HomePage() {
//   // ==========================================================
//   // AUTH SESSION
//   // ==========================================================

//   const { data: session, isPending } = authClient.useSession();

//   const isLoggedIn = !!session?.user;

//   return (
//     <main
//       dir="rtl"
//       className="relative min-h-screen overflow-hidden bg-background"
//     >
//       {/* ======================================================
//           BACKGROUND
//       ====================================================== */}

//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         {/* Main glow */}

//         <motion.div
//           className="absolute right-[-180px] top-[80px] size-[450px] rounded-full bg-red-500/10 blur-[130px]"
//           animate={{
//             scale: [1, 1.06, 1],
//             opacity: [0.65, 0.8, 0.65],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />

//         {/* Left glow */}

//         <motion.div
//           className="absolute left-[-180px] top-[480px] size-[430px] rounded-full bg-rose-500/10 blur-[130px]"
//           animate={{
//             scale: [1, 1.05, 1],
//             opacity: [0.5, 0.7, 0.5],
//           }}
//           transition={{
//             duration: 12,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />

//         <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.015] via-transparent to-rose-500/[0.02]" />

//         <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] [background-size:40px_40px]" />
//       </div>

//       {/* ======================================================
//           HERO
//       ====================================================== */}

//       <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-20 pt-32 lg:px-8">
//         <div className="grid w-full items-center gap-16 lg:grid-cols-2">
//           {/* ==================================================
//               RIGHT CONTENT
//           ================================================== */}

//           <motion.div
//             className="text-center lg:text-right"
//             initial="hidden"
//             animate="visible"
//           >
//             {/* Badge */}

//             <motion.div
//               initial={{
//                 opacity: 0,
//                 y: 20,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 duration: 0.45,
//                 ease: "easeInOut",
//               }}
//               className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-gradient-to-r from-red-500/10 to-rose-500/5 px-4 py-2 text-xs font-semibold text-red-500 shadow-sm shadow-red-500/5"
//             >
//               <Sparkles className="size-3.5" />

//               مستقبلك يبدأ بخطوة
//             </motion.div>

//             {/* Heading */}

//             <motion.h1
//               initial={{
//                 opacity: 0,
//                 y: 20,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 duration: 0.45,
//                 delay: 0.08,
//                 ease: "easeInOut",
//               }}
//               className="text-4xl font-black leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl"
//             >
//               تعلّم بطريقة

//               <span className="block bg-gradient-to-l from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
//                 مختلفة تمامًا
//               </span>
//             </motion.h1>

//             {/* Description */}

//             <motion.p
//               initial={{
//                 opacity: 0,
//                 y: 20,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 duration: 0.45,
//                 delay: 0.16,
//                 ease: "easeInOut",
//               }}
//               className="mx-auto mt-6 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base lg:mx-0"
//             >
//               في YAKKAN-EG مش هتتعلم وبس. هتكتشف مهارات جديدة، تطور نفسك،
//               تستمتع بوقتك، وتبني مستقبلك في مكان واحد.
//             </motion.p>

//             {/* ==================================================
//                 BUTTONS
//             ================================================== */}

//             <motion.div
//               initial={{
//                 opacity: 0,
//                 y: 20,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 duration: 0.45,
//                 delay: 0.24,
//                 ease: "easeInOut",
//               }}
//               className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
//             >
//               {/* REGISTER BUTTON */}

//               {!isPending && !isLoggedIn && (
//                 <motion.div
//                   initial={{
//                     opacity: 0,
//                     y: 10,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   transition={{
//                     duration: 0.4,
//                     ease: "easeOut",
//                   }}
//                   whileHover={{
//                     y: -3,
//                   }}
//                   whileTap={{
//                     scale: 0.97,
//                   }}
//                 >
//                   <Link href="/register">
//                     <Button
//                       size="lg"
//                       className="h-12 w-full gap-2 rounded-xl border-0 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 px-7 font-bold text-white shadow-xl shadow-red-500/20 transition-shadow duration-300 hover:shadow-2xl hover:shadow-red-500/30 sm:w-auto"
//                     >
//                       ابدأ رحلتك الآن
//                       <ArrowLeft className="size-4" />
//                     </Button>
//                   </Link>
//                 </motion.div>
//               )}

//               {/* COURSES BUTTON */}

//               <motion.div
//                 whileHover={{
//                   y: -3,
//                 }}
//                 whileTap={{
//                   scale: 0.97,
//                 }}
//               >
//                 <Link href="/courses">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="h-12 w-full gap-2 rounded-xl border-red-500/20 px-7 font-bold transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/5 sm:w-auto"
//                   >
//                     <BookOpen className="size-4 text-red-500" />
//                     استكشف الكورسات
//                   </Button>
//                 </Link>
//               </motion.div>
//             </motion.div>

//             {/* ==================================================
//                 STATS
//             ================================================== */}

//             <motion.div
//               initial={{
//                 opacity: 0,
//                 y: 20,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 duration: 0.45,
//                 delay: 0.32,
//                 ease: "easeInOut",
//               }}
//               className="mx-auto mt-10 grid max-w-lg grid-cols-3 divide-x divide-border rounded-2xl border border-border/50 bg-background/50 p-4 shadow-lg shadow-red-500/5 backdrop-blur-xl lg:mx-0"
//             >
//               <Stat number="+50" text="كورس" />

//               <Stat number="+10K" text="طالب" />

//               <Stat number="4.9" text="تقييم" icon />
//             </motion.div>
//           </motion.div>

//           {/* ==================================================
//               LEFT VISUAL
//           ================================================== */}

//           <motion.div
//             className="relative mx-auto flex w-full max-w-[520px] items-center justify-center"
//             initial={{
//               opacity: 0,
//               x: -30,
//               scale: 0.96,
//             }}
//             animate={{
//               opacity: 1,
//               x: 0,
//               scale: 1,
//             }}
//             transition={{
//               duration: 0.65,
//               delay: 0.1,
//               ease: "easeOut",
//             }}
//           >
//             {/* Glow */}

//             <div className="absolute size-[380px] rounded-full bg-red-500/15 blur-[110px]" />

//             <div className="absolute -right-10 top-10 size-44 rounded-full bg-rose-500/10 blur-[90px]" />

//             {/* Main visual */}

//             <motion.div
//               className="relative flex aspect-square w-full max-w-[430px] items-center justify-center overflow-hidden rounded-[42px] border border-red-500/10 bg-background/70 p-10 shadow-2xl shadow-red-500/10 backdrop-blur-2xl"
//               whileHover={{
//                 y: -4,
//                 scale: 1.01,
//               }}
//               transition={{
//                 duration: 0.25,
//                 ease: "easeOut",
//               }}
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.04] via-transparent to-orange-500/[0.04]" />

//               {/* Outer ring */}

//               <motion.div
//                 className="absolute size-[330px] rounded-full border border-red-500/10"
//                 animate={{
//                   rotate: 360,
//                 }}
//                 transition={{
//                   duration: 45,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//               />

//               {/* Inner ring */}

//               <motion.div
//                 className="absolute size-[260px] rounded-full border border-rose-500/10"
//                 animate={{
//                   rotate: -360,
//                 }}
//                 transition={{
//                   duration: 38,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//               />

//               {/* Logo */}

//               <motion.div
//                 className="absolute size-[220px] rounded-full bg-gradient-to-br from-red-500 via-rose-500 to-orange-500 p-[3px] shadow-2xl shadow-red-500/25"
//                 animate={{
//                   y: [0, -5, 0],
//                 }}
//                 transition={{
//                   duration: 6,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               >
//                 <div className="flex size-full items-center justify-center rounded-full bg-background p-4">
//                   <img
//                     src="/myLogo.png"
//                     alt="YAKKAN EG"
//                     className="size-full rounded-full object-cover drop-shadow-2xl"
//                   />
//                 </div>
//               </motion.div>

//               {/* Top floating card */}

//               <motion.div
//                 className="absolute right-5 top-7 flex items-center gap-2 rounded-2xl border border-red-500/10 bg-background/90 px-4 py-3 shadow-xl shadow-red-500/5 backdrop-blur-xl"
//                 animate={{
//                   y: [0, -5, 0],
//                 }}
//                 transition={{
//                   duration: 5,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               >
//                 <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 to-rose-500/10 text-red-500">
//                   <Sparkles className="size-4" />
//                 </div>

//                 <div>
//                   <p className="text-[9px] text-muted-foreground">
//                     منصة تعليمية
//                   </p>

//                   <p className="text-xs font-black">YAKKAN-EG</p>
//                 </div>
//               </motion.div>

//               {/* Bottom floating card */}

//               <motion.div
//                 className="absolute bottom-7 left-5 flex items-center gap-3 rounded-2xl border border-red-500/10 bg-background/90 px-4 py-3 shadow-xl shadow-red-500/5 backdrop-blur-xl"
//                 animate={{
//                   y: [0, 5, 0],
//                 }}
//                 transition={{
//                   duration: 5.5,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               >
//                 <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/15 to-orange-500/10 text-rose-500">
//                   <GraduationCap className="size-4" />
//                 </div>

//                 <div>
//                   <p className="text-[9px] text-muted-foreground">
//                     تعلّم • طوّر • استمتع
//                   </p>

//                   <p className="text-xs font-black">مستقبلك يبدأ هنا</p>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* ======================================================
//           FEATURES
//       ====================================================== */}

//       <section className="relative border-y border-border/40 bg-muted/20 py-24">
//         <div className="mx-auto max-w-7xl px-5 lg:px-8">
//           <motion.div
//             className="mx-auto max-w-2xl text-center"
//             initial={{
//               opacity: 0,
//               y: 20,
//             }}
//             whileInView={{
//               opacity: 1,
//               y: 0,
//             }}
//             viewport={{
//               once: true,
//               amount: 0.2,
//             }}
//             transition={{
//               duration: 0.45,
//               ease: "easeInOut",
//             }}
//           >
//             {/* Label */}

//             <motion.div
//               initial={{
//                 opacity: 0,
//                 y: 15,
//               }}
//               whileInView={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               viewport={{
//                 once: true,
//               }}
//               transition={{
//                 duration: 0.4,
//                 ease: "easeOut",
//               }}
//               className="mb-3 inline-flex items-center gap-2 bg-gradient-to-l from-red-500 to-rose-500 bg-clip-text text-xs font-bold text-transparent"
//             >
//               <Sparkles className="size-4 text-red-500" />

//               لماذا YAKKAN-EG؟
//             </motion.div>

//             {/* Title */}

//             <motion.h2
//               initial={{
//                 opacity: 0,
//                 y: 15,
//               }}
//               whileInView={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               viewport={{
//                 once: true,
//               }}
//               transition={{
//                 duration: 0.4,
//                 delay: 0.08,
//                 ease: "easeOut",
//               }}
//               className="text-3xl font-black tracking-tight sm:text-4xl"
//             >
//               كل ما تحتاجه في مكان واحد
//             </motion.h2>

//             {/* Description */}

//             <motion.p
//               initial={{
//                 opacity: 0,
//                 y: 15,
//               }}
//               whileInView={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               viewport={{
//                 once: true,
//               }}
//               transition={{
//                 duration: 0.4,
//                 delay: 0.16,
//                 ease: "easeOut",
//               }}
//               className="mt-4 text-sm leading-7 text-muted-foreground"
//             >
//               صممنا المنصة عشان تجمع بين التعلم، التطور، والمحتوى الممتع بدون
//               تعقيد.
//             </motion.p>
//           </motion.div>

//           {/* Feature cards */}

//           <div className="mt-14 grid gap-5 md:grid-cols-3">
//             <FeatureCard
//               icon={<BookOpen />}
//               title="تعلم بطريقة عملية"
//               text="كورسات مرتبة ومحتوى عملي يساعدك تطبق اللي بتتعلمه."
//               delay={0}
//             />

//             <FeatureCard
//               icon={<Trophy />}
//               title="تابع تقدمك"
//               text="اعرف مستواك، تابع إنجازاتك، واستمر في تطوير نفسك."
//               delay={0.08}
//             />

//             <FeatureCard
//               icon={<Gamepad2 />}
//               title="اتعلم واستمتع"
//               text="استراحة ممتعة مع ألعاب وأنشطة ترفيهية داخل المنصة."
//               delay={0.16}
//             />
//           </div>
//         </div>
//       </section>

//       {/* ======================================================
//           CTA
//       ====================================================== */}

//       <section className="relative py-24">
//         <div className="mx-auto max-w-7xl px-5 lg:px-8">
//           <motion.div
//             className="relative overflow-hidden rounded-[32px] border border-red-500/15 bg-gradient-to-br from-red-500/10 via-rose-500/10 to-orange-500/10 p-8 shadow-xl shadow-red-500/5 sm:p-12"
//             initial={{
//               opacity: 0,
//               y: 30,
//             }}
//             whileInView={{
//               opacity: 1,
//               y: 0,
//             }}
//             viewport={{
//               once: true,
//               amount: 0.1,
//             }}
//             transition={{
//               duration: 0.55,
//               ease: "easeOut",
//             }}
//           >
//             {/* CTA glows */}

//             <div className="absolute -left-20 -top-20 size-72 rounded-full bg-red-500/10 blur-[90px]" />

//             <div className="absolute -bottom-20 -right-20 size-64 rounded-full bg-orange-500/10 blur-[90px]" />

//             <div className="relative grid items-center gap-10 lg:grid-cols-2">
//               {/* CTA content */}

//               <motion.div
//                 initial={{
//                   opacity: 0,
//                   x: 20,
//                 }}
//                 whileInView={{
//                   opacity: 1,
//                   x: 0,
//                 }}
//                 viewport={{
//                   once: true,
//                 }}
//                 transition={{
//                   duration: 0.5,
//                   ease: "easeOut",
//                 }}
//               >
//                 <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold text-red-500">
//                   <BookOpen className="size-3" />

//                   ابدأ التعلم
//                 </div>

//                 <h2 className="mt-5 text-3xl font-black sm:text-4xl">
//                   جاهز تبدأ

//                   <span className="bg-gradient-to-l from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
//                     {" "}
//                     رحلتك؟
//                   </span>
//                 </h2>

//                 <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
//                   اختار المجال اللي بتحبه، وابدأ تتعلم خطوة بخطوة مع YAKKAN-EG.
//                 </p>

//                 {/* REGISTER CTA */}

//                 {!isPending && !isLoggedIn && (
//                   <motion.div
//                     initial={{
//                       opacity: 0,
//                       y: 10,
//                     }}
//                     animate={{
//                       opacity: 1,
//                       y: 0,
//                     }}
//                     transition={{
//                       duration: 0.4,
//                       ease: "easeOut",
//                     }}
//                     whileHover={{
//                       y: -3,
//                     }}
//                     whileTap={{
//                       scale: 0.97,
//                     }}
//                   >
//                     <Link href="/register">
//                       <Button
//                         size="lg"
//                         className="mt-7 gap-2 rounded-xl border-0 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 px-7 font-bold text-white shadow-lg shadow-red-500/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-red-500/30"
//                       >
//                         إنشاء حساب مجاني
//                         <ArrowLeft className="size-4" />
//                       </Button>
//                     </Link>
//                   </motion.div>
//                 )}
//               </motion.div>

//               {/* Info cards */}

//               <div className="grid grid-cols-2 gap-3">
//                 <InfoCard
//                   icon={<Users />}
//                   number="+10K"
//                   text="طالب"
//                   delay={0}
//                 />

//                 <InfoCard
//                   icon={<BookOpen />}
//                   number="+50"
//                   text="كورس"
//                   delay={0.08}
//                 />

//                 <InfoCard
//                   icon={<Clock3 />}
//                   number="+500"
//                   text="ساعة تعليم"
//                   delay={0.16}
//                 />

//                 <InfoCard
//                   icon={<Star />}
//                   number="4.9"
//                   text="متوسط التقييم"
//                   delay={0.24}
//                 />
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* ======================================================
//           FOOTER
//       ====================================================== */}

//       <footer className="border-t border-border/50 py-8">
//         <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:text-right lg:px-8">
//           <motion.div
//             className="flex items-center gap-2"
//             whileHover={{
//               scale: 1.02,
//             }}
//           >
//             <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg border border-red-500/10 bg-background p-1 shadow-sm">
//               <img
//                 src="/myLogo.png"
//                 alt="YAKKAN-EG"
//                 className="size-full rounded-md object-cover"
//               />
//             </div>

//             <span className="text-sm font-black">YAKKAN-EG</span>
//           </motion.div>

//           <p className="text-[11px] text-muted-foreground">
//             © {new Date().getFullYear()} YAKKAN-EG — كل الحقوق محفوظة
//           </p>
//         </div>
//       </footer>
//     </main>
//   );
// }

// // ============================================================
// // STAT
// // ============================================================

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
//     <motion.div
//       className="text-center"
//       whileHover={{
//         scale: 1.03,
//       }}
//       transition={{
//         duration: 0.2,
//       }}
//     >
//       <div className="flex items-center justify-center gap-1">
//         <span className="text-lg font-black">{number}</span>

//         {icon && (
//           <Star className="size-3 fill-orange-400 text-orange-400" />
//         )}
//       </div>

//       <p className="mt-0.5 text-[9px] text-muted-foreground">{text}</p>
//     </motion.div>
//   );
// }

// // ============================================================
// // FEATURE CARD
// // ============================================================

// function FeatureCard({
//   icon,
//   title,
//   text,
//   delay,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   text: string;
//   delay: number;
// }) {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         y: 20,
//       }}
//       whileInView={{
//         opacity: 1,
//         y: 0,
//       }}
//       viewport={{
//         once: true,
//         amount: 0.1,
//       }}
//       transition={{
//         duration: 0.45,
//         delay,
//         ease: "easeOut",
//       }}
//       whileHover={{
//         y: -5,
//       }}
//       className="group rounded-2xl border border-border/50 bg-background/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-red-500/20 hover:shadow-xl hover:shadow-red-500/5"
//     >
//       <motion.div
//         className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 to-rose-500/10 text-red-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/10"
//         whileHover={{
//           scale: 1.08,
//         }}
//         transition={{
//           duration: 0.2,
//         }}
//       >
//         {icon}
//       </motion.div>

//       <h3 className="mt-5 text-base font-black">{title}</h3>

//       <p className="mt-2 text-xs leading-7 text-muted-foreground">{text}</p>

//       <motion.div
//         className="mt-5 flex items-center gap-1 text-[10px] font-bold text-red-500"
//         whileHover={{
//           x: -3,
//         }}
//       >
//         اكتشف المزيد

//         <ChevronLeft className="size-3" />
//       </motion.div>
//     </motion.div>
//   );
// }

// // ============================================================
// // INFO CARD
// // ============================================================

// function InfoCard({
//   icon,
//   number,
//   text,
//   delay,
// }: {
//   icon: React.ReactNode;
//   number: string;
//   text: string;
//   delay: number;
// }) {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         y: 20,
//       }}
//       whileInView={{
//         opacity: 1,
//         y: 0,
//       }}
//       viewport={{
//         once: true,
//         amount: 0.1,
//       }}
//       transition={{
//         duration: 0.45,
//         delay,
//         ease: "easeOut",
//       }}
//       whileHover={{
//         y: -4,
//       }}
//       className="group rounded-2xl border border-border/50 bg-background/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/5"
//     >
//       <div className="flex items-center justify-between">
//         <motion.div
//           className="text-red-500"
//           whileHover={{
//             scale: 1.1,
//           }}
//           transition={{
//             duration: 0.2,
//           }}
//         >
//           {icon}
//         </motion.div>

//         <span className="text-xl font-black">{number}</span>
//       </div>

//       <p className="mt-2 text-[10px] text-muted-foreground">{text}</p>
//     </motion.div>
//   );
// }