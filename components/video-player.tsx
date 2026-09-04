
"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

// ============================================================
// PROPS
// ============================================================

type VideoPlayerProps = {
  src: string
  title?: string

  courseId: string
  chapterId: string
  lessonId: string
}

// ============================================================
// TYPES
// ============================================================

type LessonProgress = {
  progress: number
  watchedSeconds: number
  completed: boolean
  completedAt: string | null
}

// ============================================================
// VIDEO PLAYER
// ============================================================

export default function VideoPlayer({
  src,
  title = "Lesson video",
  courseId,
  chapterId,
  lessonId,
}: VideoPlayerProps) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null)

  const saveTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null)

  const lastSavedProgressRef =
    useRef(0)

  const [progress, setProgress] =
    useState<LessonProgress>({
      progress: 0,
      watchedSeconds: 0,
      completed: false,
      completedAt: null,
    })

  const [loadingProgress, setLoadingProgress] =
    useState(true)

  const [savingProgress, setSavingProgress] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  // ==========================================================
  // VALIDATE IDS
  // ==========================================================

  const idsAreValid = Boolean(
    courseId &&
      chapterId &&
      lessonId
  )

  // ==========================================================
  // PROGRESS URL
  // ==========================================================

  const progressUrl = idsAreValid
    ? `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/progress`
    : null

  // ==========================================================
  // LOAD PROGRESS
  // ==========================================================

  const loadProgress =
    useCallback(async () => {
      if (!progressUrl) {
        setLoadingProgress(false)

        setError(
          "معرف الفصل غير موجود"
        )

        return
      }

      try {
        setLoadingProgress(true)
        setError(null)

        const response =
          await fetch(
            progressUrl,
            {
              method: "GET",
              cache: "no-store",
            }
          )

        let data: {
          error?: string
          progress?: LessonProgress
        } = {}

        try {
          data =
            await response.json()
        } catch {
          // Ignore invalid JSON
        }

        if (!response.ok) {
          throw new Error(
            data?.error ||
              `فشل جلب التقدم (${response.status})`
          )
        }

        if (data.progress) {
          setProgress(
            data.progress
          )

          lastSavedProgressRef.current =
            data.progress.progress

          // ====================================================
          // RESTORE VIDEO POSITION
          // ====================================================

          const restorePosition =
            data.progress
              .watchedSeconds

          if (
            restorePosition > 0
          ) {
            const video =
              videoRef.current

            if (video) {
              const restore =
                () => {
                  if (
                    Number.isFinite(
                      video.duration
                    ) &&
                    video.duration > 0 &&
                    restorePosition <
                      video.duration
                  ) {
                    video.currentTime =
                      restorePosition
                  }
                }

              if (
                Number.isFinite(
                  video.duration
                ) &&
                video.duration > 0
              ) {
                restore()
              } else {
                video.addEventListener(
                  "loadedmetadata",
                  restore,
                  {
                    once: true,
                  }
                )
              }
            }
          }
        }
      } catch (error) {
        console.error(
          "Load lesson progress error:",
          error
        )

        setError(
          error instanceof Error
            ? error.message
            : "تعذر تحميل تقدم الدرس"
        )
      } finally {
        setLoadingProgress(false)
      }
    }, [progressUrl])

  // ==========================================================
  // SAVE PROGRESS
  // ==========================================================

  const saveProgress =
    useCallback(
      async (
        video?: HTMLVideoElement
      ) => {
        if (!progressUrl) {
          return
        }

        const currentVideo =
          video ||
          videoRef.current

        if (!currentVideo) {
          return
        }

        const duration =
          currentVideo.duration

        const currentTime =
          currentVideo.currentTime

        if (
          !Number.isFinite(
            duration
          ) ||
          duration <= 0
        ) {
          return
        }

        if (
          !Number.isFinite(
            currentTime
          ) ||
          currentTime < 0
        ) {
          return
        }

        const calculatedProgress =
          Math.min(
            100,
            Math.max(
              0,
              (currentTime /
                duration) *
                100
            )
          )

        const roundedProgress =
          Math.round(
            calculatedProgress
          )

        try {
          setSavingProgress(true)

          const response =
            await fetch(
              progressUrl,
              {
                method: "PUT",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  progress:
                    roundedProgress,

                  watchedSeconds:
                    Math.floor(
                      currentTime
                    ),
                }),
              }
            )

          let data: {
            error?: string
            progress?: LessonProgress
          } = {}

          try {
            data =
              await response.json()
          } catch {
            // Ignore invalid JSON
          }

          if (!response.ok) {
            throw new Error(
              data?.error ||
                `فشل حفظ التقدم (${response.status})`
            )
          }

          if (data.progress) {
            setProgress(
              data.progress
            )

            lastSavedProgressRef.current =
              data.progress.progress
          } else {
            setProgress(
              (previous) => ({
                ...previous,

                progress:
                  roundedProgress,

                watchedSeconds:
                  Math.floor(
                    currentTime
                  ),

                completed:
                  previous.completed ||
                  roundedProgress >=
                    90,
              })
            )

            lastSavedProgressRef.current =
              roundedProgress
          }
        } catch (error) {
          console.error(
            "Save lesson progress error:",
            error
          )
        } finally {
          setSavingProgress(false)
        }
      },
      [progressUrl]
    )

  // ==========================================================
  // SCHEDULE SAVE
  // ==========================================================

  const scheduleSave =
    useCallback(
      (
        video: HTMLVideoElement
      ) => {
        if (
          saveTimeoutRef.current
        ) {
          clearTimeout(
            saveTimeoutRef.current
          )
        }

        saveTimeoutRef.current =
          setTimeout(() => {
            saveProgress(video)
          }, 3000)
      },
      [saveProgress]
    )

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      if (
        saveTimeoutRef.current
      ) {
        clearTimeout(
          saveTimeoutRef.current
        )
      }
    }
  }, [])

  // ==========================================================
  // TIME UPDATE
  // ==========================================================

  const handleTimeUpdate =
    useCallback(() => {
      const video =
        videoRef.current

      if (!video) {
        return
      }

      if (
        !Number.isFinite(
          video.duration
        ) ||
        video.duration <= 0
      ) {
        return
      }

      const currentProgress =
        Math.min(
          100,
          Math.max(
            0,
            (video.currentTime /
              video.duration) *
              100
          )
        )

      const roundedProgress =
        Math.round(
          currentProgress
        )

      setProgress(
        (previous) => ({
          ...previous,

          progress:
            roundedProgress,

          watchedSeconds:
            Math.floor(
              video.currentTime
            ),

          completed:
            previous.completed ||
            roundedProgress >= 90,
        })
      )

      // ========================================================
      // SAVE WHEN PROGRESS CHANGES
      // ========================================================

      if (
        Math.abs(
          roundedProgress -
            lastSavedProgressRef.current
        ) >= 1
      ) {
        scheduleSave(video)
      }
    }, [scheduleSave])

  // ==========================================================
  // VIDEO ENDED
  // ==========================================================

  const handleEnded =
    useCallback(() => {
      const video =
        videoRef.current

      if (!video) {
        return
      }

      saveProgress(video)

      setProgress(
        (previous) => ({
          ...previous,

          progress: 100,

          watchedSeconds:
            Math.floor(
              video.duration
            ),

          completed: true,
        })
      )
    }, [saveProgress])

  // ==========================================================
  // PAUSE
  // ==========================================================

  const handlePause =
    useCallback(() => {
      const video =
        videoRef.current

      if (!video) {
        return
      }

      saveProgress(video)
    }, [saveProgress])

  // ==========================================================
  // NO VIDEO
  // ==========================================================

  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center bg-zinc-950 px-6">
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
            ⚠️
          </div>

          <p className="mt-5 text-lg font-black">
            تعذر تشغيل الفيديو
          </p>

          <p className="mt-2 text-sm text-white/50">
            لم يتم العثور على رابط الفيديو.
          </p>
        </div>
      </div>
    )
  }

  // ==========================================================
  // VIDEO
  // ==========================================================

  return (
    <div className="relative aspect-video w-full bg-black">
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        preload="metadata"
        playsInline
        controlsList="nodownload"
        title={title}
        onTimeUpdate={
          handleTimeUpdate
        }
        onPause={handlePause}
        onEnded={handleEnded}
        onContextMenu={(event) => {
          event.preventDefault()
        }}
      >
        <source
          src={src}
          type="video/mp4"
        />

        متصفحك لا يدعم تشغيل الفيديو.
      </video>

      {/* ====================================================== */}
      {/* PROGRESS BAR */}
      {/* ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-1
          bg-white/10
        "
      >
        <div
          className="
            h-full
            bg-red-500
            transition-[width]
            duration-300
          "
          style={{
            width: `${progress.progress}%`,
          }}
        />
      </div>

      {/* ====================================================== */}
      {/* LOADING */}
      {/* ====================================================== */}

      {loadingProgress && (
        <div
          className="
            pointer-events-none
            absolute
            right-3
            top-3
            rounded-lg
            bg-black/60
            px-3
            py-1.5
            text-[10px]
            font-bold
            text-white
            backdrop-blur
          "
        >
          جاري تحميل تقدمك...
        </div>
      )}

      {/* ====================================================== */}
      {/* SAVING */}
      {/* ====================================================== */}

      {!loadingProgress &&
        savingProgress && (
          <div
            className="
              pointer-events-none
              absolute
              left-3
              top-3
              rounded-lg
              bg-black/60
              px-3
              py-1.5
              text-[10px]
              font-bold
              text-white
              backdrop-blur
            "
          >
            جاري حفظ التقدم...
          </div>
        )}

      {/* ====================================================== */}
      {/* COMPLETED */}
      {/* ====================================================== */}

      {progress.completed && (
        <div
          className="
            pointer-events-none
            absolute
            left-3
            top-3
            rounded-lg
            bg-green-600/90
            px-3
            py-1.5
            text-[10px]
            font-black
            text-white
            shadow-lg
          "
        >
          ✓ مكتمل
        </div>
      )}

      {/* ====================================================== */}
      {/* ERROR */}
      {/* ====================================================== */}

      {error && (
        <div
          className="
            pointer-events-none
            absolute
            bottom-4
            left-4
            right-4
            rounded-xl
            bg-red-950/80
            px-4
            py-2
            text-center
            text-xs
            font-bold
            text-red-200
            backdrop-blur
          "
        >
          {error}
        </div>
      )}
    </div>
  )
}
















