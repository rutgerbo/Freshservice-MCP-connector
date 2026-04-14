import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerAssetTools(server: any) {

  server.tool(
    "list_assets",
    {},
    async (_: any, ctx: any) => {
      try {

        const assets = await fetchAllPages(
          "/assets",
          {},
          ctx.sessionId
        );

        return mcpResponse({
          total: assets.length,
          assets
        });

      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_asset",
    {
      asset_id: z.number()
    },
    async ({ asset_id }: any, ctx: any) => {
      try {

        const res = await getClient(ctx.sessionId)
          .get(`/assets/${asset_id}`);

        return mcpResponse(res.data);

      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}