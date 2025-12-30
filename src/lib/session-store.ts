import { kv } from '@vercel/kv';

export interface SessionData {
  sessionId: string;
  state: 'pending' | 'verified' | 'failed';
  qrLink?: string;
  userData?: any;
  createdAt: number;
  expiresAt?: number;
}

// CONSTANTES
const SESSION_TTL = 600; // 10 minutos

/**
 * Crea una nueva sesión en Redis (Stateless)
 */
export async function createSession(
  sessionId: string,
  data: Partial<SessionData> = {}
): Promise<SessionData> {
  const session: SessionData = {
    sessionId,
    state: 'pending',
    createdAt: Date.now(),
    ...data
  };
  
  await kv.set(`session:${sessionId}`, session, { ex: SESSION_TTL });
  console.log(`✅ [SessionStore] Created session: ${sessionId}`);
  
  return session;
}

/**
 * Lee una sesión desde Redis (Stateless)
 */
export async function getSession(sessionId: string): Promise<SessionData | null> {
  try {
    const session = await kv.get<SessionData>(`session:${sessionId}`);
    return session || null;
  } catch (error) {
    console.error(`❌ [SessionStore] Error getting session:`, error);
    return null;
  }
}

/**
 * Actualiza el estado de una sesión en Redis (Stateless)
 */
export async function updateSessionState(
  sessionId: string,
  newState: 'verified' | 'failed',
  userData?: any
): Promise<SessionData | null> {
  const session = await getSession(sessionId);
  
  if (!session) {
    console.error(`⚠️ [SessionStore] Session ${sessionId} not found for update`);
    return null;
  }

  const updatedSession: SessionData = {
    ...session,
    state: newState,
    userData: userData || session.userData
  };
  
  await kv.set(`session:${sessionId}`, updatedSession, { ex: SESSION_TTL });
  console.log(`🔄 [SessionStore] Session updated: ${sessionId} → ${newState}`);
  
  return updatedSession;
}

/**
 * Elimina una sesión de Redis (Stateless)
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await kv.del(`session:${sessionId}`);
    console.log(`🗑️ [SessionStore] Session deleted: ${sessionId}`);
  } catch (error) {
    console.error(`❌ [SessionStore] Error deleting session:`, error);
  }
}
