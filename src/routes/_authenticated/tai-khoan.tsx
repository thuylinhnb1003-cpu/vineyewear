import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getMyRoles } from "@/lib/admin.functions";
import { getMyAccount } from "@/lib/shop.functions";
import { formatDate, formatVnd } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { ProfileUpdateDialog } from "@/components/account/profile-update-dialog";

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
  const { user } = useSession();
  const { data, isLoading } = useQuery({ queryKey: ["my-account"], queryFn: () => getMyAccount() });
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: () => getMyRoles() });
  const [editOpen, setEditOpen] = React.useState(false);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const profile = data?.profile ?? null;
  const prescription = data?.prescription ?? null;
  const hasPrescription =
    !!prescription &&
    [prescription.od_sph, prescription.od_cyl, prescription.os_sph, prescription.os_cyl].some(
      (v) => v !== null,
    );

  return (
    <div className="container-vin section-vin">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h1 className="min-w-0 truncate">Xin chào{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
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
          {/* 1. Thông tin cá nhân */}
          <section className="rounded-lg border border-border p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg">Thông tin cá nhân</h2>
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
                Cập nhật hồ sơ cá nhân
              </Button>
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Họ và tên</dt>
                <dd className="font-medium">{profile?.full_name || "Chưa cập nhật"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="min-w-0 truncate font-medium">{user?.email ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Số điện thoại</dt>
                <dd className="font-medium">{profile?.phone || "Chưa cập nhật"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Ngày sinh</dt>
                <dd className="font-medium">
                  {profile?.date_of_birth ? formatDate(profile.date_of_birth) : "Chưa cập nhật"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Địa chỉ</dt>
                <dd className="max-w-[65%] text-right font-medium">
                  {profile?.address || "Chưa cập nhật"}
                </dd>
              </div>
            </dl>
          </section>

          {/* 2. Hồ sơ khúc xạ */}
          <section className="rounded-lg border border-border p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg">Hồ sơ khúc xạ</h2>
              {hasPrescription && (
                <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
                  Cập nhật hồ sơ khúc xạ
                </Button>
              )}
            </div>
            {hasPrescription ? (
              <>
                <div className="mt-3 grid grid-cols-[2.5rem_repeat(2,1fr)] gap-2 text-sm">
                  <span />
                  <span className="text-center text-2xs font-semibold uppercase text-muted-foreground">
                    SPH
                  </span>
                  <span className="text-center text-2xs font-semibold uppercase text-muted-foreground">
                    CYL
                  </span>
                  <span className="text-2xs font-bold uppercase text-muted-foreground">OD</span>
                  <span className="text-center font-medium">
                    {prescription?.od_sph ?? "—"}
                  </span>
                  <span className="text-center font-medium">
                    {prescription?.od_cyl ?? "—"}
                  </span>
                  <span className="text-2xs font-bold uppercase text-muted-foreground">OS</span>
                  <span className="text-center font-medium">
                    {prescription?.os_sph ?? "—"}
                  </span>
                  <span className="text-center font-medium">
                    {prescription?.os_cyl ?? "—"}
                  </span>
                </div>
                <p className="mt-3 text-2xs text-muted-foreground">
                  Cập nhật lần cuối: {formatDate(prescription!.updated_at)}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">Bạn chưa có hồ sơ khúc xạ.</p>
                <p className="mt-1 text-2xs text-muted-foreground">
                  Thêm thông tin độ kính để thuận tiện khi mua kính online.
                </p>
                <Button size="sm" className="mt-3" onClick={() => setEditOpen(true)}>
                  Thêm hồ sơ khúc xạ
                </Button>
              </>
            )}
          </section>

          {/* 3. Đơn hàng của tôi */}
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

          {/* 4. Lịch hẹn của tôi */}
          <section className="rounded-lg border border-border p-5">
            <h2 className="text-lg">Lịch hẹn của tôi</h2>
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

          {/* 5. Lịch sử đo mắt */}
          <section className="rounded-lg border border-border p-5 lg:col-span-2">
            <h2 className="text-lg">Lịch sử đo mắt</h2>
            {(data?.examHistory ?? []).length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Bạn chưa có lịch sử đo mắt.</p>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {data?.examHistory.map((exam) => (
                  <li key={exam.id} className="rounded-md bg-secondary p-3 text-sm">
                    <p className="font-semibold">{formatDate(exam.appointment_date)}</p>
                    <p className="text-xs text-muted-foreground">
                      {(exam as { stores?: { name?: string } | null }).stores?.name ??
                        "Vin Eyewear"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 6. Các chức năng khác */}
          <section className="rounded-lg border border-border p-5 lg:col-span-2">
            <h2 className="text-lg">Các chức năng khác</h2>
            <div className="mt-3 flex flex-wrap items-start gap-3">
              <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
                Cập nhật hồ sơ cá nhân
              </Button>
              <Button size="sm" variant="outline" onClick={signOut}>
                Đăng xuất
              </Button>
            </div>
          </section>
        </div>
      )}

      <ProfileUpdateDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        email={user?.email}
        prescription={prescription}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["my-account"] })}
      />
    </div>
  );
}
