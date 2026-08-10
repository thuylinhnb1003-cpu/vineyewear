import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "@/components/ui/sonner";
import { FloatingContactBar } from "@/components/floating-contact-bar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Không tìm thấy trang</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Trang bạn tìm không tồn tại hoặc đã được chuyển đi.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Trang này chưa tải được</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Đã có lỗi xảy ra. Bạn có thể thử lại hoặc quay về trang chủ.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            Thử lại
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VIN Eyewear - Kính Mắt Thời Trang" },
      {
        name: "description",
        content:
          "VIN Eyewear - cửa hàng kính mắt thời trang chính hãng: gọng kính, kính mát, tròng kính và đo khúc xạ miễn phí tại Hà Nội.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "VIN Eyewear - Kính Mắt Thời Trang" },
      { name: "twitter:title", content: "VIN Eyewear - Kính Mắt Thời Trang" },
      { property: "og:description", content: "VIN Eyewear - cửa hàng kính mắt thời trang chính hãng: gọng kính, kính mát, tròng kính và đo khúc xạ miễn phí tại Hà Nội." },
      { name: "twitter:description", content: "VIN Eyewear - cửa hàng kính mắt thời trang chính hãng: gọng kính, kính mát, tròng kính và đo khúc xạ miễn phí tại Hà Nội." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7c720460-82a7-466c-82ce-625c2ea59c16/id-preview-05fc5a75--a3f0df7d-8a1d-4a0f-8114-e5c56911564f.lovable.app-1785754681398.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7c720460-82a7-466c-82ce-625c2ea59c16/id-preview-05fc5a75--a3f0df7d-8a1d-4a0f-8114-e5c56911564f.lovable.app-1785754681398.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <a href="#main" className="skip-link">
          Bỏ qua tới nội dung chính
        </a>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 scroll-mt-32 focus:outline-none">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <FloatingContactBar />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>

  );
}
