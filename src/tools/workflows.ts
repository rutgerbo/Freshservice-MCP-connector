import { z } from "zod";
import { client } from "../freshserviceClient.js";
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
    async ({ ticket_id, agent_id }: any) => {
      try {
        const res = await client.put(`/tickets/${ticket_id}`, {
          ticket: { responder_id: agent_id }
        });

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
    async ({ ticket_id, body }: any) => {
      try {
        const res = await client.post(`/tickets/${ticket_id}/notes`, {
          body
        });

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
    async ({ ticket_id }: any) => {
      try {
        const res = await client.put(`/tickets/${ticket_id}`, {
          ticket: { status: 4 }
        });

        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}