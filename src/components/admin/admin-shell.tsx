import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/use-session";
import { adminDashboardQuery } from "@/lib/admin-queries";

const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị viên",
  manager: "Quản lý",
  staff: "Nhân viên",
};

export function AdminShell({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const roleLabel = roles.map((r) => ROLE_LABELS[r] ?? r).join(", ") || "—";

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Badge variant="outline">{roleLabel}</Badge>
          </div>
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: adminDashboardQuery.queryKey })
              }
            >
              <RotateCw className="h-4 w-4" /> Làm mới dữ liệu
            </Button>
          </div>
        </header>
        <div className="container-vin section-vin">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
