import { PageHero } from "@/components/page-hero";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";
import { CalendarCheck, Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/vin-field";
import { getStores, submitContact } from "@/lib/shop.functions";
import { StoreLocator } from "@/components/contact/store-locator";
import { AmenitiesGrid } from "@/components/contact/amenities-grid";
import { ShowroomGallery } from "@/components/contact/showroom-gallery";
import { HOTLINE, MESSENGER_URL, ZALO_URL } from "@/lib/contact-data";

const storesQuery = queryOptions({ queryKey: ["stores"], queryFn: () => getStores() });

const TOPICS = [
  "Tư vấn sản phẩm & gọng kính",
  "Đo mắt và cắt tròng theo đơn",
  "Đơn hàng / vận chuyển",
  "Bảo hành & sửa chữa",
  "Hợp tác doanh nghiệp",
];

const FAQS = [
  {
    q: "Đo mắt tại Vin Eyewear có mất phí không?",
    a: "Miễn phí toàn bộ quy trình đo khúc xạ 14 bước với kỹ thuật viên chuyên môn, kể cả khi bạn chưa mua kính.",
  },
  {
    q: "Cắt tròng theo đơn mất bao lâu?",
    a: "Các loại tròng phổ thông có sẵn lấy ngay trong 30–45 phút. Tròng đa tiêu cự hoặc độ đặc biệt cần 2–5 ngày làm việc.",
  },
  {
    q: "Tôi có thể đổi gọng sau khi mua không?",
    a: "Đổi gọng trong 7 ngày nếu sản phẩm còn nguyên trạng, và nắn chỉnh – vệ sinh miễn phí trọn đời tại cả hai cơ sở.",
  },
];

export const Route = createFileRoute("/lien-he")({
  head: () => ({
    meta: [
      { title: "Liên hệ & Hệ thống cửa hàng — Vin Eyewear" },
      {
        name: "description",
        content:
          "Bản đồ hai cơ sở Vin Eyewear tại Hà Nội, hotline, Zalo và form liên hệ. Đo mắt miễn phí, cắt tròng lấy ngay.",
      },
      { property: "og:title", content: "Liên hệ & Hệ thống cửa hàng — Vin Eyewear" },
      {
        property: "og:description",
        content: "Tìm cơ sở gần bạn, xem tiện ích showroom và gửi yêu cầu tư vấn tới Vin Eyewear.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(storesQuery);
  },
  component: Contact,
});

function Contact() {
  const { data: stores } = useSuspenseQuery(storesQuery);
  const [activeId, setActiveId] = React.useState(stores[0]?.id ?? "");
  const [form, setForm] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    topic: TOPICS[0]!,
    message: "",
  });
  const [state, setState] = React.useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setState("sending");
    const result = await submitContact({
      data: {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email || undefined,
        message: `[${form.topic}] ${form.message}`,
      },
    });
    if (!result.ok) {
      setError(result.error);
      setState("idle");
      return;
    }
    setState("sent");
  }

  return (
    <div>
      {/* Hero */}
      <PageHero
        index="06"
        eyebrow="Vin Eyewear · Hà Nội"
        title="Ghé showroom hoặc nhắn cho chúng tôi"
        crumbs={[{ label: "Liên hệ" }]}
        lead="Hai cơ sở tại Tây Hồ và Long Biên, mở cửa 08:00 – 21:00 mỗi ngày. Đo mắt miễn phí, tư vấn 1:1 với kỹ thuật viên khúc xạ."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="primary">
            <a href={`tel:${HOTLINE}`}>
              <Phone className="h-4 w-4" />
              Hotline {HOTLINE}
            </a>
          </Button>
          <Button asChild variant="onDark">
            <a href={ZALO_URL} target="_blank" rel="noreferrer noopener">
              <MessageCircle className="h-4 w-4" />
              Chat Zalo
            </a>
          </Button>
          <Button asChild variant="onDark">
            <Link to="/dat-lich">
              <CalendarCheck className="h-4 w-4" />
              Đặt lịch đo mắt
            </Link>
          </Button>
        </div>
      </PageHero>


      {/* Store locator + map */}
      <section className="section-vin">
        <div className="container-vin">
          <h2>Hệ thống cửa hàng</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Chọn một cơ sở để xem bản đồ chi tiết, giờ mở cửa và chỉ đường.
          </p>
          <div className="mt-8">
            <StoreLocator stores={stores} activeId={activeId} onSelect={setActiveId} />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-secondary py-14 md:py-20">
        <div className="container-vin">
          <p className="eyebrow">Tiện ích tại showroom</p>
          <h2 className="head-title display-section">Trải nghiệm trọn vẹn khi tới cửa hàng</h2>
          <div className="mt-8">
            <AmenitiesGrid />
          </div>
        </div>
      </section>

      {/* Contact form + channels */}
      <section className="section-vin">
        <div className="container-vin grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div>
            <p className="eyebrow">Gửi yêu cầu</p>
            <h2 className="head-title display-section">Chúng tôi phản hồi trong 24 giờ làm việc</h2>
            <p className="head-lead max-w-lg lead-vin">
              Để lại thông tin, bộ phận chăm sóc khách hàng sẽ liên hệ lại theo đúng chủ đề bạn chọn.
            </p>

            {state === "sent" ? (
              <div className="mt-8 rounded-lg border border-primary bg-primary-soft p-6">
                <h3 className="text-lg">Đã gửi thành công</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cảm ơn bạn! Chúng tôi sẽ phản hồi qua số điện thoại {form.phone} trong 24 giờ làm việc.
                </p>
                <Button className="mt-4" variant="secondary" onClick={() => setState("idle")}>
                  Gửi yêu cầu khác
                </Button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="mt-8 space-y-4 rounded-lg border border-border bg-background p-6"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      required
                      minLength={2}
                      maxLength={100}
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      required
                      inputMode="tel"
                      maxLength={20}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      maxLength={255}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="topic">Chủ đề *</Label>
                    <Select
                      id="topic"
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    >
                      {TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Nội dung *</Label>
                  <Textarea
                    id="message"
                    required
                    minLength={5}
                    maxLength={1000}
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                {error && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <Button type="submit" disabled={state === "sending"}>
                  {state === "sending" ? "Đang gửi..." : "Gửi liên hệ"}
                </Button>
              </form>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-border p-6">
              <p className="eyebrow">Kênh liên hệ nhanh</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${HOTLINE}`} className="hover:text-primary">
                    {HOTLINE} (08:00 – 21:00)
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:cskh@vineyewear.vn" className="hover:text-primary">
                    cskh@vineyewear.vn
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <a
                    href={MESSENGER_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-primary"
                  >
                    Messenger Vin Eyewear
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border p-6">
              <p className="eyebrow">Câu hỏi thường gặp</p>
              <div className="mt-4 divide-y divide-border">
                {FAQS.map((faq) => (
                  <details key={faq.q} className="group py-3">
                    <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                      {faq.q}
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-secondary py-14 md:py-20">
        <div className="container-vin">
          <p className="eyebrow">Không gian Vin Eyewear</p>
          <h2 className="head-title display-section">Showroom & phòng đo khúc xạ</h2>
          <div className="mt-8">
            <ShowroomGallery />
          </div>
        </div>
      </section>
    </div>
  );
}
