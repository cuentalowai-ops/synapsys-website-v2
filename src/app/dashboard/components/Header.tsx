"use client"

import { Search, Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { UserDropdown } from "./UserDropdown"

export function Header() {
  const { theme = "light", toggleTheme } = useTheme() || { theme: "light", toggleTheme: () => {} }

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="flex h-full items-center justify-between px-4 lg:pl-72">
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100">Overview</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-10 pr-4 text-sm focus:border-coral-400 focus:outline-none focus:ring-2 focus:ring-coral-400/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}

