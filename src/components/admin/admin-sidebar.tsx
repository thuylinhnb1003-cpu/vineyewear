import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarClock,
  MessageSquare,
  Package,
  ShoppingCart,
  Store,
  Tags,
  Warehouse,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { to: "/quan-tri", label: "Tổng quan", icon: BarChart3, exact: true },
  { to: "/quan-tri/san-pham", label: "Sản phẩm", icon: Package },
  { to: "/quan-tri/ton-kho", label: "Tồn kho", icon: Warehouse },
  { to: "/quan-tri/danh-muc", label: "Danh mục", icon: Tags },
  { to: "/quan-tri/su-kien", label: "Sự kiện", icon: CalendarClock },
  { to: "/quan-tri/don-hang", label: "Đơn hàng", icon: ShoppingCart },
  { to: "/quan-tri/lich-hen", label: "Lịch hẹn", icon: CalendarClock },
  { to: "/quan-tri/lien-he", label: "Liên hệ", icon: MessageSquare },
  { to: "/quan-tri/co-so", label: "Cơ sở", icon: Store },
] as const;

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-sidebar-foreground">
            Vin Eyewear
          </span>
        </Link>
        <p className="text-2xs uppercase tracking-[0.18em] text-sidebar-foreground/60">
          Bảng quản trị
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link
                      to={item.to}
                      activeOptions={{ exact: "exact" in item && item.exact }}
                      activeProps={{ "data-active": true }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Về trang web">
              <Link to="/">
                <span>← Về trang web</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
