#!/bin/bash

set -e

SERVER="http://localhost:3000"
TOTAL_REQUESTS=100
CONCURRENT=10
RESULTS_FILE="load-test-results-$(date +%s).json"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║           LOAD TEST BLITZ - STRESS TESTING               ║"
echo "║   $TOTAL_REQUESTS requests | $CONCURRENT concurrent                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Detectar servidor
echo "[1/4] 🔍 Detectando servidor..."
if ! curl -s "$SERVER/dashboard" > /dev/null 2>&1; then
  echo "❌ Servidor no está corriendo"
  echo "   Ejecuta: npm run dev"
  exit 1
fi
echo "✅ Servidor activo"
echo ""

# Función para ejecutar un test
run_test() {
  local iteration=$1
  local session_id=""
  
  # Fase 1: Crear sesión
  local init=$(curl -s -X POST "$SERVER/api/verify/start" \
    -H "Content-Type: application/json" \
    -d '{}')
  
  if command -v jq > /dev/null; then
    session_id=$(echo "$init" | jq -r '.session_id // empty' 2>/dev/null)
  else
    session_id=$(echo "$init" | grep -o '"session_id":"[^"]*"' | cut -d'"' -f4)
  fi
  
  if [ -z "$session_id" ] || [ "$session_id" == "null" ]; then
    echo "FAIL"
    return 1
  fi
  
  # Fase 2: Esperar
  sleep 0.1
  
  # Fase 3: Callback
  local callback=$(curl -s -w "\n%{http_code}" -X POST "$SERVER/api/verify/callback" \
    -H "Content-Type: application/json" \
    -d "{\"session_id\":\"$session_id\",\"state\":\"verified\",\"user_data\":{\"family_name\":\"Test\",\"given_name\":\"User\"}}")
  
  local http_code=$(echo "$callback" | tail -n 1)
  
  if [ "$http_code" = "200" ]; then
    echo "OK"
    return 0
  else
    echo "FAIL"
    return 1
  fi
}

export -f run_test
export SERVER

# Ejecutar tests en paralelo
echo "[2/4] 🔥 Ejecutando $TOTAL_REQUESTS tests..."
echo ""

START_TIME=$(python3 -c "import time; print(int(time.time() * 1000))" 2>/dev/null || echo $(($(date +%s) * 1000)))

(
  for i in $(seq 1 $TOTAL_REQUESTS); do
    echo "$i"
  done
) | xargs -P $CONCURRENT -I {} bash -c 'run_test {}' | tee /tmp/results.txt

END_TIME=$(python3 -c "import time; print(int(time.time() * 1000))" 2>/dev/null || echo $(($(date +%s) * 1000)))
DURATION=$((END_TIME - START_TIME))

# Análisis
echo ""
echo "[3/4] 📊 Analizando resultados..."
echo ""

SUCCESS=$(grep -c "^OK" /tmp/results.txt || true)
FAILED=$(grep -c "^FAIL" /tmp/results.txt || true)
SUCCESS_RATE=$((SUCCESS * 100 / TOTAL_REQUESTS))

echo "════════════════════════════════════════════════════════════"
echo "                    LOAD TEST RESULTS"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Total Requests:      $TOTAL_REQUESTS"
echo "Concurrent:          $CONCURRENT"
echo "Success:             $SUCCESS ✅"
echo "Failed:              $FAILED ❌"
echo "Success Rate:        $SUCCESS_RATE%"
echo "Total Duration:      ${DURATION}ms"
echo "Avg per Request:     $((DURATION / TOTAL_REQUESTS))ms"
if command -v bc > /dev/null; then
  RPS=$(echo "scale=2; $TOTAL_REQUESTS * 1000 / $DURATION" | bc)
  echo "Requests/sec:        $RPS"
else
  RPS=$(echo "scale=2; $TOTAL_REQUESTS * 1000 / $DURATION" | python3 -c "import sys; print(f'{float(sys.stdin.read()):.2f}')" 2>/dev/null || echo "N/A")
  echo "Requests/sec:        $RPS"
fi
echo ""
echo "════════════════════════════════════════════════════════════"

# Guardar JSON
if command -v bc > /dev/null; then
  RPS_JSON=$(echo "scale=2; $TOTAL_REQUESTS * 1000 / $DURATION" | bc)
else
  RPS_JSON=$(echo "scale=2; $TOTAL_REQUESTS * 1000 / $DURATION" | python3 -c "import sys; print(f'{float(sys.stdin.read()):.2f}')" 2>/dev/null || echo "0")
fi

cat > "$RESULTS_FILE" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "totalRequests": $TOTAL_REQUESTS,
  "concurrentLevel": $CONCURRENT,
  "success": $SUCCESS,
  "failed": $FAILED,
  "successRate": $SUCCESS_RATE,
  "totalDurationMs": $DURATION,
  "avgDurationMs": $((DURATION / TOTAL_REQUESTS)),
  "requestsPerSecond": $RPS_JSON
}
EOF

echo "[4/4] 📁 Resultados guardados en: $RESULTS_FILE"
echo ""

# Criterios de éxito
if [ $SUCCESS_RATE -ge 95 ]; then
  echo "🟢 BLITZ TEST PASSED (>95% success rate)"
  exit 0
else
  echo "🔴 BLITZ TEST FAILED (<95% success rate)"
  exit 1
fi

