import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { getEventColumns } from "@/components/admin/columns/events";
import {
  AdminEventForm,
  emptyEvent,
  toEventForm,
  type EventFormValues,
  type EventRow,
} from "@/components/admin-event-form";
import { deleteEvent, saveEvent } from "@/lib/admin.functions";
import { useAdminAction, useAdminData } from "@/lib/use-admin-data";

export const Route = createFileRoute("/_authenticated/quan-tri/su-kien")({
  component: EventsPage,
});

function EventsPage() {
  const { events, canEditCatalog } = useAdminData();
  const [eventForm, setEventForm] = React.useState<EventFormValues | null>(null);

  const saveEventM = useAdminAction(saveEvent, "Đã lưu sự kiện.");
  const deleteEventM = useAdminAction(deleteEvent, "Đã xoá sự kiện.");

  const columns = React.useMemo(
    () =>
      getEventColumns({
        canEdit: canEditCatalog,
        onEdit: (e) => setEventForm(toEventForm(e)),
        onDelete: (e) => {
          if (confirm(`Xoá sự kiện "${e.title}"?`)) deleteEventM.mutate({ id: e.id });
        },
      }),
    [canEditCatalog, deleteEventM],
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1>Sự kiện</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý sự kiện và hoạt động tại cửa hàng.
          </p>
        </div>
        {canEditCatalog && (
          <Button size="sm" onClick={() => setEventForm(emptyEvent())}>
            <Plus className="h-4 w-4" /> Thêm sự kiện
          </Button>
        )}
      </div>

      {eventForm && (
        <AdminEventForm
          value={eventForm}
          saving={saveEventM.isPending}
          onCancel={() => setEventForm(null)}
          onSubmit={(values) => saveEventM.mutate(values, { onSuccess: () => setEventForm(null) })}
        />
      )}

      <DataTable<EventRow>
        columns={columns}
        data={events as unknown as EventRow[]}
        searchPlaceholder="Tìm sự kiện..."
      />
    </div>
  );
}
