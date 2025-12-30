import { NextRequest, NextResponse } from 'next/server';
import OID4VPService from '@/services/OID4VPService';
import { sessionStore } from '@/lib/session-store';

const VERIFIER_DID = process.env.VERIFIER_DID || 'did:web:verifier.thesynapsys.io';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const verifierPrivateKey = process.env.VERIFIER_PRIVATE_KEY;
    
    if (!verifierPrivateKey) {
      return NextResponse.json(
        { error: 'Server not configured: Missing VERIFIER_PRIVATE_KEY' },
        { status: 500 }
      );
    }

    let privateKeyJwk;
    try {
      privateKeyJwk = typeof verifierPrivateKey === 'string' 
        ? JSON.parse(verifierPrivateKey) 
        : verifierPrivateKey;
      
      // Validar formato básico
      if (!privateKeyJwk.kty || !privateKeyJwk.crv) {
        throw new Error('Invalid JWK format: missing kty or crv');
      }
      
      console.log('🔑 Loaded JWK:', {
        kty: privateKeyJwk.kty,
        crv: privateKeyJwk.crv,
        hasX: !!privateKeyJwk.x,
        hasY: !!privateKeyJwk.y,
        hasD: !!privateKeyJwk.d
      });
    } catch (e) {
      console.error('❌ Failed to parse VERIFIER_PRIVATE_KEY:', e);
      return NextResponse.json(
        { error: 'Invalid VERIFIER_PRIVATE_KEY format', details: (e as Error).message },
        { status: 500 }
      );
    }
    const oid4vp = new OID4VPService();

    const requestData = await oid4vp.generateAuthorizationRequest({
      verifierDid: VERIFIER_DID,
      callbackUrl: `${API_BASE_URL}/api/verify/callback`,
      privateKey: privateKeyJwk,
      requestedFields: ['family_name', 'given_name', 'birth_date']
    });

    // Crear sesión en SessionStore para SSE
    const expiresIn = 5 * 60 * 1000; // 5 minutos
    sessionStore.createSession(requestData.session_id, expiresIn);

    console.log('✅ Authorization request generated:', requestData.session_id);

    return NextResponse.json({
      success: true,
      qr_link: requestData.uri,
      qr_payload: requestData.qr_payload,
      session_id: requestData.session_id,
      expires_at: requestData.expires_at
    });

  } catch (error: any) {
    console.error('❌ /api/verify/start error:', error.message);
    return NextResponse.json(
      { error: 'Verification initiation failed', details: error.message },
      { status: 500 }
    );
  }
}

