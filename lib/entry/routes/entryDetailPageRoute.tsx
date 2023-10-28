import { RouteContext } from '$fresh/server.ts';
import Page from '../../common/components/page.tsx';
import { EntryNotFoundError } from '../../common/errors.ts';
import EntryDetailPage from '../islands/entryDetailPage.tsx';
import { getEntryByCursor } from '../services/entryService.ts';

export default async function EntryDetailPageRoute(_: Request, context: RouteContext) {
  try {
    const cursor = context.params.cursor;
    const entry = await getEntryByCursor(cursor);

    return (
      <Page currentRoute={'/kv-insights'}>
        <EntryDetailPage initialEntry={entry} />
      </Page>
    );
  } catch (error) {
    if (error instanceof EntryNotFoundError) {
      return context.renderNotFound();
    }

    throw error;
  }
}
