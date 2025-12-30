"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Check, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type VerificationState = "idle" | "loading" | "pending" | "success" | "error"

interface VerificationSession {
  session_id: string
  qr_link: string
  qr_payload: string
  expires_at: string
}

export function QRVerification() {
  const [state, setState] = useState<VerificationState>("idle")
  const [session, setSession] = useState<VerificationSession | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [userData, setUserData] = useState<Record<string, any> | null>(null)

  // Timer para expiración
  useEffect(() => {
    if (!session || state !== "pending") return

    const interval = setInterval(() => {
      const expires = new Date(session.expires_at).getTime()
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((expires - now) / 1000))
      
      setTimeRemaining(remaining)
      
      if (remaining === 0) {
        setState("error")
        setError("Sesión expirada. Por favor, genera un nuevo QR.")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [session, state])

  const generateQR = async () => {
    setState("loading")
    setError(null)
    setSession(null)

    try {
      const response = await fetch("/api/verify/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Error al generar QR")
      }

      const data = await response.json()
      
      if (data.success && data.qr_link) {
        setSession({
          session_id: data.session_id,
          qr_link: data.qr_link,
          qr_payload: data.qr_payload,
          expires_at: data.expires_at,
        })
        setState("pending")
        
        // Inicializar timer
        const expires = new Date(data.expires_at).getTime()
        const now = Date.now()
        setTimeRemaining(Math.max(0, Math.floor((expires - now) / 1000)))

        // ═══════════════════════════════════════════════════════
        // CONECTAR SISTEMA NERVIOSO - SSE LISTENERS
        // ═══════════════════════════════════════════════════════
        
        console.log('🔌 [QRVerification] Opening SSE connection for session:', data.session_id);
        
        const eventSource = new EventSource(
          `/api/verify/events?session_id=${data.session_id}`
        );

        // Escuchar evento "verified"
        eventSource.addEventListener('verified', (event) => {
          console.log('✅ [QRVerification] Verification event received!');
          
          try {
            const verifiedData = JSON.parse(event.data);
            console.log('📊 [QRVerification] Verified data:', verifiedData);
            
            setState("success");
            setUserData(verifiedData.userData || {});
            
            eventSource.close();
            console.log('🔌 [QRVerification] SSE connection closed (verified)');
          } catch (err) {
            console.error('❌ [QRVerification] Error parsing event data:', err);
          }
        });

        // Escuchar evento de error personalizado (desde el servidor)
        // Nota: El servidor envía un evento 'error' con datos JSON
        eventSource.addEventListener('error', (event: MessageEvent) => {
          console.error('❌ [QRVerification] Verification error event received!');
          
          try {
            const errorData = JSON.parse(event.data);
            setState("error");
            setError(errorData.error || 'Verification failed');
          } catch {
            setState("error");
            setError('Verification failed');
          }
          
          eventSource.close();
        });

        // Escuchar evento de conexión
        eventSource.addEventListener('connected', (event) => {
          console.log('🔌 [QRVerification] SSE Connected:', event.data);
        });

        // Manejo de errores de conexión SSE
        eventSource.onerror = (err) => {
          console.error('❌ [QRVerification] SSE connection error:', err);
          // Solo cerrar si es un error crítico, no en reconexión
          if (eventSource.readyState === EventSource.CLOSED) {
            setState("error");
            setError('Connection failed');
            eventSource.close();
          }
        };

        // Guardar referencia global para cleanup
        (window as any).__verificationEventSource = eventSource;
      } else {
        throw new Error("Respuesta inválida del servidor")
      }
    } catch (err: any) {
      console.error("❌ Error generating QR:", err)
      setState("error")
      setError(err.message || "Error al generar código QR")
    }
  }

  const copyToClipboard = async () => {
    if (!session?.qr_link) return

    try {
      await navigator.clipboard.writeText(session.qr_link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error copying to clipboard:", err)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Cleanup SSE on unmount
  useEffect(() => {
    return () => {
      const eventSource = (window as any).__verificationEventSource;
      if (eventSource) {
        console.log('🔌 [QRVerification] Cleaning up SSE connection on unmount');
        eventSource.close();
        (window as any).__verificationEventSource = null;
      }
    };
  }, []);

  // Reset function with SSE cleanup
  const reset = () => {
    // ═══════════════════════════════════════════════════════
    // LIMPIAR CONEXIÓN SSE
    // ═══════════════════════════════════════════════════════
    const eventSource = (window as any).__verificationEventSource;
    if (eventSource) {
      console.log('🔌 [QRVerification] Closing SSE connection');
      eventSource.close();
      (window as any).__verificationEventSource = null;
    }
    
    setState("idle");
    setSession(null);
    setError(null);
    setCopied(false);
    setUserData(null);
    setTimeRemaining(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Verificación EUDI Wallet
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Escanea el código QR con tu wallet EUDI para verificar tu identidad
        </p>
      </div>

      {/* Main Card */}
      <Card className="glass-card border-2">
        <CardHeader>
          <CardTitle className="text-xl">Código QR de Verificación</CardTitle>
          <CardDescription>
            {state === "idle" && "Genera un código QR para iniciar la verificación"}
            {state === "loading" && "Generando código QR..."}
            {state === "pending" && "Escanea el código QR con tu wallet EUDI"}
            {state === "success" && "Verificación completada exitosamente"}
            {state === "error" && "Error en la verificación"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code Display */}
          {state === "pending" && session && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative p-4 bg-white rounded-xl border-2 border-teal-200/50 shadow-lg">
                <QRCodeSVG
                  value={session.qr_link}
                  size={280}
                  level="M"
                  includeMargin={true}
                  fgColor="#1f2937"
                  bgColor="#ffffff"
                />
                {timeRemaining !== null && timeRemaining > 0 && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {formatTime(timeRemaining)}
                  </div>
                )}
              </div>

              {/* Session Info */}
              <div className="w-full max-w-md space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Session ID:</span>
                  <span className="font-mono text-xs text-gray-800 dark:text-gray-200">
                    {session.session_id.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Expira en:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {timeRemaining !== null ? formatTime(timeRemaining) : "Calculando..."}
                  </span>
                </div>
              </div>

              {/* Copy Link Button */}
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full max-w-md"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    Link copiado
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar link de verificación
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Loading State */}
          {state === "loading" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">
                Generando código QR de verificación...
              </p>
            </div>
          )}

          {/* Success State */}
          {state === "success" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Verificación completada
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tu identidad ha sido verificada exitosamente
              </p>
              {userData && Object.keys(userData).length > 0 && (
                <div className="mt-4 w-full max-w-md p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Datos verificados:
                  </p>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {Object.entries(userData).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {state === "error" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Error en la verificación
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 text-center max-w-md">
                {error || "Ocurrió un error durante la verificación"}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {state === "idle" && (
              <Button
                onClick={generateQR}
                className="w-full sm:w-auto bg-gradient-coral-amber text-gray-800 hover:opacity-90 glow-coral"
                size="lg"
              >
                Generar QR de Verificación
              </Button>
            )}

            {(state === "pending" || state === "error") && (
              <Button
                onClick={reset}
                variant="outline"
                className="w-full sm:w-auto"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generar Nuevo QR
              </Button>
            )}

            {state === "success" && (
              <Button
                onClick={reset}
                className="w-full sm:w-auto bg-gradient-coral-amber text-gray-800 hover:opacity-90 glow-coral"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Nueva Verificación
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      {state === "pending" && (
        <Card className="border-teal-200/50 bg-teal-50/50 dark:bg-teal-900/10">
          <CardHeader>
            <CardTitle className="text-lg">Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Abre tu aplicación de wallet EUDI en tu móvil</li>
              <li>Selecciona la opción "Escanear QR" o "Verificar identidad"</li>
              <li>Apunta la cámara al código QR mostrado arriba</li>
              <li>Revisa los datos solicitados y autoriza la verificación</li>
              <li>Espera la confirmación de verificación exitosa</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

