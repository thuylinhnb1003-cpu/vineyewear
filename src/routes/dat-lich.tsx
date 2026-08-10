import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/vin-field";
import { createAppointment, getBookedSlots, getStores } from "@/lib/shop.functions";
import { SERVICE_TYPES, TIME_SLOTS, formatDate } from "@/lib/format";
import { useSession } from "@/hooks/use-session";
import { PageHero } from "@/components/page-hero";

const storesQuery = queryOptions({ queryKey: ["stores"], queryFn: () => getStores() });

export const Route = createFileRoute("/dat-lich")({
  validateSearch: (search: Record<string, unknown>): { frame?: string | undefined } => ({
    frame: typeof search["frame"] === "string" && search["frame"] ? search["frame"] : undefined,
  }),
  head: () => ({

    meta: [
      { title: "Đặt lịch đo mắt — Vin Eyewear" },
      {
        name: "description",
        content:
          "Đặt lịch đo khúc xạ, tư vấn gọng kính hoặc bảo hành tại cơ sở Vin Eyewear chỉ trong một phút.",
      },
      { property: "og:title", content: "Đặt lịch đo mắt — Vin Eyewear" },
      {
        property: "og:description",
        content: "Chọn cơ sở, ngày và khung giờ phù hợp để được kỹ thuật viên đo mắt miễn phí.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(storesQuery);
  },
  component: Booking,
});

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Booking() {
  const { data: stores } = useSuspenseQuery(storesQuery);
  const { frame } = Route.useSearch();
  const { user } = useSession();
  const [storeId, setStoreId] = React.useState(stores[0]?.id ?? "");
  const [date, setDate] = React.useState(todayISO());
  const [timeSlot, setTimeSlot] = React.useState("");
  const [serviceType, setServiceType] = React.useState(SERVICE_TYPES[0] ?? "");
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [note, setNote] = React.useState(frame ? `Tôi muốn thử mẫu kính: ${frame}` : "");

  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [code, setCode] = React.useState<string | null>(null);

  const booked = useQuery({
    queryKey: ["booked", storeId, date],
    queryFn: () => getBookedSlots({ data: { storeId, date } }),
    enabled: Boolean(storeId && date),
  });
  const bookedSlots = booked.data ?? [];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!storeId || !timeSlot) {
      setError("Vui lòng chọn cơ sở và khung giờ.");
      return;
    }
    if (!/^0\d{8,10}$/.test(phone.replace(/\s/g, ""))) {
      setError("Số điện thoại không hợp lệ (bắt đầu bằng 0, 9-11 số).");
      return;
    }
    setSubmitting(true);
    const result = await createAppointment({
      data: {
        storeId,
        date,
        timeSlot,
        serviceType,
        fullName,
        phone: phone.replace(/\s/g, ""),
        note: note || undefined,
        userId: user?.id ?? null,
      },
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      booked.refetch();
      return;
    }
    setCode(result.code);
  }

  if (code) {
    const store = stores.find((s) => s.id === storeId);
    return (
      <div className="container-vin section-vin">
        <div className="mx-auto max-w-lg border border-border bg-card p-8 text-center shadow-card">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
          <h1 className="mt-5 font-display text-3xl">Đặt lịch thành công</h1>
          <p className="mt-2 text-muted-foreground">
            Mã lịch hẹn của bạn là <strong className="text-primary">{code}</strong>. Chúng tôi sẽ
            gọi xác nhận trong giờ làm việc.
          </p>
          <div className="mt-6 space-y-1 border border-border bg-secondary/60 p-4 text-left text-sm">
            <p>
              <strong>Cơ sở:</strong> {store?.name}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {store?.address}
            </p>
            <p>
              <strong>Thời gian:</strong> {formatDate(date)} · {timeSlot}
            </p>
            <p>
              <strong>Dịch vụ:</strong> {serviceType}
            </p>
          </div>
          <Button
            className="mt-6"
            onClick={() => {
              setCode(null);
              setTimeSlot("");
            }}
          >
            Đặt lịch khác
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Dịch vụ"
        index="01"
        title="Đặt lịch đo mắt"
        lead="Chọn cơ sở, ngày và khung giờ — kỹ thuật viên sẽ đo khúc xạ miễn phí cho bạn, kể cả khi bạn chưa mua kính."
        crumbs={[{ label: "Đặt lịch" }]}
      />
      <div className="container-vin section-vin">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form onSubmit={onSubmit} className="space-y-6 border border-border bg-card p-6 shadow-card md:p-8">
          <div>
            <Label htmlFor="store">Cơ sở *</Label>
            <Select id="store" value={storeId} onChange={(e) => setStoreId(e.target.value)} required>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} — {store.address}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="date">Ngày hẹn *</Label>
              <Input
                id="date"
                type="date"
                min={todayISO()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTimeSlot("");
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="service">Dịch vụ *</Label>
              <Select
                id="service"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                {SERVICE_TYPES.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Khung giờ *</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {TIME_SLOTS.map((slot) => {
                const taken = bookedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={taken}
                    onClick={() => setTimeSlot(slot)}
                    className={`tap-target border py-2 text-sm font-semibold tabular-nums transition-colors ${
                      timeSlot === slot
                        ? "border-primary bg-primary text-primary-foreground"
                        : taken
                          ? "border-border bg-muted text-caption line-through"
                          : "border-input hover:border-primary hover:text-primary"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-caption">
              Khung giờ gạch ngang đã có người đặt. Mỗi khung giờ nhận 1 lịch/cơ sở.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={2}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                inputMode="tel"
                placeholder="09xxxxxxxx"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: cần tư vấn tròng chống ánh sáng xanh"
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Đang gửi..." : "Xác nhận đặt lịch"}
          </Button>
        </form>

        <aside className="space-y-4">
          <p className="micro-label">Cơ sở Vin Eyewear</p>
          {stores.map((store) => (
            <div key={store.id} className="border border-border bg-card p-5">
              <h3 className="font-display text-lg">{store.name}</h3>
              <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {store.address}
              </p>
              <p className="mt-1 flex gap-2 text-sm text-muted-foreground">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {store.open_hours}
              </p>
            </div>
          ))}
        </aside>
      </div>
      </div>
    </>
  );
}
