/**
 * Helper para obtener session_id del servidor
 * Útil si tienes endpoint que devuelve los QRs activos
 */

const http = require('http');

const SERVER = 'localhost:3000';
const ENDPOINT = '/api/qr/active'; // Ajusta según tu API

console.log('🔍 Buscando session_id activo...\n');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/qr/active',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const qrData = JSON.parse(data);
        if (qrData.session_id) {
          console.log(`✅ Session ID encontrado: ${qrData.session_id}\n`);
          process.stdout.write(qrData.session_id);
          process.exit(0);
        } else {
          console.error('❌ No se encontró session_id en respuesta\n');
          process.exit(1);
        }
      } catch (e) {
        console.error('❌ Error parseando respuesta\n');
        process.exit(1);
      }
    } else {
      console.error(`❌ HTTP ${res.statusCode}\n`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(`❌ Error: ${error.message}\n`);
  process.exit(1);
});

req.end();

