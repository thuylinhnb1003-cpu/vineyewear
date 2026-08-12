import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoreRow } from "@/lib/admin-queries";

export function getStoreColumns({
  canEdit,
  onEdit,
  onDelete,
}: {
  canEdit: boolean;
  onEdit: (s: StoreRow) => void;
  onDelete: (s: StoreRow) => void;
}): ColumnDef<StoreRow, unknown>[] {
  const columns: ColumnDef<StoreRow, unknown>[] = [
    {
      accessorKey: "name",
      header: "Cơ sở",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-secondary-foreground">{row.original.name}</span>
          <span className="block text-xs text-muted-foreground">{row.original.code}</span>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ getValue }) => (
        <span className="block max-w-[280px] truncate" title={getValue<string>()}>
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Điện thoại",
      cell: ({ getValue }) => getValue<string | null>() ?? "—",
    },
    {
      accessorKey: "is_active",
      header: "Trạng thái",
      cell: ({ getValue }) => (getValue<boolean>() ? "Đang hoạt động" : "Ngừng hoạt động"),
    },
  ];

  if (canEdit) {
    columns.push({
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    });
  }

  return columns;
}
