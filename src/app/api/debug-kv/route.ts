import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // 1. Verificar variables de entorno (sin revelar secretos)
    const envStatus = {
      KV_URL: !!process.env.KV_URL,
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    };

    // 2. Intentar escritura
    const startWrite = performance.now();
    await kv.set('synapsys-probe', 'active', { ex: 60 });
    const writeTime = performance.now() - startWrite;

    // 3. Intentar lectura
    const startRead = performance.now();
    const value = await kv.get('synapsys-probe');
    const readTime = performance.now() - startRead;

    return NextResponse.json({
      status: 'online',
      checks: envStatus,
      latency: {
        write: `${writeTime.toFixed(2)}ms`,
        read: `${readTime.toFixed(2)}ms`
      },
      value_retrieved: value
    });

  } catch (error: any) {
    console.error('KV Debug Error:', error);
    return NextResponse.json({
      status: 'critical_failure',
      error: error.message,
      stack: error.stack,
      env_vars_present: {
        KV_URL: !!process.env.KV_URL,
        KV_REST_API_URL: !!process.env.KV_REST_API_URL,
        KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
      }
    }, { status: 500 });
  }
}

