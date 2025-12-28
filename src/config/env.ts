/**
 * Environment configuration
 * Centralized environment variable management with validation
 */

export const env = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  verifierApiUrl: process.env.NEXT_PUBLIC_VERIFIER_API_URL || 'http://localhost:8080',
  
  // Application Configuration
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Synapsys Website',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // OpenID4VP Configuration
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/callback',
  
  // Security
  enableSecurityHeaders: process.env.NEXT_PUBLIC_ENABLE_SECURITY_HEADERS === 'true',
  
  // Feature Flags
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableErrorTracking: process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true',
  
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Validation
if (!env.clientId && env.isProduction) {
  console.warn('Warning: NEXT_PUBLIC_CLIENT_ID is not set');
}

