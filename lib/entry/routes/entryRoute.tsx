import { RouteContext } from '$fresh/server.ts';
import Page from '../../common/components/page.tsx';
import EntryPage from '../islands/entryDetailPage.tsx';

export default async function EntryPageRoute(_: Request, context: RouteContext) {
  return (
    <Page currentRoute={'/kv-insights'}>
      <EntryPage cursor={context.params.cursor} />
    </Page>
  );
}
