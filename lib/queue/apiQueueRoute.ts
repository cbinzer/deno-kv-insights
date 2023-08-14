import { Handlers } from '$fresh/server.ts';
import { mapToHTTPError, replace, revive } from '../common/httpUtils.ts';
import { QueueData } from './models.ts';
import { publishValue, subscribeToValue } from './queueService.ts';

export const handler: Handlers = {
  GET: (): Response => {
    try {
      const value = new ReadableStream({
        async start(controller) {
          const textEncoder = new TextEncoder();

          await subscribeToValue((value) => {
            const queueData: QueueData = {
              value,
            };
            const text = `data: ${JSON.stringify(queueData, replace)}\r\n\r\n`;
            controller.enqueue(textEncoder.encode(text));
          });
        },
        cancel() {
          console.log('should close kv queue subscription.');
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
      const queueData = JSON.parse(text, revive) as QueueData;
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
