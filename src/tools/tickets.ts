import { z } from "zod";

import { client } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";

export function registerTicketTools(server: any) {

  server.tool(
    "list_tickets",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any) => {

      const res = await client.get("/tickets", {
        params: { page, per_page }
      });

      return mcpResponse(res.data);
    }
  );

  server.tool(
    "get_ticket",
    {
      ticket_id: z.number()
    },
    async ({ ticket_id }: any) => {

      const res = await client.get(`/tickets/${ticket_id}`);

      return mcpResponse(res.data);
    }
  );

  server.tool(
    "list_all_tickets",
    {},
    async () => {

      const tickets = await fetchAllPages("/tickets");

      return mcpResponse({
        total: tickets.length,
        tickets
      });
    }
  );

}