
// "use client"

// import { useCallback, useEffect, useRef, useState } from "react"
// import { useDropzone } from "react-dropzone"
// import {
//   UploadCloud,
//   X,
//   Image as ImageIcon,
//   Video,
//   FileCheck2,
//   AlertCircle,
//   CheckCircle2,
//   Loader2,
// } from "lucide-react"

// interface FileUploadProps {
//   value?: File | null
//   onFileChange?: (file: File | null) => void
//   onUploadComplete?: (key: string, url: string) => void
//   onDeleteComplete?: () => void
//   maxSize?: number
// }

// interface FileState {
//   uploading: boolean
//   deleting: boolean
//   progress: number
//   error: boolean
//   errorMessage?: string
// }

// const acceptedFiles = {
//   "image/png": [".png"],
//   "image/jpeg": [".jpg", ".jpeg"],
//   "image/webp": [".webp"],
//   "video/mp4": [".mp4"],
//   "video/webm": [".webm"],
//   "video/quicktime": [".mov"],
// }

// export default function FileUpload({
//   value = null,
//   onFileChange,
//   onUploadComplete,
//   onDeleteComplete,
//   maxSize = 50 * 1024 * 1024,
// }: FileUploadProps) {
//   const [file, setFile] = useState<File | null>(value)
//   const [preview, setPreview] = useState<string | null>(null)

//   const uploadedKeyRef = useRef<string | null>(null)

//   const [fileState, setFileState] = useState<FileState>({
//     uploading: false,
//     deleting: false,
//     progress: 0,
//     error: false,
//   })

//   // ============================================================
//   // SYNC WITH PARENT
//   // ============================================================

//   useEffect(() => {
//     setFile(value ?? null)
//   }, [value])

//   // ============================================================
//   // PREVIEW
//   // ============================================================

//   useEffect(() => {
//     if (!file) {
//       setPreview(null)
//       return
//     }

//     const objectUrl = URL.createObjectURL(file)

//     setPreview(objectUrl)

//     return () => {
//       URL.revokeObjectURL(objectUrl)
//     }
//   }, [file])

//   // ============================================================
//   // DELETE FROM TIGRIS
//   // ============================================================

//   const deleteFromTigris = async (key: string) => {
//     const response = await fetch("/api/s3/delete", {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         key,
//       }),
//     })

//     let data: any = null

//     try {
//       data = await response.json()
//     } catch {
//       data = null
//     }

//     if (!response.ok) {
//       throw new Error(
//         data?.error ||
//           "فشل حذف الملف من التخزين"
//       )
//     }

//     return true
//   }

//   // ============================================================
//   // UPLOAD TO TIGRIS
//   // ============================================================

//   const uploadFile = async (
//     selectedFile: File
//   ) => {
//     try {
//       setFileState({
//         uploading: true,
//         deleting: false,
//         progress: 0,
//         error: false,
//         errorMessage: undefined,
//       })

//       // ========================================================
//       // STEP 1
//       // GET PRESIGNED URL
//       // ========================================================

//       const response = await fetch(
//         "/api/s3/upload",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type":
//               "application/json",
//           },
//           body: JSON.stringify({
//             fileName:
//               selectedFile.name,
//             contentType:
//               selectedFile.type,
//             size:
//               selectedFile.size,
//             isImage:
//               selectedFile.type.startsWith(
//                 "image/"
//               ),
//           }),
//         }
//       )

//       let data: any = null

//       try {
//         data = await response.json()
//       } catch {
//         data = null
//       }

//       if (!response.ok) {
//         throw new Error(
//           data?.error ||
//             "فشل الحصول على رابط الرفع"
//         )
//       }

//       const presignedUrl =
//         data?.presignedUrl

//       const key =
//         data?.key

//       if (
//         !presignedUrl ||
//         !key
//       ) {
//         throw new Error(
//           "الخادم لم يرجع رابط الرفع أو مفتاح الملف"
//         )
//       }

//       // ========================================================
//       // STEP 2
//       // UPLOAD DIRECTLY TO TIGRIS
//       // ========================================================

//       await new Promise<void>(
//         (resolve, reject) => {
//           const xhr =
//             new XMLHttpRequest()

//           // ----------------------------
//           // Progress
//           // ----------------------------

//           xhr.upload.addEventListener(
//             "progress",
//             (event) => {
//               if (
//                 !event.lengthComputable
//               ) {
//                 return
//               }

//               const progress =
//                 Math.min(
//                   100,
//                   Math.round(
//                     (event.loaded /
//                       event.total) *
//                       100
//                   )
//                 )

//               setFileState(
//                 (prev) => ({
//                   ...prev,
//                   progress,
//                 })
//               )
//             }
//           )

//           // ----------------------------
//           // HTTP response
//           // ----------------------------

//           xhr.addEventListener(
//             "load",
//             () => {
//               if (
//                 xhr.status >= 200 &&
//                 xhr.status < 300
//               ) {
//                 resolve()
//                 return
//               }

