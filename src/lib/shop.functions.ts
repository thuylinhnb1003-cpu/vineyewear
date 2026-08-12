import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PRODUCT_COLUMNS =
  "id, slug, sku, name, brand, frame_shape, material, color, gender, description, specs, images, price, compare_at_price, stock_quantity, status, is_featured, rating, review_count, category_id, ar_model_url, created_at";

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("./shop.server");
  const supabase = publicClient();
  const [products, categories] = await Promise.all([
    supabase.from("products").select(PRODUCT_COLUMNS).order("created_at", { ascending: false }),
    supabase.from("categories").select("id, slug, name, description").order("sort_order"),
  ]);
  if (products.error) throw new Error(products.error.message);
  if (categories.error) throw new Error(categories.error.message);
  return { products: products.data ?? [], categories: categories.data ?? [] };
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { publicClient } = await import("./shop.server");
    const supabase = publicClient();
    const { data: product, error } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) return { product: null, related: [], category: null };

    const [related, category] = await Promise.all([
      supabase
        .from("products")
        .select(PRODUCT_COLUMNS)
        .eq("category_id", product.category_id ?? "")
        .neq("id", product.id)
        .limit(4),
      product.category_id
        ? supabase
            .from("categories")
            .select("id, slug, name")
            .eq("id", product.category_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);
    return { product, related: related.data ?? [], category: category.data ?? null };
  });

export const getEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("./shop.server");
  const { data, error } = await publicClient()
    .from("events")
    .select(
      "id, slug, title, excerpt, content, cover_image, location, category, starts_at, ends_at",
    )
    .order("starts_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getEventBySlug = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { publicClient } = await import("./shop.server");
    const { data: event, error } = await publicClient()
      .from("events")
      .select("id, slug, title, excerpt, content, cover_image, location, starts_at, ends_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return event;
  });

export const getStores = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient } = await import("./shop.server");
  const { data, error } = await publicClient()
    .from("stores")
    .select("id, code, name, address, phone, open_hours, map_url")
    .order("code");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getBookedSlots = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ storeId: z.string().uuid(), date: z.string().min(8) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("appointments")
      .select("time_slot")
      .eq("store_id", data.storeId)
      .eq("appointment_date", data.date)
      .neq("status", "cancelled");
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => r.time_slot);
  });

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        storeId: z.string().uuid(),
        date: z.string().min(8),
        timeSlot: z.string().min(3),
        serviceType: z.string().min(2),
        fullName: z.string().min(2).max(120),
        phone: z.string().min(8).max(20),
        note: z.string().max(500).optional(),
        userId: z.string().uuid().nullish(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${data.date}T00:00:00`) < today) {
      return { ok: false as const, error: "Không thể đặt lịch trong quá khứ." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { makeCode } = await import("./shop.server");
    const code = makeCode("LH");
    const { error } = await supabaseAdmin.from("appointments").insert({
      code,
      user_id: data.userId ?? null,
      store_id: data.storeId,
      appointment_date: data.date,
      time_slot: data.timeSlot,
      service_type: data.serviceType,
      full_name: data.fullName,
      phone: data.phone,
      note: data.note ?? null,
    });
    if (error) {
      if (error.code === "23505" || error.code === "23P01" || error.code === "23505")
        return { ok: false as const, error: "Khung giờ này vừa được đặt, vui lòng chọn giờ khác." };
      if (error.code === "23505" || error.message.includes("duplicate"))
        return { ok: false as const, error: "Khung giờ này vừa được đặt, vui lòng chọn giờ khác." };
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const, code };
  });

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        customerName: z.string().min(2).max(120),
        customerPhone: z.string().min(8).max(20),
        customerEmail: z.string().email().optional().or(z.literal("")),
        deliveryMethod: z.enum(["pickup", "shipping"]),
        shippingAddress: z.string().max(300).optional(),
        paymentMethod: z.enum(["cod", "bank_transfer"]),
        note: z.string().max(500).optional(),
        userId: z.string().uuid().nullish(),
        items: z
          .array(
            z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(20) }),
          )
          .min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { makeCode } = await import("./shop.server");

    const ids = data.items.map((i) => i.productId);
    const { data: products, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, name, price, stock_quantity, status, is_visible")
      .in("id", ids);
    if (pErr) return { ok: false as const, error: pErr.message };

    const lines = data.items.map((item) => {
      const product = (products ?? []).find((p) => p.id === item.productId);
      if (!product || !product.is_visible) throw new Error("Sản phẩm không còn khả dụng.");
      if (product.status !== "in_stock" || product.stock_quantity < item.quantity) {
        throw new Error(`Sản phẩm "${product.name}" không đủ tồn kho.`);
      }
      const unit = Number(product.price);
      return {
        product_id: product.id,
        product_name: product.name,
        unit_price: unit,
        quantity: item.quantity,
        line_total: unit * item.quantity,
      };
    });

    const subtotal = lines.reduce((sum, l) => sum + l.line_total, 0);
    const shippingFee = data.deliveryMethod === "shipping" && subtotal < 1000000 ? 30000 : 0;
    const code = makeCode("DH");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        code,
        user_id: data.userId ?? null,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail || null,
        shipping_address:
          data.deliveryMethod === "shipping" ? (data.shippingAddress ?? null) : null,
        delivery_method: data.deliveryMethod,
        payment_method: data.paymentMethod,
        note: data.note ?? null,
        subtotal,
        shipping_fee: shippingFee,
        total: subtotal + shippingFee,
      })
      .select("id, code")
      .single();
    if (error || !order)
      return { ok: false as const, error: error?.message ?? "Không tạo được đơn." };

    const { error: iErr } = await supabaseAdmin
      .from("order_items")
      .insert(lines.map((l) => ({ ...l, order_id: order.id })));
    if (iErr) return { ok: false as const, error: iErr.message };

    return { ok: true as const, code: order.code, total: subtotal + shippingFee };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        fullName: z.string().min(2).max(120),
        phone: z.string().min(8).max(20),
        email: z.string().email().optional().or(z.literal("")),
        message: z.string().min(5).max(1000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_requests").insert({
      full_name: data.fullName,
      phone: data.phone,
      email: data.email || null,
      message: data.message,
    });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [profile, orders, appointments, favorites] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone").eq("id", userId).maybeSingle(),
      supabase
        .from("orders")
        .select(
          "id, code, status, total, payment_method, delivery_method, created_at, order_items(product_name, quantity, unit_price)",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("appointments")
        .select("id, code, appointment_date, time_slot, service_type, status, store_id")
        .eq("user_id", userId)
        .order("appointment_date", { ascending: false }),
      supabase
        .from("favorites")
        .select("product_id, products(slug, name, price, images, status)")
        .eq("user_id", userId),
    ]);
    return {
      profile: profile.data ?? null,
      orders: orders.data ?? [],
      appointments: appointments.data ?? [],
      favorites: favorites.data ?? [],
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({ fullName: z.string().min(2).max(120), phone: z.string().min(8).max(20) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ full_name: data.fullName, phone: data.phone })
      .eq("id", context.userId);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
