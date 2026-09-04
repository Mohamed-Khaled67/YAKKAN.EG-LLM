// "use client"

// import { EditorContent, useEditor } from "@tiptap/react"
// import StarterKit from "@tiptap/starter-kit"
// import Underline from "@tiptap/extension-underline"
// import Link from "@tiptap/extension-link"
// import TextAlign from "@tiptap/extension-text-align"
// import Placeholder from "@tiptap/extension-placeholder"
// import { TextStyle, Color } from "@tiptap/extension-text-style"

// import {
//   Bold,
//   Italic,
//   Underline as UnderlineIcon,
//   Palette,
//   Undo2,
//   Redo2,
//   Eraser,
//   AlignRight,
//   AlignCenter,
//   AlignLeft,
//   AlignJustify,
//   Code2,
//   List,
//   ListOrdered,
//   Link as LinkIcon,
// } from "lucide-react"

// type RichTextEditorProps = {
//   value: string
//   onChange: (value: string) => void
// }

// export default function RichTextEditor({
//   value,
//   onChange,
// }: RichTextEditorProps) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,

//       Underline,

//       Link.configure({
//         openOnClick: false,
//         autolink: true,
//         defaultProtocol: "https",
//       }),

//       TextAlign.configure({
//         types: ["heading", "paragraph"],
//       }),

//       Placeholder.configure({
//         placeholder: "ابدأ بكتابة وصف الكورس...",
//       }),
//     ],

//     content: value,

//     immediatelyRender: false,

//     editorProps: {
//       attributes: {
//         class:
//           "min-h-[300px] w-full px-5 py-4 outline-none [&_h1]:text-4xl [&_h1]:font-black [&_h1]:leading-tight [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:leading-tight",
//         dir: "rtl",
//       },
//     },

//     onUpdate({ editor }) {
//       onChange(editor.getHTML())
//     },
//   })

//   if (!editor) {
//     return null
//   }

//   return (
//     <div
//       dir="rtl"
//       className="
//         overflow-hidden
//         rounded-2xl
//         border border-border/60
//         bg-background
//         shadow-sm
//       "
//     >
//       {/* Toolbar */}
//       <div
//         className="
//           flex flex-wrap
//           items-center
//           gap-1
//           border-b border-border/60
//           bg-muted/30
//           p-2
//         "
//       >
//         {/* Bold */}
//         <button
//           type="button"
//           onClick={() =>
//             editor.chain().focus().toggleBold().run()
//           }
//           className={`
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive("bold")
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="Bold"
//         >
//           <Bold className="size-4" />
//         </button>

//         {/* Italic */}
//         <button
//           type="button"
//           onClick={() =>
//             editor.chain().focus().toggleItalic().run()
//           }
//           className={`
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive("italic")
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="Italic"
//         >
//           <Italic className="size-4" />
//         </button>

//         {/* Underline */}
//         <button
//           type="button"
//           onClick={() =>
//             editor.chain().focus().toggleUnderline().run()
//           }
//           className={`
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive("underline")
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="Underline"
//         >
//           <UnderlineIcon className="size-4" />
//         </button>

//         {/* Divider */}
//         <div className="mx-1 h-6 w-px bg-border" />

//         {/* Heading 1 */}
//         <button
//           type="button"
//           onClick={() =>
//             editor
//               .chain()
//               .focus()
//               .toggleHeading({ level: 1 })
//               .run()
//           }
//           className={`
//             flex h-9 min-w-9 items-center justify-center
//             rounded-lg
//             px-2
//             text-xs font-bold
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive("heading", { level: 1 })
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="Heading 1"
//         >
//           H1
//         </button>

//         {/* Heading 2 */}
//         <button
//           type="button"
//           onClick={() =>
//             editor
//               .chain()
//               .focus()
//               .toggleHeading({ level: 2 })
//               .run()
//           }
//           className={`
//             flex h-9 min-w-9 items-center justify-center
//             rounded-lg
//             px-2
//             text-xs font-bold
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive("heading", { level: 2 })
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="Heading 2"
//         >
//           H2
//         </button>

//         {/* Heading 3 */}
//         <button
//           type="button"
//           onClick={() =>
//             editor
//               .chain()
//               .focus()
//               .toggleHeading({ level: 3 })
//               .run()
//           }
//           className={`
//             flex h-9 min-w-9 items-center justify-center
//             rounded-lg
//             px-2
//             text-xs font-bold
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive("heading", { level: 3 })
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="Heading 3"
//         >
//           H3
//         </button>

//         {/* Divider */}
//         <div className="mx-1 h-6 w-px bg-border" />

//         {/* Code Block */}
//         <button
//           type="button"
//           onClick={() =>
//             editor.chain().focus().toggleCodeBlock().run()
//           }
//           className={`
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive("codeBlock")
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="كود"
//         >
//           <Code2 className="size-4" />
//         </button>

//         {/* Divider */}
//         <div className="mx-1 h-6 w-px bg-border" />

