'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  border?: 'r' | 'b' | 'both' | 'none'
}

export function GlassCard({
  children,
  className,
  hover = true,
  border = 'both',
}: GlassCardProps) {
  const borderClasses = {
    r: 'border-r border-white/5',
    b: 'border-b border-white/5',
    both: 'border border-white/5',
    none: '',
  }

  return (
    <div
      className={cn(
        'glass-card',
        borderClasses[border],
        hover && 'glass-card-hover',
        className
      )}
    >
      {children}
    </div>
  )
}

