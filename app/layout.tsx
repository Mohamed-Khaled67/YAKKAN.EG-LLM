// import { Geist, Geist_Mono } from "next/font/google"

// import "./globals.css"
// import { ThemeProvider } from "@/components/ui/theme-provider"
// import { cn } from "@/lib/utils";
// import { Toaster } from "@/components/ui/sonner";

// const geist = Geist({subsets:['latin'],variable:'--font-sans'})

// const fontMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
// })

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html
//       lang="en"
//       suppressHydrationWarning
//       className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
//     >
//       <body>
//          <ThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//           >
//             {children}
          
//           <Toaster/>
            
//           </ThemeProvider>
          
//       </body>
//     </html>
//   )
// }














import { Alexandria, Tajawal } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
  weight: ["400", "500", "700", "800"],
})

const alexandria = Alexandria({
  subsets: ["arabic"],
  variable: "--font-alexandria",
  display: "swap",
  weight: ["400", "500", "700", "800"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        tajawal.variable,
        alexandria.variable,
        "font-tajawal"
      )}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