//               reject(
//                 new Error(
//                   `فشل رفع الملف إلى Tigris (${xhr.status})`
//                 )
//               )
//             }
//           )

//           // ----------------------------
//           // Network error
//           // ----------------------------

//           xhr.addEventListener(
//             "error",
//             () => {
//               reject(
//                 new Error(
//                   "حدث خطأ في الاتصال بـ Tigris"
//                 )
//               )
//             }
//           )

//           // ----------------------------
//           // Abort
//           // ----------------------------

//           xhr.addEventListener(
//             "abort",
//             () => {
//               reject(
//                 new Error(
//                   "تم إلغاء رفع الملف"
//                 )
//               )
//             }
//           )

//           // ----------------------------
//           // PUT
//           // ----------------------------

//           xhr.open(
//             "PUT",
//             presignedUrl,
//             true
//           )

//           xhr.setRequestHeader(
//             "Content-Type",
//             selectedFile.type
//           )

//           xhr.send(
//             selectedFile
//           )
//         }
//       )

//       // ========================================================
//       // SUCCESS
//       // ========================================================

//       uploadedKeyRef.current = key

//       setFileState({
//         uploading: false,
//         deleting: false,
//         progress: 100,
//         error: false,
//         errorMessage: undefined,
//       })

//       // presigned URL مؤقت.
//       // نحفظ رابط الـ object نفسه بدون query parameters.
//       const objectUrl =
//         new URL(presignedUrl)

//       objectUrl.search = ""
//       objectUrl.hash = ""

//       onUploadComplete?.(
//         key,
//         objectUrl.toString()
//       )

//       return key
//     } catch (error) {
//       console.error(
//         "Tigris upload error:",
//         error
//       )

//       const message =
//         error instanceof Error
//           ? error.message
//           : "حدث خطأ أثناء رفع الملف"

//       setFileState({
//         uploading: false,
//         deleting: false,
//         progress: 0,
//         error: true,
//         errorMessage: message,
//       })

//       return null
//     }
//   }

//   // ============================================================
//   // DROP
//   // ============================================================

//   const onDrop = useCallback(
//     async (
//       accepted: File[]
//     ) => {
//       const selectedFile =
//         accepted[0]

//       if (!selectedFile) {
//         return
//       }

//       // --------------------------------------------------------
//       // Keep old uploaded key
//       // --------------------------------------------------------

//       const oldKey =
//         uploadedKeyRef.current

//       // --------------------------------------------------------
//       // Reset UI
//       // --------------------------------------------------------

//       setFileState({
//         uploading: true,
//         deleting: false,
//         progress: 0,
//         error: false,
//         errorMessage: undefined,
//       })

//       setFile(
//         selectedFile
//       )

//       onFileChange?.(
//         selectedFile
//       )

//       // --------------------------------------------------------
//       // Upload new file
//       // --------------------------------------------------------

//       const newKey =
//         await uploadFile(
//           selectedFile
//         )

//       // --------------------------------------------------------
//       // If new upload succeeded,
//       // delete old file from Tigris
//       // --------------------------------------------------------

//       if (
//         newKey &&
//         oldKey &&
//         oldKey !== newKey
//       ) {
//         try {
//           await deleteFromTigris(
//             oldKey
//           )

//           console.log(
//             "Old file deleted:",
//             oldKey
//           )
//         } catch (error) {
//           console.error(
//             "Failed to delete old file:",
//             error
//           )
//         }
//       }
//     },
//     [onFileChange, onUploadComplete]
//   )

//   // ============================================================
//   // DROPZONE
//   // ============================================================

//   const {
//     getRootProps,
//     getInputProps,
//     isDragActive,
//     isDragReject,
//     fileRejections,
//     open,
//   } = useDropzone({
//     onDrop,
//     accept: acceptedFiles,
//     maxSize,
//     multiple: false,
//     noClick: false,
//   })

//   // ============================================================
//   // REMOVE FILE
//   // ============================================================

//   const removeFile = async () => {
//     if (
//       fileState.uploading ||
//       fileState.deleting
//     ) {
//       return
//     }

//     const key =
//       uploadedKeyRef.current

//     if (key) {
//       try {
//         setFileState(
//           (prev) => ({
//             ...prev,
//             deleting: true,
//             error: false,
//             errorMessage:
//               undefined,
//           })
//         )

//         await deleteFromTigris(
//           key
//         )

//         console.log(
//           "File deleted from Tigris:",
//           key
//         )

//         uploadedKeyRef.current =
//           null
//       } catch (error) {
//         console.error(
//           "Delete file error:",
//           error
//         )

//         const message =
//           error instanceof Error
//             ? error.message
//             : "فشل حذف الملف"

//         setFileState({
//           uploading: false,
//           deleting: false,
//           progress: 100,
//           error: true,
//           errorMessage:
//             message,
//         })

//         return
//       }
//     }

//     setFile(null)
//     setPreview(null)

//     setFileState({
//       uploading: false,
//       deleting: false,
//       progress: 0,
//       error: false,
//       errorMessage:
//         undefined,
//     })

//     onFileChange?.(
//       null
//     )

