import { HandlerContext } from "$fresh/src/server/types.ts";
import {
  KVInsightsAppRoute,
  KVInsightsAppRouteHandlers,
} from "../lib/entry/routes/kvInsightsRoute.tsx";

export default KVInsightsAppRoute;

// @ts-ignore we don't need to type check this function
export const handler = async (request, context: HandlerContext) =>
  await KVInsightsAppRouteHandlers.GET(request, context);
