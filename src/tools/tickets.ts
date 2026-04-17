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
      ticket_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ ticket_id, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}/conversations`, {
          params: { page, per_page }
        });
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


  server.tool(
    "restore_ticket",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/tickets/${ticket_id}/restore`, {});
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_ticket_conversation",
    {
      ticket_id: z.number(),
      conversation_id: z.number(),
      body: z.string()
    },
    async ({ ticket_id, conversation_id, body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/tickets/${ticket_id}/conversations/${conversation_id}`,
          { body }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_ticket_conversation",
    { ticket_id: z.number(), conversation_id: z.number() },
    async ({ ticket_id, conversation_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(
          `/tickets/${ticket_id}/conversations/${conversation_id}`
        );
        return mcpResponse({ success: true, message: `Conversation ${conversation_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_ticket_csat",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}/csat_response`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_ticket_requested_items",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}/requested_items`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_ticket_requested_items",
    {
      ticket_id: z.number(),
      requested_items: z.array(z.record(z.unknown()))
    },
    async ({ ticket_id, requested_items }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/tickets/${ticket_id}/requested_items`,
          { requested_items }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_ticket_approvals",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}/approvals`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_ticket_approval",
    { ticket_id: z.number(), approval_id: z.number() },
    async ({ ticket_id, approval_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/tickets/${ticket_id}/approvals/${approval_id}`
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_ticket_approval",
    {
      ticket_id: z.number(),
      approver_id: z.number(),
      approval_type: z.number().optional()
    },
    async ({ ticket_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/tickets/${ticket_id}/approvals`,
          body
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_ticket_approval",
    { ticket_id: z.number(), approval_id: z.number() },
    async ({ ticket_id, approval_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(
          `/tickets/${ticket_id}/approvals/${approval_id}`
        );
        return mcpResponse({ success: true, message: `Approval ${approval_id} cancelled.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "send_ticket_approval_reminder",
    { ticket_id: z.number(), approval_id: z.number() },
    async ({ ticket_id, approval_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/tickets/${ticket_id}/approvals/${approval_id}/reminders`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_child_tickets",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}/child_tickets`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "promote_to_major_incident",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/tickets/${ticket_id}/promote_to_major_incident`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "demote_from_major_incident",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/tickets/${ticket_id}/demote_from_major_incident`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_ticket_fields",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/ticket_fields");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "move_ticket",
    {
      ticket_id: z.number(),
      workspace_id: z.number()
    },
    async ({ ticket_id, workspace_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/tickets/${ticket_id}/move_to_workspace`,
          { workspace_id }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
