import { FunctionComponent } from 'preact';
import Sidebar from '../../common/components/sidebar.tsx';
import { Head } from '$fresh/src/runtime/head.ts';

const Page: FunctionComponent<PageProps> = ({ currentRoute, children }) => {
  return (
    <div class='page'>
      <Head>
        <link href={'/kv-insights/assets/style'} rel='stylesheet' />
        <title>Deno KV Insights</title>
      </Head>
      <Sidebar currentRoute={currentRoute} />
      <main>{children}</main>
    </div>
  );
};

export interface PageProps {
  currentRoute: string;
}

export default Page;
