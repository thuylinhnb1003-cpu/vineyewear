import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { EventRow } from "@/components/admin-event-form";

export function getEventColumns({
  canEdit,
  onEdit,
  onDelete,
}: {
  canEdit: boolean;
  onEdit: (e: EventRow) => void;
  onDelete: (e: EventRow) => void;
}): ColumnDef<EventRow, unknown>[] {
  const columns: ColumnDef<EventRow, unknown>[] = [
    {
      accessorKey: "title",
      header: "Sự kiện",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-secondary-foreground">{row.original.title}</span>
          <span className="block text-xs text-muted-foreground">
            {row.original.location ?? "—"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "starts_at",
      header: "Thời gian",
      cell: ({ getValue }) => {
        const value = getValue<string | null>();
        return value ? formatDate(value) : "Chưa có ngày";
      },
    },
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
