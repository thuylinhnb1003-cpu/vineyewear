import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/format";
import { PRODUCT_STATUS, type ProductRow } from "@/components/admin-product-form";

export function getProductColumns({
  canEdit,
  onEdit,
  onDelete,
}: {
  canEdit: boolean;
  onEdit: (p: ProductRow) => void;
  onDelete: (p: ProductRow) => void;
}): ColumnDef<ProductRow, unknown>[] {
  const columns: ColumnDef<ProductRow, unknown>[] = [
    {
      accessorKey: "name",
      header: "Sản phẩm",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-secondary-foreground">{row.original.name}</span>
          <span className="block text-xs text-muted-foreground">
            {row.original.brand ?? "—"} · {row.original.is_visible ? "Hiển thị" : "Ẩn"}
            {row.original.is_featured ? " · Nổi bật" : ""}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ getValue }) => <span className="text-xs">{getValue<string>()}</span>,
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ getValue }) => formatVnd(Number(getValue())),
    },
    { accessorKey: "stock_quantity", header: "Tồn" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <span className="text-xs">
            {PRODUCT_STATUS.find((s) => s.value === value)?.label ?? value}
          </span>
        );
      },
    },
  ];

  if (canEdit) {
    columns.push({
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original)}
            aria-label={`Sửa ${row.original.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row.original)}
            aria-label={`Xoá ${row.original.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    });
  }

  return columns;
}