//         {/* Align Right */}
//         <button
//           type="button"
//           onMouseDown={(event) => {
//             event.preventDefault()
//             editor
//               .chain()
//               .focus()
//               .setTextAlign("right")
//               .run()
//           }}
//           className={`
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive({ textAlign: "right" })
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="محاذاة لليمين"
//         >
//           <AlignRight className="size-4" />
//         </button>

//         {/* Align Center */}
//         <button
//           type="button"
//           onMouseDown={(event) => {
//             event.preventDefault()
//             editor
//               .chain()
//               .focus()
//               .setTextAlign("center")
//               .run()
//           }}
//           className={`
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive({ textAlign: "center" })
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="توسيط"
//         >
//           <AlignCenter className="size-4" />
//         </button>

//         {/* Align Left */}
//         <button
//           type="button"
//           onMouseDown={(event) => {
//             event.preventDefault()
//             editor
//               .chain()
//               .focus()
//               .setTextAlign("left")
//               .run()
//           }}
//           className={`
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive({ textAlign: "left" })
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="محاذاة لليسار"
//         >
//           <AlignLeft className="size-4" />
//         </button>

//         {/* Justify */}
//         <button
//           type="button"
//           onMouseDown={(event) => {
//             event.preventDefault()
//             editor
//               .chain()
//               .focus()
//               .setTextAlign("justify")
//               .run()
//           }}
//           className={`
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             ${
//               editor.isActive({ textAlign: "justify" })
//                 ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
//                 : ""
//             }
//           `}
//           title="ضبط النص"
//         >
//           <AlignJustify className="size-4" />
//         </button>

//         {/* Link */}

//         {/* Clear Formatting */}
//         <button
//           type="button"
//           onMouseDown={(event) => {
//             event.preventDefault()
//             editor
//               .chain()
//               .focus()
//               .clearNodes()
//               .unsetAllMarks()
//               .run()
//           }}
//           className="
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//           "
//           title="مسح التنسيق"
//         >
//           <Eraser className="size-4" />
//         </button>

//         {/* Spacer */}
//         <div className="flex-1" />

//         {/* Undo */}
//         <button
//           type="button"
//           onClick={() =>
//             editor.chain().focus().undo().run()
//           }
//           disabled={!editor.can().undo()}
//           className="
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             disabled:pointer-events-none
//             disabled:opacity-30
//           "
//           title="تراجع"
//         >
//           <Undo2 className="size-4" />
//         </button>

//         {/* Redo */}
//         <button
//           type="button"
//           onClick={() =>
//             editor.chain().focus().redo().run()
//           }
//           disabled={!editor.can().redo()}
//           className="
//             flex size-9 items-center justify-center
//             rounded-lg
//             transition
//             hover:bg-red-500/10
//             hover:text-red-500
//             disabled:pointer-events-none
//             disabled:opacity-30
//           "
//           title="إعادة"
//         >
//           <Redo2 className="size-4" />
//         </button>
//       </div>

//       {/* Editor */}
//       <EditorContent editor={editor} />
//     </div>
//   )
// }







"use client"

import {
  EditorContent,
  useEditor,
} from "@tiptap/react"

import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Undo2,
  Redo2,
  Eraser,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  Code2,
} from "lucide-react"

