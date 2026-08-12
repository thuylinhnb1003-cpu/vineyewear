import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminDashboardQuery, myRolesQuery } from "@/lib/admin-queries";

export function useAdminData() {
  const dashboard = useSuspenseQuery(adminDashboardQuery);
  const roles = useSuspenseQuery(myRolesQuery);
  const queryClient = useQueryClient();

  return {
    ...dashboard.data,
    canEditCatalog: roles.data.canEditCatalog,
    isStaff: roles.data.isStaff,
    invalidate: () => queryClient.invalidateQueries({ queryKey: adminDashboardQuery.queryKey }),
  };
}

export function useAdminAction<TInput>(
  fn: (input: { data: TInput }) => Promise<{ ok: boolean; error?: string }>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TInput) => fn({ data }),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error ?? "Không thực hiện được.");
        return;
      }
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: adminDashboardQuery.queryKey });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
