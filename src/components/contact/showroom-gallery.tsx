import storefront from "@/assets/showroom-storefront.jpg";
import frames from "@/assets/showroom-frames.jpg";
import examRoom from "@/assets/showroom-exam-room.jpg";

const SHOTS = [
  { src: storefront, alt: "Mặt tiền showroom Vin Eyewear buổi tối", caption: "Mặt tiền showroom" },
  { src: frames, alt: "Khu trưng bày gọng kính bên trong showroom", caption: "Khu trưng bày gọng" },
  { src: examRoom, alt: "Phòng đo khúc xạ với thiết bị chuyên dụng", caption: "Phòng đo khúc xạ" },
];

export function ShowroomGallery() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {SHOTS.map((shot) => (
        <figure key={shot.caption} className="group overflow-hidden rounded-lg">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={shot.src}
              alt={shot.alt}
              width={1280}
              height={960}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <figcaption className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {shot.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
