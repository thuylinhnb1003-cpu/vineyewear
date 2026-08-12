import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "search_products",
  title: "Search eyewear products",
  description:
    "Search the Vin Eyewear catalog by keyword, brand, frame shape, material or gender. Returns visible products with price and stock status.",
  inputSchema: {
    query: z.string().describe("Keyword matched against product name (empty for all).").optional(),
    brand: z.string().describe("Brand name filter, e.g. Ray-Ban.").optional(),
    frame_shape: z.string().describe("Frame shape filter, e.g. Square, Round, Aviator.").optional(),
    material: z.string().describe("Frame material filter, e.g. Titanium, Acetate.").optional(),
    gender: z.string().describe("Target audience: male, female, unisex, kids.").optional(),
    limit: z.number().int().describe("Max results, default 10, max 50.").optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, brand, frame_shape, material, gender, limit }) => {
    const take = Math.min(Math.max(limit ?? 10, 1), 50);
    let q = supabaseAnon()
      .from("products")
      .select(
        "slug,name,brand,price,compare_at_price,status,frame_shape,material,gender,rating,review_count",
      )
      .eq("is_visible", true)
      .limit(take);

    if (query?.trim()) q = q.ilike("name", `%${query.trim()}%`);
    if (brand?.trim()) q = q.ilike("brand", `%${brand.trim()}%`);
    if (frame_shape?.trim()) q = q.ilike("frame_shape", `%${frame_shape.trim()}%`);
    if (material?.trim()) q = q.ilike("material", `%${material.trim()}%`);
    if (gender?.trim()) q = q.ilike("gender", `%${gender.trim()}%`);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { products: data ?? [] },
    };
  },
});
