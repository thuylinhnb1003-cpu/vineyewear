import { PageHero } from "@/components/page-hero";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import { ArTryOn } from "@/components/ar/ar-tryon";
import { getCatalog } from "@/lib/shop.functions";

const catalogQuery = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog() });

export const Route = createFileRoute("/thu-ar")({
  head: () => ({
    meta: [
      { title: "Thử kính AR trực tuyến — VIN Eyewear" },
      {
        name: "description",
        content:
          "Mở camera và ướm thử gọng Titanium, Acetate, Ray-Ban, Bolon ngay trên khuôn mặt bạn. Chụp ảnh, đổi màu gọng và đặt lịch đo mắt trong một bước.",
      },
      { property: "og:title", content: "Thử kính AR trực tuyến — VIN Eyewear" },
      {
        property: "og:description",
        content:
          "Thử kính bằng camera thời gian thực, đổi màu gọng, chụp ảnh và thêm vào giỏ hàng tại VIN Eyewear.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(catalogQuery);
  },
  component: ArPage,
});

const NOTES = [
  { icon: Smartphone, text: "Hoạt động trên cả điện thoại và máy tính có camera trước." },
  { icon: ShieldCheck, text: "Hình ảnh xử lý ngay trên thiết bị, không lưu trữ trên máy chủ." },
  { icon: Sparkles, text: "Kéo thanh điều chỉnh để canh gọng khớp với sống mũi của bạn." },
];

function ArPage() {
  const { data } = useSuspenseQuery(catalogQuery);

  return (
    <>
      <PageHero
        index="04"
        eyebrow="Virtual try-on"
        title="Thử kính bằng camera, chọn gọng như tại cửa hàng"
        crumbs={[{ label: "Thử kính AR" }]}
        lead="Chọn một mẫu gọng, bật camera và ướm thử trực tiếp lên khuôn mặt. Hài lòng rồi bạn có thể chụp ảnh lưu lại, thêm vào giỏ hàng hoặc hẹn kỹ thuật viên đo mắt với đúng mẫu kính đó."
      >
        <ul className="grid gap-3">
          {NOTES.map((note) => (
            <li key={note.text} className="flex gap-2 text-sm text-on-ink/70">
              <note.icon
                className="mt-0.5 h-4 w-4 shrink-0 text-primary-light"
                aria-hidden="true"
              />
              {note.text}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="section-vin bg-background">
        <div className="container-vin">
          <ArTryOn products={data.products} />
        </div>
      </section>
    </>
  );
}
