import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BarChart3,
  CalendarClock,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/vin-field";
import { formatDate, formatVnd } from "@/lib/format";
import {
  AdminProductForm,
  PRODUCT_STATUS,
  emptyProduct,
  toProductForm,
  type ProductFormValues,
  type ProductRow,
} from "@/components/admin-product-form";
import {
  AdminEventForm,
  emptyEvent,
  toEventForm,
  type EventFormValues,
  type EventRow,
} from "@/components/admin-event-form";
import {
  deleteEvent,
  deleteProduct,
  getAdminDashboard,
  getMyRoles,
  saveEvent,
  saveProduct,
  updateAppointmentStatus,
  updateContactStatus,
  updateOrderStatus,
  updateStock,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/quan-tri")({
  head: () => ({
    meta: [
      { title: "Bảng quản trị — Vin Eyewear" },
      {
        name: "description",
        content: "Dashboard quản lý sản phẩm, tồn kho, sự kiện và đơn hàng của Vin Eyewear.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Bảng quản trị — Vin Eyewear" },
      { property: "og:description", content: "Quản lý catalog, tồn kho, sự kiện và đơn hàng." },
    ],
  }),
  component: AdminDashboard,
});

const TABS = [
  { key: "overview", label: "Tổng quan", icon: BarChart3 },
  { key: "products", label: "Sản phẩm", icon: Package },
  { key: "stock", label: "Tồn kho", icon: Warehouse },
  { key: "events", label: "Sự kiện", icon: CalendarClock },
  { key: "orders", label: "Đơn hàng", icon: ShoppingCart },
  { key: "appointments", label: "Lịch hẹn", icon: CalendarClock },
  { key: "contacts", label: "Liên hệ", icon: MessageSquare },
] as const;

const ORDER_STATUS = [
  { value: "new", label: "Mới" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã huỷ" },
] as const;

const APPOINTMENT_STATUS = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "done", label: "Đã đến" },
  { value: "cancelled", label: "Đã huỷ" },
] as const;

