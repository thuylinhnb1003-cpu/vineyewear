import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminDashboardQuery, myRolesQuery } from "@/lib/admin-queries";

export const Route = createFileRoute("/_authenticated/quan-tri")({
  head: () => ({
    meta: [
      { title: "Bảng quản trị — Vin Eyewear" },
      {
        name: "description",
        content: "Dashboard quản lý sản phẩm, tồn kho, sự kiện và đơn hàng của Vin Eyewear.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async ({ context }) => {
    const roles = await context.queryClient.ensureQueryData(myRolesQuery);
    if (roles.isStaff) {
      await context.queryClient.ensureQueryData(adminDashboardQuery);
    }
    return { roles };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { roles } = Route.useLoaderData();

  if (!roles.isStaff) {
    return (
      <div className="container-vin section-vin">
        <h1>Không có quyền truy cập</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tài khoản của bạn chưa được cấp quyền quản trị. Vui lòng liên hệ quản lý cửa hàng.
        </p>
      </div>
    );
  }

  return (
    <AdminShell roles={roles.roles}>
      <Outlet />
    </AdminShell>
  );
}
