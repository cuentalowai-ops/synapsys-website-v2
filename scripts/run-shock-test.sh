#!/bin/bash

# Wrapper que ejecuta todo automáticamente

echo "🚀 SHOCK TEST AUTO - INICIANDO..."
echo ""

# Opción 1: Si tienes endpoint que devuelve session_id
# SESSION_ID=$(node scripts/get-session-id.js)
# if [ $? -ne 0 ]; then
#   echo "❌ No se pudo obtener session_id"
#   exit 1
# fi
# bash scripts/shock-test-auto.sh "$SESSION_ID"

# Opción 2: Script genera session_id automáticamente
bash scripts/shock-test-auto.sh "$@"

# Capturar código de salida
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo ""
  echo "📊 Ver informe más reciente:"
  echo "  cat reports/shock-test-report_*.md | tail -50"
  echo ""
  echo "💾 Todos los reportes:"
  echo "  ls -la reports/"
fi

exit $EXIT_CODE

