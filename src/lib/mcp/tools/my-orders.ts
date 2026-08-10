import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_orders",
  title: "My orders",
  description:
    "List the signed-in customer's own Vin Eyewear orders with items, totals and fulfilment status.",
  inputSchema: { limit: z.number().int().describe("Max orders, default 10, max 50.").optional() },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const take = Math.min(Math.max(limit ?? 10, 1), 50);
    const { data, error } = await supabaseForUser(ctx)
      .from("orders")
      .select(
        "code,status,total,subtotal,shipping_fee,payment_method,delivery_method,created_at,order_items(product_name,quantity,unit_price,line_total)",
      )
      .order("created_at", { ascending: false })
      .limit(take);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { orders: data ?? [] },
    };
  },
});
