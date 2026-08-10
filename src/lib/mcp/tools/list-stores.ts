import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_stores",
  title: "List stores",
  description: "List active Vin Eyewear stores with address, phone and opening hours.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const { data, error } = await supabaseAnon()
      .from("stores")
      .select("id,code,name,address,phone,open_hours,map_url")
      .eq("is_active", true);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { stores: data ?? [] },
    };
  },
});
