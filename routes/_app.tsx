import { AppProps } from '$fresh/server.ts';
import { asset, Head } from '$fresh/runtime.ts';

export default function App(props: AppProps) {
  return (
    <div class='page container'>
      <Head>
        <link href={asset('/css/bootstrap.min.css')} rel='stylesheet' />
        <link href={asset('/css/styles.css')} rel='stylesheet' />

        <title>Deno KV Insights</title>
      </Head>

      <header class='header'>
        <img class='deno-logo' src={asset('images/deno-logo.png')} />
        <span class='title'>Deno KV Insights</span>
      </header>

      <main>
        <props.Component />
      </main>

      <footer class='footer'>
        <a href='https://fresh.deno.dev'>
          <img
            width='197'
            height='37'
            src='https://fresh.deno.dev/fresh-badge.svg'
            alt='Made with Fresh'
          />
        </a>
      </footer>
    </div>
  );
}
