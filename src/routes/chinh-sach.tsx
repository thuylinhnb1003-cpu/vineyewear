import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  Eye,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/vin-field";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/chinh-sach")({
  head: () => ({
    meta: [
      { title: "Chính sách & Cam kết chất lượng — VIN Eyewear" },
      {
        name: "description",
        content:
          "Chính sách bảo hành trọn đời, đổi mẫu 7 ngày, bảo hành độ cận, giao hàng đồng kiểm và bảo mật thông tin tại VIN Eyewear.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Chính sách & Cam kết chất lượng — VIN Eyewear" },
      {
        property: "og:description",
        content:
          "Bảo hành trọn đời, đổi mẫu 7 ngày, bảo hành độ cận và đồng kiểm khi nhận hàng tại VIN Eyewear.",
      },
      { name: "twitter:title", content: "Chính sách & Cam kết chất lượng — VIN Eyewear" },
      {
        name: "twitter:description",
        content: "Cam kết bảo hành, đổi trả và bảo mật thông tin của VIN Eyewear.",
      },
    ],
    links: [{ rel: "canonical", href: "https://vineyewear.lovable.app/chinh-sach" }],
  }),
  component: Policy,
});

const HIGHLIGHTS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Wrench,
    title: "Bảo Hành Trọn Đời",
    desc: "Nắn chỉnh gọng, thay ốc & đệm mũi miễn phí tại mọi cơ sở.",
  },
  {
    icon: RefreshCw,
    title: "7 Ngày Đổi Mẫu",
    desc: "Áp dụng cho gọng kính chưa qua sử dụng, còn nguyên phụ kiện.",
  },
  {
    icon: Eye,
    title: "Bảo Hành Độ Cận",
    desc: "Đo lại & hỗ trợ tròng trong 7 ngày nếu bạn chưa êm mắt.",
  },
  {
    icon: Truck,
    title: "Đồng Kiểm Khi Nhận",
    desc: "Mở hàng kiểm tra cùng shipper trước khi thanh toán.",
  },
];

type PolicyGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  intro: string;
  items: { q: string; a: string }[];
};

