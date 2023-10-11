#!/usr/bin/env -S deno run -A --unstable --watch=static/,routes/ dev.ts

import dev from '$fresh/dev.ts';
import CleanCss from 'clean-css';

await createCSSTypescriptFile();

await dev(import.meta.url, './main.ts');

async function createCSSTypescriptFile(): Promise<void> {
  const styleCSSContent = await Deno.readTextFile('./static/style.css');
  const cleanCss = new CleanCss();
  const newMinifiedCss = cleanCss.minify(styleCSSContent).styles;
  const styleVariable = `export const style = '${newMinifiedCss}';`;
  await Deno.writeTextFile('./lib/common/routes/style.css.ts', styleVariable);
}
