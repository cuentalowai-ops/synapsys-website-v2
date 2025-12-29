"use client"

import { User, LogOut, Settings } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-coral-400 to-amber-400">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="hidden md:block text-sm font-medium">Admin</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white dark:bg-gray-800 shadow-lg py-1 z-50">
          <a
            href="/dashboard/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User className="h-4 w-4" />
            Profile
          </a>
          <a
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            Settings
          </a>
          <div className="border-t my-1" />
          <a
            href="/auth/logout"
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </a>
        </div>
      )}
    </div>
  )
}

