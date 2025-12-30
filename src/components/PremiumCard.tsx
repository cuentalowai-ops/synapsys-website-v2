'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
  interactive?: boolean
}

export function PremiumCard({
  children,
  className,
  elevated = true,
  interactive = true,
}: PremiumCardProps) {
  return (
    <div
      className={cn(
        // Base styles
        'bg-white dark:bg-slate-900',
        'rounded-2xl',
        'p-6 md:p-8',
        'border border-slate-200 dark:border-slate-800',

        // Elevation
        elevated && 'shadow-lg',

        // Interactive
        interactive &&
          'transition-all duration-200 hover:shadow-xl hover:-translate-y-1',

        className
      )}
    >
      {children}
    </div>
  )
}

