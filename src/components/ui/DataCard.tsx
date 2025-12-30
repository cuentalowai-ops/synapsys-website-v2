'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface DataCardProps {
  children: React.ReactNode
  className?: string
  border?: 'r' | 'b' | 'both' | 'none'
}

export function DataCard({
  children,
  className,
  border = 'both',
}: DataCardProps) {
  const borderClasses = {
    r: 'border-r border-structure',
    b: 'border-b border-structure',
    both: 'border-r border-b border-structure',
    none: '',
  }

  return (
    <div
      className={cn(
        'bg-transparent p-6',
        borderClasses[border],
        className
      )}
    >
      {children}
    </div>
  )
}

