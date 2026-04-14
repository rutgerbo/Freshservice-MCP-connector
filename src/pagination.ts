import { getClient } from "./freshserviceClient.js";

export async function fetchAllPages(
  endpoint: string,
  params: Record<string, unknown> = {},
  sessionId: string
) {
  let page = 1;
  const per_page = 100;
  const results: any[] = [];

  while (true) {
    const response = await getClient(sessionId).get(endpoint, {
      params: {
        ...params,
        page,
        per_page,
      },
    });

    // Find the array in the response — Freshservice wraps arrays in a
    // resource-named key e.g. { "tickets": [...] }
    const keys = Object.keys(response.data);
    const dataKey = keys.find((k) => Array.isArray(response.data[k])) ?? keys[0];
    const batch = response.data[dataKey];

    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }

    results.push(...batch);

    // Prefer the Link header (authoritative); fall back to batch-size check
    const link = response.headers["link"] as string | undefined;
    const hasMore = link ? link.includes('rel="next"') : batch.length >= per_page;

    if (!hasMore) {
      break;
    }

    page += 1;
  }

  return results;
}