const GROUPS: PolicyGroup[] = [
  {
    id: "bao-hanh",
    label: "Chính sách Bảo hành & Sửa chữa",
    icon: ShieldCheck,
    intro:
      "Mọi sản phẩm VIN Eyewear đều được bảo hành chính hãng và hỗ trợ dịch vụ chăm sóc trọn đời.",
    items: [
      {
        q: "Bảo hành trọn đời gồm những dịch vụ nào?",
        a: "Nắn chỉnh gọng, siết & thay ốc, thay đệm mũi, vệ sinh kính bằng máy sóng siêu âm — miễn phí trọn đời tại tất cả cơ sở, không giới hạn số lần.",
      },
      {
        q: "Thời gian bảo hành lỗi nhà sản xuất là bao lâu?",
        a: "24 tháng kể từ ngày mua đối với gọng kính và tròng kính chính hãng: bong lớp phủ, gãy khớp bản lề, bong tróc màu do lỗi vật liệu.",
      },
      {
        q: "Trường hợp nào không được bảo hành?",
        a: "Sản phẩm bị rơi vỡ, biến dạng do ngoại lực, tự tháo lắp tại nơi khác, hoặc trầy xước tròng do vệ sinh sai cách (dùng nước nóng, hoá chất mạnh).",
      },
      {
        q: "Tôi có cần giữ hoá đơn không?",
        a: "Không bắt buộc. Chúng tôi tra cứu bằng số điện thoại đặt hàng hoặc mã đơn hàng trong hệ thống.",
      },
    ],
  },
  {
    id: "doi-tra",
    label: "Chính sách Đổi trả & Hoàn tiền",
    icon: RefreshCw,
    intro: "Đổi mẫu linh hoạt trong 7 ngày để bạn luôn hài lòng với lựa chọn của mình.",
    items: [
      {
        q: "Điều kiện đổi mẫu trong 7 ngày?",
        a: "Gọng kính chưa qua sử dụng, không trầy xước, còn nguyên tem và đầy đủ phụ kiện (hộp, khăn lau, túi).",
      },
      {
        q: "Tròng kính đã cắt theo độ có đổi được không?",
        a: "Tròng kính cắt theo đơn độ riêng không áp dụng đổi trả, nhưng được hỗ trợ đo lại và điều chỉnh trong 7 ngày nếu chưa êm mắt.",
      },
      {
        q: "Quy trình hoàn tiền diễn ra thế nào?",
        a: "Với sản phẩm lỗi từ nhà sản xuất, chúng tôi hoàn 100% giá trị qua chuyển khoản trong 3-5 ngày làm việc sau khi nhận lại hàng.",
      },
      {
        q: "Chi phí đổi trả do ai chịu?",
        a: "VIN Eyewear chịu toàn bộ phí vận chuyển nếu lỗi thuộc về chúng tôi. Trường hợp đổi vì lý do sở thích, khách hàng hỗ trợ phí giao nhận.",
      },
    ],
  },
  {
    id: "do-mat",
    label: "Chính sách Đo mắt & Tròng kính",
    icon: Eye,
    intro:
      "Quy trình khúc xạ chuẩn phòng khám, thực hiện bởi kỹ thuật viên được đào tạo chuyên sâu.",
    items: [
      {
        q: "Đo mắt tại VIN Eyewear có mất phí không?",
        a: "Hoàn toàn miễn phí cho mọi khách hàng, kể cả khi bạn không mua kính.",
      },
      {
        q: "Quy trình đo khúc xạ gồm những bước nào?",
        a: "Khai thác tiền sử thị lực, đo máy tự động, thử kính thử, kiểm tra thị lực hai mắt, cân bằng độ và tư vấn tròng phù hợp nhu cầu sử dụng.",
      },
      {
        q: "Bao lâu thì lắp xong kính?",
        a: "Thông thường 30-60 phút với tròng có sẵn. Tròng đặc biệt (đa tiêu, chiết suất cao, đổi màu) cần 3-5 ngày làm việc.",
      },
      {
        q: "Kính mới đeo bị mỏi mắt thì sao?",
        a: "Hãy quay lại trong 7 ngày, kỹ thuật viên sẽ đo lại và điều chỉnh độ hoặc tâm tròng miễn phí.",
      },
    ],
  },
  {
    id: "giao-hang",
    label: "Giao hàng & Đồng kiểm",
    icon: Truck,
    intro: "Giao toàn quốc, cho phép mở hàng kiểm tra trước khi thanh toán.",
    items: [
      {
        q: "Phí vận chuyển tính thế nào?",
        a: "30.000đ cho đơn dưới 1.000.000đ; miễn phí vận chuyển cho đơn từ 1.000.000đ.",
      },
      {
        q: "Thời gian giao hàng bao lâu?",
        a: "Hà Nội 1-2 ngày, các tỉnh thành khác 2-5 ngày làm việc kể từ khi đơn được xác nhận.",
      },
      {
        q: "Tôi được đồng kiểm khi nhận hàng chứ?",
        a: "Có. Bạn được mở hộp kiểm tra cùng shipper; nếu sản phẩm sai mẫu hoặc hư hỏng, bạn có thể từ chối nhận và không mất phí.",
      },
      {
        q: "Có hỗ trợ thanh toán khi nhận hàng (COD)?",
        a: "Có, áp dụng toàn quốc. Đơn hàng sẽ được gọi xác nhận qua điện thoại trước khi giao.",
      },
    ],
  },
  {
    id: "bao-mat",
    label: "Bảo mật thông tin",
    icon: ShieldCheck,
    intro:
      "Dữ liệu cá nhân và hồ sơ khúc xạ của bạn được lưu trữ an toàn, chỉ dùng cho mục đích chăm sóc.",
    items: [
      {
        q: "VIN Eyewear thu thập những thông tin gì?",
        a: "Họ tên, số điện thoại, địa chỉ giao hàng và hồ sơ khúc xạ — phục vụ giao hàng, đặt lịch và tư vấn tròng kính phù hợp.",
      },
      {
        q: "Thông tin của tôi có được chia sẻ cho bên thứ ba?",
        a: "Không. Chúng tôi chỉ chia sẻ địa chỉ và số điện thoại cho đơn vị vận chuyển để hoàn tất giao hàng.",
      },
      {
        q: "Tôi có thể yêu cầu xoá dữ liệu không?",
        a: "Có. Gửi yêu cầu qua hotline hoặc trang Liên hệ, chúng tôi sẽ xoá hồ sơ trong 7 ngày làm việc.",
      },
      {
        q: "Dữ liệu hồ sơ khúc xạ được lưu bao lâu?",
        a: "Lưu trong 5 năm để tiện theo dõi tiến triển thị lực, trừ khi bạn yêu cầu xoá sớm hơn.",
      },
    ],
  },
];

