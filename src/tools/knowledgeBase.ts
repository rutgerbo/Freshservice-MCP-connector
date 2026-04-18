import { z } from "zod";
import { getClient, getWorkspaceId } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerKnowledgeBaseTools(server: any) {

  server.tool(
    "list_solution_categories",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).get("/solution_categories", {
          params: { page, per_page, workspace_id }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_solution_category",
    {
      category_id: z.number()
    },
    async ({ category_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).get(`/solution_categories/${category_id}`, {
          params: { workspace_id }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_solution_folders",
    {
      category_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ category_id, page, per_page }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).get(`/solution_categories/${category_id}/folders`, {
          params: { page, per_page, workspace_id }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_solution_folder",
    {
      folder_id: z.number()
    },
    async ({ folder_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).get(`/solution_folders/${folder_id}`, {
          params: { workspace_id }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_solution_articles",
    {
      folder_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ folder_id, page, per_page }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).get(
          `/solution_folders/${folder_id}/articles`,
          { params: { page, per_page, workspace_id } }
        );
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_solution_article",
    {
      article_id: z.number()
    },
    async ({ article_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).get(`/solution_articles/${article_id}`, {
          params: { workspace_id }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_solution_article",
    {
      title: z.string(),
      description: z.string(),
      folder_id: z.number(),
      author_id: z.number().optional(),
      status: z.number().optional(),
      tags: z.array(z.string()).optional(),
      keywords: z.array(z.string()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).post("/solution_articles", {
          ...params,
          workspace_id
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_solution_article",
    {
      article_id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      tags: z.array(z.string()).optional(),
      keywords: z.array(z.string()).optional()
    },
    async ({ article_id, ...updates }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).put(`/solution_articles/${article_id}`, {
          ...updates,
          workspace_id
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_solution_article",
    {
      article_id: z.number()
    },
    async ({ article_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        await getClient(ctx.sessionId).delete(`/solution_articles/${article_id}`, {
          params: { workspace_id }
        });
        return mcpResponse({ success: true, message: `Article ${article_id} deleted.` });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "search_solution_articles",
    {
      term: z.string(),
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ term, page, per_page }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).get("/solution_articles/search", {
          params: { term, page, per_page, workspace_id }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "publish_solution_article",
    { article_id: z.number() },
    async ({ article_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).put(
          `/solution_articles/${article_id}`,
          { status: 2, workspace_id }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_solution_category",
    { name: z.string(), description: z.string().optional() },
    async (params: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).post("/solution_categories", {
          ...params,
          workspace_id
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_solution_category",
    { category_id: z.number(), name: z.string().optional(), description: z.string().optional() },
    async ({ category_id, ...updates }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).put(
          `/solution_categories/${category_id}`,
          { ...updates, workspace_id }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_solution_category",
    { category_id: z.number() },
    async ({ category_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        await getClient(ctx.sessionId).delete(`/solution_categories/${category_id}`, {
          params: { workspace_id }
        });
        return mcpResponse({ success: true, message: `Category ${category_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_solution_folder",
    {
      name: z.string(),
      category_id: z.number(),
      visibility: z.number().optional(),
      description: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).post("/solution_folders", {
          ...params,
          workspace_id
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_solution_folder",
    {
      folder_id: z.number(),
      name: z.string().optional(),
      visibility: z.number().optional(),
      description: z.string().optional()
    },
    async ({ folder_id, ...updates }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).put(`/solution_folders/${folder_id}`, {
          ...updates,
          workspace_id
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_solution_folder",
    { folder_id: z.number() },
    async ({ folder_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        await getClient(ctx.sessionId).delete(`/solution_folders/${folder_id}`, {
          params: { workspace_id }
        });
        return mcpResponse({ success: true, message: `Folder ${folder_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_solution_sub_folders",
    { folder_id: z.number(), page: z.number().optional(), per_page: z.number().optional() },
    async ({ folder_id, page, per_page }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).get(
          `/solution_folders/${folder_id}/sub_folders`,
          { params: { page, per_page, workspace_id } }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "submit_solution_article_for_approval",
    { article_id: z.number() },
    async ({ article_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).put(
          `/solution_articles/${article_id}`,
          { status: 3, workspace_id }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "restore_solution_article",
    { article_id: z.number() },
    async ({ article_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        const res = await getClient(ctx.sessionId).put(
          `/solution_articles/${article_id}/restore`,
          { workspace_id }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "permanently_delete_solution_article",
    { article_id: z.number() },
    async ({ article_id }: any, ctx: any) => {
      try {
        const workspace_id = getWorkspaceId(ctx.sessionId);
        await getClient(ctx.sessionId).delete(
          `/solution_articles/${article_id}/permanently_delete`,
          { params: { workspace_id } }
        );
        return mcpResponse({ success: true, message: `Article ${article_id} permanently deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
