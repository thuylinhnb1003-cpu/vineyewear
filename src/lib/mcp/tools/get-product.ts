import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_product",
  title: "Get product detail",
  description: "Get full detail for one Vin Eyewear product by its slug.",
  inputSchema: { slug: z.string().describe("Product slug, e.g. gong-kinh-titan-nhe.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const { data, error } = await supabaseAnon()
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_visible", true)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: `No product with slug "${slug}".` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { product: data },
    };
  },
});
