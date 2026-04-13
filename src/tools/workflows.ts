import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerWorkflowTools(server: any) {

  // Assign ticket
  server.tool(
    "assign_ticket",
    {
      ticket_id: z.number(),
      agent_id: z.number()
    },
    async ({ ticket_id, agent_id }: any, ctx: any) => {
      try {

        const res = await getClient(ctx.sessionId).put(
          `/tickets/${ticket_id}`,
          {
            ticket: { responder_id: agent_id }
          }
        );

        return mcpResponse(res.data);

      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  // Add note
  server.tool(
    "add_note_to_ticket",
    {
      ticket_id: z.number(),
      body: z.string()
    },
    async ({ ticket_id, body }: any, ctx: any) => {
      try {

        const res = await getClient(ctx.sessionId).post(
          `/tickets/${ticket_id}/notes`,
          {
            body
          }
        );

        return mcpResponse(res.data);

      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  // Resolve ticket
  server.tool(
    "resolve_ticket",
    {
      ticket_id: z.number()
    },
    async ({ ticket_id }: any, ctx: any) => {
      try {

        const res = await getClient(ctx.sessionId).put(
          `/tickets/${ticket_id}`,
          {
            ticket: { status: 4 }
          }
        );

        return mcpResponse(res.data);

      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}