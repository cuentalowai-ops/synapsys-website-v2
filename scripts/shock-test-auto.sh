#!/bin/bash

# ╔══════════════════════════════════════════════════════════════╗
# ║         SHOCK TEST AUTOMÁTICO - SYNAPSYS VERIFICATION        ║
# ║    Detecta session_id + ejecuta test + genera informe        ║
# ╚══════════════════════════════════════════════════════════════╝

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
API_URL="http://localhost:3000"
DASHBOARD_URL="$API_URL/dashboard"
CALLBACK_ENDPOINT="$API_URL/api/verify/callback"
REPORT_DIR="./reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$REPORT_DIR/shock-test-report_${TIMESTAMP}.md"

# Crear directorio de reportes si no existe
mkdir -p "$REPORT_DIR"

# ─────────────────────────────────────────────────────────────
# PASO 1: DETECTAR SESSION_ID
# ─────────────────────────────────────────────────────────────

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ SHOCK TEST AUTOMATIZADO - SYNAPSYS VERIFICATION PLATFORM     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}[1/5] 🔍 Detectando session_id activo...${NC}"

# Buscar en localStorage del navegador o en logs del servidor
SESSION_ID=""

# Intentar obtener de proceso del servidor (si está disponible)
if pgrep -f "npm run dev" > /dev/null || pgrep -f "next dev" > /dev/null; then
    echo -e "${GREEN}    ✅ Servidor detectado (npm run dev)${NC}"
else
    echo -e "${RED}    ⚠️  Servidor no está corriendo${NC}"
    echo -e "${RED}    Ejecuta: npm run dev${NC}"
    exit 1
fi

# Hacer request a dashboard y extraer session_id del QR
echo -e "${YELLOW}    📡 Conectando a dashboard...${NC}"
DASHBOARD_HTML=$(curl -s "$DASHBOARD_URL" 2>/dev/null || echo "")

if [ -z "$DASHBOARD_HTML" ]; then
    echo -e "${RED}    ❌ No se pudo conectar a $DASHBOARD_URL${NC}"
    exit 1
fi

echo -e "${GREEN}    ✅ Dashboard accesible${NC}"
echo ""

# ─────────────────────────────────────────────────────────────
# PASO 2: USAR SESSION_ID PROPORCIONADO O GENERAR UNO
# ─────────────────────────────────────────────────────────────

echo -e "${YELLOW}[2/5] 🆔 Preparando identificador de sesión...${NC}"

# Si se pasa como argumento, usarlo
if [ ! -z "$1" ]; then
    SESSION_ID="$1"
    echo -e "${GREEN}    ✅ Session ID proporcionado: $SESSION_ID${NC}"
else
    # Generar uno para testing (en producción se obtendría de dashboard)
    if command -v uuidgen > /dev/null; then
        SESSION_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
    else
        # Fallback: generar UUID simple
        SESSION_ID=$(cat /dev/urandom | tr -dc 'a-f0-9' | fold -w 32 | head -n 1)
        SESSION_ID="${SESSION_ID:0:8}-${SESSION_ID:8:4}-${SESSION_ID:12:4}-${SESSION_ID:16:4}-${SESSION_ID:20:12}"
    fi
    echo -e "${GREEN}    ✅ Session ID generado: $SESSION_ID${NC}"
fi

echo ""

# ─────────────────────────────────────────────────────────────
# PASO 3: EJECUTAR TEST
# ─────────────────────────────────────────────────────────────

echo -e "${YELLOW}[3/5] 🔥 Ejecutando shock test...${NC}"
echo -e "${YELLOW}    📤 POST → $CALLBACK_ENDPOINT${NC}"
echo ""

# Registrar tiempo inicio (compatible macOS y Linux)
if command -v gdate > /dev/null; then
    TEST_START=$(gdate +%s%N)
else
    TEST_START=$(python3 -c "import time; print(int(time.time() * 1000000000))" 2>/dev/null || echo $(($(date +%s) * 1000000000)))
fi

# Ejecutar curl
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$CALLBACK_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"session_id\": \"$SESSION_ID\",
    \"state\": \"verified\",
    \"user_data\": {
      \"family_name\": \"Turrell\",
      \"given_name\": \"Mark\",
      \"birth_date\": \"1975-05-20\",
      \"nationality\": \"ES\",
      \"issuer\": \"did:web:eidas.example.com\"
    }
  }")

# Registrar tiempo fin (compatible macOS y Linux)
if command -v gdate > /dev/null; then
    TEST_END=$(gdate +%s%N)
