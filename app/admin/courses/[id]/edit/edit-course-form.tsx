
"use client"

import {
  useEffect,
  useRef,
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

// ============================================================
// COURSE TYPE
// ============================================================

type Course = {
  id: string

  title: string

  description: string | null

  mediaUrl: string | null

  mediaKey: string | null

  mediaType:
    | "IMAGE"
    | "VIDEO"
    | null

  price: number

  level:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED"

  educationType:
    | "UNIVERSITY"
    | "SECONDARY"

  academicLevel:
    | "UNIVERSITY_LEVEL_1"
    | "UNIVERSITY_LEVEL_2"
    | "UNIVERSITY_LEVEL_3"
    | "UNIVERSITY_LEVEL_4"
    | "SECONDARY_GRADE_1"
    | "SECONDARY_GRADE_2"
    | "SECONDARY_GRADE_3"

  semester:
    | "FIRST"
    | "SECOND"

  secondaryTrack:
    | "SCIENCE"
    | "LITERARY"
    | "SCIENCE_SCIENCES"
    | "SCIENCE_MATH"
    | null

  isPublished: boolean

  subject: {
    id: string
    name: string
    code: string
  } | null
}

// ============================================================
// PROPS
// ============================================================

interface EditCourseFormProps {
  course: Course
}

// ============================================================
// COMPONENT
// ============================================================

export default function EditCourseForm({
  course,
}: EditCourseFormProps) {
  // ============================================================
  // STATE
  // ============================================================

  const [mediaKey, setMediaKey] =
    useState<string | null>(
      course.mediaKey
    )

  const [mediaType, setMediaType] =
    useState<
      "IMAGE" | "VIDEO" | null
    >(
      course.mediaType
    )

  const [submitError, setSubmitError] =
    useState<string | null>(null)

  // ============================================================
  // FIRST RENDER FLAGS
  //
  // مهم جدًا:
  // الـ useEffect في صفحة Edit لا يجب أن يمسح
  // القيم القديمة أول ما الصفحة تفتح.
  // ============================================================

  const isFirstEducationRender =
    useRef(true)

  const isFirstAcademicRender =
    useRef(true)

  const isFirstTrackRender =
    useRef(true)

  // ============================================================
  // FORM
  // ============================================================

  const form =
    useForm<CourseFormInput>({
      resolver:
        zodResolver(courseSchema),

      defaultValues: {
        title:
          course.title,

        description:
          course.description ?? "",

        mediaFile:
          undefined,

        price:
          Number(course.price),

        educationType:
          course.educationType,

        academicLevel:
          course.academicLevel,

        semester:
          course.semester,

        secondaryTrack:
          course.secondaryTrack ??
          undefined,

        // ======================================================
        // مهم:
        //
        // الـ dropdown يستخدم IDs الموجودة في course-data
        // وهي نفسها code في جدول Subject.
        //
        // لذلك نستخدم code وليس id.
        // ======================================================

        subject:
          course.subject?.code ?? "",

        courseLevel:
          course.level,

        isPublished:
          course.isPublished,
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
  //
  // لن يعمل في أول Render.
  // سيعمل فقط عندما المستخدم يغير نوع التعليم.
  // ============================================================

  useEffect(() => {
    if (
      isFirstEducationRender.current
    ) {
      isFirstEducationRender.current =
        false

      return
    }

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
  }, [
    educationType,
    form,
  ])

  // ============================================================
  // RESET WHEN ACADEMIC LEVEL CHANGES
  //
  // لن يعمل في أول Render.
  // ============================================================

  useEffect(() => {
    if (
      isFirstAcademicRender.current
    ) {
      isFirstAcademicRender.current =
        false

      return
    }

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
  }, [
    academicLevel,
    form,
  ])

  // ============================================================
  // RESET SUBJECT WHEN TRACK CHANGES
  //
  // لن يعمل في أول Render.
  // ============================================================

  useEffect(() => {
    if (
      isFirstTrackRender.current
    ) {
      isFirstTrackRender.current =
        false

      return
    }

    form.setValue(
      "subject",
      ""
    )
  }, [
    secondaryTrack,
    form,
  ])

  // ============================================================
  // SUBJECTS
  // ============================================================

  let availableSubjects:
    readonly {
      readonly id: string
      readonly name: string
    }[] = []

  // ============================================================
  // UNIVERSITY
  // ============================================================

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

  // ============================================================
  // SECONDARY
  // ============================================================

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
    // ==========================================================
    // NEW FILE
    // ==========================================================

    if (file) {
      setMediaKey(null)

      setMediaType(null)
    } else {
      // ========================================================
      // RETURN TO OLD FILE
      // ========================================================

      setMediaKey(
        course.mediaKey
      )

      setMediaType(
        course.mediaType
      )
    }

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
      form.getValues(
        "mediaFile"
      )

    if (!file) {
      setMediaType(
        course.mediaType
      )

      return
    }

    // ==========================================================
    // IMAGE
    // ==========================================================

    if (
      file.type.startsWith(
        "image/"
      )
    ) {
      setMediaType(
        "IMAGE"
      )

      return
    }

    // ==========================================================
    // VIDEO
    // ==========================================================

    if (
      file.type.startsWith(
        "video/"
      )
    ) {
      setMediaType(
        "VIDEO"
      )

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
      // MEDIA
      // ========================================================

      const finalMediaKey =
        mediaKey ??
        course.mediaKey

      const finalMediaType =
        mediaType ??
        course.mediaType

      if (!finalMediaKey) {
        setSubmitError(
          "يجب اختيار صورة أو فيديو للكورس"
        )

        return
      }

      if (!finalMediaType) {
        setSubmitError(
          "نوع الملف غير معروف"
        )

        return
      }

      // ========================================================
      // SUBJECT
      // ========================================================

      /*
       * مهم:
       *
       * data.subject هو CODE الموجود في course-data
       *
       * وليس UUID الخاص بجدول Subject.
       *
       * الـ API سيبحث عنه باستخدام:
       *
       * prisma.subject.findUnique({
       *   where: {
       *     code: subjectId
       *   }
       * })
       */

      if (
        !data.subject ||
        typeof data.subject !== "string"
      ) {
        setSubmitError(
          "يجب اختيار المادة"
        )

        return
      }

      // ========================================================
      // UPDATE COURSE
      // ========================================================

      const response =
        await fetch(
          `/api/courses/${course.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                // ==================================================
                // BASIC
                // ==================================================

                title:
                  data.title,

                description:
                  data.description ||
                  null,

                // ==================================================
                // MEDIA
                // ==================================================

                mediaKey:
                  finalMediaKey,

                mediaType:
                  finalMediaType,

                // ==================================================
                // DETAILS
                // ==================================================

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

                // ==================================================
                // SUBJECT CODE
                // ==================================================

                subjectId:
                  data.subject,

                level:
                  data.courseLevel,

                isPublished:
                  data.isPublished,
              }),
          }
        )

      // ========================================================
      // RESPONSE
      // ========================================================

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            "فشل تعديل الكورس"
        )
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      console.log(
        "Course updated:",
        result.course
      )

      // ========================================================
      // REDIRECT
      // ========================================================

      window.location.href =
        "/admin/courses"
    } catch (error) {
      console.error(
        "Update course error:",
        error
      )

      setSubmitError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تعديل الكورس"
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
              <PencilIcon />
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
                  تعديل
                </span>
              </div>

              <h1 className="text-2xl font-black">
                تعديل الكورس
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                تعديل بيانات الكورس الحالية
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
        {/* ==================================================== */}
        {/* CARD HEADER */}
        {/* ==================================================== */}

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
                قم بتعديل المعلومات المطلوبة ثم احفظ التغييرات
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* FORM */}
        {/* ==================================================== */}

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
                    {...form.register(
                      "title"
                    )}
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
                          shouldValidate:
                            true,

                          shouldDirty:
                            true,

                          shouldTouch:
                            true,
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
                          key={
                            subject.id
                          }
                          value={
                            subject.id
                          }
                        >
                          {
                            subject.name
                          }
                        </option>
                      )
                    )}
                  </select>

                  {availableSubjects.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      تم العثور على{" "}
                      {
                        availableSubjects.length
                      }{" "}
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
                        valueAsNumber:
                          true,
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
                    اترك الملف كما هو أو اختر ملفًا جديدًا
                  </p>
                </div>
              </div>

              {/* CURRENT MEDIA */}

              {course.mediaUrl && (
                <div className="mb-5 overflow-hidden rounded-2xl border border-border bg-muted">
                  {course.mediaType ===
                  "VIDEO" ? (
                    <video
                      src={
                        course.mediaUrl
                      }
                      controls
                      className="max-h-[360px] w-full object-contain"
                    />
                  ) : (
                    <img
                      src={
                        course.mediaUrl
                      }
                      alt={
                        course.title
                      }
                      className="max-h-[360px] w-full object-contain"
                    />
                  )}
                </div>
              )}

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
                  {mediaKey ===
                  course.mediaKey
                    ? "الملف الحالي مستخدم في الكورس."
                    : "تم رفع الملف الجديد بنجاح."}
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
                        shouldDirty:
                          true,

                        shouldTouch:
                          true,
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
                  form.formState
                    .isSubmitting
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
                {form.formState
                  .isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    حفظ التعديلات
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <Sparkles className="size-3 text-red-500" />

        <span>
          تأكد من مراجعة التعديلات قبل الحفظ
        </span>
      </div>
    </div>
  )
}

// ============================================================
// SIMPLE PENCIL ICON
// ============================================================

function PencilIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />

      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

