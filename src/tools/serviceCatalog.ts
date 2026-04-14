import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerServiceCatalogTools(server: any) {

  server.tool(
    "list_service_catalog_items",
    {},
    async (_: any, ctx: any) => {
      try {

        const res = await getClient(ctx.sessionId)
          .get("/service_catalog/items");

        return mcpResponse(res.data);

      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_service_request",
    {
      request_id: z.number()
    },
    async ({ request_id }: any, ctx: any) => {
      try {

        const res = await getClient(ctx.sessionId)
          .get(`/service_requests/${request_id}`);

        return mcpResponse(res.data);

      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}