import { z } from "zod";

import { client } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";

export function registerServiceCatalogTools(server: any) {

  server.tool(
    "list_service_catalog_items",
    {},
    async () => {

      const res = await client.get("/service_catalog/items");

      return mcpResponse(res.data);
    }
  );

  server.tool(
    "get_service_request",
    {
      request_id: z.number()
    },
    async ({ request_id }: any) => {

      const res = await client.get(`/service_requests/${request_id}`);

      return mcpResponse(res.data);
    }
  );

}