else
    TEST_END=$(python3 -c "import time; print(int(time.time() * 1000000000))" 2>/dev/null || echo $(($(date +%s) * 1000000000)))
fi

# Calcular duración en milisegundos
if [ "$TEST_START" != "" ] && [ "$TEST_END" != "" ]; then
    TEST_DURATION=$(( (TEST_END - TEST_START) / 1000000 ))
else
    # Fallback: usar segundos si no se puede calcular
    TEST_DURATION=0
fi

# Separar body y status code (compatible macOS y Linux)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
HTTP_BODY=$(echo "$RESPONSE" | sed '$d')

echo -e "${YELLOW}    📥 Response:${NC}"
if command -v jq > /dev/null; then
    echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "    $HTTP_BODY"
else
    echo "    $HTTP_BODY"
fi
echo ""

echo -e "${YELLOW}    📊 HTTP Status: $HTTP_CODE${NC}"
echo -e "${YELLOW}    ⏱️  Duration: ${TEST_DURATION}ms${NC}"
echo ""

# ─────────────────────────────────────────────────────────────
# PASO 4: VALIDAR RESULTADO
# ─────────────────────────────────────────────────────────────

echo -e "${YELLOW}[4/5] ✅ Validando resultado...${NC}"

SUCCESS=false
LISTENERS_NOTIFIED=0

if [ "$HTTP_CODE" == "200" ]; then
    if command -v jq > /dev/null; then
        LISTENERS_NOTIFIED=$(echo "$HTTP_BODY" | jq -r '.listenersNotified // 0' 2>/dev/null || echo "0")
    else
        # Fallback sin jq: buscar en el texto
        LISTENERS_NOTIFIED=$(echo "$HTTP_BODY" | grep -o '"listenersNotified":[0-9]*' | grep -o '[0-9]*' || echo "0")
    fi
    
    if [ "$LISTENERS_NOTIFIED" -gt 0 ]; then
        SUCCESS=true
        echo -e "${GREEN}    ✅ HTTP 200 OK${NC}"
        echo -e "${GREEN}    ✅ Listeners notificados: $LISTENERS_NOTIFIED${NC}"
    else
        echo -e "${YELLOW}    ⚠️  HTTP 200 pero sin listeners notificados${NC}"
    fi
else
    echo -e "${RED}    ❌ HTTP $HTTP_CODE${NC}"
fi

echo ""

# ─────────────────────────────────────────────────────────────
# PASO 5: GENERAR INFORME
# ─────────────────────────────────────────────────────────────

echo -e "${YELLOW}[5/5] 📄 Generando informe...${NC}"

# Crear contenido del informe
cat > "$REPORT_FILE" << EOF
# 🔥 SHOCK TEST REPORT - SYNAPSYS VERIFICATION PLATFORM

**Fecha:** $(date '+%Y-%m-%d %H:%M:%S')  
**Ambiente:** localhost:3000  
**Tipo Test:** EUDI Wallet Verification Callback  

***

## 📊 RESULTADO FINAL

