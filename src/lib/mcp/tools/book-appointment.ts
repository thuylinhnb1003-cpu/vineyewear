import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

function makeCode(prefix: string) {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}${stamp}-${rand}`;
}

export default defineTool({
  name: "book_appointment",
  title: "Book an eye-exam appointment",
  description:
    "Book an eye-exam or consultation appointment at a Vin Eyewear store for the signed-in customer. Use list_stores first to get a store id.",
  inputSchema: {
    store_id: z.string().describe("Store UUID from list_stores."),
    full_name: z.string().describe("Customer full name."),
    phone: z.string().describe("Contact phone number."),
    service_type: z.string().describe("Service, e.g. do-khuc-xa, tu-van-gong, bao-hanh."),
    appointment_date: z.string().describe("Date in YYYY-MM-DD."),
    time_slot: z.string().describe("Time slot, e.g. 09:00."),
    note: z.string().describe("Optional note for the store.").optional(),
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.appointment_date)) {
      throw new ToolError("appointment_date must use the YYYY-MM-DD format.");
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        code: makeCode("LH"),
        user_id: ctx.getUserId() ?? null,
        store_id: input.store_id,
        full_name: input.full_name,
        phone: input.phone,
        service_type: input.service_type,
        appointment_date: input.appointment_date,
        time_slot: input.time_slot,
        note: input.note ?? null,
      })
      .select("code,appointment_date,time_slot,status")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [
        {
          type: "text",
          text: `Đã đặt lịch ${data.code} vào ${data.appointment_date} ${data.time_slot}.`,
        },
      ],
      structuredContent: { appointment: data },
    };
  },
});
