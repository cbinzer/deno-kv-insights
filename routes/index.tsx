import { HandlerContext } from '$fresh/src/server/types.ts';
import {
  KVInsightsAppRoute,
  KVInsightsAppRouteHandlers,
} from '../lib/entry/routes/kvInsightsRoute.tsx';

export default KVInsightsAppRoute;

export const handler = KVInsightsAppRouteHandlers;
