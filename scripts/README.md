# 🧪 Scripts de Testing - SYNAPSYS Verification Platform

## 📋 Descripción

Scripts automatizados para ejecutar shock tests del sistema de verificación EUDI Wallet.

## 🚀 Uso Rápido

### Opción 1: NPM Script (Recomendado)
```bash
npm run test:shock
```

### Opción 2: Con Session ID Manual
```bash
npm run test:shock:id eb539d38-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Opción 3: Wrapper Directo
```bash
bash scripts/run-shock-test.sh
```

### Opción 4: Script Directo
```bash
bash scripts/shock-test-auto.sh [SESSION_ID]
```

## 📁 Archivos

- **`shock-test-auto.sh`**: Script maestro que ejecuta el test completo
- **`get-session-id.js`**: Helper para obtener session_id del servidor (opcional)
- **`run-shock-test.sh`**: Wrapper que ejecuta el test con opciones adicionales

## 📊 Reportes

Los reportes se generan automáticamente en:
```
./reports/shock-test-report_YYYYMMDD_HHMMSS.md
```

### Ver el último reporte
```bash
cat reports/shock-test-report_*.md | tail -50
```

### Listar todos los reportes
```bash
ls -la reports/
```

## 🔍 Requisitos

- Servidor corriendo: `npm run dev`
- Dashboard accesible: `http://localhost:3000/dashboard`
- Bash shell (macOS/Linux)
- `curl` instalado
- `jq` (opcional, para mejor formato JSON)

## 📝 Notas

- El script genera automáticamente un session_id si no se proporciona uno
- Los reportes incluyen métricas de performance y validación de criterios
- El test verifica la comunicación SSE en tiempo real

