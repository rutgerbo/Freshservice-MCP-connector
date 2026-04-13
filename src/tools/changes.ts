import { z } from "zod";

import { client } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";

export function registerChangeTools(server: any) {

  server.tool(
    "list_changes",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any) => {

      const res = await client.get("/changes", {
        params: { page, per_page }
      });

      return mcpResponse(res.data);
    }
  );

  server.tool(
    "list_all_changes",
    {},
    async () => {

      const changes = await fetchAllPages("/changes");

      return mcpResponse({
        total: changes.length,
        changes
      });
    }
  );

}