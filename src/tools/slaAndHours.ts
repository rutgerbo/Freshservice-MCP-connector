import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerSlaAndHoursTools(server: any) {

  server.tool(
    "list_sla_policies",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/sla_policies");
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_business_hours",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/business_hours");
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_business_hours",
    {
      business_hours_id: z.number()
    },
    async ({ business_hours_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/business_hours/${business_hours_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_agent_roles",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/roles");
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_agent_role",
    {
      role_id: z.number()
    },
    async ({ role_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/roles/${role_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
