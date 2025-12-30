import { SignJWT, importJWK } from 'jose';
import { v4 as uuidv4 } from 'uuid';

// ═══════════════════════════════════════════════════════════
// TIPOS & INTERFACES (EUDI ARF 1.4 COMPATIBLE)
// ═══════════════════════════════════════════════════════════

interface PresentationDefinition {
  id: string;
  input_descriptors: Array<{
    id: string;
    name?: string;
    purpose?: string;
    format?: {
      mso_mdoc?: { alg: string[] };
      jwt_vp?: { alg: string[] };
    };
    constraints: {
      fields: Array<{
        path: string[];
        filter?: any;
      }>;
    };
  }>;
}

interface AuthRequestConfig {
  verifierDid: string;
  callbackUrl: string;
  privateKey: any;
  requestedFields: string[];
}

interface VerificationResult {
  verified: boolean;
  did: string;
  userData: Record<string, any>;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════
// SEGURIDAD: LISTA BLANCA TÁCTICA (MVP)
// RADAR DE MERCADO: Detectar intentos de nuevos issuers
// ═══════════════════════════════════════════════════════════

const TRUSTED_ISSUERS_MVP = [
  'did:web:issuer.eudiw.dev',
  'did:web:issuer.gataca.io',
  'did:web:issuer.idaustria.at',
  'did:web:issuer.deutscher-epass.de',
  'did:web:issuer.france-wallet.fr',
  'did:web:issuer.italia-wallet.it',
  'did:web:issuer.polska-teczka.pl',
  'did:web:issuer.portugal-wallet.pt',
  'did:web:verifier.synapsys.io', // Self-issued (testing)
];

// INTRUSION LOG: Inteligencia de mercado gratuita
const INTRUSION_LOG: Map<string, { count: number; timestamps: string[] }> = new Map();

function logIntrusion(issuerDid: string) {
  const now = new Date().toISOString();
  const existing = INTRUSION_LOG.get(issuerDid) || { count: 0, timestamps: [] };
  
  existing.count += 1;
  existing.timestamps.push(now);
  INTRUSION_LOG.set(issuerDid, existing);
  
  console.warn(`
⚠️  UNTRUSTED ISSUER ALERT
├─ DID: ${issuerDid}
├─ ATTEMPT: #${existing.count}
├─ TIMESTAMP: ${now}
└─ STATUS: BLOCKED & LOGGED
  `);
}

// ═══════════════════════════════════════════════════════════
// CLASE PRINCIPAL: OID4VPService
// ═══════════════════════════════════════════════════════════

export class OID4VPService {
  
