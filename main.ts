/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from '$fresh/server.ts';
import manifest from './fresh.gen.ts';
import { kvInsightsPlugin } from './mod.ts';

await start(manifest, { plugins: [await kvInsightsPlugin()], router: { trailingSlash: false } });
