import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerOnboardingTools(server: any) {

  server.tool(
    "get_onboarding_form",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/onboarding_form");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_onboarding_requests",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/onboarding_requests", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_onboarding_request",
    { onboarding_request_id: z.number() },
    async ({ onboarding_request_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/onboarding_requests/${onboarding_request_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_onboarding_request",
    { fields: z.record(z.unknown()) },
    async ({ fields }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/onboarding_requests", fields);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_onboarding_request_tickets",
    { onboarding_request_id: z.number() },
    async ({ onboarding_request_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/onboarding_requests/${onboarding_request_id}/tickets`
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_offboarding_form",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/offboarding_form");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_offboarding_requests",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/offboarding_requests", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_offboarding_request",
    { offboarding_request_id: z.number() },
    async ({ offboarding_request_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/offboarding_requests/${offboarding_request_id}`
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_offboarding_request",
    { fields: z.record(z.unknown()) },
    async ({ fields }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/offboarding_requests", fields);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_offboarding_request_tickets",
    { offboarding_request_id: z.number() },
    async ({ offboarding_request_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/offboarding_requests/${offboarding_request_id}/tickets`
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
