// "use client"

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar"
// import { EllipsisVerticalIcon, CircleUserRoundIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"

// export function NavUser() {
//   const { isMobile } = useSidebar()
//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger
//             render={
//               <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
//             }
//           >
//             <Avatar className="size-8 rounded-lg grayscale">
//               <AvatarImage src={user.avatar} alt={user.name} />
//               <AvatarFallback className="rounded-lg">CN</AvatarFallback>
//             </Avatar>
//             <div className="grid flex-1 text-left text-sm leading-tight">
//               <span className="truncate font-medium">{user.name}</span>
//               <span className="truncate text-xs text-foreground/70">
//                 {user.email}
//               </span>
//             </div>
//             <EllipsisVerticalIcon className="ml-auto size-4" />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="min-w-56"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuGroup>
//               <DropdownMenuLabel className="p-0 font-normal">
//                 <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                   <Avatar className="size-8">
//                     <AvatarImage src={user.avatar} alt={user.name} />
//                     <AvatarFallback className="rounded-lg">CN</AvatarFallback>
//                   </Avatar>
//                   <div className="grid flex-1 text-left text-sm leading-tight">
//                     <span className="truncate font-medium">{user.name}</span>
//                     <span className="truncate text-xs text-muted-foreground">
//                       {user.email}
//                     </span>
//                   </div>
//                 </div>
//               </DropdownMenuLabel>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <CircleUserRoundIcon
//                 />
//                 Account
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <CreditCardIcon
//                 />
//                 Billing
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <BellIcon
//                 />
//                 Notifications
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//               <LogOutIcon
//               />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   )
// }




"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  EllipsisVerticalIcon,
  HouseIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  LogOutIcon,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const {
    data: session,
    isPending,
  } = authClient.useSession()

  /* ============================== */
  /* Loading */
  /* ============================== */

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="animate-pulse"
          >
            <div className="size-8 rounded-lg bg-muted" />

            <div className="flex flex-1 flex-col gap-1">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-2 w-32 rounded bg-muted" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  /* ============================== */
  /* No Session */
  /* ============================== */

  if (!session?.user) {
    return null
  }

  const user = session.user

  /* ============================== */
  /* Avatar Initials */
  /* ============================== */

  const initials = user.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U"

  /* ============================== */
  /* Logout */
  /* ============================== */

  const handleLogout = async () => {
    try {
      await authClient.signOut()

      // الرجوع للصفحة الرئيسية بعد انتهاء الـ session
      router.replace("/")

      // تحديث بيانات الـ session والصفحة
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>

        <DropdownMenu>

          {/* ============================== */}
          {/* USER BUTTON */}
          {/* ============================== */}

          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="
                  rounded-xl
                  transition-all
                  aria-expanded:bg-muted
                "
              />
            }
          >

            <Avatar className="size-8 rounded-lg">

              <AvatarImage
                src={user.image || ""}
                alt={user.name || "User"}
              />

              <AvatarFallback className="rounded-lg">
                {initials}
              </AvatarFallback>

            </Avatar>

            <div className="grid flex-1 text-right text-sm leading-tight">

              <span className="truncate font-medium">
                {user.name}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>

            </div>

            <EllipsisVerticalIcon className="ml-auto size-4" />

          </DropdownMenuTrigger>


          {/* ============================== */}
          {/* DROPDOWN */}
          {/* ============================== */}

          <DropdownMenuContent
            className="min-w-60 rounded-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >

            {/* ============================== */}
            {/* USER INFO */}
            {/* ============================== */}

            <DropdownMenuGroup>

              <DropdownMenuLabel className="p-0 font-normal">

                <div className="flex items-center gap-3 px-2 py-2">

                  <Avatar className="size-9 rounded-lg">

                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || "User"}
                    />

                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>

                  </Avatar>

                  <div className="grid flex-1 text-right text-sm leading-tight">

                    <span className="truncate font-semibold">
                      {user.name}
                    </span>

                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>

                  </div>

                </div>

              </DropdownMenuLabel>

            </DropdownMenuGroup>


            <DropdownMenuSeparator />


            {/* ============================== */}
            {/* NAVIGATION */}
            {/* ============================== */}

            <DropdownMenuGroup>

              {/* الرئيسية */}

              <DropdownMenuItem
                className="cursor-pointer"
                render={<Link href="/" />}
              >
                <HouseIcon className="size-4" />
                <span>الرئيسية</span>
              </DropdownMenuItem>


              {/* لوحة التحكم */}

              <DropdownMenuItem
                className="cursor-pointer"
                render={<Link href="/admin" />}
              >
                <LayoutDashboardIcon className="size-4" />
                <span>لوحة التحكم</span>
              </DropdownMenuItem>


              {/* الكورسات */}

              <DropdownMenuItem
                className="cursor-pointer"
                render={<Link href="/admin/courses" />}
              >
                <BookOpenIcon className="size-4" />
                <span>الكورسات</span>
              </DropdownMenuItem>

            </DropdownMenuGroup>


            <DropdownMenuSeparator />


            {/* ============================== */}
            {/* LOGOUT */}
            {/* ============================== */}

            <DropdownMenuItem
              className="
                cursor-pointer
                text-red-500
                focus:text-red-500
              "
              onClick={handleLogout}
            >
              <LogOutIcon className="size-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </SidebarMenuItem>
    </SidebarMenu>
  )
}