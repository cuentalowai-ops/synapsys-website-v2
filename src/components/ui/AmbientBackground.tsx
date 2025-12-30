'use client'

import React from 'react'

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Grid Background (ya está en body::before, pero lo mantenemos para consistencia) */}
      
      {/* Orbe 1 - Top Right */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 md:w-[600px] md:h-[600px] opacity-30 md:opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 5s ease-in-out infinite',
        }}
      />

      {/* Orbe 2 - Bottom Left */}
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 md:w-[500px] md:h-[500px] opacity-25 md:opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 8s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />

      {/* Orbe 3 - Center (móvil solo) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:hidden opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />
    </div>
  )
}

