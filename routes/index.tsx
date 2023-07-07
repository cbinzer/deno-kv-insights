import { HandlerContext } from '$fresh/src/server/types.ts';
import KVInsightsAppRoute, { handler as kvInsightsHandler } from '../lib/entry/routes/kvInsightsRoute.tsx';

export default KVInsightsAppRoute;

export const handler = async (request, context: HandlerContext) => kvInsightsHandler.GET(request, context);
