import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CategoryRow } from "@/components/admin-category-form";

export function getCategoryColumns({
  canEdit,
  onEdit,
  onDelete,
}: {
  canEdit: boolean;
  onEdit: (c: CategoryRow) => void;
  onDelete: (c: CategoryRow) => void;
}): ColumnDef<CategoryRow, unknown>[] {
  const columns: ColumnDef<CategoryRow, unknown>[] = [
    {
      accessorKey: "name",
      header: "Danh mục",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-secondary-foreground">{row.original.name}</span>
          <span className="block text-xs text-muted-foreground">{row.original.slug}</span>
        </div>
      ),
    },
    { accessorKey: "sort_order", header: "Thứ tự" },
    {
      accessorKey: "is_visible",
      header: "Trạng thái",
      cell: ({ getValue }) => (getValue<boolean>() ? "Hiển thị" : "Ẩn"),
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
