import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";

export function registerAssetTools(server: any) {

  server.tool(
    "list_assets",
    {},
    async () => {

      const assets = await fetchAllPages("/assets", {}, ctx.sessionId);

      return mcpResponse({
        total: assets.length,
        assets
      });
    }
  );

  server.tool(
    "get_asset",
    {
      asset_id: z.number()
    },
    async ({ asset_id }: any) => {

      const res = await getClient(ctx.sessionId).get(`/assets/${asset_id}`);

      return mcpResponse(res.data);
    }
  );

}