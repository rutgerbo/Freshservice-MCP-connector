import { z } from "zod";
import { client } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";

export function registerSyncTools(server: any) {

  server.tool(
    "list_tickets_updated_since",
    {
      updated_since: z.string()
    },
    async ({ updated_since }: any) => {

      const res = await client.get("/tickets", {
        params: { updated_since }
      });

      return mcpResponse(res.data);
    }
  );

}