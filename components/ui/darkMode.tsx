"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function DarkMode() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // نفس الحجم حتى لا يحصل layout shift
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        type="button"
        aria-label="تغيير الوضع"
        className="
          size-10
          rounded-xl
          border-border/50
          bg-background/80
          shadow-sm
        "
      >
        <Sun className="size-[1.1rem]" />
        <span className="sr-only">تغيير الوضع</span>
      </Button>
    )
  }

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      className="
        relative
        size-10
        rounded-xl
        border-border/50
        bg-background/80
        shadow-sm
        transition-all
        duration-300
        hover:border-red-500/20
        hover:bg-red-500/5
        hover:text-red-500
        hover:shadow-md
      "
    >
      <Sun
        className="
          size-[1.1rem]
          scale-100
          rotate-0
          transition-all
          duration-300
          dark:scale-0
          dark:-rotate-90
        "
      />

      <Moon
        className="
          absolute
          size-[1.1rem]
          scale-0
          rotate-90
          transition-all
          duration-300
          dark:scale-100
          dark:rotate-0
        "
      />

      <span className="sr-only">
        {isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      </span>
    </Button>
  )
}