import { Handlers } from '$fresh/server.ts';

export const handler: Handlers = {
  GET: async (_, context): Promise<Response> => {
    const filepath = `./static/${context.params.fileName}`;

    let file;
    try {
      file = await Deno.open(filepath, { read: true });
    } catch {
      // If the file cannot be opened, return a "404 Not Found" response
      return new Response('404 Not Found', { status: 404 });
    }

    // // // Build a readable stream so the file doesn't have to be fully loaded into
    // // // memory while we send it
    const readableStream = file.readable;

    // // // Build and send the response
    return new Response(readableStream);
  },
};
