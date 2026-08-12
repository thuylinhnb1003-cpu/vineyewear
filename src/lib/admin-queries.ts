import { queryOptions } from "@tanstack/react-query";
import { getAdminDashboard, getMyRoles } from "@/lib/admin.functions";

export const myRolesQuery = queryOptions({
  queryKey: ["my-roles"],
  queryFn: () => getMyRoles(),
});

export const adminDashboardQuery = queryOptions({
  queryKey: ["admin-dashboard"],
  queryFn: () => getAdminDashboard(),
});

export type AdminDashboardData = Awaited<ReturnType<typeof getAdminDashboard>>;
export type OrderRow = AdminDashboardData["orders"][number];
export type AppointmentRow = AdminDashboardData["appointments"][number];
export type ContactRow = AdminDashboardData["contacts"][number];
export type StoreRow = AdminDashboardData["stores"][number];

export const ORDER_STATUS = [
  { value: "new", label: "Mới" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã huỷ" },
] as const;

export const APPOINTMENT_STATUS = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "done", label: "Đã đến" },
  { value: "cancelled", label: "Đã huỷ" },
] as const;

export const CONTACT_STATUS = [
  { value: "new", label: "Mới" },
  { value: "handling", label: "Đang xử lý" },
  { value: "done", label: "Đã xử lý" },
] as const;
