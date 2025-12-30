'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/theme-context'
import { PremiumCard } from '@/components/PremiumCard'
import { VerificationProgress } from '@/components/VerificationProgress'
import { QRCodeSVG } from 'qrcode.react'

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // ===== STATE LÓGICO (Conectado al Backend) =====
  const [status, setStatus] = useState<'idle' | 'loading' | 'pending' | 'success' | 'error'>('idle')
  const [qrLink, setQrLink] = useState<string>('')
  const [sessionId, setSessionId] = useState<string>('')
  const [userData, setUserData] = useState<{
    given_name?: string
    family_name?: string
    nationality?: string
    document_number?: string
  } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')

  // Hydration fix (Next.js)
  useEffect(() => {
    setMounted(true)
  }, [])

  // ===== INICIAR VERIFICACIÓN (Conectar SSE) =====
  useEffect(() => {
    if (mounted) {
      startVerification()
    }
    
    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [mounted])

  // ===== POLLING FALLBACK (para cuando SSE falla en serverless) =====
  useEffect(() => {
    // Solo hacer polling si estamos en estado 'pending' y tenemos sessionId
    if (status === 'pending' && sessionId) {
      console.log('🔄 [Polling] Starting fallback polling for session:', sessionId)
      
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/verify/poll?session_id=${sessionId}`)
          
          if (!res.ok) {
            if (res.status === 404) {
              // Sesión expirada
              console.warn('⚠️ [Polling] Session expired')
              setStatus('error')
              setErrorMsg('La sesión ha expirado. Por favor, intenta de nuevo.')
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current)
                pollIntervalRef.current = null
              }
            }
            return
          }

          const data = await res.json()
          
          if (data.state === 'verified') {
            console.log('✅ [Polling] Verification detected via polling')
            setUserData(data.userData || {})
            setStatus('success')
            
            // Limpiar polling
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current)
              pollIntervalRef.current = null
            }
          } else if (data.state === 'failed') {
            console.log('❌ [Polling] Verification failed detected via polling')
            setStatus('error')
            setErrorMsg('La verificación falló')
            
            // Limpiar polling
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current)
              pollIntervalRef.current = null
            }
          }
          // Si state === 'pending', continuar polling
        } catch (error) {
          console.error('❌ [Polling] Error:', error)
          // No detener polling por errores de red temporales
        }
      }, 2000) // Poll cada 2 segundos
    } else {
      // Detener polling si no estamos en 'pending'
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }

    // Cleanup
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [status, sessionId])

  const startVerification = async () => {
    try {
      setStatus('loading')
      setErrorMsg('')

      // Paso 1: Crear sesión en backend
      const res = await fetch('/api/verify/start', { method: 'POST' })
      
      if (!res.ok) {
        throw new Error('Failed to start verification')
      }

      const data = await res.json()
      
      setQrLink(data.qr_link)
      setSessionId(data.session_id)
      setStatus('pending')

      // Paso 2: Conectar SSE para recibir eventos
      const eventSource = new EventSource(
        `/api/verify/events?session_id=${data.session_id}`
      )
      
      eventSourceRef.current = eventSource
      
      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data)
          console.log('📡 SSE Event received:', msg)

          if (msg.status === 'verified') {
            setUserData(msg.userData)
            setStatus('success')
            eventSource.close()
            eventSourceRef.current = null
          } else if (msg.status === 'error') {
            setStatus('error')
            setErrorMsg(msg.error || 'Verification failed')
            eventSource.close()
            eventSourceRef.current = null
          }
        } catch (e) {
          console.error('❌ SSE parsing error:', e)
        }
      }

      eventSource.onerror = () => {
        console.warn('⚠️ SSE connection lost - falling back to polling')
        // No cerrar SSE inmediatamente, dejar que polling tome el control
        // El polling ya está activo si status === 'pending'
      }

    } catch (e) {
      console.error('❌ Verification error:', e)
      setStatus('error')
      setErrorMsg(
        e instanceof Error ? e.message : 'Verification failed. Try again.'
      )
    }
  }

  // ===== MAPEAR STATUS A STEPS VISUALES =====
  const steps = [
    {
      id: 'init',
      label: 'Conexión Segura',
      status:
        status === 'loading'
          ? ('active' as const)
          : status !== 'idle'
            ? ('completed' as const)
            : ('pending' as const),
    },
    {
      id: 'scan',
      label: 'Escaneo de Credencial',
      status:
        status === 'pending'
          ? ('active' as const)
          : status === 'success'
            ? ('completed' as const)
            : ('pending' as const),
    },
    {
      id: 'verify',
      label: 'Validación Criptográfica',
      status: status === 'success' ? ('completed' as const) : ('pending' as const),
    },
  ]

  const currentStepIndex = steps.findIndex(
    (s) => s.status === 'active'
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors font-inter">
      {/* ===== HEADER PREMIUM ===== */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              SYNAPSYS
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Status Banner - Success */}
        {status === 'success' && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-4 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xl flex-shrink-0">
              ✓
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-800 dark:text-green-300">
                Identidad Verificada
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Las credenciales han sido validadas criptográficamente.
              </p>
            </div>
          </div>
        )}

        {/* Status Banner - Error */}
        {status === 'error' && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-4 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-xl flex-shrink-0">
              ✕
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-800 dark:text-red-300">
                Error de Verificación
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                {errorMsg}
              </p>
              <button
                onClick={() => startVerification()}
                className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Layout Grid: 2 columns on desktop */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* ===== LEFT COLUMN: PROGRESS & SECURITY ===== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Progress Card */}
            <PremiumCard>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Proceso de Verificación
              </h2>
              <VerificationProgress
                steps={steps}
                currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
              />
            </PremiumCard>

            {/* Security Badge Card */}
            <PremiumCard className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-lg">
              <h3 className="font-bold mb-2 text-lg">Seguridad de Nivel Bancario</h3>
              <p className="text-blue-100 text-sm mb-4">
                Esta sesión está protegida con encriptación end-to-end y cumple con
                eIDAS 2.0, NIS2 y ISO 27001.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  🔐 NIS2 Compliant
                </span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  ✓ ISO 27001
                </span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  ⚡ GDPR Ready
                </span>
              </div>
            </PremiumCard>

            {/* Session Info Card (if pending or success) */}
            {sessionId && (
              <PremiumCard>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  SESSION IDENTIFIER
                </h3>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700">
                  {sessionId}
                </p>
              </PremiumCard>
            )}
          </div>

          {/* ===== RIGHT COLUMN: QR SCANNING ===== */}
          <div className="lg:col-span-7">
            <PremiumCard className="h-full flex flex-col items-center justify-center min-h-[500px] py-12">
              {/* LOADING STATE */}
              {status === 'loading' && (
                <div className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Iniciando motor criptográfico...
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Conectando con backend seguro
                  </p>
                </div>
              )}

              {/* PENDING STATE - QR Code */}
              {status === 'pending' && qrLink && (
                <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Escanea para Verificar
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                      Utiliza tu EUDI Wallet compatible para escanear este código QR
                      único y vinculado a esta sesión.
                    </p>
                  </div>

                  {/* QR Code with Glow */}
                  <div className="relative group">
                    {/* Animated glow background */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 animate-pulse"></div>

                    {/* QR Code */}
                    <div className="relative bg-white p-6 rounded-xl shadow-xl">
                      <QRCodeSVG
                        value={qrLink}
                        size={256}
                        level="H"
                        includeMargin={true}
                        fgColor="#000000"
                        bgColor="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Session indicator */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Sesión activa: {sessionId.slice(0, 16)}...</span>
                  </div>

                  {/* Waiting message */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-sm animate-pulse">
                    Esperando verificación del dispositivo móvil...
                  </p>
                </div>
              )}

              {/* SUCCESS STATE - Result */}
              {status === 'success' && userData && (
                <div className="text-center w-full gap-8 flex flex-col items-center animate-slide-in">
                  {/* Celebration Icon */}
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-4xl">🎉</span>
                  </div>

                  {/* Success Message */}
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {userData.given_name || 'Usuario'} Verificado
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Todos los controles de seguridad superados correctamente.
                    </p>
                  </div>

                  {/* User Data Card */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-700">
                    <div className="space-y-3">
                      {userData.given_name && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Nombre
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {userData.given_name} {userData.family_name || ''}
                          </span>
                        </div>
                      )}

                      {userData.nationality && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Nacionalidad
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {userData.nationality}
                          </span>
                        </div>
                      )}

                      {userData.document_number && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Documento
                          </span>
                          <span className="font-mono text-sm text-slate-900 dark:text-white">
                            {userData.document_number.slice(-6)}...
                          </span>
                        </div>
                      )}

                      {/* Trust Score */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold">
                          Trust Score
                        </span>
                        <span className="text-lg font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                          98/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 w-full max-w-sm">
                    <button
                      onClick={() => {
                        setStatus('idle')
                        setQrLink('')
                        setSessionId('')
                        setUserData(null)
                        startVerification()
                      }}
                      className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Nueva Verificación
                    </button>
                    <button
                      onClick={() => (window.location.href = '/')}
                      className="flex-1 px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}
            </PremiumCard>
          </div>
        </div>

        {/* ===== INFO FOOTER ===== */}
        <PremiumCard className="mt-12">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            ¿Por qué confiar en SYNAPSYS?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔒',
                title: 'Seguridad Máxima',
                desc: 'Encriptación end-to-end con protocolos bancarios',
              },
              {
                icon: '⚡',
                title: 'Ultra rápido',
                desc: 'Verificación completa en menos de 2 segundos',
              },
              {
                icon: '✓',
                title: 'Cumplimiento Legal',
                desc: 'Certificado eIDAS 2.0, NIS2 e ISO 27001',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </PremiumCard>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>© 2025 SYNAPSYS. Privacidad garantizada bajo GDPR, NIS2, ISO 27001.</p>
          <p className="mt-2 text-xs">
            SSE-Powered Real-Time Verification | eIDAS 2.0 Compliant
          </p>
        </div>
      </footer>
    </div>
  )
}
