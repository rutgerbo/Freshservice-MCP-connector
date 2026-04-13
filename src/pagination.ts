import { client } from "./freshserviceClient.js";

export async function fetchAllPages(
  endpoint: string,
  params: Record<string, unknown> = {}
) {
  let page = 1;
  const per_page = 100;

  const results: any[] = [];

  while (true) {
    const response = await client.get(endpoint, {
      params: {
        ...params,
        page,
        per_page
      }
    });

    const key = Object.keys(response.data)[0];
    const batch = response.data[key];

    if (!batch || batch.length === 0) break;

    results.push(...batch);

    if (batch.length < per_page) break;

    page++;
  }

  return results;
}