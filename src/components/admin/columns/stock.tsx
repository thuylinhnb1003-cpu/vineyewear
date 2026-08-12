import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PRODUCT_STATUS,
  type ProductFormValues,
  type ProductRow,
} from "@/components/admin-product-form";
import { StatusSelect } from "@/components/admin/status-select";

function StockCell({
  product,
  disabled,
  onSave,
}: {
  product: ProductRow;
  disabled: boolean;
  onSave: (stock: number, status: ProductFormValues["status"]) => void;
}) {
  const [stock, setStock] = React.useState(product.stock_quantity);
  const [status, setStatus] = React.useState<ProductFormValues["status"]>(
    (product.status as ProductFormValues["status"]) ?? "in_stock",
  );
  const dirty = stock !== product.stock_quantity || status !== product.status;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="number"
        min={0}
        className="w-24"
        value={stock}
        disabled={disabled}
        aria-label={`Tồn kho ${product.name}`}
        onChange={(e) => setStock(Number(e.target.value))}
      />
      <StatusSelect
        className="w-36"
        value={status}
        disabled={disabled}
        ariaLabel={`Trạng thái ${product.name}`}
        options={PRODUCT_STATUS}
        onChange={setStatus}
      />
      <Button size="sm" disabled={disabled || !dirty} onClick={() => onSave(stock, status)}>
        Lưu
      </Button>
    </div>
  );
}

export function getStockColumns({
  canEdit,
  saving,
  onSave,
}: {
  canEdit: boolean;
  saving: boolean;
  onSave: (product: ProductRow, stock: number, status: ProductFormValues["status"]) => void;
}): ColumnDef<ProductRow, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Sản phẩm",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-secondary-foreground">{row.original.name}</span>
          <span className="block text-xs text-muted-foreground">{row.original.sku}</span>
        </div>
      ),
    },
    { accessorKey: "stock_quantity", header: "Tồn kho" },
    {
      id: "controls",
      header: "Cập nhật",
      enableSorting: false,
      cell: ({ row }) => (
        <StockCell
          product={row.original}
          disabled={!canEdit || saving}
          onSave={(stock, status) => onSave(row.original, stock, status)}
        />
      ),
    },
  ];
}