function Policy() {
  const [activeId, setActiveId] = React.useState(GROUPS[0]!.id);
  const [query, setQuery] = React.useState("");

  const term = query.trim().toLowerCase();
  const active = GROUPS.find((g) => g.id === activeId)!;

  const searching = term.length > 0;
  const results = (searching ? GROUPS : [active]).flatMap((g) =>
    g.items
      .filter((item) => !searching || `${g.label} ${item.q} ${item.a}`.toLowerCase().includes(term))
      .map((item) => ({ ...item, group: g.label, key: `${g.id}-${item.q}` })),
  );

  return (
    <div>
      <PageHero
        index="07"
        eyebrow="Chính sách & Hỗ trợ"
        title="Chính Sách & Cam Kết Chất Lượng"
        crumbs={[{ label: "Chính sách & Hỗ trợ" }]}
        lead="VIN Eyewear đồng hành cùng thị lực và phong cách của bạn — bảo hành trọn đời, đổi mẫu 7 ngày và đồng kiểm khi nhận hàng."
      />

      {/* Highlights */}
      <section className="section-vin">
        <div className="container-vin">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <article
                key={h.title}
                className="group rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-[box-shadow,border-color,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-sm bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <h.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-sans text-base font-semibold leading-snug">{h.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{h.desc}</p>
              </article>
            ))}
          </div>

          {/* Main content */}
          <div className="mt-14 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-40 lg:self-start">
              <p className="eyebrow">Danh mục chính sách</p>
              <nav className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                {GROUPS.map((g) => {
                  const isActive = !searching && g.id === activeId;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setActiveId(g.id);
                      }}
                      className={`flex shrink-0 items-center gap-2.5 rounded-sm border px-3.5 py-3 text-left text-sm font-medium transition-all duration-300 ease-[var(--ease-out-soft)] lg:w-full lg:shrink ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
                          : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      <g.icon className="h-4 w-4 shrink-0" />
                      <span className="lg:min-w-0">{g.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div className="min-w-0">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                  aria-label="Tìm kiếm chính sách"
                  placeholder="Tìm kiếm chính sách (ví dụ: bảo hành, đổi trả, ship...)"
                />
              </div>

              <div className="mt-6">
                {searching ? (
                  <p className="text-sm text-muted-foreground">
                    {results.length} kết quả cho “{query.trim()}”
                  </p>
                ) : (
                  <>
                    <h2 className="display-section">{active.label}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{active.intro}</p>
                  </>
                )}
              </div>

              {results.length === 0 ? (
                <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
                  <p className="font-semibold">Không tìm thấy nội dung phù hợp</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Thử từ khoá khác hoặc liên hệ hotline để được hỗ trợ trực tiếp.
                  </p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="mt-5">
                  {results.map((item) => (
                    <AccordionItem key={item.key} value={item.key}>
                      <AccordionTrigger className="text-left text-base font-medium">
                        <span className="min-w-0">
                          {searching && (
                            <span className="mr-2 rounded-full bg-secondary px-2 py-0.5 text-2xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                              {item.group}
                            </span>
                          )}
                          {item.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>

          {/* Help CTA */}
          <div className="mt-14 grid gap-6 rounded-lg border border-border bg-secondary p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="min-w-0">
              <h2 className="display-section">Bạn vẫn còn thắc mắc về chính sách?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Đội ngũ chuyên viên VIN Eyewear sẵn sàng tư vấn từ 8:30 - 21:00 mỗi ngày.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="primary">
                <a href="https://zalo.me/0901234567" target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat Zalo Tư Vấn
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="tel:19001234">
                  <Phone className="mr-2 h-4 w-4" />
                  Gọi Hotline: 1900 1234
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
