import { Handlers } from "$fresh/server.ts";
import { mapToHTTPError } from "../common/httpUtils.ts";

export const handler: Handlers = {
    GET: async (request, context): Promise<Response> => {
      try {
        
        return new Response(JSON.stringify(removeUndefinedValue(entry), replace), {
          headers: { 'content-type': 'application/json' },
        });
      } catch (e) {
        console.error(e);
  
        const httpError = mapToHTTPError(e);
        return Response.json(httpError, {
          status: httpError.status,
        });
      }
    },
  
    POST: async (request, context): Promise<Response> => {
      try {
        
        return new Response(JSON.stringify(removeUndefinedValue(updatedEntry), replace), {
          headers: { 'content-type': 'application/json' },
        });
      } catch (e) {
        console.error(e);
  
        const httpError = mapToHTTPError(e);
        return Response.json(httpError, {
          status: httpError.status,
        });
      }
    },
  };