//     onDeleteComplete?.()
//   }

//   // ============================================================
//   // FILE TYPE
//   // ============================================================

//   const isImage =
//     file?.type.startsWith(
//       "image/"
//     ) ?? false

//   const isVideo =
//     file?.type.startsWith(
//       "video/"
//     ) ?? false

//   // ============================================================
//   // FILE SIZE
//   // ============================================================

//   const formatFileSize = (
//     size: number
//   ) => {
//     if (size < 1024) {
//       return `${size} B`
//     }

//     if (
//       size <
//       1024 * 1024
//     ) {
//       return `${(
//         size / 1024
//       ).toFixed(0)} KB`
//     }

//     return `${(
//       size /
//       1024 /
//       1024
//     ).toFixed(2)} MB`
//   }

//   // ============================================================
//   // UI
//   // ============================================================

//   return (
//     <div
//       dir="rtl"
//       className="w-full space-y-3"
//     >
//       {!file ? (
//         <>
//           {/* ==================================================
//               DROPZONE
//           =================================================== */}

//           <div
//             {...getRootProps()}
//             className={`
//               group relative flex min-h-64
//               cursor-pointer flex-col
//               items-center justify-center
//               overflow-hidden rounded-3xl
//               border-2 border-dashed
//               p-8 text-center
//               transition-all duration-300

//               ${
//                 isDragActive
//                   ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10"
//                   : "border-border/60 bg-muted/10 hover:border-red-500/40 hover:bg-red-500/[0.03]"
//               }

//               ${
//                 isDragReject
//                   ? "border-red-500 bg-red-500/10"
//                   : ""
//               }
//             `}
//           >
//             <input
//               {...getInputProps()}
//             />

//             <div
//               className="
//                 pointer-events-none
//                 absolute -top-20 left-1/2
//                 h-40 w-40
//                 -translate-x-1/2
//                 rounded-full
//                 bg-red-500/10
//                 blur-3xl
//                 transition-all
//                 duration-500
//                 group-hover:bg-red-500/20
//               "
//             />

//             <div
//               className="
//                 relative z-10
//                 mb-5 flex size-16
//                 items-center justify-center
//                 rounded-2xl
//                 bg-gradient-to-br
//                 from-red-500
//                 to-rose-600
//                 text-white
//                 shadow-xl
//                 shadow-red-500/20
//                 transition-all
//                 duration-300
//                 group-hover:-translate-y-1
//                 group-hover:scale-105
//               "
//             >
//               <UploadCloud className="size-8" />
//             </div>

//             {isDragReject ? (
//               <div className="relative z-10">
//                 <p className="font-bold text-red-500">
//                   نوع الملف غير مدعوم
//                 </p>

//                 <p className="mt-2 text-sm text-muted-foreground">
//                   اختر صورة أو فيديو من الأنواع المسموحة
//                 </p>
//               </div>
//             ) : isDragActive ? (
//               <div className="relative z-10">
//                 <p className="text-base font-black text-red-500">
//                   أفلت الملف هنا
//                 </p>

//                 <p className="mt-2 text-sm text-muted-foreground">
//                   سيتم رفع الملف مباشرة إلى Tigris
//                 </p>
//               </div>
//             ) : (
//               <div className="relative z-10">
//                 <p className="text-base font-black">
//                   اسحب الصورة أو الفيديو هنا
//                 </p>

//                 <p className="mt-2 text-sm text-muted-foreground">
//                   أو{" "}
//                   <span className="font-bold text-red-500">
//                     اضغط لاختيار ملف
//                   </span>
//                 </p>
//               </div>
//             )}

//             <div
//               className="
//                 relative z-10 mt-6
//                 flex flex-wrap
//                 items-center justify-center
//                 gap-2
//               "
//             >
//               <span
//                 className="
//                   inline-flex items-center
//                   gap-1.5 rounded-full
//                   border border-border/50
//                   bg-background/70
//                   px-3 py-1.5
//                   text-[11px]
//                   font-semibold
//                   text-muted-foreground
//                 "
//               >
//                 <ImageIcon className="size-3.5" />
//                 PNG / JPG / WEBP
//               </span>

//               <span
//                 className="
//                   inline-flex items-center
//                   gap-1.5 rounded-full
//                   border border-border/50
//                   bg-background/70
//                   px-3 py-1.5
//                   text-[11px]
//                   font-semibold
//                   text-muted-foreground
//                 "
//               >
//                 <Video className="size-3.5" />
//                 MP4 / WEBM / MOV
//               </span>
//             </div>

//             <p
//               className="
//                 relative z-10 mt-3
//                 text-[11px]
//                 text-muted-foreground
//               "
//             >
//               الحد الأقصى لحجم الملف:{" "}
//               {Math.round(
//                 maxSize /
//                   1024 /
//                   1024
//               )}
//               MB
//             </p>
//           </div>

