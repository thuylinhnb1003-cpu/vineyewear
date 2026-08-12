import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/admin/data-table";
import { getOrderColumns } from "@/components/admin/columns/orders";
import { updateOrderStatus } from "@/lib/admin.functions";
import { useAdminAction, useAdminData } from "@/lib/use-admin-data";

export const Route = createFileRoute("/_authenticated/quan-tri/don-hang")({
  component: OrdersPage,
});

function OrdersPage() {
  const { orders } = useAdminData();
  const orderStatusM = useAdminAction(updateOrderStatus, "Đã cập nhật đơn hàng.");

  const columns = React.useMemo(
    () =>
      getOrderColumns({
        disabled: orderStatusM.isPending,
        onStatusChange: (id, status) => orderStatusM.mutate({ id, status }),
      }),
    [orderStatusM],
  );

  return (
    <div className="grid gap-5">
      <div>
        <h1>Đơn hàng</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo dõi và cập nhật trạng thái đơn hàng.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={orders}
        searchPlaceholder="Tìm theo mã đơn, khách hàng..."
      />
    </div>
  );
}
