import { AppProps } from '$fresh/server.ts';

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta name='robots' content='noindex' />
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />

        <link href={'/kv-insights/assets/style'} rel='stylesheet' />
        <title>Deno KV Insights</title>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
