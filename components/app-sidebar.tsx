// "use client"

// import * as React from "react"

// import { NavDocuments } from "@/components/nav-documents"
// import { NavMain } from "@/components/nav-main"
// import { NavSecondary } from "@/components/nav-secondary"
// import { NavUser } from "@/components/nav-user"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { LayoutDashboardIcon, ListIcon, ChartBarIcon, FolderIcon, UsersIcon, CameraIcon, FileTextIcon, Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CommandIcon } from "lucide-react"

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "#",
//       icon: (
//         <LayoutDashboardIcon
//         />
//       ),
//     },
//     {
//       title: "Lifecycle",
//       url: "#",
//       icon: (
//         <ListIcon
//         />
//       ),
//     },
//     {
//       title: "Analytics",
//       url: "#",
//       icon: (
//         <ChartBarIcon
//         />
//       ),
//     },
//     {
//       title: "Projects",
//       url: "#",
//       icon: (
//         <FolderIcon
//         />
//       ),
//     },
//     {
//       title: "Team",
//       url: "#",
//       icon: (
//         <UsersIcon
//         />
//       ),
//     },
//   ],
//   navClouds: [
//     {
//       title: "Capture",
//       icon: (
//         <CameraIcon
//         />
//       ),
//       isActive: true,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Proposal",
//       icon: (
//         <FileTextIcon
//         />
//       ),
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Prompts",
//       icon: (
//         <FileTextIcon
//         />
//       ),
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//   ],
//   navSecondary: [
//     {
//       title: "Settings",
//       url: "#",
//       icon: (
//         <Settings2Icon
//         />
//       ),
//     },
//     {
//       title: "Get Help",
//       url: "#",
//       icon: (
//         <CircleHelpIcon
//         />
//       ),
//     },
//     {
//       title: "Search",
//       url: "#",
//       icon: (
//         <SearchIcon
//         />
//       ),
//     },
//   ],
//   documents: [
//     {
//       name: "Data Library",
//       url: "#",
//       icon: (
//         <DatabaseIcon
//         />
//       ),
//     },
//     {
//       name: "Reports",
//       url: "#",
//       icon: (
//         <FileChartColumnIcon
//         />
//       ),
//     },
//     {
//       name: "Word Assistant",
//       url: "#",
//       icon: (
//         <FileIcon
//         />
//       ),
//     },
//   ],
// }
// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               className="data-[slot=sidebar-menu-button]:p-1.5!"
//               render={<a href="#" />}
//             >
//               <CommandIcon className="size-5!" />
//               <span className="text-base font-semibold">Acme Inc.</span>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navMain} />
//         <NavDocuments items={data.documents} />
//         <NavSecondary items={data.navSecondary} className="mt-auto" />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//     </Sidebar>
//   )
// }





"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  LayoutDashboardIcon,
  BookOpenIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  Sparkles,
  GraduationCap,
} from "lucide-react"


/* ================================================= */
/* DATA */
/* ================================================= */

const data = {
 

  /* ============================== */
  /* MAIN NAVIGATION */
  /* ============================== */

  navMain: [
    {
      title: "لوحة التحكم",
      url: "/admin/dashbord",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "الكورسات",
      url: "/admin/courses",
      icon: <BookOpenIcon />,
    },
    {
      title: "التقدم الدراسي",
      url: "#",
      icon: <ChartBarIcon />,
    },
    {
      title: "المشاريع",
      url: "#",
      icon: <FolderIcon />,
    },
    {
      title: "المجتمع",
      url: "#",
      icon: <UsersIcon />,
    },
  ],

  /* ============================== */
  /* DOCUMENTS */
  /* ============================== */


  /* ============================== */
  /* SECONDARY */
  /* ============================== */

  navSecondary: [
    {
      title: "الإعدادات",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "مركز المساعدة",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "البحث",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
}


/* ================================================= */
/* SIDEBAR */
/* ================================================= */

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      dir="rtl"
      className="
        border-border/50
        bg-background/95
        backdrop-blur-xl
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <SidebarHeader
        className="
          border-b
          border-border/50
          p-3
        "
      >

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton
              className="
                group
                h-12
                rounded-xl
                px-3
                transition-all
                duration-300

                hover:bg-red-500/5
              "
              render={<a href="#" />}
            >

              {/* Logo */}

              <div
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-red-500/15
                  bg-background
                  p-1
                  shadow-sm
                  transition-all
                  duration-300

                  group-hover:scale-105
                  group-hover:border-red-500/30
                  group-hover:shadow-md
                  group-hover:shadow-red-500/10
                "
              >

                <img
                  src="/myLogo.png"
                  alt="YAKKAN-EG"
                  className="
                    size-full
                    rounded-lg
                    object-cover
                  "
                />

              </div>

              {/* Brand */}

              <div className="flex flex-col items-start">

                <span
                  className="
                    text-sm
                    font-black
                    tracking-tight
                  "
                >
                  YAKKAN-EG
                </span>

                <span
                  className="
                    text-[9px]
                    font-medium
                    text-muted-foreground
                  "
                >
                  منصة التعلم والتطوير
                </span>

              </div>

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarHeader>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <SidebarContent
        className="
          px-2
          py-3
        "
      >

        {/* Main Navigation */}

        <div className="mb-2">

          <div
            className="
              mb-2
              px-3
              text-[9px]
              font-bold
              text-muted-foreground
            "
          >
            الرئيسية
          </div>

          <NavMain items={data.navMain} />

        </div>


        {/* Documents */}

        <div className="mt-4">

          <div
            className="
              mb-2
              px-3
              text-[9px]
              font-bold
              text-muted-foreground
            "
          >
            المحتوى
          </div>

          

        </div>


        {/* Secondary */}

        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
        />

      </SidebarContent>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <SidebarFooter
        className="
          border-t
          border-border/50
          p-2
        "
      >

        <NavUser />

      </SidebarFooter>

    </Sidebar>
  )
}