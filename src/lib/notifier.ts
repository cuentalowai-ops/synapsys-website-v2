import https from 'https';

interface NotifyPayload {
  status: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  metrics?: {
    latency?: number;
    listenersNotified?: number;
    timestamp?: string;
  };
}

export async function notifyTeam(payload: NotifyPayload): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('📢 [NOTIFIER] No webhook configured. Using console output:');
    console.log(`   Status: ${payload.status.toUpperCase()}`);
    console.log(`   Title: ${payload.title}`);
    console.log(`   Message: ${payload.message}`);
    if (payload.metrics) {
      console.log(`   Latency: ${payload.metrics.latency}ms`);
      console.log(`   Timestamp: ${payload.metrics.timestamp}`);
    }
    return;
  }

  const slackMessage = {
    text: payload.title,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${payload.title}*\n${payload.message}`,
        },
      },
      ...(payload.metrics
        ? [
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Latency:*\n${payload.metrics.latency}ms`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Listeners Notified:*\n${payload.metrics.listenersNotified || 0}`,
                },
                {
                  type: 'mrkdwn',
                  text: `*Timestamp:*\n${payload.metrics.timestamp || new Date().toISOString()}`,
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
            text: `Status: *${payload.status}* | Source: SYNAPSYS`,
          },
        ],
      },
    ],
  };

  try {
    const data = JSON.stringify(slackMessage);

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
          console.log('✅ Slack notification sent');
          resolve();
        } else {
          reject(new Error(`Slack returned ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  } catch (error) {
    console.error('⚠️ Failed to send notification:', error instanceof Error ? error.message : error);
  }
}

export function notifySuccess(
  title: string,
  message: string,
  metrics?: NotifyPayload['metrics']
): Promise<void> {
  return notifyTeam({
    status: 'success',
    title,
    message,
    metrics,
  });
}

export function notifyError(
  title: string,
  message: string,
  metrics?: NotifyPayload['metrics']
): Promise<void> {
  return notifyTeam({
    status: 'error',
    title,
    message,
    metrics,
  });
}