//           {fileRejections.length >
//             0 && (
//             <div
//               className="
//                 flex items-center gap-2
//                 rounded-xl
//                 border border-red-500/20
//                 bg-red-500/5
//                 px-4 py-3
//                 text-xs font-medium
//                 text-red-500
//               "
//             >
//               <AlertCircle className="size-4 shrink-0" />

//               <span>
//                 الملف غير صالح. تأكد من نوع الملف وحجمه.
//               </span>
//             </div>
//           )}
//         </>
//       ) : (
//         /* ======================================================
//            SELECTED FILE
//         ======================================================= */

//         <div
//           className="
//             overflow-hidden
//             rounded-3xl
//             border border-border/50
//             bg-background/60
//             shadow-sm
//             backdrop-blur-xl
//           "
//         >
//           {/* PREVIEW */}

//           <div
//             className="
//               relative overflow-hidden
//               bg-muted/30
//             "
//           >
//             {isImage &&
//             preview ? (
//               <img
//                 src={preview}
//                 alt={file.name}
//                 className="
//                   h-64 w-full
//                   object-cover
//                   sm:h-72
//                 "
//               />
//             ) : isVideo &&
//               preview ? (
//               <video
//                 src={preview}
//                 controls
//                 preload="metadata"
//                 className="
//                   h-64 w-full
//                   bg-black
//                   object-contain
//                   sm:h-72
//                 "
//               />
//             ) : (
//               <div
//                 className="
//                   flex h-64
//                   items-center justify-center
//                   bg-muted/30
//                 "
//               >
//                 <FileCheck2
//                   className="size-16 text-red-500"
//                 />
//               </div>
//             )}

//             <div
//               className="
//                 absolute right-4 top-4
//                 flex items-center gap-2
//                 rounded-full
//                 border border-white/10
//                 bg-black/60
//                 px-3 py-1.5
//                 text-xs font-bold
//                 text-white
//                 backdrop-blur-md
//               "
//             >
//               {isImage ? (
//                 <>
//                   <ImageIcon className="size-3.5" />
//                   صورة
//                 </>
//               ) : (
//                 <>
//                   <Video className="size-3.5" />
//                   فيديو
//                 </>
//               )}
//             </div>

//             <button
//               type="button"
//               onClick={removeFile}
//               disabled={
//                 fileState.uploading ||
//                 fileState.deleting
//               }
//               className="
//                 absolute left-4 top-4
//                 flex size-9
//                 items-center justify-center
//                 rounded-full
//                 bg-black/60
//                 text-white
//                 backdrop-blur-md
//                 transition-all
//                 hover:scale-110
//                 hover:bg-red-500
//                 disabled:cursor-not-allowed
//                 disabled:opacity-50
//               "
//               aria-label="حذف الملف"
//             >
//               {fileState.deleting ? (
//                 <Loader2 className="size-4 animate-spin" />
//               ) : (
//                 <X className="size-4" />
//               )}
//             </button>
//           </div>

//           {/* INFO */}

//           <div className="p-5">
//             <div
//               className="
//                 flex items-center gap-4
//               "
//             >
//               <div
//                 className="
//                   flex size-12 shrink-0
//                   items-center justify-center
//                   rounded-2xl
//                   bg-red-500/10
//                   text-red-500
//                 "
//               >
//                 {isImage ? (
//                   <ImageIcon className="size-5" />
//                 ) : (
//                   <Video className="size-5" />
//                 )}
//               </div>

//               <div className="min-w-0 flex-1">
//                 <p
//                   className="
//                     truncate
//                     text-sm font-bold
//                   "
//                   title={file.name}
//                 >
//                   {file.name}
//                 </p>

//                 <div
//                   className="
//                     mt-1 flex
//                     items-center gap-2
//                   "
//                 >
//                   <span className="text-xs text-muted-foreground">
//                     {formatFileSize(
//                       file.size
//                     )}
//                   </span>

//                   <span
//                     className="
//                       size-1 rounded-full
//                       bg-muted-foreground/40
//                     "
//                   />

//                   {fileState.uploading ? (
//                     <span
//                       className="
//                         flex items-center gap-1
//                         text-xs font-medium
//                         text-blue-500
//                       "
//                     >
//                       <Loader2 className="size-3.5 animate-spin" />
//                       جاري الرفع
//                     </span>
//                   ) : fileState.deleting ? (
//                     <span
//                       className="
//                         flex items-center gap-1
//                         text-xs font-medium
//                         text-red-500
//                       "
//                     >
//                       <Loader2 className="size-3.5 animate-spin" />
//                       جاري الحذف
//                     </span>
//                   ) : fileState.error ? (
//                     <span
//                       className="
//                         flex items-center gap-1
//                         text-xs font-medium
//                         text-red-500
//                       "
//                     >
//                       <AlertCircle className="size-3.5" />
//                       فشل العملية
//                     </span>
//                   ) : fileState.progress ===
//                     100 ? (
//                     <span
//                       className="
//                         flex items-center gap-1
//                         text-xs font-medium
//                         text-emerald-500
//                       "
//                     >
//                       <CheckCircle2 className="size-3.5" />
//                       تم الرفع
//                     </span>
//                   ) : null}
//                 </div>
//               </div>

