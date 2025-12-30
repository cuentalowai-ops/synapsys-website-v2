import { kv } from '@vercel/kv';

// Interface para datos de sesión en Redis (sin listeners)
export interface SessionData {
  sessionId: string;
  createdAt: string; // ISO string para serialización
  expiresAt: string; // ISO string para serialización
  state: 'pending' | 'verified' | 'failed';
  userData?: Record<string, any>;
}

// Interface completa con listeners (solo en memoria, por lambda)
export interface SessionInfo {
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
  state: 'pending' | 'verified' | 'failed';
  userData?: Record<string, any>;
  listeners: Set<any>;
}

// Listeners SSE se mantienen en memoria local (por lambda instance)
// NOTA: En serverless, cada lambda tiene su propio Map, pero esto es OK para SSE
// porque SSE solo funciona mientras la conexión está activa en esa lambda
let listenersMap: Map<string, Set<any>> | null = null;

function getListenersMap(): Map<string, Set<any>> {
  if (!listenersMap) {
    listenersMap = new Map();
  }
  return listenersMap;
}

const encoder = new TextEncoder();
const TTL_SECONDS = 300; // 5 minutos

/**
 * Crea una nueva sesión en Redis
 */
export async function createSession(
  sessionId: string,
  expiresIn: number = 300000
): Promise<SessionInfo> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresIn);
  
  const sessionData: SessionData = {
    sessionId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    state: 'pending'
  };

  // Guardar en Redis con TTL
  const ttlSeconds = Math.floor(expiresIn / 1000);
  await kv.set(`session:${sessionId}`, sessionData, { ex: ttlSeconds });
  
  // Inicializar listeners en memoria (lazy)
  getListenersMap().set(sessionId, new Set());

  console.log(`✅ [SessionStore] Created session in Redis: ${sessionId} (TTL: ${ttlSeconds}s)`);
  
  // Retornar SessionInfo completo para compatibilidad
  return {
    ...sessionData,
    createdAt: now,
    expiresAt: expiresAt,
    listeners: getListenersMap().get(sessionId)!
  };
}

/**
 * Obtiene sesión desde Redis
 */
export async function getSession(sessionId: string): Promise<SessionInfo | undefined> {
  try {
    const sessionData = await kv.get<SessionData>(`session:${sessionId}`);
    
    if (!sessionData) {
      return undefined;
    }

    // Obtener listeners de memoria (lazy init si no existe)
    const listeners = getListenersMap().get(sessionId) || new Set();
    if (!getListenersMap().has(sessionId)) {
      getListenersMap().set(sessionId, listeners);
    }

    // Convertir strings ISO a Date
    return {
      ...sessionData,
      createdAt: new Date(sessionData.createdAt),
      expiresAt: new Date(sessionData.expiresAt),
      listeners
    };
  } catch (error) {
    console.error(`❌ [SessionStore] Error getting session from Redis:`, error);
    return undefined;
  }
}

/**
 * Añade un listener SSE (solo en memoria, por lambda)
 */
export function addListener(sessionId: string, controller: any): boolean {
  const listeners = getListenersMap();
  let listenerSet = listeners.get(sessionId);
  
  if (!listenerSet) {
    listenerSet = new Set();
    listeners.set(sessionId, listenerSet);
  }
  
  listenerSet.add(controller);
  console.log(`👂 [SessionStore] Listener added. Total for ${sessionId}: ${listenerSet.size}`);
  return true;
}

/**
 * Remueve un listener SSE
 */
export function removeListener(sessionId: string, controller: any): void {
  const listenerSet = getListenersMap().get(sessionId);
  if (listenerSet) {
    listenerSet.delete(controller);
    console.log(`👂 [SessionStore] Listener removed. Total for ${sessionId}: ${listenerSet.size}`);
    
    // Limpiar si no hay más listeners
    if (listenerSet.size === 0) {
      getListenersMap().delete(sessionId);
    }
  }
}

/**
 * Notifica a todos los listeners SSE (solo en memoria, por lambda)
 */
export function notifyListeners(
  sessionId: string,
  eventType: string,
  data: Record<string, any>
): number {
  const listenerSet = getListenersMap().get(sessionId);
  if (!listenerSet || listenerSet.size === 0) {
    return 0;
  }

  let notified = 0;
  const failedListeners = new Set<any>();

  listenerSet.forEach((controller) => {
    try {
      const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
      controller.enqueue(encoder.encode(message));
      console.log(`📤 [SessionStore] Event '${eventType}' sent to listener`);
      notified++;
    } catch (error) {
      console.error(`❌ [SessionStore] Error writing to listener:`, error);
      failedListeners.add(controller);
    }
  });

  // Remove failed listeners
  failedListeners.forEach(controller => listenerSet!.delete(controller));

  return notified;
}

/**
 * Actualiza el estado de la sesión en Redis
 */
export async function updateSessionState(
  sessionId: string,
  state: 'verified' | 'failed',
  userData?: Record<string, any>
): Promise<boolean> {
  try {
    const sessionData = await kv.get<SessionData>(`session:${sessionId}`);
    
    if (!sessionData) {
      console.warn(`⚠️ [SessionStore] Session not found for update: ${sessionId}`);
      return false;
    }

    // Actualizar estado y userData
    const updatedData: SessionData = {
      ...sessionData,
      state,
      userData: userData || sessionData.userData
    };

    // Calcular TTL restante
    const expiresAt = new Date(sessionData.expiresAt);
    const now = new Date();
    const remainingSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));

    // Actualizar en Redis con TTL restante
    await kv.set(`session:${sessionId}`, updatedData, { ex: remainingSeconds || TTL_SECONDS });
    
    console.log(`🔄 [SessionStore] Session state updated in Redis: ${sessionId} → ${state}`);
    return true;
  } catch (error) {
    console.error(`❌ [SessionStore] Error updating session in Redis:`, error);
    return false;
  }
}

/**
 * Cierra todos los listeners SSE (por lambda)
 */
export function closeAllListeners(sessionId: string): void {
  const listenerSet = getListenersMap().get(sessionId);
  if (!listenerSet) return;

  listenerSet.forEach((controller) => {
    try {
      controller.close();
    } catch (error) {
      console.error('[SessionStore] Error closing listener:', error);
    }
  });

  listenerSet.clear();
  getListenersMap().delete(sessionId);
  console.log(`🔌 [SessionStore] All listeners closed for ${sessionId}`);
}

/**
 * Elimina una sesión de Redis y memoria
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await kv.del(`session:${sessionId}`);
    closeAllListeners(sessionId);
    console.log(`🗑️ [SessionStore] Session deleted: ${sessionId}`);
  } catch (error) {
    console.error(`❌ [SessionStore] Error deleting session:`, error);
  }
}

// Exportar objeto de compatibilidad para mantener la API existente
export const sessionStore = {
  createSession,
  getSession,
  addListener,
  removeListener,
  notifyListeners,
  updateSessionState,
  closeAllListeners,
  deleteSession,
};
