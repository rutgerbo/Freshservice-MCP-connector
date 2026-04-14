import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerSearchTools(server: any) {

  server.tool(
    "search_all_tickets",
    {
      query: z.string()
    },
    async ({ query }: any, ctx: any) => {
      try {

        const results = await fetchAllPages(
          "/search/tickets",
          { query },
          ctx.sessionId
        );

        return mcpResponse({
          total: results.length,
          results
        });

      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}