//               {!fileState.uploading &&
//                 !fileState.deleting && (
//                   <button
//                     type="button"
//                     onClick={open}
//                     className="
//                       hidden shrink-0
//                       rounded-xl
//                       border border-border/60
//                       px-4 py-2
//                       text-xs font-bold
//                       transition
//                       hover:border-red-500/30
//                       hover:bg-red-500/5
//                       sm:block
//                     "
//                   >
//                     تغيير
//                   </button>
//                 )}
//             </div>

//             {/* PROGRESS */}

//             {fileState.uploading && (
//               <div className="mt-5">
//                 <div
//                   className="
//                     mb-2 flex
//                     items-center
//                     justify-between
//                   "
//                 >
//                   <span className="text-xs font-medium text-muted-foreground">
//                     جاري رفع الملف إلى Tigris...
//                   </span>

//                   <span className="text-sm font-black text-red-500">
//                     {fileState.progress}%
//                   </span>
//                 </div>

//                 <div
//                   className="
//                     h-2.5 w-full
//                     overflow-hidden
//                     rounded-full
//                     bg-muted
//                   "
//                 >
//                   <div
//                     className="
//                       h-full
//                       rounded-full
//                       bg-gradient-to-r
//                       from-red-500
//                       to-rose-600
//                       transition-[width]
//                       duration-200
//                     "
//                     style={{
//                       width: `${fileState.progress}%`,
//                     }}
//                   />
//                 </div>

//                 <p className="mt-2 text-[11px] text-muted-foreground">
//                   يرجى الانتظار حتى يكتمل رفع الفيديو قبل حفظ الدرس
//                 </p>
//               </div>
//             )}

//             {/* ERROR */}

//             {fileState.error && (
//               <div
//                 className="
//                   mt-4
//                   flex flex-col gap-1
//                   rounded-xl
//                   border border-red-500/20
//                   bg-red-500/5
//                   px-4 py-3
//                   text-xs
//                   text-red-500
//                 "
//               >
//                 <div
//                   className="
//                     flex items-center
//                     gap-2 font-medium
//                   "
//                 >
//                   <AlertCircle className="size-4 shrink-0" />

//                   <span>
//                     حدث خطأ أثناء العملية
//                   </span>
//                 </div>

//                 {fileState.errorMessage && (
//                   <span
//                     className="
//                       mr-6 text-[11px]
//                       opacity-80
//                     "
//                   >
//                     {fileState.errorMessage}
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* SUCCESS */}

//             {!fileState.uploading &&
//               !fileState.deleting &&
//               !fileState.error &&
//               fileState.progress ===
//                 100 && (
//                 <div
//                   className="
//                     mt-4
//                     flex items-center gap-2
//                     rounded-xl
//                     border border-emerald-500/20
//                     bg-emerald-500/5
//                     px-4 py-3
//                     text-xs font-medium
//                     text-emerald-500
//                   "
//                 >
//                   <CheckCircle2 className="size-4 shrink-0" />

//                   <span>
//                     تم رفع الملف بنجاح
//                   </span>
//                 </div>
//               )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }





















"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { useDropzone } from "react-dropzone"

import {
  UploadCloud,
  X,
  Image as ImageIcon,
  Video,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"

// ============================================================
// TYPES
// ============================================================

interface FileUploadProps {
  value?: File | null

  onFileChange?: (
    file: File | null
  ) => void

  onUploadComplete?: (
    key: string,
    url: string
  ) => void

  onDeleteComplete?: () => void

  onUploadStateChange?: (
    uploading: boolean,
    progress: number
  ) => void

  maxSize?: number
}

// ============================================================
// ACCEPTED FILES
// ============================================================

const acceptedFiles = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],

  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
}

// ============================================================
// HELPERS
// ============================================================

function getFileFingerprint(file: File) {
  return [
    file.name,
    file.size,
    file.lastModified,
    file.type,
  ].join(":")
}

function getObjectUrlFromPresignedUrl(
  presignedUrl: string
) {
  const objectUrl = new URL(
    presignedUrl
  )

  objectUrl.search = ""
  objectUrl.hash = ""

  return objectUrl.toString()
}

// ============================================================
// COMPONENT
// ============================================================

