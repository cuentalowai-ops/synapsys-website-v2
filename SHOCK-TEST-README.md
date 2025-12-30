# Shock Test - Verificación Automática E2E

## ¿Qué es?

Test End-to-End (E2E) que verifica que el flujo completo de verificación EUDI Wallet funciona correctamente:

1. **INIT**: Crear sesión (POST `/api/verify/start`)
2. **EXTRACT**: Extraer `session_id` de la respuesta
3. **WAIT**: Esperar propagación en SessionStore (100ms)
4. **SHOCK**: Ejecutar callback (POST `/api/verify/callback`)
5. **VERIFY**: Validar HTTP 200 y procesamiento exitoso

## Ejecutar Localmente

### Opción 1: NPM Script (Recomendado)
```bash
npm run test:shock
```

### Opción 2: Script Directo
```bash
bash scripts/shock-test-auto-FIXED.sh
```

### Resultado Esperado
```
✅ STATUS: PASSOU
🟢 SISTEMA OPERACIONAL
```

## Flujo del Test

```
┌─────────────────────────────────────────────────┐
│ 1. INIT: POST /api/verify/start                 │
│    → Servidor crea sesión en SessionStore      │
│    → Response: { session_id: "abc123...", ... } │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. EXTRACT: Parsear JSON                        │
│    → SESSION_ID = "abc123..." (REAL)            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 3. WAIT: sleep 100ms                            │
│    → Propagación en SessionStore                │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 4. SHOCK: POST /api/verify/callback            │
│    → Usa session_id real                        │
│    → Servidor encuentra sesión ✅                │
│    → Notifica listeners SSE (si hay)            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 5. VERIFY: Validar HTTP 200                     │
│    → Listeners notificados (puede ser 0)        │
│    → Generar reporte markdown                   │
└─────────────────────────────────────────────────┘
```

## Reportes

Cada ejecución genera un reporte markdown en:
```
./reports/shock-test-FIXED_YYYYMMDD_HHMMSS.md
```

### Contenido del Reporte
- ✅ Resultado final (PASSOU/FALHOU)
- 📊 Métricas de performance (latencia INIT, SHOCK, total)
- 📋 Detalles del test (endpoints, session_id, usuario)
- 📥 Respuestas del servidor (JSON completo)
- 🧪 Criterios de éxito validados
- 🔍 Flujo ejecutado paso a paso

### Ver el Último Reporte
```bash
cat reports/shock-test-FIXED_*.md | tail -50
```

### Listar Todos los Reportes
```bash
ls -la reports/
```

## CI/CD

El test se ejecuta automáticamente en:
- ✅ Cada push a `main` o `develop`
- ✅ Cada pull request

Ver: `.github/workflows/shock-test.yml`

## Troubleshooting

### Error: "Session not found (404)"
**Causa:** El session_id no existe en el SessionStore.

**Solución:**
1. Verificar que `npm run dev` está corriendo
2. Verificar que `/api/verify/start` devuelve JSON válido
3. Verificar que el session_id se extrae correctamente
4. Aumentar `WAIT_TIME_MS` en el script (100ms → 500ms)

### Error: "JSON parse error"
**Causa:** La respuesta no es JSON válido.

**Solución:**
1. Verificar que el servidor responde con JSON (no HTML)
2. Verificar que `session_id` está en la respuesta
3. Revisar logs del servidor para errores

### Error: "Timeout"
**Causa:** El servidor no responde a tiempo.

**Solución:**
1. Verificar que `npm run dev` está corriendo
2. Verificar conectividad a `localhost:3000`
3. Revisar logs del servidor

### Listeners Notificados: 0
**Causa:** No hay clientes SSE conectados (normal en test automatizado).

**Solución:**
- ✅ Esto es **normal** si no hay navegadores con SSE abierto
- ✅ El test pasa si HTTP 200 (sesión encontrada y procesada)
- ⚠️ Para probar listeners, abrir dashboard en navegador y generar QR primero

## Criterios de Éxito

| Criterio | Estado Requerido |
|----------|------------------|
| **INIT HTTP 200** | ✅ Obligatorio |
| **SHOCK HTTP 200** | ✅ Obligatorio |
| **Latencia Total < 1s** | ✅ Recomendado |
| **Listeners > 0** | ⚠️ Opcional (requiere cliente SSE) |

## Requisitos

- ✅ Node.js 18+
- ✅ Servidor corriendo: `npm run dev`
- ✅ Bash shell (macOS/Linux)
- ✅ `curl` instalado
- ✅ `jq` (opcional, para mejor formato JSON)
- ✅ `python3` o `bc` (para cálculos de tiempo)

## Scripts Disponibles

```json
{
  "test:shock": "bash ./scripts/shock-test-auto-FIXED.sh",
  "test:shock:old": "bash ./scripts/shock-test-auto.sh"
}
```

## Comparación: Antes vs Después

### ❌ Antes (shock-test-auto.sh)
- Generaba UUID localmente
- POST callback con UUID inexistente
- Resultado: HTTP 404 (Session not found)

### ✅ Después (shock-test-auto-FIXED.sh)
- POST `/api/verify/start` → crea sesión real
- Extrae `session_id` de la respuesta
- POST callback con `session_id` real
- Resultado: HTTP 200 ✅

## Información Técnica

**Sistema:** SYNAPSYS Universal EUDI Verification Platform  
**Versión:** 2.0 (FIXED)  
**Ambiente:** Development  
**Tipo:** E2E Test Automatizado  

## Soporte

Para más información:
- Ver reportes en `./reports/`
- Revisar logs del servidor: `npm run dev`
- Consultar documentación del proyecto

