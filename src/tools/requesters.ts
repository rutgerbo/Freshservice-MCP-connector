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
      language: z.string().optional()
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
      language: z.string().optional()
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

}
