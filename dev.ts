#!/usr/bin/env -S deno run -A --unstable --watch=static/,routes/ dev.ts

import dev from '$fresh/dev.ts';

await dev(import.meta.url, './main.ts');

