'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'active' | 'success' | 'warning' | 'error' | 'pending'
  children: React.ReactNode
  className?: string
}

export function StatusBadge({
  status,
  children,
  className,
}: StatusBadgeProps) {
  const statusStyles = {
    active: 'bg-truth/10 text-truth border-truth/20',
    success: 'bg-truth/10 text-truth border-truth/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-text-muted/10 text-text-muted border-structure',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 text-xs font-mono border',
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  )
}

