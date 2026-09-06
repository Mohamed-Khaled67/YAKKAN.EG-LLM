
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
  ImageIcon,
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
   { title: "معرض الصور",
     url: "/admin/gallery",
      icon: <ImageIcon />,
     },
  ],

  /* ============================== */
  /* DOCUMENTS */
  /* ============================== */


  /* ============================== */
  /* SECONDARY */
  /* ============================== */


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

       


        {/* Secondary */}

        

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