import { EntryValue } from '../entry/models.ts';

export type SubscriptionId = string;

export interface Subscription {
  id: SubscriptionId;
  handler: (value: EntryValue) => Promise<void> | void;
}

export interface QueueData {
  received: Date;
  value: unknown;
}
