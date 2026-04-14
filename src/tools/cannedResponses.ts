import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerCannedResponseTools(server: any) {

  server.tool(
    "list_canned_response_folders",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/canned_response_folders");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_canned_response_folder",
    { folder_id: z.number() },
    async ({ folder_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/canned_response_folders/${folder_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_canned_responses",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/canned_responses", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_canned_response",
    { canned_response_id: z.number() },
    async ({ canned_response_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/canned_responses/${canned_response_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_canned_responses_in_folder",
    { folder_id: z.number() },
    async ({ folder_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/canned_response_folders/${folder_id}/canned_responses`
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
