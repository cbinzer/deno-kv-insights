import { RouteContext } from '$fresh/server.ts';
import Page from '../../common/components/page.tsx';
import { EntryNotFoundError } from '../../common/errors.ts';
import EntryManagement from '../islands/entryManagement.tsx';
import { getEntryByCursor } from '../services/entryService.ts';

export default async function EntryPageRoute(_: Request, context: RouteContext) {
  try {
    const cursor = context.params.cursor;
    const entry = await getEntryByCursor(cursor);

    return (
      <Page currentRoute={'/kv-insights'}>
        <EntryManagement initialEntry={entry} />
      </Page>
    );
  } catch (error) {
    if (error instanceof EntryNotFoundError) {
      return context.renderNotFound();
    }

    throw error;
  }
}