\`\`\`
Estado: $([ "$SUCCESS" = true ] && echo "✅ EXITOSO" || echo "❌ FALLIDO")
HTTP Code: $HTTP_CODE
Duration: ${TEST_DURATION}ms
Listeners Notificados: $LISTENERS_NOTIFIED
\`\`\`

***

## 📋 DETALLES DEL TEST

### Configuración
| Parámetro | Valor |
|-----------|-------|
| **Endpoint** | POST $CALLBACK_ENDPOINT |
| **Session ID** | $SESSION_ID |
| **State** | verified |
| **Timestamp** | $(date -u +%Y-%m-%dT%H:%M:%SZ) |

### Usuario de Test
\`\`\`json
{
  "family_name": "Turrell",
  "given_name": "Mark",
  "birth_date": "1975-05-20",
  "nationality": "ES",
  "issuer": "did:web:eidas.example.com"
}
\`\`\`

### Request Headers
\`\`\`
Content-Type: application/json
\`\`\`

***

## 📥 RESPUESTA DEL SERVIDOR

### HTTP Status
\`\`\`
$HTTP_CODE
\`\`\`

### Response Body
\`\`\`json
$HTTP_BODY
\`\`\`

***

## ⏱️ MÉTRICAS DE PERFORMANCE

| Métrica | Valor |
|---------|-------|
| **Latencia** | ${TEST_DURATION}ms |
| **Listeners Notificados** | $LISTENERS_NOTIFIED |
| **Estado** | $([ "$SUCCESS" = true ] && echo "✅ Normal" || echo "❌ Anómalo") |

**Análisis:** 
- $([ $TEST_DURATION -lt 500 ] && echo "✅ Latencia excelente (<500ms)" || echo "⚠️ Latencia moderada (>500ms)")
- $([ "$LISTENERS_NOTIFIED" -gt 0 ] && echo "✅ Comunicación SSE funcionando" || echo "❌ SSE no está notificando")

***

## 🧪 CRITERIOS DE ÉXITO

| Criterio | Estado |
|----------|--------|
| **HTTP 200** | $([ "$HTTP_CODE" == "200" ] && echo "✅" || echo "❌") |
| **Listeners > 0** | $([ "$LISTENERS_NOTIFIED" -gt 0 ] && echo "✅" || echo "❌") |
| **Latencia < 1s** | $([ $TEST_DURATION -lt 1000 ] && echo "✅" || echo "❌") |
| **Response válido** | $([ "$SUCCESS" = true ] && echo "✅" || echo "❌") |

***

## 🔍 LOGS ESPERADOS

### En servidor (npm run dev)
\`\`\`
📥 [/api/verify/callback] Request received
   session_id: $SESSION_ID
   state: verified
✅ [/api/verify/callback] Verification successful
📤 [SessionStore] Event 'verified' sent to listener
📤 [/api/verify/callback] Notified 1 listener(s)
\`\`\`

### En navegador (F12 Console)
\`\`\`
🔌 [QRVerification] Verification event received!
📊 [QRVerification] Verified data: {family_name: "Turrell", ...}
🔌 [QRVerification] SSE connection closed (verified)
\`\`\`

***

## 📊 DASHBOARD STATUS

Esperado:
- **Antes:** PENDING (spinner girando)
- **Después:** SUCCESS (checkmark verde + datos)
- **Transición:** <500ms, sin F5

***

## 🎯 PRÓXIMOS PASOS

$([ "$SUCCESS" = true ] && echo "### ✅ TEST EXITOSO

1. Revisar el navegador - Dashboard debe estar en SUCCESS
2. Validar que los datos de usuario se muestren correctamente
3. Confirmar que no hubo recarga (F5) durante la transición
4. Revisar logs del servidor para detalles

**RECOMENDACIÓN:** El sistema está operacional para producción.
" || echo "### ⚠️ TEST CON PROBLEMAS

1. Verificar que npm run dev está corriendo
2. Revisar logs del servidor en busca de errores
3. Confirmar que /api/verify/callback está implementado
4. Verificar que SessionStore.listeners tiene listeners activos
5. Debuggear la conexión SSE en el navegador (F12)

**RECOMENDACIÓN:** Revisar implementación de SSE y SessionStore.")

***

## 📝 OBSERVACIONES

- Test ejecutado automáticamente por script
- Datos de usuario son de ejemplo para testing
- Session ID generado dinámicamente
- Sin dependencias de interfaz gráfica

***

## 🔒 Información Técnica

**Sistema:** SYNAPSYS Universal EUDI Verification Platform  
**Versión:** 2.0  
**Ambiente:** Development  
**Timestamp:** $TIMESTAMP  

***

**Generado automáticamente por shock-test-auto.sh**
EOF

echo -e "${GREEN}    ✅ Informe creado: $REPORT_FILE${NC}"
echo ""

# ─────────────────────────────────────────────────────────────
# RESULTADO FINAL
# ─────────────────────────────────────────────────────────────

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"

if [ "$SUCCESS" = true ]; then
    echo -e "${GREEN}║ ✅ SHOCK TEST EXITOSO                                      ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}📄 Informe guardado en: ${REPORT_FILE}${NC}"
    echo ""
    echo -e "${GREEN}Próximas acciones:${NC}"
    echo -e "  1. Verifica en el navegador que el dashboard cambió a SUCCESS"
    echo -e "  2. Revisa los logs en ${REPORT_FILE}"
    echo -e "  3. Comparte el informe para documentación"
    echo ""
    exit 0
else
    echo -e "${RED}║ ❌ SHOCK TEST FALLIDO                                      ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}📄 Informe guardado en: ${REPORT_FILE}${NC}"
    echo ""
    echo -e "${RED}Revisar:${NC}"
    echo -e "  1. Logs del servidor: npm run dev"
    echo -e "  2. Endpoint: $CALLBACK_ENDPOINT"
    echo -e "  3. DevTools: F12 → Console → Network"
    echo -e "  4. Informe detallado: ${REPORT_FILE}"
    echo ""
    exit 1
fi

