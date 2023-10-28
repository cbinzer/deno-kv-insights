import { HandlerContext } from '$fresh/src/server/types.ts';
import { EntriesPageRoute, EntriesPageRouteHandlers } from '../lib/entry/routes/entriesPageRoute.tsx';

export default EntriesPageRoute;

export const handler = EntriesPageRouteHandlers;
