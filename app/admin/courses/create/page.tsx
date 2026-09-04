"use client"

import {
  useEffect,
  useState,
} from "react"

import Link from "next/link"

import {
  useForm,
} from "react-hook-form"

import {
  zodResolver,
} from "@hookform/resolvers/zod"

import RichTextEditor from "@/components/rich-text-editor/editor"
import FileUpload from "@/components/file-uploader/uploader"

import {
  ArrowRight,
  BookOpen,
  Save,
  DollarSign,
  BarChart3,
  FileText,
  Image as ImageIcon,
  Eye,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react"

import {
  courseSchema,
  CourseFormInput,
} from "@/lib/zodSchema"

import {
  universityData,
  secondaryData,
} from "@/lib/course-data"

export default function CoursesCreatePage() {
  // ============================================================
  // STATE
  // ============================================================

  const [mediaKey, setMediaKey] =
    useState<string | null>(null)

  const [mediaType, setMediaType] =
    useState<
      "IMAGE" | "VIDEO" | null
    >(null)

  const [submitError, setSubmitError] =
    useState<string | null>(null)

  // ============================================================
  // FORM
  // ============================================================

  const form =
    useForm<CourseFormInput>({
      resolver:
        zodResolver(courseSchema),

      defaultValues: {
        title: "",
        description: "",
        mediaFile: undefined,

        price: 0,

        educationType:
          "UNIVERSITY",

        academicLevel:
          "UNIVERSITY_LEVEL_1",

        semester:
          "FIRST",

        secondaryTrack:
          undefined,

        subject: "",

        courseLevel:
          "BEGINNER",

        isPublished:
          false,
      },
    })

  // ============================================================
  // WATCH
  // ============================================================

  const educationType =
    form.watch("educationType")

  const academicLevel =
    form.watch("academicLevel")

  const semester =
    form.watch("semester")

  const secondaryTrack =
    form.watch("secondaryTrack")

  const isPublished =
    form.watch("isPublished")

  const mediaFile =
    form.watch("mediaFile")

  // ============================================================
  // FLAGS
  // ============================================================

  const isUniversity =
    educationType === "UNIVERSITY"

  const isSecondary =
    educationType === "SECONDARY"

  const showTrack =
    isSecondary &&
    (
      academicLevel ===
        "SECONDARY_GRADE_2" ||
      academicLevel ===
        "SECONDARY_GRADE_3"
    )

  // ============================================================
  // RESET WHEN EDUCATION TYPE CHANGES
  // ============================================================

  useEffect(() => {
    form.setValue(
      "academicLevel",
      educationType === "UNIVERSITY"
        ? "UNIVERSITY_LEVEL_1"
        : "SECONDARY_GRADE_1"
    )

    form.setValue(
      "semester",
      "FIRST"
    )

    form.setValue(
      "secondaryTrack",
      undefined
    )

    form.setValue(
      "subject",
      ""
    )
  }, [educationType, form])

  // ============================================================
  // RESET WHEN ACADEMIC LEVEL CHANGES
  // ============================================================

  useEffect(() => {
    form.setValue(
      "semester",
      "FIRST"
    )

    form.setValue(
      "secondaryTrack",
      undefined
    )

    form.setValue(
      "subject",
      ""
    )
  }, [academicLevel, form])

  // ============================================================
  // RESET SUBJECT WHEN TRACK CHANGES
  // ============================================================

  useEffect(() => {
    form.setValue(
      "subject",
      ""
    )
  }, [secondaryTrack, form])

  // ============================================================
  // SUBJECTS
  // ============================================================

  let availableSubjects:
    readonly {
      readonly id: string
      readonly name: string
    }[] = []

  // UNIVERSITY
  if (isUniversity) {
    const levelData =
      universityData[
        academicLevel as keyof typeof universityData
      ]

    if (levelData) {
      availableSubjects =
        levelData[
          semester
        ] as readonly {
          readonly id: string
          readonly name: string
        }[]
    }
  }

  // SECONDARY
  if (isSecondary) {
    const gradeData =
      secondaryData[
        academicLevel as keyof typeof secondaryData
      ]

    if (gradeData) {
      if (gradeData.tracks) {
        const trackData =
          gradeData.tracks[
            secondaryTrack as keyof typeof gradeData.tracks
          ]

        if (trackData) {
          availableSubjects =
            trackData[
              semester
            ] as readonly {
              readonly id: string
              readonly name: string
            }[]
        }
      } else {
        availableSubjects =
          gradeData[
            semester
          ] as readonly {
            readonly id: string
            readonly name: string
          }[]
      }
    }
  }

  // ============================================================
  // FILE CHANGE
  // ============================================================

  const handleFileChange = (
    file: File | null
  ) => {
    // إزالة الرفع القديم
    setMediaKey(null)
    setMediaType(null)

    form.setValue(
      "mediaFile",
      file ?? undefined,
      {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }

  // ============================================================
  // UPLOAD COMPLETE
  // ============================================================

  const handleUploadComplete = (
    key: string
  ) => {
    setMediaKey(key)

    const file =
      form.getValues("mediaFile")

    if (!file) {
      setMediaType(null)
      return
    }

    if (
      file.type.startsWith("image/")
    ) {
      setMediaType("IMAGE")
      return
    }

    if (
      file.type.startsWith("video/")
    ) {
      setMediaType("VIDEO")
      return
    }

    setMediaType(null)
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  const onSubmit = async (
    data: CourseFormInput
  ) => {
    try {
      setSubmitError(null)

      // ========================================================
      // FILE
      // ========================================================

      if (!data.mediaFile) {
        setSubmitError(
          "يجب اختيار صورة أو فيديو للكورس"
        )

        return
      }

      // ========================================================
      // S3 KEY
      // ========================================================

      if (!mediaKey) {
        setSubmitError(
          "يجب رفع الملف أولاً"
        )

        return
      }

      // ========================================================
      // MEDIA TYPE
      // ========================================================

      if (!mediaType) {
        setSubmitError(
          "نوع الملف غير معروف"
        )

        return
      }

      // ========================================================
      // CREATE COURSE
      // ========================================================

      const response =
        await fetch(
          "/api/courses",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                title:
                  data.title,

                description:
                  data.description ||
                  null,

                mediaKey:
                  mediaKey,

                mediaType:
                  mediaType,

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
                  data.subject,

                level:
                  data.courseLevel,

                isPublished:
                  data.isPublished,
              }),
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            "فشل إنشاء الكورس"
        )
      }

      console.log(
        "Course created:",
        result.course
      )

      window.location.href =
        "/admin/courses"
    } catch (error) {
      console.error(
        "Submit error:",
        error
      )

      setSubmitError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء حفظ الكورس"
      )
    }
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      dir="rtl"
      className="
        min-h-full
        bg-muted/[0.18]
        px-1
        pb-10
      "
    >
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="mb-7">
        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                size-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-red-500/20
                bg-red-500
                text-white
                shadow-lg
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
                  إنشاء جديد
                </span>
              </div>

              <h1 className="text-2xl font-black">
                إنشاء كورس جديد
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                أضف كورس جديد إلى منصة YAKKAN.EG
              </p>
            </div>
          </div>

          <Link
            href="/admin/courses"
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-border
              bg-background
              px-5
              text-sm
              font-bold
              shadow-sm
              transition-all
              hover:-translate-y-0.5
              hover:border-red-500/40
              hover:bg-red-500/[0.04]
              hover:text-red-500
            "
          >
            <ArrowRight className="size-4" />
            العودة للكورسات
          </Link>
        </div>
      </div>

      {/* ====================================================== */}
      {/* MAIN CARD */}
      {/* ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-[26px]
          border
          border-border
          bg-background
          shadow-[0_10px_40px_rgba(0,0,0,0.04)]
        "
      >
        {/* CARD HEADER */}

        <div
          className="
            border-b
            border-border
            bg-muted/[0.18]
            px-6
            py-5
            sm:px-8
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-background
                text-muted-foreground
              "
            >
              <FileText className="size-5" />
            </div>

            <div>
              <h2 className="text-sm font-black">
                معلومات الكورس
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                أدخل المعلومات الأساسية الخاصة بالكورس
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}

        <form
          onSubmit={form.handleSubmit(
            onSubmit
          )}
          className="p-6 sm:p-8"
        >
          <div className="space-y-8">

            {/* ================================================= */}
            {/* BASIC */}
            {/* ================================================= */}

            <section
              className="
                rounded-2xl
                border
                border-border
                bg-background
                p-5
                sm:p-6
              "
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-500/10
                    text-red-500
                  "
                >
                  <BookOpen className="size-4" />
                </div>

                <div>
                  <h3 className="text-sm font-black">
                    البيانات الأساسية
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    المعلومات التي ستظهر للطلاب
                  </p>
                </div>
              </div>

              <div className="space-y-6">

                {/* TITLE */}

                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    اسم الكورس
                    <span className="mr-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: أساسيات البرمجة باستخدام JavaScript"
                    {...form.register("title")}
                    className={`
                      h-12
                      w-full
                      rounded-xl
                      border
                      bg-background
                      px-4
                      text-sm
                      outline-none
                      transition
                      focus:border-red-500
                      focus:ring-4
                      focus:ring-red-500/10
                      ${
                        form.formState.errors.title
                          ? "border-red-500"
                          : "border-border"
                      }
                    `}
                  />

                  {form.formState.errors.title && (
                    <p className="text-xs font-semibold text-red-500">
                      {
                        form.formState.errors.title.message
                      }
                    </p>
                  )}
                </div>

                {/* DESCRIPTION */}

                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    وصف الكورس
                  </label>

                  <RichTextEditor
                    value={
                      form.watch(
                        "description"
                      ) ?? ""
                    }
                    onChange={(value) =>
                      form.setValue(
                        "description",
                        value,
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        }
                      )
                    }
                  />

                  {form.formState.errors.description && (
                    <p className="text-xs font-semibold text-red-500">
                      {
                        form.formState.errors.description.message
                      }
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* ACADEMIC */}
            {/* ================================================= */}

            <section
              className="
                rounded-2xl
                border
                border-border
                bg-background
                p-5
                sm:p-6
              "
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-500/10
                    text-red-500
                  "
                >
                  <BookOpen className="size-4" />
                </div>

                <div>
                  <h3 className="text-sm font-black">
                    التصنيف الأكاديمي
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    حدد المرحلة الدراسية والترم والمادة
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* EDUCATION */}

                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    نوع التعليم
                    <span className="mr-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    {...form.register(
                      "educationType"
                    )}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-border
                      bg-background
                      px-4
                      text-sm
                      outline-none
                      focus:border-red-500
                    "
                  >
                    <option value="UNIVERSITY">
                      التعليم الجامعي
                    </option>

                    <option value="SECONDARY">
                      الثانوية العامة
                    </option>
                  </select>
                </div>

                {/* ACADEMIC LEVEL */}

                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    {isUniversity
                      ? "المستوى الدراسي"
                      : "الصف الدراسي"}

                    <span className="mr-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    {...form.register(
                      "academicLevel"
                    )}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-border
                      bg-background
                      px-4
                      text-sm
                      outline-none
                      focus:border-red-500
                    "
                  >
                    {isUniversity && (
                      <>
                        <option value="UNIVERSITY_LEVEL_1">
                          المستوى الأول
                        </option>

                        <option value="UNIVERSITY_LEVEL_2">
                          المستوى الثاني
                        </option>

                        <option value="UNIVERSITY_LEVEL_3">
                          المستوى الثالث
                        </option>

                        <option value="UNIVERSITY_LEVEL_4">
                          المستوى الرابع
                        </option>
                      </>
                    )}

                    {isSecondary && (
                      <>
                        <option value="SECONDARY_GRADE_1">
                          الصف الأول الثانوي
                        </option>

                        <option value="SECONDARY_GRADE_2">
                          الصف الثاني الثانوي
                        </option>

                        <option value="SECONDARY_GRADE_3">
                          الصف الثالث الثانوي
                        </option>
                      </>
                    )}
                  </select>

                  {form.formState.errors.academicLevel && (
                    <p className="text-xs text-red-500">
                      {
                        form.formState.errors.academicLevel.message
                      }
                    </p>
                  )}
                </div>

                {/* TRACK */}

                {showTrack && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold">
                      الشعبة
                      <span className="mr-1 text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      {...form.register(
                        "secondaryTrack"
                      )}
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-border
                        bg-background
                        px-4
                        text-sm
                        outline-none
                        focus:border-red-500
                      "
                    >
                      <option value="">
                        اختر الشعبة
                      </option>

                      {academicLevel ===
                        "SECONDARY_GRADE_2" && (
                        <>
                          <option value="SCIENCE">
                            الشعبة العلمية
                          </option>

                          <option value="LITERARY">
                            الشعبة الأدبية
                          </option>
                        </>
                      )}

                      {academicLevel ===
                        "SECONDARY_GRADE_3" && (
                        <>
                          <option value="SCIENCE_SCIENCES">
                            علمي علوم
                          </option>

                          <option value="SCIENCE_MATH">
                            علمي رياضة
                          </option>

                          <option value="LITERARY">
                            الشعبة الأدبية
                          </option>
                        </>
                      )}
                    </select>

                    {form.formState.errors.secondaryTrack && (
                      <p className="text-xs text-red-500">
                        {
                          form.formState.errors.secondaryTrack.message
                        }
                      </p>
                    )}
                  </div>
                )}

                {/* SEMESTER */}

                <div className="space-y-2">
                  <label className="text-sm font-bold">
                    الفصل الدراسي
                    <span className="mr-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    {...form.register(
                      "semester"
                    )}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-border
                      bg-background
                      px-4
                      text-sm
                      outline-none
                      focus:border-red-500
                    "
                  >
                    <option value="FIRST">
                      الفصل الدراسي الأول
                    </option>

                    <option value="SECOND">
                      الفصل الدراسي الثاني
                    </option>
                  </select>
                </div>

                {/* SUBJECT */}

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold">
                    المادة
                    <span className="mr-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    {...form.register(
                      "subject"
                    )}
                    disabled={
                      !academicLevel ||
                      (
                        showTrack &&
                        !secondaryTrack
                      )
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-border
                      bg-background
                      px-4
                      text-sm
                      outline-none
                      disabled:opacity-50
                    "
                  >
                    <option value="">
                      اختر المادة
                    </option>

                    {availableSubjects.map(
                      (subject) => (
                        <option
                          key={subject.id}
                          value={subject.id}
                        >
                          {subject.name}
                        </option>
                      )
                    )}
                  </select>

                  {availableSubjects.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      تم العثور على{" "}
                      {availableSubjects.length}{" "}
                      مادة متاحة.
                    </p>
                  )}

                  {form.formState.errors.subject && (
                    <p className="text-xs font-semibold text-red-500">
                      {
                        form.formState.errors.subject.message
                      }
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* DETAILS */}
            {/* ================================================= */}

            <section
              className="
                rounded-2xl
                border
                border-border
                bg-background
                p-5
                sm:p-6
              "
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-500/10
                    text-red-500
                  "
                >
                  <BarChart3 className="size-4" />
                </div>

                <div>
                  <h3 className="text-sm font-black">
                    تفاصيل الكورس
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* PRICE */}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold">
                    <DollarSign className="size-4 text-red-500" />
                    السعر
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...form.register(
                      "price",
                      {
                        valueAsNumber: true,
                      }
                    )}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-border
                      bg-background
                      px-4
                      text-sm
                      outline-none
                      focus:border-red-500
                    "
                  />

                  {form.formState.errors.price && (
                    <p className="text-xs text-red-500">
                      {
                        form.formState.errors.price.message
                      }
                    </p>
                  )}
                </div>

                {/* COURSE LEVEL */}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold">
                    <BarChart3 className="size-4 text-red-500" />
                    مستوى الكورس
                  </label>

                  <select
                    {...form.register(
                      "courseLevel"
                    )}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-border
                      bg-background
                      px-4
                      text-sm
                    "
                  >
                    <option value="BEGINNER">
                      مبتدئ
                    </option>

                    <option value="INTERMEDIATE">
                      متوسط
                    </option>

                    <option value="ADVANCED">
                      متقدم
                    </option>
                  </select>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* MEDIA */}
            {/* ================================================= */}

            <section
              className="
                rounded-2xl
                border
                border-border
                bg-background
                p-5
                sm:p-6
              "
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-500/10
                    text-red-500
                  "
                >
                  <ImageIcon className="size-4" />
                </div>

                <div>
                  <h3 className="text-sm font-black">
                    صورة الكورس
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    اختر صورة أو فيديو للكورس
                  </p>
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border-2
                  border-dashed
                  border-border
                  bg-muted/[0.15]
                  p-5
                "
              >
                <FileUpload
                  value={mediaFile}
                  onFileChange={
                    handleFileChange
                  }
                  onUploadComplete={
                    handleUploadComplete
                  }
                />
              </div>

              {form.formState.errors.mediaFile && (
                <p className="mt-3 text-xs font-semibold text-red-500">
                  {
                    form.formState.errors.mediaFile.message
                  }
                </p>
              )}

              {mediaKey && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-emerald-500/20
                    bg-emerald-500/5
                    px-4
                    py-3
                    text-xs
                    text-emerald-500
                  "
                >
                  تم رفع الملف بنجاح.
                </div>
              )}
            </section>

            {/* ================================================= */}
            {/* PUBLISH */}
            {/* ================================================= */}

            <section
              className={`
                rounded-2xl
                border
                p-5
                ${
                  isPublished
                    ? "border-red-500/30 bg-red-500/[0.04]"
                    : "border-border bg-background"
                }
              `}
            >
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      size-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-500/10
                      text-red-500
                    "
                  >
                    <Eye className="size-5" />
                  </div>

                  <div>
                    <p className="text-sm font-black">
                      نشر الكورس
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {isPublished
                        ? "الكورس ظاهر للطلاب"
                        : "الكورس محفوظ كمسودة"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={
                    isPublished
                  }
                  onClick={() =>
                    form.setValue(
                      "isPublished",
                      !isPublished,
                      {
                        shouldDirty: true,
                        shouldTouch: true,
                      }
                    )
                  }
                  className={`
                    relative
                    h-7
                    w-12
                    rounded-full
                    p-1
                    transition
                    ${
                      isPublished
                        ? "bg-red-500"
                        : "bg-muted-foreground/30"
                    }
                  `}
                >
                  <span
                    className={`
                      flex
                      size-5
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      shadow-md
                      transition
                      ${
                        isPublished
                          ? "translate-x-0"
                          : "-translate-x-5"
                      }
                    `}
                  >
                    {isPublished && (
                      <Check className="size-3 text-red-500" />
                    )}
                  </span>
                </button>
              </div>
            </section>

            {/* ================================================= */}
            {/* ERROR */}
            {/* ================================================= */}

            {submitError && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/5
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-red-500
                "
              >
                {submitError}
              </div>
            )}

            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-border
                pt-7
                sm:flex-row
                sm:justify-end
              "
            >
              <Link
                href="/admin/courses"
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-border
                  px-7
                  text-sm
                  font-bold
                "
              >
                إلغاء
              </Link>

              <button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !mediaKey
                }
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-8
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-red-500/20
                  transition
                  hover:bg-red-600
                  disabled:pointer-events-none
                  disabled:opacity-50
                "
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    حفظ الكورس
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* FOOTER */}

      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <Sparkles className="size-3 text-red-500" />

        <span>
          تأكد من مراجعة بيانات الكورس قبل الحفظ
        </span>
      </div>
    </div>
  )
}
