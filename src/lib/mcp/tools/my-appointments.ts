import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_appointments",
  title: "My eye-exam appointments",
  description: "List the signed-in customer's own eye-exam / consultation appointments.",
  inputSchema: { limit: z.number().int().describe("Max appointments, default 10, max 50.").optional() },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const take = Math.min(Math.max(limit ?? 10, 1), 50);
    const { data, error } = await supabaseForUser(ctx)
      .from("appointments")
      .select("code,full_name,phone,service_type,appointment_date,time_slot,status,note,stores(name,address)")
      .order("appointment_date", { ascending: false })
      .limit(take);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { appointments: data ?? [] },
    };
  },
});
