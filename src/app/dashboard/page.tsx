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
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      {/* ===== HEADER BRUTALISTA ===== */}
      <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white font-bold text-sm border border-blue-700">
              S
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              SYNAPSYS
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ===== MAIN CONTENT - RETÍCULA ESTRICTA ===== */}
      <main className="max-w-7xl mx-auto">
        {/* Status Banner - Success */}
        {status === 'success' && (
          <div className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-black p-4 flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-green-600 flex items-center justify-center text-green-600 text-sm font-mono">
              OK
            </div>
            <div className="flex-1">
              <h3 className="font-sans font-bold text-gray-900 dark:text-white">
                Identidad Verificada
              </h3>
              <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                Las credenciales han sido validadas criptográficamente.
              </p>
            </div>
          </div>
        )}

        {/* Status Banner - Error */}
        {status === 'error' && (
          <div className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-black p-4 flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-red-600 flex items-center justify-center text-red-600 text-sm font-mono">
              ERR
            </div>
            <div className="flex-1">
              <h3 className="font-sans font-bold text-gray-900 dark:text-white">
                Error de Verificación
              </h3>
              <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                {errorMsg}
              </p>
              <button
                onClick={() => startVerification()}
                className="mt-2 text-sm font-sans text-blue-600 hover:underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Layout Grid: Retícula Estricta */}
        <div className="grid grid-cols-12 border-b border-gray-300 dark:border-gray-700">
          {/* ===== LEFT COLUMN: PROGRESS & SECURITY ===== */}
          <div className="col-span-12 lg:col-span-5 border-r border-gray-300 dark:border-gray-700">
            {/* Progress Section */}
            <div className="border-b border-gray-300 dark:border-gray-700 p-6">
              <h2 className="text-lg font-sans font-bold text-gray-900 dark:text-white mb-6">
                Proceso de Verificación
              </h2>
              <VerificationProgress
                steps={steps}
                currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
              />
            </div>

            {/* Security Badges - Estilo Código */}
            <div className="border-b border-gray-300 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-sm font-sans font-bold text-gray-900 dark:text-white mb-4">COMPLIANCE</h3>
              <div className="space-y-2">
                <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                  NIS2_COMPLIANT
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                  ISO_27001
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                  GDPR_READY
                </div>
              </div>
            </div>

            {/* Session Info - Estilo Técnico */}
            {sessionId && (
              <div className="p-6">
                <h3 className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-2 uppercase">
                  SESSION_ID
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 border border-gray-300 dark:border-gray-700">
                  <p className="text-xs font-mono text-gray-900 dark:text-white break-all">
                    {sessionId}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===== RIGHT COLUMN: QR SCANNING ===== */}
          <div className="col-span-12 lg:col-span-7">
            <div className="p-6 min-h-[500px] flex flex-col items-center justify-center border-b border-gray-300 dark:border-gray-700">
              {/* LOADING STATE */}
              {status === 'loading' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent animate-spin"></div>
                  <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                    Iniciando motor criptográfico...
                  </p>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-500">
                    CONNECTING_TO_BACKEND
                  </p>
                </div>
              )}

              {/* PENDING STATE - QR Code */}
              {status === 'pending' && qrLink && (
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="text-center">
                    <h2 className="text-xl font-sans font-bold text-gray-900 dark:text-white mb-2">
                      Escanea para Verificar
                    </h2>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                      Utiliza tu EUDI Wallet compatible para escanear este código QR
                      único y vinculado a esta sesión.
                    </p>
                  </div>

                  {/* QR Code - Marco Técnico */}
                  <div className="border-2 border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-black">
                    <QRCodeSVG
                      value={qrLink}
                      size={256}
                      level="H"
                      includeMargin={true}
                      fgColor="#000000"
                      bgColor="#ffffff"
                    />
                  </div>

                  {/* Session indicator - Estilo Técnico */}
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <span className="w-2 h-2 bg-blue-600"></span>
                    <span>SESSION_ACTIVE: {sessionId.slice(0, 16)}...</span>
                  </div>

                  {/* Waiting message */}
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 text-center">
                    WAITING_FOR_VERIFICATION...
                  </p>
                </div>
              )}

              {/* SUCCESS STATE - Result */}
              {status === 'success' && userData && (
                <div className="text-center w-full gap-6 flex flex-col items-center">
                  {/* Success Indicator */}
                  <div className="w-16 h-16 border-2 border-green-600 flex items-center justify-center text-green-600 text-2xl font-mono">
                    ✓
                  </div>

                  {/* Success Message */}
                  <div>
                    <h2 className="text-2xl font-sans font-bold text-gray-900 dark:text-white mb-2">
                      {userData.given_name || 'Usuario'} Verificado
                    </h2>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                      Todos los controles de seguridad superados correctamente.
                    </p>
                  </div>

                  {/* User Data - Estilo Técnico */}
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-6 w-full max-w-sm">
                    <div className="space-y-3">
                      {userData.given_name && (
                        <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-2">
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">
                            NAME
                          </span>
                          <span className="text-sm font-sans text-gray-900 dark:text-white">
                            {userData.given_name} {userData.family_name || ''}
                          </span>
                        </div>
                      )}

                      {userData.nationality && (
                        <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-2">
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">
                            NATIONALITY
                          </span>
                          <span className="text-sm font-sans text-gray-900 dark:text-white">
                            {userData.nationality}
                          </span>
                        </div>
                      )}

                      {userData.document_number && (
                        <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-2">
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">
                            DOCUMENT
                          </span>
                          <span className="text-xs font-mono text-gray-900 dark:text-white">
                            {userData.document_number.slice(-6)}...
                          </span>
                        </div>
                      )}

                      {/* Trust Score */}
                      <div className="pt-2 border-t-2 border-gray-300 dark:border-gray-700 flex justify-between items-center">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">
                          TRUST_SCORE
                        </span>
                        <span className="text-lg font-mono text-blue-600">
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
                      className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white border border-blue-700 font-sans text-sm"
                    >
                      Nueva Verificación
                    </button>
                    <button
                      onClick={() => (window.location.href = '/')}
                      className="flex-1 px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 font-sans text-sm"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== INFO FOOTER - Estilo Técnico ===== */}
        <div className="border-b border-gray-300 dark:border-gray-700 p-6">
          <h3 className="text-lg font-sans font-bold text-gray-900 dark:text-white mb-6">
            ¿Por qué confiar en SYNAPSYS?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Seguridad Máxima',
                desc: 'Encriptación end-to-end con protocolos bancarios',
              },
              {
                title: 'Ultra rápido',
                desc: 'Verificación completa en menos de 2 segundos',
              },
              {
                title: 'Cumplimiento Legal',
                desc: 'Certificado eIDAS 2.0, NIS2 e ISO 27001',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-300 dark:border-gray-700 p-4"
              >
                <h4 className="font-sans font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-sm font-sans text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ===== FOOTER BRUTALISTA ===== */}
      <footer className="border-t border-gray-300 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-mono text-gray-500 dark:text-gray-400">
          <p>© 2025 SYNAPSYS. Privacidad garantizada bajo GDPR, NIS2, ISO 27001.</p>
          <p className="mt-2">
            SSE-Powered Real-Time Verification | eIDAS 2.0 Compliant
          </p>
        </div>
      </footer>
    </div>
  )
}
