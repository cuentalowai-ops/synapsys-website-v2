import { NextRequest, NextResponse } from 'next/server';
import { getSession, updateSessionState } from '@/lib/session-store';
import { notifySuccess, notifyError } from '@/lib/notifier';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, state, user_data, error } = body;

    console.log(`\n📥 [/api/verify/callback] Request received`);
    console.log(`   session_id: ${session_id}`);
    console.log(`   state: ${state}`);

    if (!session_id) {
      console.error('❌ [/api/verify/callback] Missing session_id');
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    // Get session from Redis (Stateless)
    const session = await getSession(session_id);
    if (!session) {
      console.warn(`⚠️ [/api/verify/callback] Session not found: ${session_id}`);
      return NextResponse.json(
        { error: 'Session not found or expired' },
        { status: 404 }
      );
    }

    if (state === 'verified') {
      console.log(`✅ [/api/verify/callback] Verification successful`);

      const startTime = Date.now();

      // Update session state in Redis (Stateless)
      await updateSessionState(session_id, 'verified', user_data);

      const latency = Date.now() - startTime;

      console.log(`📤 [/api/verify/callback] Session updated in Redis (polling will detect)`);

      // Send webhook notification (async, no await to avoid blocking)
      // ✅ GDPR: Solo metadatos, sin PII
      notifySuccess(
        'Verification completed successfully',
        {
          latency,
          timestamp: new Date().toISOString(),
        }
      ).catch(err => console.error('⚠️ Notification error:', err));

      return NextResponse.json(
        {
          success: true,
          message: 'Verification processed'
        },
        { status: 200 }
      );
    } else if (state === 'failed') {
      console.log(`❌ [/api/verify/callback] Verification failed`);

      // Update session state in Redis (Stateless)
      await updateSessionState(session_id, 'failed');

      // Send webhook notification (async, no await to avoid blocking)
      // ✅ GDPR: Solo metadatos, sin PII
      notifyError(
        'Verification failed',
        {
          timestamp: new Date().toISOString(),
        }
      ).catch(err => console.error('⚠️ Notification error:', err));

      return NextResponse.json(
        {
          success: false,
          error: error || 'Verification failed'
        },
        { status: 400 }
      );
    } else {
      console.error(`❌ [/api/verify/callback] Invalid state: ${state}`);
      return NextResponse.json(
        { error: 'Invalid state value' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ [/api/verify/callback] Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
