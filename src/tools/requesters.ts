import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerRequesterTools(server: any) {

  server.tool(
    "list_requesters",
    {
      page: z.number().optional(),
      per_page: z.number().optional(),
      query: z.string().optional()
    },
    async ({ page, per_page, query }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/requesters", {
          params: { page, per_page, query }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_requesters",
    {},
    async (_: any, ctx: any) => {
      try {
        const requesters = await fetchAllPages("/requesters", {}, ctx.sessionId);
        return mcpResponse({ total: requesters.length, requesters });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_requester",
    {
      requester_id: z.number()
    },
    async ({ requester_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/requesters/${requester_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_requester",
    {
      first_name: z.string(),
      last_name: z.string().optional(),
      primary_email: z.string().optional(),
      secondary_emails: z.array(z.string()).optional(),
      job_title: z.string().optional(),
      work_phone_number: z.string().optional(),
      mobile_phone_number: z.string().optional(),
      department_ids: z.array(z.number()).optional(),
      location_id: z.number().optional(),
      time_zone: z.string().optional(),
      language: z.string().optional(),
      vip_user: z.boolean().optional(),
      reporting_manager_id: z.number().optional(),
      address: z.string().optional(),
      time_format: z.string().optional(),
      background_information: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/requesters", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_requester",
    {
      requester_id: z.number(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      primary_email: z.string().optional(),
      secondary_emails: z.array(z.string()).optional(),
      job_title: z.string().optional(),
      work_phone_number: z.string().optional(),
      mobile_phone_number: z.string().optional(),
      department_ids: z.array(z.number()).optional(),
      location_id: z.number().optional(),
      time_zone: z.string().optional(),
      language: z.string().optional(),
      vip_user: z.boolean().optional(),
      reporting_manager_id: z.number().optional(),
      address: z.string().optional(),
      time_format: z.string().optional(),
      background_information: z.string().optional()
    },
    async ({ requester_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/requesters/${requester_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_requester",
    { requester_id: z.number() },
    async ({ requester_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/requesters/${requester_id}`);
        return mcpResponse({ success: true, message: `Requester ${requester_id} deactivated.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "forget_requester",
    { requester_id: z.number() },
    async ({ requester_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/requesters/${requester_id}/forget`);
        return mcpResponse({ success: true, message: `Requester ${requester_id} permanently deleted (GDPR).` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "convert_requester_to_agent",
    { requester_id: z.number() },
    async ({ requester_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/requesters/${requester_id}/convert_to_agent`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "merge_requesters",
    {
      requester_id: z.number(),
      secondary_requester_ids: z.array(z.number())
    },
    async ({ requester_id, secondary_requester_ids }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/requesters/${requester_id}/merge`,
          { secondary_requesters: secondary_requester_ids }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_requester_fields",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/requester_fields");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
