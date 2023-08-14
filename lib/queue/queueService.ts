import { db } from '../common/db.ts';

export async function publishValue(value: unknown): Promise<void> {
  const result: { ok: boolean } = await db.enqueue(value);
  if (!result.ok) {
    throw new Error('An unknown error occurred on publishing a value.');
  }
}

export async function subscribeToValue(handler: (value: unknown) => Promise<void> | void): Promise<void> {
  await db.listenQueue(handler);
}
