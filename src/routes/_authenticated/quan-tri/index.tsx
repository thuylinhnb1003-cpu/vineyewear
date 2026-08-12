import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format, subDays, startOfDay } from "date-fns";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatVnd } from "@/lib/format";
import { ORDER_STATUS, APPOINTMENT_STATUS } from "@/lib/admin-queries";
import { useAdminData } from "@/lib/use-admin-data";

export const Route = createFileRoute("/_authenticated/quan-tri/")({
  component: OverviewPage,
});

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-secondary-foreground">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

const REVENUE_CONFIG: ChartConfig = {
  revenue: { label: "Doanh thu", color: "var(--primary)" },
};

const ORDER_STATUS_COLORS = ["#801A20", "#c97a80", "#1a1214", "#5c4f52", "#27ae60", "#c0392b"];

function OverviewPage() {
  const { products, orders, appointments, events, contacts } = useAdminData();

  const revenue = React.useMemo(
    () =>
      orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + Number(o.total), 0),
    [orders],
  );
  const lowStock = React.useMemo(() => products.filter((p) => p.stock_quantity <= 3), [products]);

  const revenueByDay = React.useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => startOfDay(subDays(new Date(), 13 - i)));
    const totals = new Map(days.map((d) => [format(d, "yyyy-MM-dd"), 0]));
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      const key = format(startOfDay(new Date(o.created_at)), "yyyy-MM-dd");
      if (totals.has(key)) totals.set(key, (totals.get(key) ?? 0) + Number(o.total));
    }
    return days.map((d) => {
      const key = format(d, "yyyy-MM-dd");
      return { date: format(d, "dd/MM"), revenue: totals.get(key) ?? 0 };
    });
  }, [orders]);

  const orderStatusData = React.useMemo(
    () =>
      ORDER_STATUS.map((s) => ({
        status: s.label,
        count: orders.filter((o) => o.status === s.value).length,
      })).filter((d) => d.count > 0),
    [orders],
  );

  const appointmentStatusData = React.useMemo(
    () =>
      APPOINTMENT_STATUS.map((s) => ({
        status: s.label,
        count: appointments.filter((a) => a.status === s.value).length,
      })).filter((d) => d.count > 0),
    [appointments],
  );

  return (
    <div className="grid gap-6">
      <div>
        <h1>Tổng quan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý sản phẩm, tồn kho, sự kiện và đơn hàng trong một nơi duy nhất.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Sản phẩm"
          value={String(products.length)}
          hint={`${products.filter((p) => p.is_visible).length} đang hiển thị`}
        />
        <Kpi
          label="Đơn hàng"
          value={String(orders.length)}
          hint={`${orders.filter((o) => o.status === "new").length} đơn mới`}
        />
        <Kpi label="Doanh thu (đơn hợp lệ)" value={formatVnd(revenue)} />
        <Kpi
          label="Lịch hẹn"
          value={String(appointments.length)}
          hint={`${appointments.filter((a) => a.status === "pending").length} chờ xác nhận`}
        />
        <Kpi label="Sự kiện" value={String(events.length)} />
        <Kpi
          label="Liên hệ mới"
          value={String(contacts.filter((c) => c.status === "new").length)}
        />
        <Kpi label="Sắp hết hàng (≤3)" value={String(lowStock.length)} />
        <Kpi
          label="Tổng tồn kho"
          value={String(products.reduce((s, p) => s + p.stock_quantity, 0))}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Doanh thu 14 ngày gần nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={REVENUE_CONFIG} className="aspect-auto h-64 w-full">
              <BarChart data={revenueByDay}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatVnd(v)}
                  width={90}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(v) => formatVnd(Number(v))} />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {orderStatusData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có đơn hàng.</p>
            ) : (
              <ChartContainer config={{}} className="aspect-square h-64 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                  <Pie data={orderStatusData} dataKey="count" nameKey="status" innerRadius={50}>
                    {orderStatusData.map((_, i) => (
                      <Cell key={i} fill={ORDER_STATUS_COLORS[i % ORDER_STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trạng thái lịch hẹn</CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentStatusData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có lịch hẹn.</p>
            ) : (
              <ChartContainer config={{}} className="aspect-square h-64 w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                  <Pie
                    data={appointmentStatusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={50}
                  >
                    {appointmentStatusData.map((_, i) => (
                      <Cell key={i} fill={ORDER_STATUS_COLORS[i % ORDER_STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cảnh báo sắp hết hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">Không có sản phẩm sắp hết hàng.</p>
            ) : (
              <ul className="grid gap-2 text-sm">
                {lowStock.slice(0, 8).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">{p.name}</span>
                    <span className="shrink-0 font-semibold text-destructive">
                      {p.stock_quantity} còn lại
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/quan-tri/ton-kho"
              className="mt-3 inline-block text-xs font-semibold text-primary link-underline"
            >
              Xem tồn kho →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
