import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerContractTools(server: any) {

  server.tool(
    "list_contracts",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/contracts", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_contract",
    {
      contract_id: z.number()
    },
    async ({ contract_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/contracts/${contract_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_contract",
    {
      name: z.string(),
      vendor_id: z.number(),
      contract_type_id: z.number(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      cost: z.number().optional(),
      description: z.string().optional(),
      auto_renew: z.boolean().optional(),
      notify_expiry: z.boolean().optional(),
      notify_before: z.number().optional(),
      approver_id: z.number().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/contracts", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_contract",
    {
      contract_id: z.number(),
      name: z.string().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      cost: z.number().optional(),
      description: z.string().optional(),
      auto_renew: z.boolean().optional(),
      notify_expiry: z.boolean().optional(),
      notify_before: z.number().optional()
    },
    async ({ contract_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/contracts/${contract_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
