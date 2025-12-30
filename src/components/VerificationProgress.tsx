'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Step {
  id: string
  label: string
  status: 'completed' | 'active' | 'pending'
}

interface VerificationProgressProps {
  steps: Step[]
  currentStep: number
}

export function VerificationProgress({
  steps,
  currentStep,
}: VerificationProgressProps) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress Bar - Brutalista */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">
            PROGRESS
          </span>
          <span className="text-xs font-mono text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps Timeline - Brutalista */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-2">
            {/* Step indicator - Cuadrado, no redondo */}
            <div
              className={`w-8 h-8 border-2 flex items-center justify-center text-xs font-mono ${
                step.status === 'completed'
                  ? 'border-green-600 text-green-600 bg-green-50 dark:bg-green-900/20'
                  : step.status === 'active'
                    ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-700 text-gray-400 bg-gray-50 dark:bg-gray-900'
              }`}
            >
              {step.status === 'completed' ? '✓' : index + 1}
            </div>

            {/* Step label - Font Sans para humanos */}
            <span
              className={`text-sm font-sans transition-colors ${
                step.status === 'active'
                  ? 'text-blue-600 font-bold'
                  : step.status === 'completed'
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
