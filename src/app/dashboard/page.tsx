'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTheme } from '@/contexts/theme-context'
import { DataCard } from '@/components/ui/DataCard'
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
    <div className="min-h-screen bg-void text-text-primary font-sans relative selection:bg-truth/30 overflow-x-hidden">
      {/* ===== HEADER LUMINOUS VOID (Idéntico a Landing) ===== */}
      <header className="sticky top-0 z-50 border-b border-structure bg-void/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-truth flex items-center justify-center text-truth font-mono text-xs">
              S
            </div>
            <span className="text-lg font-display font-bold uppercase tracking-tight">
              SYNAPSYS
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="/#technology" className="text-data text-text-muted hover:text-truth transition-colors">
              TECHNOLOGY
            </a>
            <a href="/#trust" className="text-data text-text-muted hover:text-truth transition-colors">
              TRUST
            </a>
            <Link href="/dashboard" className="text-data text-text-primary hover:text-truth transition-colors">
              DASHBOARD
            </Link>
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2 border border-structure hover:border-truth hover:text-truth transition-colors h-12 w-12"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* ===== MAIN CONTENT - GRID BRUTALISTA ===== */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
        {/* Status Banner - Success */}
        {status === 'success' && (
          <div className="border-b border-structure bg-void p-4 flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-truth flex items-center justify-center text-truth text-xs font-mono">
              OK
            </div>
            <div className="flex-1">
              <h3 className="font-sans font-bold text-text-primary">
                Identidad Verificada
              </h3>
              <p className="text-sm font-sans text-text-muted">
                Las credenciales han sido validadas criptográficamente.
              </p>
            </div>
          </div>
        )}

        {/* Status Banner - Error */}
        {status === 'error' && (
          <div className="border-b border-structure bg-void p-4 flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-red-500 flex items-center justify-center text-red-400 text-xs font-mono">
              ERR
            </div>
            <div className="flex-1">
              <h3 className="font-sans font-bold text-text-primary">
                Error de Verificación
              </h3>
              <p className="text-sm font-sans text-text-muted">
                {errorMsg}
              </p>
              <button
                onClick={() => startVerification()}
                className="mt-2 px-4 py-2 text-sm font-sans text-truth border border-truth/30 hover:border-truth hover:bg-truth/10 h-12"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Layout Grid: Retícula Estricta */}
        <section className="border-b border-structure py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-structure">
            {/* ===== LEFT COLUMN: PROGRESS & SECURITY ===== */}
            <div className="col-span-1 md:col-span-5 border-b md:border-b-0 md:border-r border-structure">
            {/* Progress Section */}
            <div className="border-b border-structure p-6">
              <h2 className="text-lg font-display font-bold uppercase tracking-widest text-text-primary mb-6">
                PROCESO DE VERIFICACIÓN
              </h2>
              <VerificationProgress
                steps={steps}
                currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
              />
            </div>

            {/* Security Badges - Estilo Código */}
            <div className="border-b border-structure p-6 bg-void-surface/50">
              <h3 className="text-sm font-sans font-bold text-text-primary mb-4">COMPLIANCE</h3>
              <div className="space-y-2">
                <div className="bg-truth/10 px-2 py-1 text-xs font-mono text-truth border border-truth/20">
                  NIS2_COMPLIANT
                </div>
                <div className="bg-truth/10 px-2 py-1 text-xs font-mono text-truth border border-truth/20">
                  ISO_27001
                </div>
                <div className="bg-truth/10 px-2 py-1 text-xs font-mono text-truth border border-truth/20">
                  GDPR_READY
                </div>
              </div>
            </div>

            {/* Session Info - Estilo Técnico */}
            {sessionId && (
              <div className="p-6">
                <h3 className="text-xs font-mono text-text-muted mb-2 uppercase">
                  SESSION_ID
                </h3>
                <div className="bg-void-surface/50 p-3 border border-structure">
                  <p className="text-xs font-mono text-text-primary break-all">
                    {sessionId}
                  </p>
                </div>
              </div>
            )}
            </div>

            {/* ===== RIGHT COLUMN: QR SCANNING ===== */}
            <div className="col-span-1 md:col-span-7">
            <div className="p-6 min-h-[500px] flex flex-col items-center justify-center border-b border-structure">
              {/* LOADING STATE */}
              {status === 'loading' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-truth border-t-transparent animate-spin"></div>
                  <p className="text-sm font-sans text-text-muted">
                    Iniciando motor criptográfico...
                  </p>
                  <p className="text-xs font-mono text-text-muted">
                    CONNECTING_TO_BACKEND
                  </p>
                </div>
              )}

              {/* PENDING STATE - QR Code */}
              {status === 'pending' && qrLink && (
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="text-center">
                    <h2 className="text-xl font-sans font-bold text-text-primary mb-2">
                      Escanea para Verificar
                    </h2>
                    <p className="text-sm font-sans text-text-muted max-w-sm mx-auto">
                      Utiliza tu EUDI Wallet compatible para escanear este código QR
                      único y vinculado a esta sesión.
                    </p>
                  </div>

                  {/* QR Code - Cuadrado de Luz Perfecto */}
                  <div className="relative border border-truth/30 p-6 bg-void">
                    <div className="absolute inset-0 border border-truth/20"></div>
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
                  <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                    <span className="w-2 h-2 bg-truth animate-pulse"></span>
                    <span>SESSION_ACTIVE: {sessionId.slice(0, 16)}...</span>
                  </div>

                  {/* Waiting message */}
                  <p className="text-xs font-mono text-text-muted text-center">
                    WAITING_FOR_VERIFICATION...
                  </p>
                </div>
              )}

              {/* SUCCESS STATE - Result */}
              {status === 'success' && userData && (
                <div className="text-center w-full gap-6 flex flex-col items-center">
                  {/* Success Indicator */}
                  <div className="w-16 h-16 border-2 border-truth flex items-center justify-center text-truth text-2xl font-mono glow-truth">
                    ✓
                  </div>

                  {/* Success Message */}
                  <div>
                    <h2 className="text-2xl font-sans font-bold text-text-primary mb-2">
                      {userData.given_name || 'Usuario'} Verificado
                    </h2>
                    <p className="text-sm font-sans text-text-muted">
                      Todos los controles de seguridad superados correctamente.
                    </p>
                  </div>

                  {/* User Data - Estilo Técnico */}
                  <div className="bg-void-surface/50 border border-structure p-6 w-full max-w-sm">
                    <div className="space-y-3">
                      {userData.given_name && (
                        <div className="flex justify-between items-center border-b border-structure pb-2">
                          <span className="text-xs font-mono text-text-muted uppercase">
                            NAME
                          </span>
                          <span className="text-sm font-sans text-text-primary">
                            {userData.given_name} {userData.family_name || ''}
                          </span>
                        </div>
                      )}

                      {userData.nationality && (
                        <div className="flex justify-between items-center border-b border-structure pb-2">
                          <span className="text-xs font-mono text-text-muted uppercase">
                            NATIONALITY
                          </span>
                          <span className="text-sm font-sans text-text-primary">
                            {userData.nationality}
                          </span>
                        </div>
                      )}

                      {userData.document_number && (
                        <div className="flex justify-between items-center border-b border-structure pb-2">
                          <span className="text-xs font-mono text-text-muted uppercase">
                            DOCUMENT
                          </span>
                          <span className="text-xs font-mono text-text-primary">
                            {userData.document_number.slice(-6)}...
                          </span>
                        </div>
                      )}

                      {/* Trust Score */}
                      <div className="pt-2 border-t-2 border-structure flex justify-between items-center">
                        <span className="text-xs font-mono text-text-muted uppercase">
                          TRUST_SCORE
                        </span>
                        <span className="text-lg font-mono text-truth">
                          98/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                    <button
                      onClick={() => {
                        setStatus('idle')
                        setQrLink('')
                        setSessionId('')
                        setUserData(null)
                        startVerification()
                      }}
                      className="flex-1 px-6 py-3 bg-truth text-void border border-truth hover:glow-truth hover:bg-truth-500 font-sans text-sm h-12"
                    >
                      Nueva Verificación
                    </button>
                    <button
                      onClick={() => (window.location.href = '/')}
                      className="flex-1 px-6 py-3 border border-structure text-text-primary hover:border-truth hover:text-truth font-sans text-sm h-12"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        </section>

        {/* ===== INFO FOOTER - Estilo Técnico ===== */}
        <section className="border-b border-structure py-12 md:py-24">
          <h3 className="text-lg font-display font-bold uppercase tracking-widest text-text-primary mb-6">
            ¿POR QUÉ CONFIAR EN SYNAPSYS?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-structure">
            {[
              {
                title: 'SEGURIDAD MÁXIMA',
                desc: 'ENCRYPTION END-TO-END // 2048-BIT RSA & ECC',
              },
              {
                title: 'ULTRA RÁPIDO',
                desc: 'VERIFICATION COMPLETE IN &lt; 2S // EDGE COMPUTING',
              },
              {
                title: 'CUMPLIMIENTO LEGAL',
                desc: 'CERTIFIED EIDAS 2.0 // NIS2 // ISO 27001',
              },
            ].map((item, i) => (
              <DataCard key={i} border={i < 2 ? 'r' : 'none'}>
                <h4 className="font-display font-semibold uppercase tracking-wide text-text-primary mb-2 text-sm">
                  {item.title}
                </h4>
                <p className="text-xs font-mono text-text-muted">
                  {item.desc}
                </p>
              </DataCard>
            ))}
          </div>
        </section>
        </div>
      </main>

      {/* ===== FOOTER LUMINOUS VOID (Idéntico a Landing) ===== */}
      <footer className="border-t border-structure py-8 px-4 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 border-b border-structure pb-8 mb-8">
            <div>
              <h4 className="text-data text-text-primary uppercase mb-4">SYSTEM</h4>
              <ul className="space-y-2">
                <li><a href="/#technology" className="text-data text-text-muted hover:text-truth">TECHNOLOGY</a></li>
                <li><a href="/#trust" className="text-data text-text-muted hover:text-truth">TRUST</a></li>
                <li><Link href="/dashboard" className="text-data text-text-muted hover:text-truth">DASHBOARD</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-data text-text-primary uppercase mb-4">COMPLIANCE</h4>
              <ul className="space-y-2">
                <li className="text-data text-text-muted">GDPR Art. 5</li>
                <li className="text-data text-text-muted">eIDAS 2.0</li>
                <li className="text-data text-text-muted">NIS2</li>
              </ul>
            </div>
            <div>
              <h4 className="text-data text-text-primary uppercase mb-4">STATUS</h4>
              <div className="space-y-2">
                <div className="text-data text-text-muted text-xs">
                  UPTIME: 99.9%
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-data text-text-muted text-xs">
              © 2025 SYNAPSYS // THE TRUST PROTOCOL FOR EUROPE // SSE-POWERED REAL-TIME VERIFICATION
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
