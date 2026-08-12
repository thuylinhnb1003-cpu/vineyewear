import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/format";
import { CONTACT_STATUS, type ContactRow } from "@/lib/admin-queries";
import { StatusSelect } from "@/components/admin/status-select";

type ContactStatus = (typeof CONTACT_STATUS)[number]["value"];

export function getContactColumns({
  disabled,
  onStatusChange,
}: {
  disabled: boolean;
  onStatusChange: (id: string, status: ContactStatus) => void;
}): ColumnDef<ContactRow, unknown>[] {
  return [
    {
      accessorKey: "full_name",
      header: "Khách hàng",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-secondary-foreground">{row.original.full_name}</span>
          <span className="block text-xs text-muted-foreground">
            {row.original.phone} · {row.original.email ?? "—"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Ngày gửi",
      cell: ({ getValue }) => formatDate(getValue<string>()),
    },
    {
      accessorKey: "message",
      header: "Nội dung",
      enableSorting: false,
      cell: ({ getValue }) => {
        const text = getValue<string>();
        return (
          <span className="block max-w-[280px] truncate" title={text}>
            {text}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      enableSorting: false,
      cell: ({ row }) => (
        <StatusSelect
          value={row.original.status as ContactStatus}
          options={CONTACT_STATUS}
          disabled={disabled}
          ariaLabel={`Trạng thái liên hệ ${row.original.full_name}`}
          onChange={(status) => onStatusChange(row.original.id, status)}
        />
      ),
    },
  ];
}
