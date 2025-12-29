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

    // Read body as text once - can only be consumed once
    const responseText = await response.text().catch(() => {
      throw new Error('Failed to read response body');
    });

    if (!response.ok) {
      throw new Error(
        `Failed to initiate verification: ${response.status} ${response.statusText}. ${responseText}`
      );
    }

    // Validate Content-Type before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(
        `Invalid response format. Expected JSON, got ${contentType || 'unknown'}. Response: ${responseText.substring(0, 200)}`
      );
    }

    // Parse JSON from the text we already read
    try {
      return JSON.parse(responseText) as { authorizationUrl: string; state: string };
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}. Response: ${responseText.substring(0, 200)}`
      );
    }
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

    // Read body as text once - can only be consumed once
    const responseText = await response.text().catch(() => {
      throw new Error('Failed to read response body');
    });

    if (!response.ok) {
      throw new Error(
        `Failed to verify presentation: ${response.status} ${response.statusText}. ${responseText}`
      );
    }

    // Validate Content-Type before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(
        `Invalid response format. Expected JSON, got ${contentType || 'unknown'}. Response: ${responseText.substring(0, 200)}`
      );
    }

    // Parse JSON from the text we already read
    try {
      return JSON.parse(responseText) as { valid: boolean; claims?: Record<string, unknown> };
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}. Response: ${responseText.substring(0, 200)}`
      );
    }
  }

  /**
   * Get verification status
   */
  async getVerificationStatus(state: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    result?: VerifiablePresentation;
  }> {
    const response = await fetch(`${this.baseUrl}/verify/status/${state}`);

    // Read body as text once - can only be consumed once
    const responseText = await response.text().catch(() => {
      throw new Error('Failed to read response body');
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get verification status: ${response.status} ${response.statusText}. ${responseText}`
      );
    }

    // Validate Content-Type before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(
        `Invalid response format. Expected JSON, got ${contentType || 'unknown'}. Response: ${responseText.substring(0, 200)}`
      );
    }

    // Parse JSON from the text we already read
    try {
      return JSON.parse(responseText) as {
        status: 'pending' | 'completed' | 'failed';
        result?: VerifiablePresentation;
      };
    } catch (error) {
      throw new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}. Response: ${responseText.substring(0, 200)}`
      );
    }
  }
}

export const verifierClient = new VerifierClient();

