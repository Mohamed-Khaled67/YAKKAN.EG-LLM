// "use client"

// import { Button } from "@/components/ui/button"
// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { CirclePlusIcon, MailIcon } from "lucide-react"

// export function NavMain({
//   items,
// }: {
//   items: {
//     title: string
//     url: string
//     icon?: React.ReactNode
//   }[]
// }) {
//   return (
//     <SidebarGroup>
//       <SidebarGroupContent className="flex flex-col gap-2">
//         <SidebarMenu>
//           <SidebarMenuItem className="flex items-center gap-2">
//             <SidebarMenuButton
//               tooltip="Quick Create"
//               className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
//             >
//               <CirclePlusIcon
//               />
//               <span>Quick Create</span>
//             </SidebarMenuButton>
//             <Button
//               size="icon"
//               className="size-8 group-data-[collapsible=icon]:opacity-0"
//               variant="outline"
//             >
//               <MailIcon
//               />
//               <span className="sr-only">Inbox</span>
//             </Button>
//           </SidebarMenuItem>
//         </SidebarMenu>
//         <SidebarMenu>
//           {items.map((item) => (
//             <SidebarMenuItem key={item.title}>
//               <SidebarMenuButton tooltip={item.title}>
//                 {item.icon}
//                 <span>{item.title}</span>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           ))}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   )
// }






"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  CirclePlusIcon,
  MailIcon,
} from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  return (
    <SidebarGroup dir="rtl">
      <SidebarGroupContent className="flex flex-col gap-4">

        {/* إنشاء كورس + الرسائل */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">

            {/* إنشاء كورس */}
            <Link
              href="/admin/courses/create"
              className="flex-1"
            >
              <SidebarMenuButton
                tooltip="إنشاء كورس"
                className="
                  h-10
                  w-full
                  rounded-xl
                  bg-primary
                  text-primary-foreground
                  font-semibold
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-primary/90
                  hover:text-primary-foreground
                  hover:shadow-md
                  active:scale-[0.98]
                "
              >
                <CirclePlusIcon className="size-5" />

                <span>
                  إنشاء كورس
                </span>
              </SidebarMenuButton>
            </Link>

            {/* الرسائل */}
            <Button
              size="icon"
              variant="outline"
              className="
                size-10
                shrink-0
                rounded-xl
                border-border
                bg-background
                shadow-sm
                transition-all
                hover:bg-accent
                hover:text-primary
                hover:shadow-md
                group-data-[collapsible=icon]:hidden
              "
            >
              <MailIcon className="size-5" />

              <span className="sr-only">
                الرسائل
              </span>
            </Button>

          </SidebarMenuItem>
        </SidebarMenu>


        {/* عناصر القائمة */}
        <SidebarMenu className="gap-1">

          {items.map((item) => (
            <SidebarMenuItem key={item.title}>

              <Link
                href={item.url}
                className="block w-full"
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  className="
                    h-11
                    w-full
                    rounded-xl
                    px-3
                    text-muted-foreground
                    transition-all
                    duration-200
                    hover:bg-primary/10
                    hover:text-primary
                  "
                >
                  {item.icon && (
                    <span className="flex size-5 items-center justify-center">
                      {item.icon}
                    </span>
                  )}

                  <span>
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </Link>

            </SidebarMenuItem>
          ))}

        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  )
}