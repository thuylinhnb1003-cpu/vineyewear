import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/admin/data-table";
import { getAppointmentColumns } from "@/components/admin/columns/appointments";
import { updateAppointmentStatus } from "@/lib/admin.functions";
import { useAdminAction, useAdminData } from "@/lib/use-admin-data";

export const Route = createFileRoute("/_authenticated/quan-tri/lich-hen")({
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { appointments, stores } = useAdminData();
  const apptStatusM = useAdminAction(updateAppointmentStatus, "Đã cập nhật lịch hẹn.");

  const columns = React.useMemo(
    () =>
      getAppointmentColumns({
        disabled: apptStatusM.isPending,
        stores,
        onStatusChange: (id, status) => apptStatusM.mutate({ id, status }),
      }),
    [apptStatusM, stores],
  );

  return (
    <div className="grid gap-5">
      <div>
        <h1>Lịch hẹn</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quản lý lịch hẹn đo mắt và tư vấn.</p>
      </div>
      <DataTable
        columns={columns}
        data={appointments}
        searchPlaceholder="Tìm theo mã, khách hàng..."
      />
    </div>
  );
}
