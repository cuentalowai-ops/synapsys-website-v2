'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ScanButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  href?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

export function ScanButton({
  children,
  href,
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: ScanButtonProps) {
  const baseStyles = 'relative overflow-hidden rounded-lg font-mono inline-flex items-center justify-center transition-all duration-300'
  
  const variants = {
    primary: 'bg-truth-600 text-void border border-truth-500 hover:bg-truth-500 hover:-translate-y-0.5 hover:glow-truth-lg',
    secondary: 'bg-transparent text-truth border border-truth/50 hover:bg-truth/10 hover:border-truth hover:glow-truth',
  }

  const sizes = {
    sm: 'px-4 h-11 text-xs',
    md: 'px-6 h-12 text-sm',
    lg: 'px-8 h-12 text-base',
  }

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  )

  // Efecto scanning (pseudo-element)
  const scanningEffect = (
    <span
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
        animation: 'scanning 3s linear infinite',
      }}
    />
  )

  const content = (
    <>
      {scanningEffect}
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}

