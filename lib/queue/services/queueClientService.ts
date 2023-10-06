import { replace, revive } from '../../common/httpUtils.ts';
import { QueueData } from '../models.ts';

export function subscribeToQueue(handler: (queueData: QueueData) => void) {
  const source = new EventSource('/kv-insights/api/queue');
  source.onmessage = (event) => {
    const queueData = JSON.parse(event.data, revive) as QueueData;
    handler(queueData);
  };
}

export async function publishValue(value: unknown): Promise<void> {
  const body = JSON.stringify({ value }, replace);
  await fetch('/kv-insights/api/queue', {
    method: 'POST',
    body,
  });
}
