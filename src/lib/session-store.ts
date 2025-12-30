import { kv } from '@vercel/kv';

// Interface para datos de sesión en Redis (sin listeners)
interface SessionData {
  sessionId: string;
  createdAt: string; // ISO string para serialización
  expiresAt: string; // ISO string para serialización
  state: 'pending' | 'verified' | 'failed';
  userData?: Record<string, any>;
}

// Interface completa con listeners (solo en memoria)
interface SessionInfo {
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
  state: 'pending' | 'verified' | 'failed';
  userData?: Record<string, any>;
  listeners: Set<any>;
}

class SessionStore {
  // Listeners se mantienen en memoria (no se pueden serializar en Redis)
  private listeners = new Map<string, Set<any>>();
  private encoder = new TextEncoder();
  private readonly TTL_SECONDS = 300; // 5 minutos

  /**
   * Crea una nueva sesión en Redis
   */
  async createSession(sessionId: string, expiresIn: number = 300000): Promise<SessionInfo> {
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
    
    // Inicializar listeners en memoria
    this.listeners.set(sessionId, new Set());

    console.log(`✅ [SessionStore] Created session in Redis: ${sessionId} (TTL: ${ttlSeconds}s)`);
    
    // Retornar SessionInfo completo para compatibilidad
    return {
      ...sessionData,
      createdAt: now,
      expiresAt: expiresAt,
      listeners: this.listeners.get(sessionId)!
    };
  }

  /**
   * Obtiene sesión desde Redis
   */
  async getSession(sessionId: string): Promise<SessionInfo | undefined> {
    try {
      const sessionData = await kv.get<SessionData>(`session:${sessionId}`);
      
      if (!sessionData) {
        return undefined;
      }

      // Obtener listeners de memoria
      const listeners = this.listeners.get(sessionId) || new Set();

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
   * Añade un listener SSE (solo en memoria)
   */
  addListener(sessionId: string, controller: any): boolean {
    let listenerSet = this.listeners.get(sessionId);
    
    if (!listenerSet) {
      listenerSet = new Set();
      this.listeners.set(sessionId, listenerSet);
    }
    
    listenerSet.add(controller);
    console.log(`👂 [SessionStore] Listener added. Total for ${sessionId}: ${listenerSet.size}`);
    return true;
  }

  /**
   * Remueve un listener SSE
   */
  removeListener(sessionId: string, controller: any): void {
    const listenerSet = this.listeners.get(sessionId);
    if (listenerSet) {
      listenerSet.delete(controller);
      console.log(`👂 [SessionStore] Listener removed. Total for ${sessionId}: ${listenerSet.size}`);
      
      // Limpiar si no hay más listeners
      if (listenerSet.size === 0) {
        this.listeners.delete(sessionId);
      }
    }
  }

  /**
   * Notifica a todos los listeners SSE (solo en memoria)
   */
  notifyListeners(
    sessionId: string,
    eventType: string,
    data: Record<string, any>
  ): number {
    const listenerSet = this.listeners.get(sessionId);
    if (!listenerSet || listenerSet.size === 0) {
      return 0;
    }

    let notified = 0;
    const failedListeners = new Set<any>();

    listenerSet.forEach((controller) => {
      try {
        const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(this.encoder.encode(message));
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
  async updateSessionState(
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
      await kv.set(`session:${sessionId}`, updatedData, { ex: remainingSeconds || this.TTL_SECONDS });
      
      console.log(`🔄 [SessionStore] Session state updated in Redis: ${sessionId} → ${state}`);
      return true;
    } catch (error) {
      console.error(`❌ [SessionStore] Error updating session in Redis:`, error);
      return false;
    }
  }

  /**
   * Cierra todos los listeners SSE
   */
  closeAllListeners(sessionId: string): void {
    const listenerSet = this.listeners.get(sessionId);
    if (!listenerSet) return;

    listenerSet.forEach((controller) => {
      try {
        controller.close();
      } catch (error) {
        console.error('[SessionStore] Error closing listener:', error);
      }
    });

    listenerSet.clear();
    this.listeners.delete(sessionId);
    console.log(`🔌 [SessionStore] All listeners closed for ${sessionId}`);
  }

  /**
   * Elimina una sesión de Redis y memoria
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      await kv.del(`session:${sessionId}`);
      this.closeAllListeners(sessionId);
      console.log(`🗑️ [SessionStore] Session deleted: ${sessionId}`);
    } catch (error) {
      console.error(`❌ [SessionStore] Error deleting session:`, error);
    }
  }
}

export const sessionStore = new SessionStore();
export type { SessionInfo };
