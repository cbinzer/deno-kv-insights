import { Handlers } from '$fresh/server.ts';
import { mapToHTTPError, replace, revive } from '../../common/httpUtils.ts';
import { EntryValue } from '../../entry/models.ts';
import { getValueType } from '../../entry/utils.ts';
import { QueueData, SubscriptionId } from '../models.ts';
import { publishValue, subscribeToQueue, unsubscribeFromQueue } from '../services/queueService.ts';

export const handler: Handlers = {
  GET: (): Response => {
    try {
      let subscriptionId: SubscriptionId;

      const value = new ReadableStream({
        start(controller) {
          const textEncoder = new TextEncoder();

          subscriptionId = subscribeToQueue((value) => {
            const queueData: QueueData = {
              received: new Date(),
              valueType: getValueType(value),
              value,
            };
            const text = `data: ${JSON.stringify(queueData, replace)}\r\n\r\n`;
            controller.enqueue(textEncoder.encode(text));
          });
        },

        cancel() {
          unsubscribeFromQueue(subscriptionId);
        },
      });

      return new Response(value, {
        headers: {
          'Content-Type': 'text/event-stream',
        },
      });
    } catch (e) {
      console.error(e);

      const httpError = mapToHTTPError(e);
      return Response.json(httpError, {
        status: httpError.status,
      });
    }
  },

  POST: async (request): Promise<Response> => {
    try {
      const text = await request.text();
      const queueData = JSON.parse(text, revive) as { value: EntryValue };
      await publishValue(queueData.value);
      return new Response(null, { status: 201 });
    } catch (e) {
      console.error(e);

      const httpError = mapToHTTPError(e);
      return Response.json(httpError, {
        status: httpError.status,
      });
    }
  },
};
