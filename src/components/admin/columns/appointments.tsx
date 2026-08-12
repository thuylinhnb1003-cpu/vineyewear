import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/format";
import { APPOINTMENT_STATUS, type AppointmentRow, type StoreRow } from "@/lib/admin-queries";
import { StatusSelect } from "@/components/admin/status-select";

type AppointmentStatus = (typeof APPOINTMENT_STATUS)[number]["value"];

export function getAppointmentColumns({
  disabled,
  stores,
  onStatusChange,
}: {
  disabled: boolean;
  stores: StoreRow[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}): ColumnDef<AppointmentRow, unknown>[] {
  return [
    {
      accessorKey: "code",
      header: "Mã lịch hẹn",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-primary">{row.original.code}</span>
          <span className="block text-xs text-muted-foreground">
            {formatDate(row.original.appointment_date)} {row.original.time_slot}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "full_name",
      header: "Khách hàng",
      cell: ({ row }) => (
        <div>
          <span>{row.original.full_name}</span>
          <span className="block text-xs text-muted-foreground">{row.original.phone}</span>
        </div>
      ),
    },
    { accessorKey: "service_type", header: "Dịch vụ" },
    {
      id: "store",
      header: "Cơ sở",
      enableSorting: false,
      cell: ({ row }) =>
        stores.find((s) => s.id === row.original.store_id)?.name ?? "Cơ sở không rõ",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      enableSorting: false,
      cell: ({ row }) => (
        <StatusSelect
          value={row.original.status as AppointmentStatus}
          options={APPOINTMENT_STATUS}
          disabled={disabled}
          ariaLabel={`Trạng thái lịch hẹn ${row.original.code}`}
          onChange={(status) => onStatusChange(row.original.id, status)}
        />
      ),
    },
  ];
}
