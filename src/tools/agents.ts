import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerAgentTools(server: any) {

  server.tool(
    "list_agents",
    {
      page: z.number().optional(),
      per_page: z.number().optional(),
      email: z.string().optional(),
      active: z.boolean().optional()
    },
    async ({ page, per_page, email, active }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/agents", {
          params: { page, per_page, email, active }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_agents",
    {
      active: z.boolean().optional()
    },
    async ({ active }: any, ctx: any) => {
      try {
        const agents = await fetchAllPages("/agents", active !== undefined ? { active } : {}, ctx.sessionId);
        return mcpResponse({ total: agents.length, agents });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_agent",
    {
      agent_id: z.number()
    },
    async ({ agent_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/agents/${agent_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_current_agent",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/agents/me");
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_agent",
    {
      first_name: z.string(),
      last_name: z.string().optional(),
      email: z.string(),
      job_title: z.string().optional(),
      phone: z.string().optional(),
      mobile_phone_number: z.string().optional(),
      work_phone_number: z.string().optional(),
      department_ids: z.array(z.number()).optional(),
      location_id: z.number().optional(),
      time_zone: z.string().optional(),
      language: z.string().optional(),
      role_ids: z.array(z.number()).optional(),
      group_ids: z.array(z.number()).optional(),
      vip_user: z.boolean().optional(),
      reporting_manager_id: z.number().optional(),
      address: z.string().optional(),
      time_format: z.string().optional(),
      background_information: z.string().optional(),
      auto_assign_tickets: z.boolean().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/agents", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_agent",
    {
      agent_id: z.number(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      job_title: z.string().optional(),
      phone: z.string().optional(),
      mobile_phone_number: z.string().optional(),
      work_phone_number: z.string().optional(),
      department_ids: z.array(z.number()).optional(),
      location_id: z.number().optional(),
      time_zone: z.string().optional(),
      language: z.string().optional(),
      role_ids: z.array(z.number()).optional(),
      group_ids: z.array(z.number()).optional(),
      occasional: z.boolean().optional(),
      vip_user: z.boolean().optional(),
      reporting_manager_id: z.number().optional(),
      address: z.string().optional(),
      time_format: z.string().optional(),
      background_information: z.string().optional(),
      auto_assign_tickets: z.boolean().optional()
    },
    async ({ agent_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/agents/${agent_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_agent",
    { agent_id: z.number() },
    async ({ agent_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/agents/${agent_id}`);
        return mcpResponse({ success: true, message: `Agent ${agent_id} deactivated.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "reactivate_agent",
    { agent_id: z.number() },
    async ({ agent_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/agents/${agent_id}/reactivate`, {});
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "convert_agent_to_requester",
    { agent_id: z.number() },
    async ({ agent_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/agents/${agent_id}/convert_to_requester`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "forget_agent",
    { agent_id: z.number() },
    async ({ agent_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).put(`/agents/${agent_id}/forget`, {});
        return mcpResponse({ success: true, message: `Agent ${agent_id} permanently deleted (GDPR).` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_agent_fields",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/agent_fields");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
