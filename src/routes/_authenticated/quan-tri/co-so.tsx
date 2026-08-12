import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { getStoreColumns } from "@/components/admin/columns/stores";
import {
  AdminStoreForm,
  emptyStore,
  toStoreForm,
  type StoreFormValues,
} from "@/components/admin-store-form";
import type { StoreRow } from "@/lib/admin-queries";
import { deleteStore, saveStore } from "@/lib/admin.functions";
import { useAdminAction, useAdminData } from "@/lib/use-admin-data";

export const Route = createFileRoute("/_authenticated/quan-tri/co-so")({
  component: StoresPage,
});

function StoresPage() {
  const { stores, canEditCatalog } = useAdminData();
  const [storeForm, setStoreForm] = React.useState<StoreFormValues | null>(null);

  const saveStoreM = useAdminAction(saveStore, "Đã lưu cơ sở.");
  const deleteStoreM = useAdminAction(deleteStore, "Đã xoá cơ sở.");

  const columns = React.useMemo(
    () =>
      getStoreColumns({
        canEdit: canEditCatalog,
        onEdit: (s) => setStoreForm(toStoreForm(s)),
        onDelete: (s) => {
          if (confirm(`Xoá cơ sở "${s.name}"?`)) deleteStoreM.mutate({ id: s.id });
        },
      }),
    [canEditCatalog, deleteStoreM],
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1>Cơ sở</h1>
          <p className="mt-1 text-sm text-muted-foreground">Quản lý các cơ sở/cửa hàng.</p>
        </div>
        {canEditCatalog && (
          <Button size="sm" onClick={() => setStoreForm(emptyStore())}>
            <Plus className="h-4 w-4" /> Thêm cơ sở
          </Button>
        )}
      </div>

      {storeForm && (
        <AdminStoreForm
          value={storeForm}
          saving={saveStoreM.isPending}
          onCancel={() => setStoreForm(null)}
          onSubmit={(values) => saveStoreM.mutate(values, { onSuccess: () => setStoreForm(null) })}
        />
      )}

      <DataTable<StoreRow> columns={columns} data={stores} searchPlaceholder="Tìm cơ sở..." />
    </div>
  );
}
