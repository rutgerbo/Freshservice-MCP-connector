import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";

export function registerRelationshipTools(server: any) {

  server.tool(
    "link_ticket_to_problem",
    {
      ticket_id: z.number(),
      problem_id: z.number()
    },
    async ({ ticket_id, problem_id }: any) => {
      const res = await client.put(`/tickets/${ticket_id}`, {
        ticket: { problem_id }
      });

      return mcpResponse(res.data);
    }
  );

}