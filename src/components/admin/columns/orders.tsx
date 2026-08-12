import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatVnd } from "@/lib/format";
import { ORDER_STATUS, type OrderRow } from "@/lib/admin-queries";
import { StatusSelect } from "@/components/admin/status-select";

type OrderStatus = (typeof ORDER_STATUS)[number]["value"];

export function getOrderColumns({
  disabled,
  onStatusChange,
}: {
  disabled: boolean;
  onStatusChange: (id: string, status: OrderStatus) => void;
}): ColumnDef<OrderRow, unknown>[] {
  return [
    {
      accessorKey: "code",
      header: "Mã đơn",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-primary">{row.original.code}</span>
          <span className="block text-xs text-muted-foreground">
            {formatDate(row.original.created_at)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Khách hàng",
      cell: ({ row }) => (
        <div>
          <span>{row.original.customer_name}</span>
          <span className="block text-xs text-muted-foreground">{row.original.customer_phone}</span>
        </div>
      ),
    },
    {
      id: "items",
      header: "Sản phẩm",
      enableSorting: false,
      cell: ({ row }) => {
        const items = row.original.order_items ?? [];
        const text = items.map((it) => `${it.product_name} × ${it.quantity}`).join(", ");
        return (
          <span className="block max-w-[240px] truncate text-xs text-muted-foreground" title={text}>
            {text || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "total",
      header: "Tổng tiền",
      cell: ({ getValue }) => (
        <span className="font-semibold">{formatVnd(Number(getValue()))}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      enableSorting: false,
      cell: ({ row }) => (
        <StatusSelect
          value={row.original.status as OrderStatus}
          options={ORDER_STATUS}
          disabled={disabled}
          ariaLabel={`Trạng thái đơn ${row.original.code}`}
          onChange={(status) => onStatusChange(row.original.id, status)}
        />
      ),
    },
  ];
}
