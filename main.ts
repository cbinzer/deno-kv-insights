/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from '$fresh/server.ts';
import manifest from './fresh.gen.ts';
import { createQueueValueHandler, kvInsightsPlugin } from './mod.ts';

const kv = await Deno.openKv();
const kvInsightsQueueValueHandler = createQueueValueHandler();

kv.listenQueue(async (value: unknown) => {
  await kvInsightsQueueValueHandler(value);
});

await start(manifest, { plugins: [kvInsightsPlugin({ kv })], router: { trailingSlash: false } });
