'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface QRScannerProps {
  onScan: (data: string) => void
  isScanning: boolean
}

export function QRScannerPremium({ onScan, isScanning }: QRScannerProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* QR Scanner Area */}
      <div className="relative w-full max-w-sm">
        <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden relative">
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 border-2 border-blue-500 rounded-2xl"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0.7)',
                '0 0 0 10px rgba(59, 130, 246, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Scanning line */}
          {isScanning && (
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-b from-blue-500 to-transparent"
              animate={{ top: ['0%', '100%'] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}

          {/* Placeholder */}
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <p className="text-sm">Apunta tu credencial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full justify-center flex-wrap">
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Subir archivo
        </button>
        <button className="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors">
          Usar cámara
        </button>
      </div>

      {/* Trust indicators */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 w-full">
        <p className="text-xs text-slate-600 dark:text-slate-400 text-center mb-2">
          Información de seguridad:
        </p>
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-green-500">✓</span>
            <span className="text-slate-600 dark:text-slate-400">E2E encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-500">✓</span>
            <span className="text-slate-600 dark:text-slate-400">eIDAS 2.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

