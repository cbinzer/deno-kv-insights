import { Handlers } from '$fresh/server.ts';
import { style } from './style.css.ts';

export const handler: Handlers = {
  GET: (): Response => {
    return new Response(style, {
      headers: {
        'content-type': 'text/css',
      },
    });
  },
};
