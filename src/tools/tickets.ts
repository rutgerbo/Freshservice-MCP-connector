import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerTicketTools(server: any) {

  server.tool(
    "list_tickets",
    {
      page: z.number().optional(),
      per_page: z.number().optional(),
      filter: z.string().optional(),
      order_by: z.string().optional(),
      order_type: z.enum(["asc", "desc"]).optional(),
      include: z.string().optional()
    },
    async ({ page, per_page, filter, order_by, order_type, include }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/tickets", {
          params: { page, per_page, filter, order_by, order_type, include }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_ticket",
    {
      ticket_id: z.number(),
      include: z.string().optional()
    },
    async ({ ticket_id, include }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}`, {
          params: { include }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_tickets",
    {
      filter: z.string().optional()
    },
    async ({ filter }: any, ctx: any) => {
      try {
        const tickets = await fetchAllPages("/tickets", filter ? { filter } : {}, ctx.sessionId);
        return mcpResponse({ total: tickets.length, tickets });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_ticket",
    {
      subject: z.string(),
      description: z.string().optional(),
      email: z.string().optional(),
      requester_id: z.number().optional(),
      type: z.string().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      urgency: z.number().optional(),
      impact: z.number().optional(),
      group_id: z.number().optional(),
      responder_id: z.number().optional(),
      category: z.string().optional(),
      sub_category: z.string().optional(),
      item_category: z.string().optional(),
      department_id: z.number().optional(),
      cc_emails: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      due_by: z.string().optional(),
      fr_due_by: z.string().optional(),
      workspace_id: z.number().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/tickets", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_ticket",
    {
      ticket_id: z.number(),
      subject: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      urgency: z.number().optional(),
      impact: z.number().optional(),
      group_id: z.number().optional(),
      responder_id: z.number().optional(),
      category: z.string().optional(),
      sub_category: z.string().optional(),
      item_category: z.string().optional(),
      department_id: z.number().optional(),
      tags: z.array(z.string()).optional(),
      due_by: z.string().optional(),
      fr_due_by: z.string().optional()
    },
    async ({ ticket_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/tickets/${ticket_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_ticket",
    {
      ticket_id: z.number()
    },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/tickets/${ticket_id}`);
        return mcpResponse({ success: true, message: `Ticket ${ticket_id} deleted.` });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_ticket_conversations",
    {
      ticket_id: z.number()
    },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}/conversations`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_ticket_reply",
    {
      ticket_id: z.number(),
      body: z.string(),
      cc_emails: z.array(z.string()).optional(),
      bcc_emails: z.array(z.string()).optional()
    },
    async ({ ticket_id, body, cc_emails, bcc_emails }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/tickets/${ticket_id}/conversations/reply`,
          { body, cc_emails, bcc_emails }
        );
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_ticket_note",
    {
      ticket_id: z.number(),
      body: z.string(),
      private: z.boolean().optional(),
      notify_emails: z.array(z.string()).optional()
    },
    async ({ ticket_id, body, private: isPrivate, notify_emails }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/tickets/${ticket_id}/conversations/note`,
          { body, private: isPrivate, notify_emails }
        );
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_ticket_activities",
    {
      ticket_id: z.number()
    },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}/activities`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
