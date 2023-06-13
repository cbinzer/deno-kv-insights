import { AppProps } from '$fresh/server.ts';
import { asset, Head } from '$fresh/runtime.ts';

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <link href={asset('/css/bootstrap.min.css')} rel='stylesheet' />
        <link href={asset('/css/styles.css')} rel='stylesheet' />

        <title>Deno KV Insights</title>
      </Head>
      <div class='container'>
        <props.Component />
      </div>
    </>
  );
}
