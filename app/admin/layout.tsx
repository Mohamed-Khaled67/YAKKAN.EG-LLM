
// import { AppSidebar } from "@/components/app-sidebar"
// import { SiteHeader } from "@/components/site-header"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"

// import type { ReactNode } from "react"

// export default function AdminLayout({
//   children,
// }: {
//   children: ReactNode
// }) {
//   return (
//     <div
//       dir="rtl"
//       className="min-h-screen bg-background"
//     >
//       <SidebarProvider
//         style={
//           {
//             "--sidebar-width": "calc(var(--spacing) * 72)",
//             "--header-height": "calc(var(--spacing) * 12)",
//           } as React.CSSProperties
//         }
//       >

//         {/* Sidebar */}
//         <AppSidebar
//           variant="inset"
//           side="right"
//         />

//         {/* Main */}
//         <SidebarInset>

//           <SiteHeader />

//           <main className="flex flex-1 flex-col">

//             <div className="@container/main flex flex-1 flex-col">

//               <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">

//                 {children}

//               </div>

//             </div>

//           </main>

//         </SidebarInset>

//       </SidebarProvider>
//     </div>
//   )
// }









import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import type { ReactNode } from "react"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // ============================================================
  // GET CURRENT SESSION
  // ============================================================

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // ============================================================
  // NOT LOGGED IN
  // ============================================================

  if (!session) {
    redirect("/login")
  }

  // ============================================================
  // ADMIN ONLY
  // ============================================================

  if (session.user.role !== "admin") {
    redirect("/")
  }

  // ============================================================
  // ADMIN LAYOUT
  // ============================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background"
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width":
              "calc(var(--spacing) * 72)",

            "--header-height":
              "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        {/* ================================================== */}
        {/* SIDEBAR */}
        {/* ================================================== */}

        <AppSidebar
          variant="inset"
          side="right"
        />

        {/* ================================================== */}
        {/* MAIN */}
        {/* ================================================== */}

        <SidebarInset>

          <SiteHeader />

          <main className="flex flex-1 flex-col">

            <div className="@container/main flex flex-1 flex-col">

              <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">

                {children}

              </div>

            </div>

          </main>

        </SidebarInset>

      </SidebarProvider>
    </div>
  )
}