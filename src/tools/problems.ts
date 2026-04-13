import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";

export function registerProblemTools(server: any) {

  server.tool(
    "list_problems",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {

      const res = await getClient(ctx.sessionId).get(
        "/problems",
        {
          params: { page, per_page }
        }
      );

      return mcpResponse(res.data);

    }
  );


  server.tool(
    "list_all_problems",
    {},
    async (_: any, ctx: any) => {

      const problems = await fetchAllPages(
        "/problems",
        {},
        ctx.sessionId
      );

      return mcpResponse({
        total: problems.length,
        problems
      });

    }
  );

}