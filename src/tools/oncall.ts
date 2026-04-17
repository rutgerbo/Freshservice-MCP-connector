import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerOncallTools(server: any) {

  server.tool(
    "get_oncall",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/oncall");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_oncall_schedules",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/schedules", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_oncall_schedule",
    { schedule_id: z.number() },
    async ({ schedule_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/schedules/${schedule_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_oncall_schedule",
    {
      name: z.string(),
      description: z.string().optional(),
      time_zone: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/schedules", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_oncall_schedule",
    {
      schedule_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      time_zone: z.string().optional()
    },
    async ({ schedule_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/schedules/${schedule_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_oncall_schedule",
    { schedule_id: z.number() },
    async ({ schedule_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/schedules/${schedule_id}`);
        return mcpResponse({ success: true, message: `Schedule ${schedule_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_escalation_policies",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/escalation_policies", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_escalation_policy",
    { policy_id: z.number() },
    async ({ policy_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/escalation_policies/${policy_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_escalation_policy",
    {
      name: z.string(),
      description: z.string().optional(),
      rules: z.array(z.record(z.unknown())).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/escalation_policies", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_escalation_policy",
    {
      policy_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      rules: z.array(z.record(z.unknown())).optional()
    },
    async ({ policy_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/escalation_policies/${policy_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_escalation_policy",
    { policy_id: z.number() },
    async ({ policy_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/escalation_policies/${policy_id}`);
        return mcpResponse({ success: true, message: `Escalation policy ${policy_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_oncall_shifts",
    { schedule_id: z.number() },
    async ({ schedule_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/schedules/${schedule_id}/shifts`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_oncall_shift",
    {
      schedule_id: z.number(),
      name: z.string().optional(),
      color: z.string().optional(),
      time_zone: z.string().optional(),
      start_time: z.string().optional(),
      duration: z.number().optional(),
      rotation_type: z.string().optional(),
      agent_ids: z.array(z.number()).optional()
    },
    async ({ schedule_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(`/schedules/${schedule_id}/shifts`, body);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_oncall_shift",
    {
      schedule_id: z.number(),
      shift_id: z.number(),
      name: z.string().optional(),
      agent_ids: z.array(z.number()).optional()
    },
    async ({ schedule_id, shift_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/schedules/${schedule_id}/shifts/${shift_id}`,
          updates
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_oncall_shift",
    { schedule_id: z.number(), shift_id: z.number() },
    async ({ schedule_id, shift_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/schedules/${schedule_id}/shifts/${shift_id}`);
        return mcpResponse({ success: true, message: `Shift ${shift_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_oncall_override",
    {
      schedule_id: z.number(),
      shift_id: z.number(),
      start_time: z.string(),
      end_time: z.string(),
      agent_id: z.number()
    },
    async ({ schedule_id, shift_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/schedules/${schedule_id}/shifts/${shift_id}/overrides`,
          body
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