type RichTextEditorProps = {
  value: string
  onChange: (
    value: string
  ) => void
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      // ========================================================
      // STARTER KIT
      // ========================================================

      StarterKit,

      // ========================================================
      // TEXT ALIGN
      // ========================================================

      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
        ],
      }),

      // ========================================================
      // PLACEHOLDER
      // ========================================================

      Placeholder.configure({
        placeholder:
          "ابدأ بكتابة وصف الكورس...",
      }),
    ],

    content: value,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] w-full px-5 py-4 outline-none " +
          "[&_h1]:text-4xl " +
          "[&_h1]:font-black " +
          "[&_h1]:leading-tight " +
          "[&_h2]:text-3xl " +
          "[&_h2]:font-bold " +
          "[&_h2]:leading-tight " +
          "[&_h3]:text-2xl " +
          "[&_h3]:font-bold " +
          "[&_h3]:leading-tight " +
          "[&_p]:leading-8 " +
          "[&_ul]:mr-6 " +
          "[&_ul]:list-disc " +
          "[&_ol]:mr-6 " +
          "[&_ol]:list-decimal " +
          "[&_a]:text-red-500 " +
          "[&_a]:underline",

        dir: "rtl",
      },
    },

    onUpdate({
      editor,
    }) {
      onChange(
        editor.getHTML()
      )
    },
  })

  // ============================================================
  // LOADING
  // ============================================================

  if (!editor) {
    return null
  }

  // ============================================================
  // BUTTON CLASS
  // ============================================================

  const getButtonClass = (
    active = false
  ) => `
    flex
    size-9
    items-center
    justify-center
    rounded-lg
    transition
    hover:bg-red-500/10
    hover:text-red-500
    ${
      active
        ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
        : ""
    }
  `

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      dir="rtl"
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-background
        shadow-sm
      "
    >
      {/* ====================================================== */}
      {/* TOOLBAR */}
      {/* ====================================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-1
          border-b
          border-border
          bg-muted/30
          p-2
        "
      >

        {/* ==================================================== */}
        {/* BOLD */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }}
          className={getButtonClass(
            editor.isActive("bold")
          )}
          title="غامق"
        >
          <Bold className="size-4" />
        </button>

        {/* ==================================================== */}
        {/* ITALIC */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }}
          className={getButtonClass(
            editor.isActive("italic")
          )}
          title="مائل"
        >
          <Italic className="size-4" />
        </button>

        {/* ==================================================== */}
        {/* UNDERLINE */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }}
          className={getButtonClass(
            editor.isActive(
              "underline"
            )
          )}
          title="تحته خط"
        >
          <UnderlineIcon className="size-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* ==================================================== */}
        {/* H1 */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }}
          className={`
            flex
            h-9
            min-w-9
            items-center
            justify-center
            rounded-lg
            px-2
            text-xs
            font-bold
            transition
            hover:bg-red-500/10
            hover:text-red-500
            ${
              editor.isActive(
                "heading",
                {
                  level: 1,
                }
              )
                ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
                : ""
            }
          `}
          title="عنوان 1"
        >
          H1
        </button>

        {/* ==================================================== */}
        {/* H2 */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }}
          className={`
            flex
            h-9
            min-w-9
            items-center
            justify-center
            rounded-lg
            px-2
            text-xs
            font-bold
            transition
            hover:bg-red-500/10
            hover:text-red-500
            ${
              editor.isActive(
                "heading",
                {
                  level: 2,
                }
              )
                ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
                : ""
            }
          `}
          title="عنوان 2"
        >
          H2
        </button>

        {/* ==================================================== */}
        {/* H3 */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
          }}
          className={`
            flex
            h-9
            min-w-9
            items-center
            justify-center
            rounded-lg
            px-2
            text-xs
            font-bold
            transition
            hover:bg-red-500/10
            hover:text-red-500
            ${
              editor.isActive(
                "heading",
                {
                  level: 3,
                }
              )
                ? "bg-red-500 text-white hover:bg-red-500 hover:text-white"
                : ""
            }
          `}
          title="عنوان 3"
        >
          H3
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* ==================================================== */}
        {/* CODE BLOCK */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }}
          className={getButtonClass(
            editor.isActive(
              "codeBlock"
            )
          )}
          title="كود"
        >
          <Code2 className="size-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* ==================================================== */}
        {/* RIGHT */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .setTextAlign("right")
              .run()
          }}
          className={getButtonClass(
            editor.isActive({
              textAlign: "right",
            })
          )}
          title="محاذاة لليمين"
        >
          <AlignRight className="size-4" />
        </button>

        {/* ==================================================== */}
        {/* CENTER */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .setTextAlign("center")
              .run()
          }}
          className={getButtonClass(
            editor.isActive({
              textAlign: "center",
            })
          )}
          title="توسيط"
        >
          <AlignCenter className="size-4" />
        </button>

        {/* ==================================================== */}
        {/* LEFT */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .setTextAlign("left")
              .run()
          }}
          className={getButtonClass(
            editor.isActive({
              textAlign: "left",
            })
          )}
          title="محاذاة لليسار"
        >
          <AlignLeft className="size-4" />
        </button>

        {/* ==================================================== */}
        {/* JUSTIFY */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .setTextAlign("justify")
              .run()
          }}
          className={getButtonClass(
            editor.isActive({
              textAlign: "justify",
            })
          )}
          title="ضبط النص"
        >
          <AlignJustify className="size-4" />
        </button>

        {/* ==================================================== */}
        {/* CLEAR */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .clearNodes()
              .unsetAllMarks()
              .run()
          }}
          className={getButtonClass()}
          title="مسح التنسيق"
        >
          <Eraser className="size-4" />
        </button>

        <div className="flex-1" />

        {/* ==================================================== */}
        {/* UNDO */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .undo()
              .run()
          }}
          disabled={
            !editor.can().undo()
          }
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-lg
            transition
            hover:bg-red-500/10
            hover:text-red-500
            disabled:pointer-events-none
            disabled:opacity-30
          "
          title="تراجع"
        >
          <Undo2 className="size-4" />
        </button>

        {/* ==================================================== */}
        {/* REDO */}
        {/* ==================================================== */}

        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()

            editor
              .chain()
              .focus()
              .redo()
              .run()
          }}
          disabled={
            !editor.can().redo()
          }
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-lg
            transition
            hover:bg-red-500/10
            hover:text-red-500
            disabled:pointer-events-none
            disabled:opacity-30
          "
          title="إعادة"
        >
          <Redo2 className="size-4" />
        </button>
      </div>

      {/* ====================================================== */}
      {/* EDITOR */}
      {/* ====================================================== */}

      <EditorContent
        editor={editor}
      />
    </div>
  )
}