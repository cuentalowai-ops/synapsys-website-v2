/**
 * Global type definitions
 */

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

// OpenID4VP Types
export interface VerifiablePresentation {
  type: string;
  verifiableCredential: VerifiableCredential[];
  proof: Proof;
}

export interface VerifiableCredential {
  '@context': string[];
  type: string[];
  credentialSubject: Record<string, unknown>;
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
}

export interface Proof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  jws?: string;
}

// User Types
export interface User {
  id: string;
  email?: string;
  name?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

