import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";

export function registerTicketTools(server: any) {

  server.tool(
    "list_tickets",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {

      const res = await getClient(ctx.sessionId).get(
        "/tickets",
        {
          params: { page, per_page }
        }
      );

      return mcpResponse(res.data);

    }
  );


  server.tool(
    "get_ticket",
    {
      ticket_id: z.number()
    },
    async ({ ticket_id }: any, ctx: any) => {

      const res = await getClient(ctx.sessionId).get(
        `/tickets/${ticket_id}`
      );

      return mcpResponse(res.data);

    }
  );


  server.tool(
    "list_all_tickets",
    {},
    async (_: any, ctx: any) => {

      const tickets = await fetchAllPages(
        "/tickets",
        {},
        ctx.sessionId
      );

      return mcpResponse({
        total: tickets.length,
        tickets
      });

    }
  );

}