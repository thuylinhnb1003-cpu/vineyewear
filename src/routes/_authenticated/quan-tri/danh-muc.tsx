import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { getCategoryColumns } from "@/components/admin/columns/categories";
import {
  AdminCategoryForm,
  emptyCategory,
  toCategoryForm,
  type CategoryFormValues,
  type CategoryRow,
} from "@/components/admin-category-form";
import { deleteCategory, saveCategory } from "@/lib/admin.functions";
import { useAdminAction, useAdminData } from "@/lib/use-admin-data";

export const Route = createFileRoute("/_authenticated/quan-tri/danh-muc")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { categories, canEditCatalog } = useAdminData();
  const [categoryForm, setCategoryForm] = React.useState<CategoryFormValues | null>(null);

  const saveCategoryM = useAdminAction(saveCategory, "Đã lưu danh mục.");
  const deleteCategoryM = useAdminAction(deleteCategory, "Đã xoá danh mục.");

  const columns = React.useMemo(
    () =>
      getCategoryColumns({
        canEdit: canEditCatalog,
        onEdit: (c) => setCategoryForm(toCategoryForm(c)),
        onDelete: (c) => {
          if (confirm(`Xoá danh mục "${c.name}"?`)) deleteCategoryM.mutate({ id: c.id });
        },
      }),
    [canEditCatalog, deleteCategoryM],
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1>Danh mục</h1>
          <p className="mt-1 text-sm text-muted-foreground">Quản lý danh mục sản phẩm.</p>
        </div>
        {canEditCatalog && (
          <Button size="sm" onClick={() => setCategoryForm(emptyCategory())}>
            <Plus className="h-4 w-4" /> Thêm danh mục
          </Button>
        )}
      </div>

      {categoryForm && (
        <AdminCategoryForm
          value={categoryForm}
          saving={saveCategoryM.isPending}
          onCancel={() => setCategoryForm(null)}
          onSubmit={(values) =>
            saveCategoryM.mutate(values, { onSuccess: () => setCategoryForm(null) })
          }
        />
      )}

      <DataTable<CategoryRow>
        columns={columns}
        data={categories as unknown as CategoryRow[]}
        searchPlaceholder="Tìm danh mục..."
      />
    </div>
  );
}
