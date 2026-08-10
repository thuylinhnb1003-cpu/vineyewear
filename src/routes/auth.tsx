import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/vin-field";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

function safeNext(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => {
    const next = safeNext(s['next']);
    return next ? { next } : {};
  },
  head: () => ({
    meta: [
      { title: "Đăng nhập / Đăng ký — Vin Eyewear" },
      { name: "description", content: "Đăng nhập để theo dõi đơn hàng, lịch hẹn và sản phẩm yêu thích." },
      { property: "og:title", content: "Đăng nhập — Vin Eyewear" },
      { property: "og:description", content: "Tài khoản Vin Eyewear giúp bạn quản lý đơn hàng và lịch hẹn." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();

  function afterAuth() {
    if (next) {
      window.location.href = next;
      return;
    }
    navigate({ to: "/tai-khoan" });
  }
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);
    if (mode === "login") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (err) return setError(err.message);
      afterAuth();
      return;
    }
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: next ? window.location.origin + next : window.location.origin,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (err) return setError(err.message);
    if (!data.session) {
      setMessage("Vui lòng kiểm tra email để xác nhận tài khoản.");
      return;
    }
    afterAuth();
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: next ? window.location.origin + next : window.location.origin,
    });
    if (result.error) {
      setError("Không đăng nhập được bằng Google. Vui lòng thử lại.");
      return;
    }
    if (result.redirected) return;
    afterAuth();
  }

  return (
    <div className="container-vin section-vin">
      <div className="mx-auto grid max-w-5xl items-stretch gap-px border border-border bg-border lg:grid-cols-2">
        <aside className="hidden flex-col justify-between bg-ink p-10 text-on-ink lg:flex">
          <div>
            <p className="micro-label !text-on-ink/60">Vin Eyewear</p>
            <p className="mt-6 font-display text-4xl leading-[1.05]">
              Hồ sơ thị lực của bạn,
              <br />
              luôn trong tầm tay.
            </p>
          </div>
          <ul className="mt-10 space-y-3 text-sm text-on-ink/70">
            <li className="border-t border-on-ink/15 pt-3">Theo dõi đơn hàng và lịch hẹn đo mắt</li>
            <li className="border-t border-on-ink/15 pt-3">Lưu độ khúc xạ để đặt tròng nhanh hơn</li>
            <li className="border-t border-on-ink/15 pt-3">Ưu đãi riêng cho khách hàng thân thiết</li>
          </ul>
        </aside>

        <div className="bg-card p-8 md:p-10">
        <h1 className="font-display text-3xl">{mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Theo dõi đơn hàng, lịch hẹn và sản phẩm yêu thích của bạn.
        </p>

        <Button variant="outline" className="mt-5 w-full" onClick={onGoogle}>
          Tiếp tục với Google
        </Button>

        <div className="my-4 flex items-center gap-3 text-xs text-caption">
          <span className="h-px flex-1 bg-border" /> hoặc <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}
          {message && (
            <p className="rounded-md bg-primary-soft px-3 py-2 text-sm text-primary">{message}</p>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Đang xử lý..." : mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </form>

        <button
          className="mt-4 w-full text-sm font-semibold text-primary hover:underline"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </button>
        </div>
      </div>
    </div>
  );
}
