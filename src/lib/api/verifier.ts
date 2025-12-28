/**
 * Verifier API Client
 * Client for interacting with synapsys-verifier (OpenID4VP)
 */

import { env } from '@/config/env';
import type { VerifiablePresentation } from '@/types';

class VerifierClient {
  private baseUrl: string;

  constructor(baseUrl: string = env.verifierApiUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Initiate a verification request
   */
  async initiateVerification(request: {
    clientId: string;
    redirectUri: string;
    scope?: string[];
  }): Promise<{ authorizationUrl: string; state: string }> {
    const response = await fetch(`${this.baseUrl}/verify/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to initiate verification');
    }

    return response.json();
  }

  /**
   * Verify a presentation
   */
  async verifyPresentation(
    presentation: VerifiablePresentation
  ): Promise<{ valid: boolean; claims?: Record<string, unknown> }> {
    const response = await fetch(`${this.baseUrl}/verify/presentation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(presentation),
    });

    if (!response.ok) {
      throw new Error('Failed to verify presentation');
    }

    return response.json();
  }

  /**
   * Get verification status
   */
  async getVerificationStatus(state: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    result?: VerifiablePresentation;
  }> {
    const response = await fetch(`${this.baseUrl}/verify/status/${state}`);

    if (!response.ok) {
      throw new Error('Failed to get verification status');
    }

    return response.json();
  }
}

export const verifierClient = new VerifierClient();