export default function FileUpload({
  value = null,
  onFileChange,
  onUploadComplete,
  onDeleteComplete,
  onUploadStateChange,
  maxSize = 50 * 1024 * 1024,
}: FileUploadProps) {
  // ==========================================================
  // STATE
  // ==========================================================

  const [file, setFile] =
    useState<File | null>(value)

  const [preview, setPreview] =
    useState<string | null>(null)

  const [uploading, setUploading] =
    useState(false)

  const [progress, setProgress] =
    useState(0)

  const [uploadError, setUploadError] =
    useState<string | null>(null)

  // ==========================================================
  // REFS
  // ==========================================================

  // Key of the file uploaded by THIS component.
  const uploadedKeyRef =
    useRef<string | null>(null)

  // Prevent two uploads at the same time.
  const uploadInProgressRef =
    useRef(false)

  // Prevent uploading exactly the same file twice.
  const uploadedFingerprintRef =
    useRef<string | null>(null)

  // ==========================================================
  // SYNC VALUE
  // ==========================================================

  useEffect(() => {
    setFile(value ?? null)
  }, [value])

  // ==========================================================
  // PREVIEW
  // ==========================================================

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    const previewUrl =
      URL.createObjectURL(file)

    setPreview(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [file])

  // ==========================================================
  // UPLOAD STATE
  // ==========================================================

  const updateUploadState = (
    isUploading: boolean,
    nextProgress: number
  ) => {
    setUploading(isUploading)
    setProgress(nextProgress)

    onUploadStateChange?.(
      isUploading,
      nextProgress
    )
  }

  // ==========================================================
  // DELETE UPLOADED FILE
  // ==========================================================

  const deleteUploadedFile = async (
    key: string
  ) => {
    try {
      const response = await fetch(
        "/api/s3/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            key,
          }),
        }
      )

      if (!response.ok) {
        console.error(
          "Failed to delete uploaded file"
        )
      }
    } catch (error) {
      console.error(
        "Failed to delete uploaded file:",
        error
      )
    }
  }

  // ==========================================================
  // GET PRESIGNED URL
  // ==========================================================

  const getPresignedUpload = async (
    selectedFile: File
  ) => {
    const response = await fetch(
      "/api/s3/upload",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          size: selectedFile.size,
          isImage:
            selectedFile.type.startsWith(
              "image/"
            ),
        }),
      }
    )

    const contentType =
      response.headers.get(
        "content-type"
      ) || ""

    let result: any

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      result = await response.json()
    } else {
      const text =
        await response.text()

      throw new Error(
        `السيرفر رجّع استجابة غير صحيحة (${response.status})`
      )
    }

    if (!response.ok) {
      throw new Error(
        result?.error ||
          "فشل إنشاء رابط رفع الملف"
      )
    }

    if (
      !result?.presignedUrl ||
      !result?.key
    ) {
      throw new Error(
        "بيانات رفع الملف غير مكتملة"
      )
    }

    return {
      presignedUrl:
        result.presignedUrl as string,
      key: result.key as string,
    }
  }

  // ==========================================================
  // XHR UPLOAD WITH PROGRESS
  // ==========================================================

  const uploadWithProgress = (
    selectedFile: File,
    presignedUrl: string
  ): Promise<void> => {
    return new Promise(
      (resolve, reject) => {
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

        xhr.upload.onprogress = (
          event
        ) => {
          if (
            event.lengthComputable
          ) {
            const nextProgress =
              Math.round(
                (event.loaded /
                  event.total) *
                  100
              )

            updateUploadState(
              true,
              nextProgress
            )
          }
        }

        xhr.onload = () => {
          if (
            xhr.status >= 200 &&
            xhr.status < 300
          ) {
            updateUploadState(
              false,
              100
            )

            resolve()
          } else {
            reject(
              new Error(
                `فشل رفع الملف إلى S3 (${xhr.status})`
              )
            )
          }
        }

        xhr.onerror = () => {
          reject(
            new Error(
              "حدث خطأ في الاتصال بـ S3 أثناء رفع الملف"
            )
          )
        }

        xhr.onabort = () => {
          reject(
            new Error(
              "تم إلغاء رفع الملف"
            )
          )
        }

        xhr.send(selectedFile)
      }
    )
  }

  // ==========================================================
  // UPLOAD FILE
  // ==========================================================

  const uploadFile = async (
    selectedFile: File
  ) => {
    if (
      uploadInProgressRef.current
    ) {
      return
    }

    const fingerprint =
      getFileFingerprint(
        selectedFile
      )

    // --------------------------------------------------------
    // SAME FILE ALREADY UPLOADED
    // --------------------------------------------------------

    if (
      uploadedKeyRef.current &&
      uploadedFingerprintRef.current ===
        fingerprint
    ) {
      return
    }

    uploadInProgressRef.current =
      true

    setUploadError(null)

    updateUploadState(
      true,
      0
    )

    try {
      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (
        !selectedFile.type.startsWith(
          "video/"
        ) &&
        !selectedFile.type.startsWith(
          "image/"
        )
      ) {
        throw new Error(
          "نوع الملف غير مدعوم"
        )
      }

      if (
        selectedFile.size > maxSize
      ) {
        throw new Error(
          "حجم الملف أكبر من الحد المسموح"
        )
      }

      // ------------------------------------------------------
      // GET PRESIGNED URL
      // ------------------------------------------------------

      const {
        presignedUrl,
        key,
      } =
        await getPresignedUpload(
          selectedFile
        )

      // ------------------------------------------------------
      // UPLOAD
      // ------------------------------------------------------

      await uploadWithProgress(
        selectedFile,
        presignedUrl
      )

      // ------------------------------------------------------
      // OBJECT URL
      // ------------------------------------------------------

      const objectUrl =
        getObjectUrlFromPresignedUrl(
          presignedUrl
        )

      // ------------------------------------------------------
      // SAVE UPLOADED KEY
      // ------------------------------------------------------

      uploadedKeyRef.current =
        key

      uploadedFingerprintRef.current =
        fingerprint

      // ------------------------------------------------------
      // INFORM PARENT
      // ------------------------------------------------------

      onUploadComplete?.(
        key,
        objectUrl
      )

      updateUploadState(
        false,
        100
      )
    } catch (error) {
      console.error(
        "File upload error:",
        error
      )

      setUploadError(
        error instanceof Error
          ? error.message
          : "فشل رفع الملف"
      )

      updateUploadState(
        false,
        0
      )
    } finally {
      uploadInProgressRef.current =
        false
    }
  }

  // ==========================================================
  // DROP / SELECT
  // ==========================================================

  const onDrop = useCallback(
    async (
      accepted: File[]
    ) => {
      const selectedFile =
        accepted[0]

      if (!selectedFile) {
        return
      }

      setUploadError(null)

      // ------------------------------------------------------
      // Set local state immediately
      // ------------------------------------------------------

      setFile(selectedFile)

      onFileChange?.(
        selectedFile
      )

      // ------------------------------------------------------
      // Upload ONLY HERE
      // ------------------------------------------------------

      await uploadFile(
        selectedFile
      )
    },
    [onFileChange]
  )

  // ==========================================================
  // REMOVE FILE
  // ==========================================================

  const removeFile = async () => {
    if (uploading) {
      return
    }

    const uploadedKey =
      uploadedKeyRef.current

    // --------------------------------------------------------
    // Clear UI first
    // --------------------------------------------------------

    setFile(null)
    setPreview(null)
    setUploadError(null)
    setProgress(0)

    onFileChange?.(null)

    // --------------------------------------------------------
    // Delete only the file uploaded by this component
    // --------------------------------------------------------

    if (uploadedKey) {
      await deleteUploadedFile(
        uploadedKey
      )
    }

    uploadedKeyRef.current =
      null

    uploadedFingerprintRef.current =
      null

    onDeleteComplete?.()

    updateUploadState(
      false,
      0
    )
  }

  // ==========================================================
  // DROPZONE
  // ==========================================================

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: acceptedFiles,
    maxSize,
    multiple: false,
    disabled: uploading,
  })

  // ==========================================================
  // FILE INFO
  // ==========================================================

  const isImage =
    file?.type.startsWith(
      "image/"
    )

  const isVideo =
    file?.type.startsWith(
      "video/"
    )

  const formatFileSize = (
    size: number
  ) => {
    if (
      size <
      1024 * 1024
    ) {
      return `${(
        size / 1024
      ).toFixed(0)} KB`
    }

    if (
      size <
      1024 *
        1024 *
        1024
    ) {
      return `${(
        size /
        1024 /
        1024
      ).toFixed(2)} MB`
    }

    return `${(
      size /
      1024 /
      1024 /
      1024
    ).toFixed(2)} GB`
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full space-y-3">
      {!file ? (
        <>
          {/* ==================================================
              DROP ZONE
              ================================================== */}

          <div
            {...getRootProps()}
            className={`
              group relative flex min-h-64
              cursor-pointer flex-col
              items-center justify-center
              overflow-hidden rounded-3xl
              border-2 border-dashed
              p-8 text-center
              transition-all duration-300

              ${
                isDragActive
                  ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10"
                  : "border-border/60 bg-muted/10 hover:border-red-500/40 hover:bg-red-500/[0.03]"
              }

              ${
                isDragReject
                  ? "border-red-500 bg-red-500/10"
                  : ""
              }

              ${
                uploading
                  ? "pointer-events-none opacity-60"
                  : ""
              }
            `}
          >
            <input
              {...getInputProps()}
            />

            <div
              className="
                pointer-events-none
                absolute -top-20 left-1/2
                h-40 w-40
                -translate-x-1/2
                rounded-full
                bg-red-500/10
                blur-3xl
              "
            />

            <div
              className="
                relative z-10 mb-5
                flex size-16
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br
                from-red-500
                to-rose-600
                text-white
                shadow-xl
                shadow-red-500/20
              "
            >
              {uploading ? (
                <Loader2 className="size-8 animate-spin" />
              ) : (
                <UploadCloud className="size-8" />
              )}
            </div>

            <div className="relative z-10">
              {isDragActive ? (
                <>
                  <p className="text-base font-black text-red-500">
                    أفلت الملف هنا
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    سيتم رفع الملف مباشرة
                  </p>
                </>
              ) : isDragReject ? (
                <>
                  <p className="font-bold text-red-500">
                    نوع الملف غير مدعوم
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    اختر صورة أو فيديو من الأنواع المسموحة
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base font-black">
                    اسحب الصورة أو الفيديو هنا
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    أو{" "}
                    <span className="font-bold text-red-500">
                      اضغط لاختيار ملف
                    </span>
                  </p>
                </>
              )}
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-2">
              <span
                className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  border border-border/50
                  bg-background/70
                  px-3 py-1.5
                  text-[11px]
                  font-semibold
                  text-muted-foreground
                "
              >
                <ImageIcon className="size-3.5" />
                PNG / JPG / WEBP
              </span>

              <span
                className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  border border-border/50
                  bg-background/70
                  px-3 py-1.5
                  text-[11px]
                  font-semibold
                  text-muted-foreground
                "
              >
                <Video className="size-3.5" />
                MP4 / WEBM / MOV
              </span>
            </div>

            <p className="relative z-10 mt-3 text-[11px] text-muted-foreground">
              الحد الأقصى:{" "}
              {maxSize >=
              1024 *
                1024 *
                1024
                ? "5GB"
                : "50MB"}
            </p>
          </div>

          {/* REJECTION */}

          {fileRejections.length >
            0 && (
            <div
              className="
                flex items-center gap-2
                rounded-xl
                border border-red-500/20
                bg-red-500/5
                px-4 py-3
                text-xs font-medium
                text-red-500
              "
            >
              <AlertCircle className="size-4 shrink-0" />

              <span>
                الملف غير صالح. تأكد من نوع الملف وحجمه.
              </span>
            </div>
          )}

          {/* UPLOAD ERROR */}

          {uploadError && (
            <div
              className="
                flex items-center gap-2
                rounded-xl
                border border-red-500/20
                bg-red-500/5
                px-4 py-3
                text-xs font-semibold
                text-red-500
              "
            >
              <AlertCircle className="size-4 shrink-0" />

              <span>
                {uploadError}
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          {/* ==================================================
              SELECTED FILE
              ================================================== */}

          <div
            className="
              overflow-hidden
              rounded-3xl
              border border-border/50
              bg-background/60
              shadow-sm
            "
          >
            {/* PREVIEW */}

            <div className="relative overflow-hidden bg-muted/30">
              {isImage &&
              preview ? (
                <img
                  src={preview}
                  alt={file.name}
                  className="
                    h-64 w-full
                    object-cover
                    sm:h-72
                  "
                />
              ) : isVideo &&
                preview ? (
                <video
                  src={preview}
                  controls
                  className="
                    h-64 w-full
                    object-contain
                    bg-black
                    sm:h-72
                  "
                />
              ) : (
                <div
                  className="
                    flex h-64
                    items-center justify-center
                    bg-muted/30
                  "
                >
                  <FileCheck2 className="size-16 text-red-500" />
                </div>
              )}

              {/* TYPE */}

              <div
                className="
                  absolute right-4 top-4
                  flex items-center gap-2
                  rounded-full
                  border border-white/10
                  bg-black/60
                  px-3 py-1.5
                  text-xs font-bold
                  text-white
                  backdrop-blur-md
                "
              >
                {isImage ? (
                  <>
                    <ImageIcon className="size-3.5" />
                    صورة
                  </>
                ) : (
                  <>
                    <Video className="size-3.5" />
                    فيديو
                  </>
                )}
              </div>

              {/* REMOVE */}

              {!uploading && (
                <button
                  type="button"
                  onClick={
                    removeFile
                  }
                  className="
                    absolute left-4 top-4
                    flex size-9
                    items-center justify-center
                    rounded-full
                    bg-black/60
                    text-white
                    backdrop-blur-md
                    transition-all
                    hover:scale-110
                    hover:bg-red-500
                  "
                  aria-label="حذف الملف"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* FILE INFO */}

            <div className="flex items-center gap-4 p-5">
              <div
                className="
                  flex size-12 shrink-0
                  items-center justify-center
                  rounded-2xl
                  bg-red-500/10
                  text-red-500
                "
              >
                {isImage ? (
                  <ImageIcon className="size-5" />
                ) : (
                  <Video className="size-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    truncate
                    text-sm
                    font-bold
                  "
                >
                  {file.name}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(
                      file.size
                    )}
                  </span>

                  <span className="size-1 rounded-full bg-muted-foreground/40" />

                  {uploading ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                      <Loader2 className="size-3.5 animate-spin" />
                      جاري الرفع...
                    </span>
                  ) : progress >=
                    100 ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                      <CheckCircle2 className="size-3.5" />
                      تم الرفع
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      الملف جاهز
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              UPLOAD PROGRESS
              ================================================== */}

          {(uploading ||
            progress > 0) && (
            <div
              className="
                rounded-2xl
                border border-red-500/20
                bg-red-500/5
                p-4
              "
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {progress >=
                  100 ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <UploadCloud className="size-4 animate-pulse text-red-500" />
                  )}

                  <span className="text-xs font-bold">
                    {progress >=
                    100
                      ? "تم رفع الفيديو بنجاح"
                      : "جاري رفع الفيديو..."}
                  </span>
                </div>

                <span className="text-sm font-black text-red-500">
                  {progress}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="
                    h-full
                    rounded-full
                    bg-red-500
                    transition-all
                    duration-200
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="truncate">
                  {file.name}
                </span>

                <span>
                  {progress >=
                  100
                    ? "اكتمل"
                    : "يرجى الانتظار..."}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}