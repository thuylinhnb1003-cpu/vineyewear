import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const productInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2).max(120),
  sku: z.string().min(1).max(60),
  name: z.string().min(2).max(200),
  categoryId: z.string().uuid().nullish(),
  brand: z.string().max(80).nullish(),
  frameShape: z.string().max(80).nullish(),
  material: z.string().max(80).nullish(),
  color: z.string().max(80).nullish(),
  gender: z.string().max(40).nullish(),
  description: z.string().max(4000).nullish(),
  imagesText: z.string().max(4000).optional(),
  spinImagesText: z.string().max(6000).optional(),
  arModelUrl: z.string().max(500).nullish(),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).nullish(),
  stockQuantity: z.number().int().min(0),
  status: z.enum(["in_stock", "low_stock", "out_of_stock", "preorder"]),
  isFeatured: z.boolean(),
  isVisible: z.boolean(),
});

const eventInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2).max(120),
  title: z.string().min(2).max(200),
  excerpt: z.string().max(500).nullish(),
  content: z.string().max(8000).nullish(),
  coverImage: z.string().max(500).nullish(),
  location: z.string().max(200).nullish(),
  startsAt: z.string().nullish(),
  endsAt: z.string().nullish(),
  isVisible: z.boolean(),
});

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role as string);
    return {
      roles,
      isStaff: roles.some((r) => r === "admin" || r === "manager" || r === "staff"),
      canEditCatalog: roles.some((r) => r === "admin" || r === "manager"),
    };
  });

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const s = context.supabase;
    const [products, categories, events, orders, appointments, contacts, stores] = await Promise.all([
      s
        .from("products")
        .select(
          "id, slug, sku, name, specs, ar_model_url, brand, frame_shape, material, color, gender, description, images, price, compare_at_price, stock_quantity, status, is_featured, is_visible, category_id, created_at",
        )
        .order("created_at", { ascending: false }),
      s.from("categories").select("id, slug, name").order("sort_order"),
      s
        .from("events")
        .select("id, slug, title, excerpt, content, cover_image, location, starts_at, ends_at, is_visible")
        .order("starts_at", { ascending: false }),
      s
        .from("orders")
        .select(
          "id, code, customer_name, customer_phone, total, status, payment_method, delivery_method, created_at, order_items(product_name, quantity, unit_price)",
        )
        .order("created_at", { ascending: false })
        .limit(200),
      s
        .from("appointments")
        .select(
          "id, code, full_name, phone, appointment_date, time_slot, service_type, status, store_id, note",
        )
        .order("appointment_date", { ascending: false })
        .limit(200),
      s
        .from("contact_requests")
        .select("id, full_name, phone, email, message, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
      s.from("stores").select("id, code, name"),
    ]);

    const err =
      products.error ?? events.error ?? orders.error ?? appointments.error ?? contacts.error;
    if (err) throw new Error(err.message);

    return {
      products: products.data ?? [],
      categories: categories.data ?? [],
      events: events.data ?? [],
      orders: orders.data ?? [],
      appointments: appointments.data ?? [],
      contacts: contacts.data ?? [],
      stores: stores.data ?? [],
    };
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => productInput.parse(input))
  .handler(async ({ data, context }) => {
    const images = (data.imagesText ?? "")
      .split(/[\n,]/)
      .map((v) => v.trim())
      .filter(Boolean);
    const spinImages = (data.spinImagesText ?? "")
      .split(/[\n,]/)
      .map((v) => v.trim())
      .filter(Boolean);
    const row = {
      slug: data.slug,
      sku: data.sku,
      name: data.name,
      category_id: data.categoryId ?? null,
      brand: data.brand ?? null,
      frame_shape: data.frameShape ?? null,
      material: data.material ?? null,
      color: data.color ?? null,
      gender: data.gender ?? null,
      description: data.description ?? null,
      images,
      specs: spinImages.length > 0 ? { spin_images: spinImages } : {},
      ar_model_url: data.arModelUrl || null,
      price: data.price,
      compare_at_price: data.compareAtPrice ?? null,
      stock_quantity: data.stockQuantity,
      status: data.status,
      is_featured: data.isFeatured,
      is_visible: data.isVisible,
    };
    const query = data.id
      ? context.supabase.from("products").update(row).eq("id", data.id)
      : context.supabase.from("products").insert(row);
    const { error } = await query;
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const updateStock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        stockQuantity: z.number().int().min(0),
        status: z.enum(["in_stock", "low_stock", "out_of_stock", "preorder"]).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("products")
      .update({
        stock_quantity: data.stockQuantity,
        ...(data.status ? { status: data.status } : {}),
      })
      .eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const saveEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => eventInput.parse(input))
  .handler(async ({ data, context }) => {
    const row = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt ?? null,
      content: data.content ?? null,
      cover_image: data.coverImage ?? null,
      location: data.location ?? null,
      starts_at: data.startsAt ? new Date(data.startsAt).toISOString() : null,
      ends_at: data.endsAt ? new Date(data.endsAt).toISOString() : null,
      is_visible: data.isVisible,
    };
    const query = data.id
      ? context.supabase.from("events").update(row).eq("id", data.id)
      : context.supabase.from("events").insert(row);
    const { error } = await query;
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const deleteEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("events").delete().eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "confirmed", "processing", "shipping", "completed", "cancelled"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "done", "cancelled"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const updateContactStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "handling", "done"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("contact_requests")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
