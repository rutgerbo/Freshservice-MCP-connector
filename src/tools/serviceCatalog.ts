import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";

export function registerServiceCatalogTools(server: any) {

  server.tool(
    "list_service_catalog_items",
    {},
    async (_: any, ctx: any) => {

      const res = await getClient(ctx.sessionId)
        .get("/service_catalog/items");

      return mcpResponse(res.data);

    }
  );


  server.tool(
    "get_service_request",
    {
      request_id: z.number()
    },
    async ({ request_id }: any, ctx: any) => {

      const res = await getClient(ctx.sessionId)
        .get(`/service_requests/${request_id}`);

      return mcpResponse(res.data);

    }
  );

}