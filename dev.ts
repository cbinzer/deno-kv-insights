#!/usr/bin/env -S deno run -A --unstable --watch=static/,routes/ dev.ts

import dev from '$fresh/dev.ts';
import CleanCss from 'clean-css';

await createCSSTypescriptFile();

await dev(import.meta.url, './main.ts');

async function createCSSTypescriptFile(): Promise<void> {
  const bootstrapCSSContent = await Deno.readTextFile('./static/bootstrap.css');
  const bootstrapIconsCSSContent = await Deno.readTextFile('./static/bootstrap-icons.css');
  const styleCSSContent = await Deno.readTextFile('./static/style.css');

  const cleanCss = new CleanCss();
  const minifiedStyles = cleanCss.minify(styleCSSContent).styles;
  const minifiedBootstrapStyles = cleanCss.minify(bootstrapCSSContent).styles;
  const minifiedBootstrapIconsStyles = cleanCss.minify(bootstrapIconsCSSContent).styles;

  const styleVariable =
    `export const style = \`${minifiedBootstrapStyles} ${minifiedStyles} ${minifiedBootstrapIconsStyles}\`;`;
  await Deno.writeTextFile('./lib/common/routes/style.css.ts', styleVariable);
}
