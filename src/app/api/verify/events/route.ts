import { NextRequest } from 'next/server';
import { sessionStore } from '@/lib/session-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    console.error('❌ [/api/verify/events] Missing session_id');
    return new Response('Missing session_id', { status: 400 });
  }

  console.log(`🔌 [/api/verify/events] SSE connection requested for: ${sessionId}`);

  // Check if session exists in Redis
  const session = await sessionStore.getSession(sessionId);
  if (!session) {
    console.warn(`⚠️ [/api/verify/events] Session not found: ${sessionId}`);
    return new Response('Session not found or expired', { status: 404 });
  }

  const encoder = new TextEncoder();
  let isClosed = false;

  const customResponse = new Response(
    new ReadableStream({
      start(controller) {
        console.log(`📡 [/api/verify/events] ReadableStream started for ${sessionId}`);

        // Send initial connection message
        try {
          const initialMsg = `event: connected\ndata: {"status":"connected","sessionId":"${sessionId}"}\n\n`;
          controller.enqueue(encoder.encode(initialMsg));
          console.log(`✅ [/api/verify/events] Initial message sent`);
        } catch (error) {
          console.error('Error sending initial message:', error);
          controller.close();
          return;
        }

        // Register listener
        sessionStore.addListener(sessionId, controller);

        // Cleanup on client disconnect
        const cleanup = () => {
          if (!isClosed) {
            isClosed = true;
            sessionStore.removeListener(sessionId, controller);
            console.log(`🔌 [/api/verify/events] SSE connection closed for ${sessionId}`);
          }
        };

        request.signal.addEventListener('abort', cleanup);
      },

      cancel() {
        console.log(`⚠️ [/api/verify/events] Stream cancelled for ${sessionId}`);
        sessionStore.removeListener(sessionId, undefined);
      }
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    }
  );

  return customResponse;
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

