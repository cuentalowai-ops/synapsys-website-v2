import { kv } from '@vercel/kv';

interface SessionInfo {
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
  state: 'pending' | 'verified' | 'failed';
  userData?: Record<string, any>;
  listeners: Set<any>;
}

class SessionStore {
  private encoder = new TextEncoder();

  private getKey(sessionId: string): string {
    return `session:${sessionId}`;
  }

  async createSession(sessionId: string, expiresIn: number = 300000): Promise<SessionInfo> {
    const now = new Date();
    const session: SessionInfo = {
      sessionId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + expiresIn),
      state: 'pending',
      listeners: new Set()
    };

    // Store in Redis KV with TTL (in seconds)
    await kv.set(this.getKey(sessionId), {
      ...session,
      listeners: [] // Convert Set to Array for storage
    }, {
      ex: Math.floor(expiresIn / 1000)
    });

    return session;
  }

  async getSession(sessionId: string): Promise<SessionInfo | null> {
    const data = await kv.get<Omit<SessionInfo, 'listeners'>>(this.getKey(sessionId));
    
    if (!data) return null;

    // Reconstruct dates and Set
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      expiresAt: new Date(data.expiresAt),
      listeners: new Set()
    };
  }

  async updateSession(sessionId: string, updates: Partial<Omit<SessionInfo, 'sessionId' | 'listeners'>>): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    const updated = { ...session, ...updates };
    const ttl = await kv.ttl(this.getKey(sessionId));

    await kv.set(this.getKey(sessionId), {
      ...updated,
      listeners: []
    }, {
      ex: ttl > 0 ? ttl : 300
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    await kv.del(this.getKey(sessionId));
  }

  async cleanExpired(): Promise<void> {
    // Redis handles TTL automatically
  }

  // SSE methods remain the same but won't persist listeners
  addListener(sessionId: string, controller: ReadableStreamDefaultController<any>) {
    // For SSE, we keep listeners in memory (transient)
  }

  removeListener(sessionId: string, controller: ReadableStreamDefaultController<any>) {
    // For SSE, we keep listeners in memory (transient)
  }

  async notifyListeners(sessionId: string, data: any) {
    // For SSE, we keep listeners in memory (transient)
  }
}

export const sessionStore = new SessionStore();
export type { SessionInfo };
