import { HandlerContext } from '$fresh/src/server/types.ts';
import { EntriesPageRoute, EntriesPageRouteHandlers } from '../lib/entry/routes/entriesRoute.tsx';

export default EntriesPageRoute;

export const handler = EntriesPageRouteHandlers;
