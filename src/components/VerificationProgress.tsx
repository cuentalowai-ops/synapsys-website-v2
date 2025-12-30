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
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Progreso
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            {/* Step indicator */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step.status === 'completed'
                  ? 'bg-green-500 text-white'
                  : step.status === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {step.status === 'completed' ? '✓' : index + 1}
            </div>

            {/* Step label */}
            <span
              className={`text-sm font-medium transition-colors ${
                step.status === 'active'
                  ? 'text-blue-600'
                  : 'text-slate-600 dark:text-slate-400'
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

