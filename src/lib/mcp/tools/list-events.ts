import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_events",
  title: "List events and news",
  description: "List published Vin Eyewear events, promotions and news posts, newest first.",
  inputSchema: {
    category: z.string().describe("Optional category filter, e.g. SỰ KIỆN, TIN ƯU ĐÃI.").optional(),
    limit: z.number().int().describe("Max results, default 10, max 50.").optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit }) => {
    const take = Math.min(Math.max(limit ?? 10, 1), 50);
    let q = supabaseAnon()
      .from("events")
      .select("slug,title,excerpt,category,location,starts_at,ends_at")
      .eq("is_visible", true)
      .order("starts_at", { ascending: false })
      .limit(take);
    if (category?.trim()) q = q.ilike("category", `%${category.trim()}%`);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { events: data ?? [] },
    };
  },
});
