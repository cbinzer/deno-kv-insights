import { db } from '../../common/db.ts';
import { EntryValue } from '../../entry/models.ts';
import { Subscription, SubscriptionId } from '../models.ts';

let subscriptions: Subscription[] = [];
let queueConnected = false;

export async function publishValue(value: EntryValue): Promise<void> {
  const result: { ok: boolean } = await db.enqueue(value);
  if (!result.ok) {
    throw new Error('An unknown error occurred on publishing a value.');
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
    db.listenQueue(async (value) => {
      await Promise.all(subscriptions.map((subscription) => subscription.handler(value as EntryValue)));
    });
    console.debug(`Successfully connected to queue.`);
  }

  return id;
}

export function unsubscribeFromQueue(id: SubscriptionId) {
  subscriptions = subscriptions.filter((subscribtion) => subscribtion.id !== id);
  console.debug(`Subscription with id ${id} successfully removed.`);
}