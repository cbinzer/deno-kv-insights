import { db } from '../../common/db.ts';
import { EntryValue } from '../../entry/models.ts';
import { Subscription, SubscriptionId } from '../models.ts';

const onDenoDeploy = Deno.env.get('DENO_DEPLOYMENT_ID') !== undefined;

let subscriptions: Subscription[] = [];
let queueConnected = false;
let queueValueHandler: ((value: unknown) => Promise<void>) | undefined;
let broadcastChannel: BroadcastChannel;

export async function publishValue(value: EntryValue): Promise<void> {
  const result: { ok: boolean } = await db.enqueue(value);
  if (!result.ok) {
    throw new Error('An unknown error occurred on publishing a value.');
  }

  if (broadcastChannel) {
    console.debug('Publish value to broadcast channel', value);
    broadcastChannel.postMessage(value);
  }

  if (onDenoDeploy && queueValueHandler) {
    console.debug('Publish value to publisher', value);
    await queueValueHandler(value);
  }
}

export function subscribeToQueue(handler: (value: EntryValue) => Promise<void> | void): SubscriptionId {
  const id = crypto.randomUUID();
  subscriptions.push({
    id,
    handler,
  });

  if (!queueConnected) {
    queueConnected = true;

    if (!queueValueHandler) {
      createQueueValueHandler();

      try {
        connectToKVQueue();
      } catch (e) {
        queueConnected = false;
        unsubscribeFromQueue(id);

        console.error('An error occurred on connecting to queue', e);
        throw new Error('An error occurred on connecting to queue');
      }
    }
  }

  return id;
}

export function unsubscribeFromQueue(id: SubscriptionId) {
  subscriptions = subscriptions.filter((subscription) => subscription.id !== id);
  console.debug(`Subscription with id ${id} successfully removed.`);
}

export function createQueueValueHandler(): (value: unknown) => Promise<void> {
  if (!queueValueHandler) {
    queueValueHandler = async (value) => {
      await Promise.all(subscriptions.map((subscription) => subscription.handler(value as EntryValue)));
    };

    if (!Deno.args.includes('build')) {
      connectToBroadcastChannel();
    }
  }

  return queueValueHandler;
}

function connectToKVQueue() {
  db.listenQueue(async (value) => {
    if (queueValueHandler) {
      console.debug('Received value over queue', value);
      await queueValueHandler(value);
    }
  });
  console.debug(`Successfully connected to queue.`);
}

function connectToBroadcastChannel() {
  try {
    if (!broadcastChannel) {
      broadcastChannel = new BroadcastChannel('kv-insights');
      broadcastChannel.onmessage = async (event: MessageEvent<unknown>) => {
        if (queueValueHandler) {
          console.debug('Received value over broadcast channel', event.data);
          await queueValueHandler(event.data);
        }
      };
      console.debug(`Successfully connected to broadcast channel.`);
    }
  } catch (e) {
    console.error('Connecting to broadcast channel failed.', e);
  }
}
