import { z } from "zod";

import { client } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";

export function registerProblemTools(server: any) {

  server.tool(
    "list_problems",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any) => {

      const res = await client.get("/problems", {
        params: { page, per_page }
      });

      return mcpResponse(res.data);
    }
  );

  server.tool(
    "list_all_problems",
    {},
    async () => {

      const problems = await fetchAllPages("/problems");

      return mcpResponse({
        total: problems.length,
        problems
      });
    }
  );

}