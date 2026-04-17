import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerApprovalTools(server: any) {

  server.tool(
    "list_approvals",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional(),
      approver_id: z.number().optional(),
      status: z.string().optional()
    },
    async ({ page, per_page, approver_id, status }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/approvals", {
          params: { page, per_page, approver_id, status }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_service_request_approvals",
    { ticket_id: z.number() },
    async ({ ticket_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/service_requests/${ticket_id}/approvals`
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_service_request_approval",
    {
      ticket_id: z.number(),
      approver_id: z.number(),
      approval_type: z.number().optional()
    },
    async ({ ticket_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/service_requests/${ticket_id}/approvals`,
          body
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_service_request_approval",
    { ticket_id: z.number(), approval_id: z.number() },
    async ({ ticket_id, approval_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(
          `/service_requests/${ticket_id}/approvals/${approval_id}`
        );
        return mcpResponse({ success: true, message: `Approval ${approval_id} cancelled.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_approval_groups",
    { page: z.number().optional(), per_page: z.number().max(100).optional() },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/approval_groups", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_approval_group",
    { approval_group_id: z.number() },
    async ({ approval_group_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/approval_groups/${approval_group_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_approval_group",
    {
      name: z.string(),
      description: z.string().optional(),
      approver_ids: z.array(z.number()).optional(),
      approval_type: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/approval_groups", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_approval_group",
    {
      approval_group_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      approver_ids: z.array(z.number()).optional()
    },
    async ({ approval_group_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/approval_groups/${approval_group_id}`,
          updates
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_approval_group",
    { approval_group_id: z.number() },
    async ({ approval_group_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/approval_groups/${approval_group_id}`);
        return mcpResponse({ success: true, message: `Approval group ${approval_group_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
