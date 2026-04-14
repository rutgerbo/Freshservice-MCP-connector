import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerRelationshipTools(server: any) {

  server.tool(
    "link_ticket_to_problem",
    {
      ticket_id: z.number(),
      problem_id: z.number()
    },
    async ({ ticket_id, problem_id }: any, ctx: any) => {
      try {

        const res = await getClient(ctx.sessionId).put(
          `/tickets/${ticket_id}`,
          {
            ticket: { problem_id }
          }
        );

        return mcpResponse(res.data);

      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}