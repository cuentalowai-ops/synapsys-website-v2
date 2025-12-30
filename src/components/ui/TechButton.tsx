'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface TechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  asChild?: boolean
  href?: string
}

export function TechButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  asChild = false,
  href,
  ...props
}: TechButtonProps) {
  const baseStyles = 'font-mono text-data border transition-all duration-200 inline-flex items-center justify-center'
  
  const variants = {
    primary: 'bg-truth text-void border-truth hover:border-truth-500 hover:glow-truth hover:bg-truth-500',
    secondary: 'bg-transparent text-truth border-truth hover:bg-truth/10 hover:glow-truth',
    ghost: 'bg-transparent text-text-primary border-structure hover:border-truth hover:text-truth',
  }

  const sizes = {
    sm: 'px-4 h-11 text-xs', // Mínimo 44px
    md: 'px-6 h-12 text-sm', // 48px
    lg: 'px-8 h-12 text-base', // 48px
  }

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  )

  // Si hay href, renderizar como Link
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}
