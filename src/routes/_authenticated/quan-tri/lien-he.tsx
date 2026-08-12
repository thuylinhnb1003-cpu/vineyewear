import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/admin/data-table";
import { getContactColumns } from "@/components/admin/columns/contacts";
import { updateContactStatus } from "@/lib/admin.functions";
import { useAdminAction, useAdminData } from "@/lib/use-admin-data";

export const Route = createFileRoute("/_authenticated/quan-tri/lien-he")({
  component: ContactsPage,
});

function ContactsPage() {
  const { contacts } = useAdminData();
  const contactStatusM = useAdminAction(updateContactStatus, "Đã cập nhật yêu cầu liên hệ.");

  const columns = React.useMemo(
    () =>
      getContactColumns({
        disabled: contactStatusM.isPending,
        onStatusChange: (id, status) => contactStatusM.mutate({ id, status }),
      }),
    [contactStatusM],
  );

  return (
    <div className="grid gap-5">
      <div>
        <h1>Liên hệ</h1>
        <p className="mt-1 text-sm text-muted-foreground">Yêu cầu liên hệ từ khách hàng.</p>
      </div>
      <DataTable
        columns={columns}
        data={contacts}
        searchPlaceholder="Tìm theo tên, số điện thoại..."
      />
    </div>
  );
}
