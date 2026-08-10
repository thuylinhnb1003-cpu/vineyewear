import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getMyRoles } from "@/lib/admin.functions";
import { getMyAccount } from "@/lib/shop.functions";
import { formatDate, formatVnd } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/tai-khoan")({
  head: () => ({
    meta: [
      { title: "Tài khoản của tôi — Vin Eyewear" },
      { name: "description", content: "Quản lý đơn hàng, lịch hẹn đo mắt và sản phẩm yêu thích." },
      { property: "og:title", content: "Tài khoản — Vin Eyewear" },
      { property: "og:description", content: "Theo dõi đơn hàng và lịch hẹn tại Vin Eyewear." },
    ],
  }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["my-account"], queryFn: () => getMyAccount() });
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: () => getMyRoles() });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="container-vin section-vin">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h1 className="min-w-0 truncate">
          Xin chào{data?.profile?.full_name ? `, ${data.profile.full_name}` : ""}
        </h1>
        <div className="flex gap-2">
          {roles.data?.isStaff && (
            <Button asChild variant="outline" size="sm">
              <Link to="/quan-tri">Bảng quản trị</Link>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={signOut}>
            Đăng xuất
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border p-5">
            <h2 className="text-lg">Đơn hàng của tôi</h2>
            {(data?.orders ?? []).length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {data?.orders.map((order) => (
                  <li key={order.id} className="rounded-md bg-secondary p-3">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-semibold text-primary">{order.code}</span>
                      <span>{formatVnd(Number(order.total))}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.created_at)} · {order.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-border p-5">
            <h2 className="text-lg">Lịch hẹn</h2>
            {(data?.appointments ?? []).length === 0 ? (
              <>
                <p className="mt-2 text-sm text-muted-foreground">Bạn chưa có lịch hẹn nào.</p>
                <Button asChild size="sm" className="mt-3">
                  <Link to="/dat-lich">Đặt lịch đo mắt</Link>
                </Button>
              </>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {data?.appointments.map((appointment) => (
                  <li key={appointment.id} className="rounded-md bg-secondary p-3">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-semibold text-primary">{appointment.code}</span>
                      <span>{appointment.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(appointment.appointment_date)} · {appointment.time_slot} ·{" "}
                      {appointment.service_type}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
