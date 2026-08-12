import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { getProductColumns } from "@/components/admin/columns/products";
import {
  AdminProductForm,
  emptyProduct,
  toProductForm,
  type ProductFormValues,
  type ProductRow,
} from "@/components/admin-product-form";
import { deleteProduct, saveProduct } from "@/lib/admin.functions";
import { useAdminAction, useAdminData } from "@/lib/use-admin-data";

export const Route = createFileRoute("/_authenticated/quan-tri/san-pham")({
  component: ProductsPage,
});

function ProductsPage() {
  const { products, categories, canEditCatalog } = useAdminData();
  const [productForm, setProductForm] = React.useState<ProductFormValues | null>(null);

  const saveProductM = useAdminAction(saveProduct, "Đã lưu sản phẩm.");
  const deleteProductM = useAdminAction(deleteProduct, "Đã xoá sản phẩm.");

  const columns = React.useMemo(
    () =>
      getProductColumns({
        canEdit: canEditCatalog,
        onEdit: (p) => setProductForm(toProductForm(p)),
        onDelete: (p) => {
          if (confirm(`Xoá sản phẩm "${p.name}"?`)) deleteProductM.mutate({ id: p.id });
        },
      }),
    [canEditCatalog, deleteProductM],
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1>Sản phẩm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý gọng kính, kính mát, tròng kính.
          </p>
        </div>
        {canEditCatalog && (
          <Button size="sm" onClick={() => setProductForm(emptyProduct())}>
            <Plus className="h-4 w-4" /> Thêm sản phẩm
          </Button>
        )}
      </div>

      {productForm && (
        <AdminProductForm
          value={productForm}
          categories={categories}
          saving={saveProductM.isPending}
          onCancel={() => setProductForm(null)}
          onSubmit={(values) =>
            saveProductM.mutate(values, { onSuccess: () => setProductForm(null) })
          }
        />
      )}

      <DataTable<ProductRow>
        columns={columns}
        data={products as unknown as ProductRow[]}
        searchPlaceholder="Tìm theo tên, SKU..."
      />
    </div>
  );
}
