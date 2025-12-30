interface SessionInfo {
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
  state: 'pending' | 'verified' | 'failed';
  userData?: Record<string, any>;
  listeners: Set<any>;
}

class SessionStore {
  private sessions = new Map<string, SessionInfo>();
  private encoder = new TextEncoder();

  createSession(sessionId: string, expiresIn: number = 300000): SessionInfo {
    const now = new Date();
    const session: SessionInfo = {
      sessionId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + expiresIn),
      state: 'pending',
      listeners: new Set()
    };
    
    this.sessions.set(sessionId, session);
    
    // Auto-cleanup
    setTimeout(() => {
      this.closeAllListeners(sessionId);
      this.sessions.delete(sessionId);
      console.log(`🗑️ Session expired and cleaned: ${sessionId}`);
    }, expiresIn);

    console.log(`✅ [SessionStore] Created session: ${sessionId}`);
    return session;
  }

  getSession(sessionId: string): SessionInfo | undefined {
    return this.sessions.get(sessionId);
  }

  addListener(sessionId: string, controller: any): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️ [SessionStore] Session not found: ${sessionId}`);
      return false;
    }
    
    session.listeners.add(controller);
    console.log(`👂 [SessionStore] Listener added. Total for ${sessionId}: ${session.listeners.size}`);
    return true;
  }

  removeListener(sessionId: string, controller: any): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.listeners.delete(controller);
      console.log(`👂 [SessionStore] Listener removed. Total for ${sessionId}: ${session.listeners.size}`);
    }
  }

  notifyListeners(
    sessionId: string,
    eventType: string,
    data: Record<string, any>
  ): number {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️ [SessionStore] Session not found for notification: ${sessionId}`);
      return 0;
    }

    let notified = 0;
    const failedListeners = new Set<any>();

    session.listeners.forEach((controller) => {
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
    failedListeners.forEach(controller => session.listeners.delete(controller));

    return notified;
  }

  updateSessionState(
    sessionId: string,
    state: 'verified' | 'failed',
    userData?: Record<string, any>
  ): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️ [SessionStore] Session not found for update: ${sessionId}`);
      return false;
    }

    session.state = state;
    if (userData) session.userData = userData;
    
    console.log(`🔄 [SessionStore] Session state updated: ${sessionId} → ${state}`);
    return true;
  }

  closeAllListeners(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.listeners.forEach((controller) => {
      try {
        controller.close();
      } catch (error) {
        console.error('[SessionStore] Error closing listener:', error);
      }
    });

    session.listeners.clear();
    console.log(`🔌 [SessionStore] All listeners closed for ${sessionId}`);
  }
}

export const sessionStore = new SessionStore();

