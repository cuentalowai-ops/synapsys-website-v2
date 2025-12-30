import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    console.log('🚀 [API] Iniciando flujo de verificación...');

    // 1. DIAGNÓSTICO DE ENTORNO
    const envCheck = {
      KV_URL: !!process.env.KV_URL,
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      VERIFIER_PRIVATE_KEY: !!process.env.VERIFIER_PRIVATE_KEY,
    };
    console.log('🔍 [API] Env Check:', envCheck);

    if (!process.env.KV_URL && !process.env.KV_REST_API_URL) {
      throw new Error('CRITICAL: KV_URL o KV_REST_API_URL debe estar definida en las variables de entorno.');
    }

    // 2. GENERACIÓN DE SESIÓN (MOCK DE CRIPTOGRAFÍA TEMPORAL)
    // Usamos un mock para aislar si el fallo es Redis o la librería OID4VP
    const sessionId = crypto.randomUUID();
    const nonce = crypto.randomUUID();
    
    // URL simulada que cumple el formato pero no requiere firma criptográfica aún
    const mockQrLink = `openid4vp://authorize?client_id=synapsys.io&request_uri=https://thesynapsys.io/api/verify/request/${sessionId}&nonce=${nonce}`;

    console.log(`💾 [API] Creando sesión en Redis: ${sessionId}`);
    
    // 3. PERSISTENCIA EN REDIS (KV)
    await createSession(sessionId, { 
      qrLink: mockQrLink,
      state: 'pending' 
    });

    console.log('✅ [API] Sesión creada exitosamente');

    return NextResponse.json({
      success: true,
      session_id: sessionId,
      qr_link: mockQrLink,
      debug_info: {
        env: envCheck,
        mode: 'DEBUG_BYPASS_CRYPTO'
      }
    });

  } catch (error: any) {
    console.error('❌ [API] FATAL ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
