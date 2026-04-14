import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerSyncTools(server: any) {

  server.tool(
    "list_tickets_updated_since",
    {
      updated_since: z.string(),
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ updated_since, page, per_page }: any, ctx: any) => {
      try {

        const res = await getClient(ctx.sessionId).get("/tickets", {
          params: { updated_since, page, per_page }
        });

        return mcpResponse(res.data);

      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}