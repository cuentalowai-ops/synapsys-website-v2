import https from 'https';

interface NotifyPayload {
  status: 'success' | 'error' | 'warning';
  message: string;
  metrics?: {
    latency?: number;
    timestamp?: string;
  };
}

/**
 * ZERO-KNOWLEDGE NOTIFIER
 * ✅ GDPR Compliant: Solo metadatos operacionales
 * ❌ NUNCA transmite PII a servicios externos
 */
export async function notifyTeam(payload: NotifyPayload): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    // ✅ Console-only (no external transmission)
    console.log(`🔔 [${payload.status.toUpperCase()}] ${payload.message}`);
    if (payload.metrics) {
      console.log(`   Latency: ${payload.metrics.latency}ms`);
      console.log(`   Timestamp: ${payload.metrics.timestamp}`);
    }
    return;
  }

  // ✅ AUDITOR CHECK: Solo metadatos seguros
  const sanitizedPayload = {
    text: `🔔 ${payload.message}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${payload.status === 'success' ? '✅' : '❌'} Operation Status*\n${payload.message}`,
        },
      },
      ...(payload.metrics
        ? [
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  // ✅ OK: Latency (no personal)
                  text: `*Latency:*\n${payload.metrics.latency}ms`,
                },
                {
                  type: 'mrkdwn',
                  // ✅ OK: Timestamp (operational)
                  text: `*Time:*\n${payload.metrics.timestamp}`,
                },
              ],
            },
          ]
        : []),
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `🔐 SYNAPSYS | Zero-Knowledge Notification`,
          },
        ],
      },
    ],
  };

  try {
    const data = JSON.stringify(sanitizedPayload);
    const options = {
      hostname: new URL(webhookUrl).hostname,
      path: new URL(webhookUrl).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    await new Promise<void>((resolve, reject) => {
      const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
          console.log('✅ Notification sent securely');
          resolve();
        } else {
          reject(new Error(`Webhook returned ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  } catch (error) {
    console.error('⚠️ Notification failed (non-blocking):', 
      error instanceof Error ? error.message : 'Unknown');
  }
}

export function notifySuccess(
  message: string,
  metrics?: { latency?: number; timestamp?: string }
): Promise<void> {
  return notifyTeam({
    status: 'success',
    message,
    metrics,
  });
}

export function notifyError(
  message: string,
  metrics?: { latency?: number; timestamp?: string }
): Promise<void> {
  return notifyTeam({
    status: 'error',
    message,
    metrics,
  });
}
