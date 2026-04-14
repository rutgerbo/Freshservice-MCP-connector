import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerJourneyTools(server: any) {

  server.tool(
    "list_journey_configs",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/journey_configs");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_journey_config_form",
    { journey_config_id: z.number() },
    async ({ journey_config_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/journey_configs/${journey_config_id}/form`
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_journey_requests",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/journey_requests", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_journey_request",
    { journey_request_id: z.number() },
    async ({ journey_request_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/journey_requests/${journey_request_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_journey_request",
    {
      journey_config_id: z.number(),
      fields: z.record(z.unknown()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/journey_requests", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "cancel_journey_request",
    { journey_request_id: z.number() },
    async ({ journey_request_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/journey_requests/${journey_request_id}/cancel`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
