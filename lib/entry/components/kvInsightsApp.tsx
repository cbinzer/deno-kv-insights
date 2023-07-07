import { FunctionComponent } from 'preact';
import { Head } from '$fresh/src/runtime/head.ts';
import { asset } from '$fresh/src/runtime/utils.ts';
import { HTTPStrippedEntries } from '../models.ts';
import EntriesManagement from '../../../islands/entry/entriesManagement.tsx';

const KVInsightsApp: FunctionComponent<KVInsightsAppProps> = ({ initialEntries }) => {
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
        <EntriesManagement initialEntries={initialEntries} />
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
};

export interface KVInsightsAppProps {
  initialEntries: HTTPStrippedEntries;
}

export default KVInsightsApp;
