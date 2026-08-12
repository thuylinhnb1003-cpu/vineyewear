import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/admin/data-table";
import { getStockColumns } from "@/components/admin/columns/stock";
import type { ProductRow } from "@/components/admin-product-form";
import { updateStock } from "@/lib/admin.functions";
import { useAdminAction, useAdminData } from "@/lib/use-admin-data";

export const Route = createFileRoute("/_authenticated/quan-tri/ton-kho")({
  component: StockPage,
});

function StockPage() {
  const { products, canEditCatalog } = useAdminData();
  const updateStockM = useAdminAction(updateStock, "Đã cập nhật tồn kho.");

  const columns = React.useMemo(
    () =>
      getStockColumns({
        canEdit: canEditCatalog,
        saving: updateStockM.isPending,
        onSave: (product, stockQuantity, status) =>
          updateStockM.mutate({ id: product.id, stockQuantity, status }),
      }),
    [canEditCatalog, updateStockM],
  );

  return (
    <div className="grid gap-5">
      <div>
        <h1>Tồn kho</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cập nhật số lượng và trạng thái tồn kho.
        </p>
      </div>
      <DataTable<ProductRow>
        columns={columns}
        data={products as unknown as ProductRow[]}
        searchPlaceholder="Tìm theo tên, SKU..."
      />
    </div>
  );
}
