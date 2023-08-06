import { FunctionComponent } from 'preact';
import { Head } from '$fresh/src/runtime/head.ts';
import { HTTPStrippedEntries } from '../models.ts';
import EntriesManagement from '../islands/entriesManagement.tsx';
import Sidebar from '../../common/components/sidebar.tsx';
import { asset } from '$fresh/src/runtime/utils.ts';

const KVInsightsApp: FunctionComponent<KVInsightsAppProps> = ({ initialEntries }) => {
  return (
    <div class='page'>
      <Head>
        <meta name='robots' content='noindex' />
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM'
          crossOrigin='anonymous'
        />
        <link href={asset('style.css')} rel='stylesheet' />
        <title>Deno KV Insights</title>
      </Head>

      <Sidebar />

      <div class='main'>
        <header class='header'>
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
    </div>
  );
};

export interface KVInsightsAppProps {
  initialEntries: HTTPStrippedEntries;
}

export default KVInsightsApp;
