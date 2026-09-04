// import { Separator } from "@/components/ui/separator"
// import { SidebarTrigger } from "@/components/ui/sidebar"

// export function SiteHeader() {
//   return (
//     <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2 h-4 data-vertical:self-auto"
//         />
//         <h1 className="text-base font-medium">Documents</h1>
//       </div>
//     </header>
//   )
// }


import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DarkMode } from "@/components/ui/darkMode"

export function SiteHeader() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        flex
        h-(--header-height)
        shrink-0
        items-center
        border-b
        border-border/50
        bg-background/80
        backdrop-blur-xl
        transition-[width,height]
        ease-linear
        group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)
      "
    >
      <div
        className="
          flex
          w-full
          items-center
          justify-between
          gap-2
          px-4
          lg:px-6
        "
      >

        {/* ============================== */}
        {/* RIGHT SIDE */}
        {/* ============================== */}

        <div className="flex items-center gap-2">

          {/* Sidebar Button */}

          <SidebarTrigger
            className="
              size-9
              rounded-lg
              transition-all
              hover:bg-muted
            "
          />

          <Separator
            orientation="vertical"
            className="mx-1 h-5"
          />

          {/* Brand */}

          <div className="flex items-center gap-2">

            {/* Logo */}

            <div
              className="
                flex
                size-8
                items-center
                justify-center
                overflow-hidden
                rounded-lg
                border
                border-red-500/15
                bg-background
                p-1
                shadow-sm
                transition-all
                duration-300
                hover:scale-105
              "
            >
              <img
                src="/myLogo.png"
                alt="YAKKAN-EG"
                className="size-full rounded-md object-cover"
              />
            </div>

            {/* Brand Name */}

            <div className="hidden sm:flex flex-col">

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

          </div>

        </div>


        {/* ============================== */}
        {/* LEFT SIDE */}
        {/* ============================== */}

        <div className="flex items-center gap-2">

          {/* Theme Toggle */}

          <div
            className="
              rounded-lg
              border
              border-border/50
              bg-background/60
              p-1
              shadow-sm
              transition-all
              hover:bg-muted
            "
          >
            <DarkMode />
          </div>

        </div>

      </div>
    </header>
  )
}