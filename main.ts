/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from '$fresh/server.ts';
import manifest from './fresh.gen.ts';
import { db } from './lib/common/db.ts';

for (let i = 300; i < 700; i++) {
  await db.set(['test', i], {});
}

await start(manifest, { plugins: [] });