const CONTACT_STATUS = [
  { value: "new", label: "Mới" },
  { value: "handling", label: "Đang xử lý" },
  { value: "done", label: "Đã xử lý" },
] as const;

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-secondary-foreground">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function AdminDashboard() {
  const queryClient = useQueryClient();
  const [tab, setTab] = React.useState<(typeof TABS)[number]["key"]>("overview");
  const [productForm, setProductForm] = React.useState<ProductFormValues | null>(null);
  const [eventForm, setEventForm] = React.useState<EventFormValues | null>(null);
  const [search, setSearch] = React.useState("");

  const roles = useQuery({ queryKey: ["my-roles"], queryFn: () => getMyRoles() });
  const isStaff = roles.data?.isStaff ?? false;
  const canEditCatalog = roles.data?.canEditCatalog ?? false;

  const dashboard = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => getAdminDashboard(),
    enabled: isStaff,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });

  function useAction<TInput>(fn: (input: { data: TInput }) => Promise<{ ok: boolean; error?: string }>, successMessage: string) {
    return useMutation({
      mutationFn: (data: TInput) => fn({ data }),
      onSuccess: (result) => {
        if (!result.ok) {
          toast.error(result.error ?? "Không thực hiện được.");
          return;
        }
        toast.success(successMessage);
        invalidate();
      },
      onError: (e: Error) => toast.error(e.message),
    });
  }

  const saveProductM = useAction(saveProduct, "Đã lưu sản phẩm.");
  const deleteProductM = useAction(deleteProduct, "Đã xoá sản phẩm.");
  const updateStockM = useAction(updateStock, "Đã cập nhật tồn kho.");
  const saveEventM = useAction(saveEvent, "Đã lưu sự kiện.");
  const deleteEventM = useAction(deleteEvent, "Đã xoá sự kiện.");
  const orderStatusM = useAction(updateOrderStatus, "Đã cập nhật đơn hàng.");
  const apptStatusM = useAction(updateAppointmentStatus, "Đã cập nhật lịch hẹn.");
  const contactStatusM = useAction(updateContactStatus, "Đã cập nhật yêu cầu liên hệ.");

  if (roles.isLoading) {
    return (
      <div className="container-vin section-vin">
        <p className="text-sm text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="container-vin section-vin">
        <h1>Không có quyền truy cập</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tài khoản của bạn chưa được cấp quyền quản trị. Vui lòng liên hệ quản lý cửa hàng.
        </p>
      </div>
    );
  }

  const data = dashboard.data;
  const products = (data?.products ?? []) as unknown as ProductRow[];
  const events = (data?.events ?? []) as unknown as EventRow[];
  const orders = data?.orders ?? [];
  const appointments = data?.appointments ?? [];
  const contacts = data?.contacts ?? [];
  const stores = data?.stores ?? [];

  const kw = search.trim().toLowerCase();
  const filteredProducts = kw
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.sku.toLowerCase().includes(kw) ||
          (p.brand ?? "").toLowerCase().includes(kw),
      )
    : products;

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const lowStock = products.filter((p) => p.stock_quantity <= 3);

  return (
    <div className="container-vin section-vin">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1>Bảng quản trị</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý sản phẩm, tồn kho, sự kiện và đơn hàng trong một nơi duy nhất.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => invalidate()}>
          Làm mới dữ liệu
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {dashboard.isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      ) : dashboard.isError ? (
        <p className="mt-6 text-sm text-destructive">
          Không tải được dữ liệu: {(dashboard.error as Error).message}
        </p>
      ) : (
        <div className="mt-6">
          {tab === "overview" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card label="Sản phẩm" value={String(products.length)} hint={`${products.filter((p) => p.is_visible).length} đang hiển thị`} />
              <Card label="Đơn hàng" value={String(orders.length)} hint={`${orders.filter((o) => o.status === "new").length} đơn mới`} />
              <Card label="Doanh thu (đơn hợp lệ)" value={formatVnd(revenue)} />
              <Card label="Lịch hẹn" value={String(appointments.length)} hint={`${appointments.filter((a) => a.status === "pending").length} chờ xác nhận`} />
              <Card label="Sự kiện" value={String(events.length)} />
              <Card label="Liên hệ mới" value={String(contacts.filter((c) => c.status === "new").length)} />
              <Card label="Sắp hết hàng (≤3)" value={String(lowStock.length)} />
              <Card label="Tổng tồn kho" value={String(products.reduce((s, p) => s + p.stock_quantity, 0))} />
            </div>
          )}

          {tab === "products" && (
            <div className="grid gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  className="max-w-xs"
                  placeholder="Tìm theo tên, SKU, thương hiệu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Tìm sản phẩm"
                />
                {canEditCatalog && (
                  <Button size="sm" onClick={() => setProductForm(emptyProduct())}>
                    <Plus className="h-4 w-4" /> Thêm sản phẩm
                  </Button>
                )}
              </div>

              {productForm && (
                <AdminProductForm
                  value={productForm}
                  categories={data?.categories ?? []}
                  saving={saveProductM.isPending}
                  onCancel={() => setProductForm(null)}
                  onSubmit={(values) =>
                    saveProductM.mutate(values, { onSuccess: () => setProductForm(null) })
                  }
                />
              )}

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Giá</th>
                      <th className="p-3">Tồn</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="p-3">
                          <span className="font-semibold text-secondary-foreground">{p.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {p.brand ?? "—"} · {p.is_visible ? "Hiển thị" : "Ẩn"}
                            {p.is_featured ? " · Nổi bật" : ""}
                          </span>
                        </td>
                        <td className="p-3 text-xs">{p.sku}</td>
                        <td className="p-3">{formatVnd(Number(p.price))}</td>
                        <td className="p-3">{p.stock_quantity}</td>
                        <td className="p-3 text-xs">
                          {PRODUCT_STATUS.find((s) => s.value === p.status)?.label ?? p.status}
                        </td>
                        <td className="p-3">
                          {canEditCatalog && (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setProductForm(toProductForm(p))}
                                aria-label={`Sửa ${p.name}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Xoá sản phẩm "${p.name}"?`))
                                    deleteProductM.mutate({ id: p.id });
                                }}
                                aria-label={`Xoá ${p.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          Không có sản phẩm nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "stock" && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="p-3">Sản phẩm</th>
                    <th className="p-3">Tồn kho</th>
                    <th className="p-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <StockRow
                      key={p.id}
                      product={p}
                      disabled={!canEditCatalog || updateStockM.isPending}
                      onSave={(stockQuantity, status) =>
                        updateStockM.mutate({ id: p.id, stockQuantity, status })
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "events" && (
            <div className="grid gap-5">
              {canEditCatalog && (
                <div>
                  <Button size="sm" onClick={() => setEventForm(emptyEvent())}>
                    <Plus className="h-4 w-4" /> Thêm sự kiện
                  </Button>
                </div>
              )}
              {eventForm && (
                <AdminEventForm
                  value={eventForm}
                  saving={saveEventM.isPending}
                  onCancel={() => setEventForm(null)}
                  onSubmit={(values) =>
                    saveEventM.mutate(values, { onSuccess: () => setEventForm(null) })
                  }
                />
              )}
              <div className="grid gap-3">
                {events.map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-secondary-foreground">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.starts_at ? formatDate(e.starts_at) : "Chưa có ngày"} ·{" "}
                        {e.location ?? "—"} · {e.is_visible ? "Hiển thị" : "Ẩn"}
                      </p>
                    </div>
                    {canEditCatalog && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEventForm(toEventForm(e))}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Xoá sự kiện "${e.title}"?`)) deleteEventM.mutate({ id: e.id });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-sm text-muted-foreground">Chưa có sự kiện nào.</p>
                )}
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="grid gap-3">
              {orders.map((o) => (
                <div key={o.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-primary">{o.code}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.customer_name} · {o.customer_phone} · {formatDate(o.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{formatVnd(Number(o.total))}</span>
                      <Select
                        className="w-40"
                        aria-label={`Trạng thái đơn ${o.code}`}
                        value={o.status}
                        onChange={(e) =>
                          orderStatusM.mutate({
                            id: o.id,
                            status: e.target.value as (typeof ORDER_STATUS)[number]["value"],
                          })
                        }
                      >
                        {ORDER_STATUS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <ul className="mt-3 grid gap-1 text-xs text-muted-foreground">
                    {(o.order_items ?? []).map((it, idx) => (
                      <li key={idx}>
                        {it.product_name} × {it.quantity} — {formatVnd(Number(it.unit_price))}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {o.delivery_method === "shipping" ? "Giao hàng" : "Nhận tại cửa hàng"} ·{" "}
                    {o.payment_method === "cod" ? "COD" : "Chuyển khoản"}
                  </p>
                </div>
              ))}
              {orders.length === 0 && <p className="text-sm text-muted-foreground">Chưa có đơn hàng.</p>}
            </div>
          )}

          {tab === "appointments" && (
            <div className="grid gap-3">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-primary">{a.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.full_name} · {a.phone} · {formatDate(a.appointment_date)} {a.time_slot}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.service_type} ·{" "}
                      {stores.find((s) => s.id === a.store_id)?.name ?? "Cơ sở không rõ"}
                    </p>
                  </div>
                  <Select
                    className="w-44"
                    aria-label={`Trạng thái lịch hẹn ${a.code}`}
                    value={a.status}
                    onChange={(e) =>
                      apptStatusM.mutate({
                        id: a.id,
                        status: e.target.value as (typeof APPOINTMENT_STATUS)[number]["value"],
                      })
                    }
                  >
                    {APPOINTMENT_STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-sm text-muted-foreground">Chưa có lịch hẹn.</p>
              )}
            </div>
          )}

          {tab === "contacts" && (
            <div className="grid gap-3">
              {contacts.map((c) => (
                <div key={c.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-secondary-foreground">{c.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.phone} · {c.email ?? "—"} · {formatDate(c.created_at)}
                      </p>
                    </div>
                    <Select
                      className="w-40"
                      aria-label={`Trạng thái liên hệ ${c.full_name}`}
                      value={c.status}
                      onChange={(e) =>
                        contactStatusM.mutate({
                          id: c.id,
                          status: e.target.value as (typeof CONTACT_STATUS)[number]["value"],
                        })
                      }
                    >
                      {CONTACT_STATUS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <p className="mt-2 text-sm">{c.message}</p>
                </div>
              ))}
              {contacts.length === 0 && (
                <p className="text-sm text-muted-foreground">Chưa có yêu cầu liên hệ.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StockRow({
  product,
  disabled,
  onSave,
}: {
  product: ProductRow;
  disabled: boolean;
  onSave: (stock: number, status: ProductFormValues["status"]) => void;
}) {
  const [stock, setStock] = React.useState(product.stock_quantity);
  const [status, setStatus] = React.useState<ProductFormValues["status"]>(
    (product.status as ProductFormValues["status"]) ?? "in_stock",
  );
  const dirty = stock !== product.stock_quantity || status !== product.status;

  return (
    <tr className="border-t border-border">
      <td className="p-3">
        <span className="font-semibold text-secondary-foreground">{product.name}</span>
        <span className="block text-xs text-muted-foreground">{product.sku}</span>
      </td>
      <td className="p-3">
        <Input
          type="number"
          min={0}
          className="w-24"
          value={stock}
          disabled={disabled}
          aria-label={`Tồn kho ${product.name}`}
          onChange={(e) => setStock(Number(e.target.value))}
        />
      </td>
      <td className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            className="w-36"
            value={status}
            disabled={disabled}
            aria-label={`Trạng thái ${product.name}`}
            onChange={(e) => setStatus(e.target.value as ProductFormValues["status"])}
          >
            {PRODUCT_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
          <Button size="sm" disabled={disabled || !dirty} onClick={() => onSave(stock, status)}>
            Lưu
          </Button>
        </div>
      </td>
    </tr>
  );
}
