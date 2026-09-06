
"use client"

import * as React from "react"

import {
  CheckCircle2,
  Filter,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react"

// ============================================================
// TYPES
// ============================================================

type GalleryCategory =
  | "GRADUATION"
  | "TRIPS"
  | "COURSES"

type GalleryImage = {
  id: string
  key: string
  url: string
  category: GalleryCategory
  createdAt: string
}

// ============================================================
// CATEGORY LABELS
// ============================================================

const categoryLabels: Record<
  GalleryCategory,
  string
> = {
  GRADUATION: "حفلات التخرج",
  TRIPS: "الرحلات",
  COURSES: "الكورسات",
}

// ============================================================
// CONSTANTS
// ============================================================

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024

const allowedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
]

// ============================================================
// PAGE
// ============================================================

export default function GalleryPage() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [images, setImages] =
    React.useState<GalleryImage[]>([])

  const [loading, setLoading] =
    React.useState(true)

  const [uploading, setUploading] =
    React.useState(false)

  const [deletingId, setDeletingId] =
    React.useState<string | null>(null)

  const [file, setFile] =
    React.useState<File | null>(null)

  const [preview, setPreview] =
    React.useState<string | null>(null)

  const [category, setCategory] =
    React.useState<
      GalleryCategory | ""
    >("")

  const [filter, setFilter] =
    React.useState<
      "ALL" | GalleryCategory
    >("ALL")

  const [uploadProgress, setUploadProgress] =
    React.useState(0)

  const [error, setError] =
    React.useState<string | null>(null)

  const [success, setSuccess] =
    React.useState<string | null>(null)

  // ==========================================================
  // FETCH IMAGES
  // ==========================================================

  const fetchImages =
    React.useCallback(
      async () => {
        try {
          setLoading(true)

          const response =
            await fetch(
              "/api/admin/gallery",
              {
                method: "GET",
                cache: "no-store",
              }
            )

          const result =
            await response.json()

          if (!response.ok) {
            throw new Error(
              result.error ||
                "فشل جلب الصور"
            )
          }

          setImages(
            result.images ?? []
          )
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "فشل جلب الصور"
          )
        } finally {
          setLoading(false)
        }
      },
      []
    )

  React.useEffect(() => {
    fetchImages()
  }, [fetchImages])

  // ==========================================================
  // SELECT FILE
  // ==========================================================

  const handleFileChange = (
    selectedFile: File | null
  ) => {
    setError(null)
    setSuccess(null)

    if (!selectedFile) {
      setFile(null)
      setPreview(null)
      return
    }

    if (
      !allowedImageTypes.includes(
        selectedFile.type
      )
    ) {
      setError(
        "من فضلك اختر صورة PNG أو JPG أو WEBP"
      )

      setFile(null)
      setPreview(null)
      return
    }

    if (
      selectedFile.size >
      MAX_IMAGE_SIZE
    ) {
      setError(
        "حجم الصورة لا يمكن أن يتجاوز 5MB"
      )

      setFile(null)
      setPreview(null)
      return
    }

    setFile(selectedFile)

    const previewUrl =
      URL.createObjectURL(
        selectedFile
      )

    setPreview(previewUrl)
  }

  // ==========================================================
  // GET PRESIGNED URL
  // ==========================================================

  const getPresignedUpload =
    async (
      selectedFile: File
    ) => {
      const response =
        await fetch(
          "/api/s3/upload",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              fileName:
                selectedFile.name,
              contentType:
                selectedFile.type,
              size:
                selectedFile.size,
              isImage: true,
            }),
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            "فشل إنشاء رابط رفع الصورة"
        )
      }

      if (
        !result.presignedUrl ||
        !result.key
      ) {
        throw new Error(
          "بيانات رفع الصورة غير مكتملة"
        )
      }

      return {
        presignedUrl:
          result.presignedUrl as string,
        key:
          result.key as string,
      }
    }

  // ==========================================================
  // UPLOAD TO S3 WITH PROGRESS
  // ==========================================================

  const uploadToS3 = (
    selectedFile: File,
    presignedUrl: string
  ): Promise<void> => {
    return new Promise(
      (
        resolve,
        reject
      ) => {
        const xhr =
          new XMLHttpRequest()

        xhr.open(
          "PUT",
          presignedUrl
        )

        xhr.setRequestHeader(
          "Content-Type",
          selectedFile.type
        )

        xhr.upload.onprogress =
          (event) => {
            if (
              event.lengthComputable
            ) {
              const percent =
                Math.round(
                  (event.loaded /
                    event.total) *
                    100
                )

              setUploadProgress(
                percent
              )
            }
          }

        xhr.onload = () => {
          if (
            xhr.status >= 200 &&
            xhr.status < 300
          ) {
            setUploadProgress(100)
            resolve()
          } else {
            reject(
              new Error(
                `فشل رفع الصورة إلى S3 (${xhr.status})`
              )
            )
          }
        }

        xhr.onerror = () => {
          reject(
            new Error(
              "حدث خطأ أثناء الاتصال بـ S3"
            )
          )
        }

        xhr.onabort = () => {
          reject(
            new Error(
              "تم إلغاء رفع الصورة"
            )
          )
        }

        xhr.send(selectedFile)
      }
    )
  }

  // ==========================================================
  // UPLOAD IMAGE
  // ==========================================================

  const handleUpload =
    async () => {
      if (uploading) return

      setError(null)
      setSuccess(null)

      if (!file) {
        setError(
          "من فضلك اختر صورة أولاً"
        )
        return
      }

      if (!category) {
        setError(
          "من فضلك اختر تصنيف الصورة"
        )
        return
      }

      let uploadedKey: string | null =
        null

      try {
        setUploading(true)
        setUploadProgress(0)

        // ====================================================
        // STEP 1
        // GET PRESIGNED URL
        // ====================================================

        const {
          presignedUrl,
          key,
        } =
          await getPresignedUpload(
            file
          )

        uploadedKey = key

        // ====================================================
        // STEP 2
        // UPLOAD TO S3
        // ====================================================

        await uploadToS3(
          file,
          presignedUrl
        )

        // ====================================================
        // STEP 3
        // OBJECT URL
        // ====================================================

        const objectUrl =
          new URL(
            presignedUrl
          )

        objectUrl.search = ""
        objectUrl.hash = ""

        // ====================================================
        // STEP 4
        // SAVE DATABASE
        // ====================================================

        const response =
          await fetch(
            "/api/admin/gallery",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                key,
                url:
                  objectUrl.toString(),
                category,
              }),
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل حفظ الصورة"
          )
        }

        // ====================================================
        // SUCCESS
        // ====================================================

        setImages(
          (previous) => [
            result.image,
            ...previous,
          ]
        )

        setFile(null)
        setPreview(null)
        setCategory("")
        setUploadProgress(0)

        setSuccess(
          "تم رفع الصورة وإضافتها إلى المعرض بنجاح"
        )
      } catch (error) {
        // ====================================================
        // CLEANUP S3 IF DATABASE SAVE FAILED
        // ====================================================

        if (uploadedKey) {
          try {
            await fetch(
              "/api/s3/delete",
              {
                method: "DELETE",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  key: uploadedKey,
                }),
              }
            )
          } catch (
            cleanupError
          ) {
            console.error(
              "S3 cleanup failed:",
              cleanupError
            )
          }
        }

        setError(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء رفع الصورة"
        )
      } finally {
        setUploading(false)
      }
    }

  // ==========================================================
  // DELETE IMAGE
  // ==========================================================

  const handleDelete =
    async (
      image: GalleryImage
    ) => {
      if (deletingId) return

      const confirmed =
        window.confirm(
          `هل أنت متأكد من حذف هذه الصورة؟\nسيتم حذفها نهائيًا من S3.`
        )

      if (!confirmed) {
        return
      }

      try {
        setDeletingId(image.id)
        setError(null)
        setSuccess(null)

        const response =
          await fetch(
            `/api/admin/gallery/${image.id}`,
            {
              method: "DELETE",
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              "فشل حذف الصورة"
          )
        }

        setImages(
          (previous) =>
            previous.filter(
              (item) =>
                item.id !==
                image.id
            )
        )

        setSuccess(
          "تم حذف الصورة بنجاح"
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "فشل حذف الصورة"
        )
      } finally {
        setDeletingId(null)
      }
    }

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredImages =
    filter === "ALL"
      ? images
      : images.filter(
          (image) =>
            image.category ===
            filter
        )

  // ==========================================================
  // CLEAR PREVIEW
  // ==========================================================

  const clearSelectedFile = () => {
    setFile(null)
    setPreview(null)
    setUploadProgress(0)
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      dir="rtl"
      className="
        min-h-full
        bg-muted/[0.18]
        px-1
        pb-12
      "
    >
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="mb-8">
        <div>
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                size-11
                items-center
                justify-center
                rounded-2xl
                bg-red-500/10
                text-red-500
              "
            >
              <ImageIcon className="size-5" />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-black
                  tracking-tight
                "
              >
                معرض الصور
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                إدارة صور الحفلات والرحلات والكورسات
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* MESSAGES */}
      {/* ====================================================== */}

      {error && (
        <div
          className="
            mb-6
            flex
            items-center
            justify-between
            gap-3
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/5
            px-4
            py-3
            text-sm
            text-red-600
            dark:text-red-400
          "
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
            className="opacity-70 hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {success && (
        <div
          className="
            mb-6
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-emerald-500/20
            bg-emerald-500/5
            px-4
            py-3
            text-sm
            text-emerald-600
            dark:text-emerald-400
          "
        >
          <CheckCircle2 className="size-4" />

          <span>{success}</span>
        </div>
      )}

      {/* ====================================================== */}
      {/* UPLOAD SECTION */}
      {/* ====================================================== */}

      <section
        className="
          mb-10
          rounded-3xl
          border
          border-border/60
          bg-background
          p-5
          shadow-[0_10px_40px_rgba(0,0,0,0.04)]
          sm:p-7
        "
      >
        <div
          className="
            mb-6
            flex
            items-center
            gap-3
          "
        >
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
            <Upload className="size-5" />
          </div>

          <div>
            <h2 className="font-black">
              إضافة صورة جديدة
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              اختر التصنيف ثم ارفع الصورة
            </p>
          </div>
        </div>

        <div
          className="
            grid
            gap-6
            lg:grid-cols-[1fr_320px]
          "
        >
          {/* ================================================== */}
          {/* LEFT */}
          {/* ================================================== */}

          <div className="space-y-5">
            {/* CATEGORY */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                "
              >
                تصنيف الصورة
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target
                      .value as GalleryCategory
                  )
                }
                disabled={uploading}
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
                  transition
                  focus:border-red-500
                  focus:ring-2
                  focus:ring-red-500/10
                "
              >
                <option value="">
                  اختر تصنيف الصورة
                </option>

                <option value="GRADUATION">
                  حفلات التخرج
                </option>

                <option value="TRIPS">
                  الرحلات
                </option>

                <option value="COURSES">
                  الكورسات
                </option>
              </select>
            </div>

            {/* FILE INPUT */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                "
              >
                الصورة
              </label>

              <label
                className={`
                  flex
                  min-h-36
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-dashed
                  px-5
                  py-7
                  text-center
                  transition

                  ${
                    uploading
                      ? "cursor-not-allowed opacity-60"
                      : "border-border hover:border-red-500/40 hover:bg-red-500/[0.02]"
                  }
                `}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) =>
                    handleFileChange(
                      event.target
                        .files?.[0] ??
                        null
                    )
                  }
                />

                <div
                  className="
                    mb-3
                    flex
                    size-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-500/10
                    text-red-500
                  "
                >
                  <Upload className="size-5" />
                </div>

                <p className="text-sm font-bold">
                  اضغط لاختيار صورة
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  PNG / JPG / WEBP — حتى 5MB
                </p>
              </label>
            </div>

            {/* PROGRESS */}

            {uploading && (
              <div
                className="
                  rounded-2xl
                  border
                  border-red-500/15
                  bg-red-500/[0.03]
                  p-4
                "
              >
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >
                  <span className="font-bold">
                    جاري رفع الصورة...
                  </span>

                  <span className="font-black text-red-500">
                    {uploadProgress}%
                  </span>
                </div>

                <div
                  className="
                    h-2
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
                      duration-200
                    "
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* UPLOAD BUTTON */}

            <button
              type="button"
              onClick={handleUpload}
              disabled={
                uploading ||
                !file ||
                !category
              }
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-500
                px-6
                font-bold
                text-white
                shadow-lg
                shadow-red-500/20
                transition-all
                hover:-translate-y-0.5
                hover:bg-red-600
                hover:shadow-xl
                hover:shadow-red-500/20
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:translate-y-0
              "
            >
              {uploading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                <>
                  <Upload className="size-5" />
                  رفع الصورة
                </>
              )}
            </button>
          </div>

          {/* ================================================== */}
          {/* PREVIEW */}
          {/* ================================================== */}

          <div>
            <div
              className="
                mb-2
                text-sm
                font-bold
              "
            >
              معاينة الصورة
            </div>

            <div
              className="
                relative
                flex
                aspect-[4/3]
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-muted/40
              "
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  {!uploading && (
                    <button
                      type="button"
                      onClick={
                        clearSelectedFile
                      }
                      className="
                        absolute
                        left-3
                        top-3
                        flex
                        size-9
                        items-center
                        justify-center
                        rounded-full
                        bg-black/60
                        text-white
                        backdrop-blur
                        transition
                        hover:bg-black/80
                      "
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </>
              ) : (
                <div
                  className="
                    flex
                    w-full
                    flex-col
                    items-center
                    justify-center
                    text-center
                    text-muted-foreground
                  "
                >
                  <ImageIcon className="mb-3 size-10 opacity-30" />

                  <span className="text-sm font-medium">
                    لم يتم اختيار صورة
                  </span>
                </div>
              )}
            </div>

            {file && (
              <div
                className="
                  mt-3
                  rounded-xl
                  bg-muted/50
                  px-3
                  py-2
                  text-xs
                  text-muted-foreground
                "
              >
                <p className="truncate font-medium">
                  {file.name}
                </p>

                <p className="mt-1">
                  {(
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* GALLERY */}
      {/* ====================================================== */}

      <section>
        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2 className="text-xl font-black">
              جميع الصور
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {images.length} صورة في المعرض
            </p>
          </div>

          {/* FILTER */}

          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-border
              bg-background
              p-1
            "
          >
            <div className="px-2 text-muted-foreground">
              <Filter className="size-4" />
            </div>

            {[
              {
                value: "ALL",
                label: "الكل",
              },
              {
                value:
                  "GRADUATION",
                label: "الحفلات",
              },
              {
                value: "TRIPS",
                label: "الرحلات",
              },
              {
                value: "COURSES",
                label: "الكورسات",
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setFilter(
                    item.value as
                      | "ALL"
                      | GalleryCategory
                  )
                }
                className={`
                  rounded-lg
                  px-3
                  py-2
                  text-xs
                  font-bold
                  transition

                  ${
                    filter ===
                    item.value
                      ? "bg-red-500 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==================================================== */}
        {/* LOADING */}
        {/* ==================================================== */}

        {loading ? (
          <div
            className="
              flex
              min-h-72
              items-center
              justify-center
              rounded-3xl
              border
              border-border
              bg-background
            "
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-7 animate-spin text-red-500" />

              <span className="text-sm text-muted-foreground">
                جاري تحميل الصور...
              </span>
            </div>
          </div>
        ) : filteredImages.length ===
          0 ? (
          <div
            className="
              flex
              min-h-72
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-dashed
              border-border
              bg-background
              text-center
            "
          >
            <div
              className="
                mb-4
                flex
                size-16
                items-center
                justify-center
                rounded-2xl
                bg-red-500/10
                text-red-500
              "
            >
              <ImageIcon className="size-7" />
            </div>

            <h3 className="font-black">
              لا توجد صور
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              ابدأ بإضافة أول صورة إلى المعرض
            </p>
          </div>
        ) : (
          /* ================================================== */
          /* IMAGE GRID */
          /* ================================================== */

          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
            "
          >
            {filteredImages.map(
              (image) => (
                <article
                  key={image.id}
                  className="
                    group
                    overflow-hidden
                    rounded-3xl
                    border
                    border-border/60
                    bg-background
                    shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_20px_50px_rgba(0,0,0,0.09)]
                  "
                >
                  {/* IMAGE */}

                  <div
                    className="
                      relative
                      aspect-[4/3]
                      overflow-hidden
                      bg-muted
                    "
                  >
                    <img
                      src={image.url}
                      alt={
                        categoryLabels[
                          image.category
                        ]
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />

                    {/* CATEGORY */}

                    <div
                      className="
                        absolute
                        right-3
                        top-3
                        rounded-full
                        border
                        border-white/20
                        bg-black/55
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-white
                        backdrop-blur-md
                      "
                    >
                      {
                        categoryLabels[
                          image.category
                        ]
                      }
                    </div>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          image
                        )
                      }
                      disabled={
                        deletingId ===
                        image.id
                      }
                      className="
                        absolute
                        left-3
                        top-3
                        flex
                        size-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-500/90
                        text-white
                        opacity-0
                        shadow-lg
                        backdrop-blur
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        hover:bg-red-600
                        disabled:cursor-not-allowed
                        disabled:opacity-100
                      "
                      aria-label="حذف الصورة"
                    >
                      {deletingId ===
                      image.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  </div>

                  {/* INFO */}

                  <div className="p-4">
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          text-xs
                          font-bold
                          text-muted-foreground
                        "
                      >
                        صورة المعرض
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            image
                          )
                        }
                        disabled={
                          deletingId ===
                          image.id
                        }
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-xs
                          font-bold
                          text-red-500
                          transition
                          hover:text-red-600
                          disabled:opacity-50
                          sm:hidden
                        "
                      >
                        {deletingId ===
                        image.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}

                        حذف
                      </button>
                    </div>

                    <p
                      className="
                        mt-2
                        truncate
                        text-xs
                        text-muted-foreground
                      "
                    >
                      {new Date(
                        image.createdAt
                      ).toLocaleDateString(
                        "ar-EG"
                      )}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  )
}

