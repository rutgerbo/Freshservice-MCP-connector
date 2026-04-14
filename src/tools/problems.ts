import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerProblemTools(server: any) {

  server.tool(
    "list_problems",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {

        const res = await getClient(ctx.sessionId).get(
          "/problems",
          {
            params: { page, per_page }
          }
        );

        return mcpResponse(res.data);

      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_problems",
    {},
    async (_: any, ctx: any) => {
      try {

        const problems = await fetchAllPages(
          "/problems",
          {},
          ctx.sessionId
        );

        return mcpResponse({
          total: problems.length,
          problems
        });

      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}