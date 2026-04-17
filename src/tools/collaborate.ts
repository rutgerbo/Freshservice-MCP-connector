import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerCollaborateTools(server: any) {

  server.tool(
    "list_ticket_emails",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}/emails`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_ticket_email",
    {
      ticket_id: z.number(),
      to_emails: z.array(z.string()),
      body: z.string(),
      subject: z.string().optional(),
      cc_emails: z.array(z.string()).optional()
    },
    async ({ ticket_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(`/tickets/${ticket_id}/emails`, body);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_ticket_email",
    { ticket_id: z.number(), email_id: z.number() },
    async ({ ticket_id, email_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/tickets/${ticket_id}/emails/${email_id}`);
        return mcpResponse({ success: true, message: `Email ${email_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_ticket_zoom_meetings",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/tickets/${ticket_id}/zoom_meetings`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_ticket_zoom_meeting",
    {
      ticket_id: z.number(),
      topic: z.string().optional(),
      start_time: z.string().optional(),
      duration: z.number().optional(),
      invitees: z.array(z.string()).optional()
    },
    async ({ ticket_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(`/tickets/${ticket_id}/zoom_meetings`, body);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_ticket_zoom_meeting",
    { ticket_id: z.number(), meeting_id: z.number() },
    async ({ ticket_id, meeting_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/tickets/${ticket_id}/zoom_meetings/${meeting_id}`);
        return mcpResponse({ success: true, message: `Zoom meeting ${meeting_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