  /**
   * 🔧 GENERA AUTHORIZATION REQUEST (OID4VP)
   * Output: JWT firmado que se convierte en QR
   */
  public async generateAuthorizationRequest(config: AuthRequestConfig) {
    
    const presentationDefinition: PresentationDefinition = {
      id: uuidv4(),
      input_descriptors: [{
        id: "EUDI_PID_REQUEST",
        name: "Verificación de Identidad Europea",
        purpose: "Verificar identidad para acceso a servicios Synapsys S.L.",
        format: {
          mso_mdoc: { alg: ["ES256", "ES512"] },
          jwt_vp: { alg: ["ES256", "ES512"] }
        },
        constraints: {
          fields: config.requestedFields.map(field => ({
            path: [
              `$.credentialSubject.${field}`,
              `$.${field}`,
              `$.vc.credentialSubject.${field}`
            ]
          }))
        }
      }]
    };

    const nonce = uuidv4();
    const state = uuidv4();

    const requestPayload = {
      client_id: config.verifierDid,
      client_id_scheme: "did",
      response_type: "vp_token",
      response_mode: "direct_post",
      redirect_uri: config.callbackUrl,
      nonce: nonce,
      state: state,
      presentation_definition: presentationDefinition,
      client_metadata: {
        client_name: "Synapsys Verifier",
        logo_uri: "https://thesynapsys.io/assets/logo-synapsys.png",
        contacts: ["contact@thesynapsys.io"]
      }
    };

    const signedJwt = await this.signRequestObject(
      requestPayload,
      config.privateKey,
      config.verifierDid
    );

    return {
      uri: `openid4vp://?request=${signedJwt}`,
      qr_payload: signedJwt,
      session_id: state,
      nonce: nonce,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  }

  /**
   * 🔐 FIRMA CRIPTOGRÁFICA (JWS - ES256)
   */
  private async signRequestObject(
    payload: any,
    privateKeyJwk: any,
    issuerDid: string
  ): Promise<string> {
    try {
      // Validar que la clave tenga los campos requeridos
      if (!privateKeyJwk.kty || !privateKeyJwk.crv || !privateKeyJwk.d) {
        throw new Error('Invalid JWK: Missing required fields (kty, crv, d)');
      }

      // Normalizar la clave JWK (jose requiere formato específico)
      const normalizedKey: any = {
        kty: privateKeyJwk.kty,
        crv: privateKeyJwk.crv,
        x: privateKeyJwk.x,
        y: privateKeyJwk.y,
        d: privateKeyJwk.d,
        use: privateKeyJwk.use || 'sig',
        kid: privateKeyJwk.kid || 'synapsys-verifier-key-1'
      };

      // Verificar que las coordenadas estén presentes
      if (!normalizedKey.x || !normalizedKey.y || !normalizedKey.d) {
        throw new Error('Invalid JWK: Missing coordinates (x, y, d)');
      }

      console.log('🔑 Importing JWK with:', {
        kty: normalizedKey.kty,
        crv: normalizedKey.crv,
        hasX: !!normalizedKey.x,
        hasY: !!normalizedKey.y,
        hasD: !!normalizedKey.d
      });

      const key = await importJWK(normalizedKey, 'ES256');
      
      return new SignJWT(payload)
        .setProtectedHeader({
          alg: 'ES256',
          typ: 'JWT',
          kid: normalizedKey.kid
        })
        .setIssuedAt()
        .setExpirationTime('5m')
        .setIssuer(issuerDid)
        .setAudience('https://self-issued.me/v2')
        .sign(key);
    } catch (error: any) {
      console.error('❌ Sign error details:', {
        message: error.message,
        stack: error.stack,
        keyInfo: {
          kty: privateKeyJwk?.kty,
          crv: privateKeyJwk?.crv,
          hasX: !!privateKeyJwk?.x,
          hasY: !!privateKeyJwk?.y,
          hasD: !!privateKeyJwk?.d
        }
      });
      throw new Error(`Signing failed: ${error.message}`);
    }
  }

  /**
   * 🔄 VALIDA RESPUESTA DE WALLET (VP Token)
   * Input: vp_token + presentation_submission
   * Output: Datos verificados o ERROR
   */
  public async verifyWalletResponse(
    responseBody: any,
    expectedNonce: string
  ): Promise<VerificationResult> {
    
    const { vp_token, presentation_submission } = responseBody;

    if (!vp_token || !presentation_submission) {
      throw new Error('ERR_INVALID_FLOW: Falta vp_token o presentation_submission');
    }

    const vp = await this.parseVP(vp_token);
    const issuerDid = vp.payload.iss;

    // STEP 1: Validar firma criptográfica
    const isValidSignature = await this.verifyDidSignature(issuerDid, vp_token);
    if (!isValidSignature) {
      throw new Error('ERR_SECURITY_BREACH: Firma del emisor inválida');
    }

    // STEP 2: SECURITY BRIDGE - Validar whitelist
    if (!TRUSTED_ISSUERS_MVP.includes(issuerDid)) {
      logIntrusion(issuerDid);
      throw new Error(`ERR_UNTRUSTED_ISSUER: ${issuerDid} bloqueado`);
    }

    // STEP 3: Anti-replay (nonce validation)
    if (vp.payload.nonce !== expectedNonce) {
      throw new Error('ERR_REPLAY_ATTACK: Nonce no coincide');
    }

    // STEP 4: Validar expiración
    const now = Math.floor(Date.now() / 1000);
    if (vp.payload.exp && vp.payload.exp < now) {
      throw new Error('ERR_CREDENTIAL_EXPIRED: Credencial expirada');
    }

    // STEP 5: Extraer datos
    const userData = this.extractClaims(vp.payload, presentation_submission);

    return {
      verified: true,
      did: issuerDid,
      userData: userData,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 🔍 PARSEAR VP TOKEN (JWT)
   */
  private async parseVP(token: string) {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('ERR_INVALID_JWT: Token malformado');
    }

    try {
      return {
        header: JSON.parse(Buffer.from(parts[0], 'base64url').toString()),
        payload: JSON.parse(Buffer.from(parts[1], 'base64url').toString()),
        signature: parts[2]
      };
    } catch (e) {
      throw new Error('ERR_DECODE_FAILED: No se puede decodificar token');
    }
  }

  /**
   * ✅ VERIFICAR FIRMA DEL DID
   * MVP: Basado en whitelist
   * PRODUCCIÓN: DID Resolver + LOTL validation
   */
  private async verifyDidSignature(did: string, token: string): Promise<boolean> {
    try {
      // TODO: Implementar DID Resolution real
      // const publicKey = await didResolver.resolve(did);
      // await jwtVerify(token, publicKey);
      
      // MVP: Aceptar si está en whitelist
      return TRUSTED_ISSUERS_MVP.includes(did);
    } catch (e) {
      console.error(`❌ Signature verification error for ${did}:`, e);
      return false;
    }
  }

  /**
   * 📊 EXTRAER DATOS DEL USUARIO
   */
  private extractClaims(payload: any, submission: any): Record<string, any> {
    const vc = payload.vp?.verifiableCredential;
    
    if (!vc) {
      throw new Error('ERR_NO_VC: Credencial verificable no encontrada');
    }

    return vc.credentialSubject || vc.claims || {};
  }

  /**
   * 📈 OBTENER INTRUSION LOG (Para inteligencia de mercado)
   */
  public getIntrusionLog() {
    return Object.fromEntries(INTRUSION_LOG);
  }
}

export { TRUSTED_ISSUERS_MVP, INTRUSION_LOG };
export default OID4VPService;

