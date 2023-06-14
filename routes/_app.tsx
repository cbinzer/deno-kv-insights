import { AppProps } from '$fresh/server.ts';
import { asset, Head } from '$fresh/runtime.ts';

export default function App(props: AppProps) {
  return (
    <div class="page">
      <Head>
        <link href={asset('/css/bootstrap.min.css')} rel='stylesheet' />
        <link href={asset('/css/styles.css')} rel='stylesheet' />

        <title>Deno KV Insights</title>
      </Head>
      <header></header>
      <main class='container'>
        <props.Component />
      </main>
    </div>
  );
}
