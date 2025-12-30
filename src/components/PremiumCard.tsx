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
  elevated = false,
  interactive = false,
}: PremiumCardProps) {
  return (
    <div
      className={cn(
        // Base styles - Brutalismo Técnico
        'bg-white dark:bg-black',
        'border border-gray-300 dark:border-gray-700',
        'p-6',
        
        // Sin decoración
        // NO rounded, NO shadow, NO gradient, NO blur

        className
      )}
    >
      {children}
    </div>
  )
}
