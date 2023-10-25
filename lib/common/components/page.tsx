import { Head } from '$fresh/src/runtime/head.ts';
import { FunctionComponent } from 'preact';
import Sidebar from '../../common/components/sidebar.tsx';

const Page: FunctionComponent<PageProps> = ({ currentRoute, children }) => {
  return (
    <div class='page'>
      <Head>
        <meta name='robots' content='noindex' />
        <link href={'/kv-insights/assets/style'} rel='stylesheet' />
        <title>Deno KV Insights</title>
      </Head>

      <Sidebar currentRoute={currentRoute} />

      <div class='main'>
        <header class='header'>
          <span class='title'>Deno KV Insights</span>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
};

export interface PageProps {
  currentRoute: string;
}

export default Page;
