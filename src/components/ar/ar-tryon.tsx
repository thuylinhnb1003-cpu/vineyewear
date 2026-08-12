import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Camera,
  CameraOff,
  Download,
  Heart,
  Layers,
  Palette,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/vin-field";
import { AR_COLORS, AR_FRAMES, type ArFrame } from "@/lib/ar-frames";
import { formatVnd } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { CheckoutModal, type CheckoutItem } from "@/components/checkout-modal";

type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  images: unknown;
};

type LensEffect = {
  id: "clear" | "blue" | "tinted";
  label: string;
  desc: string;
  filter: string;
};

type PresetFace = {
  id: string;
  label: string;
  shape: string;
  image: string;
};

const LENS_EFFECTS: LensEffect[] = [
  { id: "clear", label: "Tròng trong suốt", desc: "Sắc nét và tự nhiên.", filter: "brightness(1)" },
  {
    id: "blue",
    label: "Chống ánh sáng xanh",
    desc: "Giảm chói màn hình, dễ chịu khi dùng máy tính.",
    filter: "contrast(1.05) saturate(1.05)",
  },
  {
    id: "tinted",
    label: "Tròng mát",
    desc: "Giảm sáng, vẻ ngoài thời thượng.",
    filter: "brightness(0.92) saturate(1.2)",
  },
];

const PRESET_FACES: PresetFace[] = [
  { id: "round", label: "Mặt Tròn", shape: "Round", image: "/images/product-1.jpg" },
  { id: "oval", label: "Mặt Oval", shape: "Oval", image: "/images/product-2.jpg" },
  { id: "square", label: "Mặt Vuông", shape: "Square", image: "/images/product-3.jpg" },
  { id: "heart", label: "Mặt Tim", shape: "Heart", image: "/images/product-4.jpg" },
];

const SIZE_OPTIONS = [
  { id: "S", label: "Nhỏ" },
  { id: "M", label: "Trung bình" },
  { id: "L", label: "Lớn" },
];

const MODE_OPTIONS = [
  { id: "camera", label: "Camera" },
  { id: "upload", label: "Tải ảnh" },
  { id: "preset", label: "Mẫu khuôn mặt" },
] as const;

const FACE_SHAPE_ADVICE: Record<string, string> = {
  Round: "Gọng vuông, góc cạnh sẽ tạo sự cân đối và nổi bật.",
  Oval: "Gọng chữ nhật hoặc phi công sẽ tôn chiều dài khuôn mặt.",
  Square: "Gọng tròn hoặc mềm mại giúp làm dịu các đường góc.",
  Heart: "Gọng mắt mèo hoặc viền nhẹ giúp cân bằng trán và cằm.",
};

function estimateFaceShape(box: { width: number; height: number }) {
  const ratio = box.height / box.width;
  if (ratio > 1.12) return "Heart";
  if (ratio > 1.03) return "Oval";
  if (ratio > 0.9) return "Round";
  return "Square";
}

export function ArTryOn({ products }: { products: CatalogProduct[] }) {
  const { add } = useCart();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [active, setActive] = React.useState(false);
  const [loadingCamera, setLoadingCamera] = React.useState(false);
  const [permissionError, setPermissionError] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<(typeof MODE_OPTIONS)[number]["id"]>("camera");
  const [uploadImage, setUploadImage] = React.useState<string | null>(null);
  const [presetFace, setPresetFace] = React.useState<PresetFace>(PRESET_FACES[0]!);
  const [faceShape, setFaceShape] = React.useState<string | null>(null);
  const [sizeOption, setSizeOption] = React.useState("M");
  const [pd, setPd] = React.useState(62);
  const [lensEffect, setLensEffect] = React.useState<LensEffect>(LENS_EFFECTS[0]!);
  const [frameColor, setFrameColor] = React.useState(AR_COLORS[0]!);
  const [frame, setFrame] = React.useState<ArFrame>(AR_FRAMES[0]!);
  const [width, setWidth] = React.useState(58);
  const [top, setTop] = React.useState(40);
  const [rotate, setRotate] = React.useState(0);
  const [shot, setShot] = React.useState<string | null>(null);
  const [beforeAfter, setBeforeAfter] = React.useState(50);
  const [faceDetected, setFaceDetected] = React.useState(false);
  const [faceBox, setFaceBox] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [faceStatus, setFaceStatus] = React.useState<string | null>(null);
  const [checkout, setCheckout] = React.useState<CheckoutItem | null>(null);
  const [uploadHint, setUploadHint] = React.useState<string | null>(null);
  const faceDetectorRef = React.useRef<any>(null);
  const detectTimerRef = React.useRef<number | null>(null);

  const selectedProduct = React.useMemo(
    () => products.find((item) => item.slug === frame.slug),
    [products, frame],
  );

  const currentPreview = React.useMemo(() => {
    if (mode === "upload" && uploadImage) return uploadImage;
    if (mode === "preset") return presetFace.image;
    return null;
  }, [mode, uploadImage, presetFace]);

  const cameraSupported =
    typeof window !== "undefined" && typeof (window as any).FaceDetector === "function";

  const checkoutItem = React.useMemo<CheckoutItem | null>(() => {
    if (!selectedProduct) return null;
    return {
      productId: selectedProduct.id,
      slug: selectedProduct.slug,
      name: `${selectedProduct.name}`,
      price: Number(selectedProduct.price),
      image: Array.isArray(selectedProduct.images)
        ? (selectedProduct.images[0] as string | null)
        : null,
      variant: `${frame.name} • ${frameColor.label} • ${lensEffect.label}`,
    };
  }, [selectedProduct, frame, frameColor, lensEffect]);

  const faceAdvice = faceShape
    ? FACE_SHAPE_ADVICE[faceShape]
    : "Chưa xác định kiểu mặt. Hãy quay thẳng camera hoặc tải ảnh đẹp rõ mặt.";

  React.useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (detectTimerRef.current) window.clearInterval(detectTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (!active) return;
    if (!cameraSupported) {
      setFaceStatus("Trình duyệt này chưa hỗ trợ nhận diện khuôn mặt tự động.");
      return;
    }

    faceDetectorRef.current ??= new (window as any).FaceDetector();

    const detectFace = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        const results = await faceDetectorRef.current.detect(canvas);
        if (results.length > 0) {
          const face = results[0].boundingBox;
          const stage = stageRef.current;
          const stageWidth = stage?.clientWidth ?? canvas.width;
          const stageHeight = stage?.clientHeight ?? canvas.height;
          setFaceDetected(true);
          setFaceStatus(null);
          setFaceBox({
            x: (face.x / canvas.width) * stageWidth,
            y: (face.y / canvas.height) * stageHeight,
            width: (face.width / canvas.width) * stageWidth,
            height: (face.height / canvas.height) * stageHeight,
          });
          setFaceShape(estimateFaceShape({ width: face.width, height: face.height }));
          setUploadHint(null);
        } else {
          setFaceDetected(false);
          setFaceStatus("Chưa phát hiện khuôn mặt. Hướng camera thẳng vào mặt bạn.");
        }
      } catch {
        setFaceDetected(false);
        setFaceStatus("Chức năng nhận diện mặt không hoạt động trong trình duyệt này.");
      }
    };

    detectFace();
    detectTimerRef.current = window.setInterval(detectFace, 1200);

    return () => {
      if (detectTimerRef.current) window.clearInterval(detectTimerRef.current);
      detectTimerRef.current = null;
    };
  }, [active, cameraSupported]);

  const startCamera = React.useCallback(async () => {
    setPermissionError(null);
    setLoadingCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (err) {
      setPermissionError(
        "Không truy cập được camera. Kiểm tra quyền camera hoặc thử lại với Chrome/Edge.",
      );
      setActive(false);
    } finally {
      setLoadingCamera(false);
    }
  }, []);

  const stopCamera = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
    setFaceDetected(false);
    setFaceBox(null);
  }, []);

  const handleUpload = React.useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadImage(reader.result);
        setMode("upload");
        setFaceShape("Oval");
        setUploadHint("Ảnh đã tải lên sẵn sàng để thử kính.");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const autoAlign = React.useCallback(() => {
    if (!faceDetected || !faceBox) return;
    setWidth(Math.min(80, Math.max(40, Math.round(faceBox.width / 3.75))));
    setTop(Math.min(58, Math.max(26, Math.round(faceBox.y / 4.2))));
    setRotate(0);
    toast.success("Đã căn chỉnh gọng kính phù hợp với khuôn mặt.");
  }, [faceDetected, faceBox]);

  const addToCart = React.useCallback(() => {
    if (!checkoutItem) return;
    add(checkoutItem);
    toast.success(`Đã thêm ${checkoutItem.name} vào giỏ hàng.`);
  }, [add, checkoutItem]);

  const renderPreviewBackground = React.useMemo(() => {
    if (mode === "camera") return null;
    if (mode === "upload" && uploadImage) return uploadImage;
    return presetFace.image;
  }, [mode, uploadImage, presetFace]);

  const previewLabel =
    mode === "camera"
      ? "Camera trực tiếp"
      : mode === "upload"
        ? "Ảnh tự tải"
        : `${presetFace.label}`;

  const currentProduct = selectedProduct ?? frame;

  const buyNow = React.useCallback(() => {
    if (!checkoutItem) return;
    setCheckout(checkoutItem);
  }, [checkoutItem]);

  const baseGlassesStyle = {
    left: "50%",
    top: "50%",
    width: "58%",
    transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
    filter: `${frameColor.filter} ${lensEffect.filter}`,
  } as const;

  const glassesStyle = React.useMemo<React.CSSProperties>(() => {
    if (!active || !faceBox) return baseGlassesStyle;

    const widthPx = Math.max(120, faceBox.width * (0.8 + width / 100));
    const pdOffset = (pd - 62) * 0.35;
    const topOffset = faceBox.y + faceBox.height * 0.38 + (top - 40) * 0.5;

    return {
      left: faceBox.x + faceBox.width / 2 + pdOffset,
      top: topOffset,
      width: `${widthPx}px`,
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      filter: `${frameColor.filter} ${lensEffect.filter}`,
    };
  }, [
    active,
    faceBox,
    width,
    top,
    rotate,
    pd,
    frameColor.filter,
    lensEffect.filter,
    baseGlassesStyle,
  ]);

  const activeOverlayStyle = {
    left: faceBox?.x ?? 0,
    top: faceBox?.y ?? 0,
    width: faceBox?.width ?? 0,
    height: faceBox?.height ?? 0,
  } as React.CSSProperties;

  const stageSrc = renderPreviewBackground;

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_360px]">
        <div>
          <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="micro-label text-muted-foreground">Thử kính AR</p>
                <h2 className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
                  Virtual Try-On
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {MODE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setMode(option.id)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm font-semibold transition",
                      mode === option.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 rounded-[2rem] border border-border bg-ink/80 p-4 shadow-inner backdrop-blur-xl">
              <div
                ref={stageRef}
                className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950"
              >
                {mode === "camera" ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className={cn(
                        "h-full w-full object-cover transition duration-500",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {!active && (
                      <div className="absolute inset-0 grid place-items-center bg-slate-950/80 text-center text-sm text-slate-200">
                        <p className="text-lg font-semibold">Camera chưa hoạt động</p>
                        <p className="mt-2 text-sm text-slate-300">
                          Cho phép camera và mở chế độ live try-on.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 overflow-hidden text-left">
                    <img
                      src={stageSrc ?? "/images/product-1.jpg"}
                      alt={previewLabel}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  </div>
                )}

                {active && faceBox && (
                  <div
                    className="pointer-events-none absolute rounded-2xl border border-primary/70 bg-primary/10"
                    style={activeOverlayStyle}
                  />
                )}

                {(active || stageSrc) && (
                  <motion.img
                    key={`${frame.id}-${frameColor.id}-${lensEffect.id}`}
                    src={frame.image}
                    alt={frame.name}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    className="pointer-events-none absolute left-1/2 select-none"
                    style={baseGlassesStyle}
                  />
                )}

                <div className="pointer-events-none absolute inset-x-0 top-4 z-10 mx-4 rounded-3xl border border-white/10 bg-black/30 p-3 text-white/90 backdrop-blur-sm shadow-lg sm:mx-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-white/70">
                    <span>{previewLabel}</span>
                    <span>{lensEffect.label}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 z-10 rounded-3xl border border-white/10 bg-black/60 p-3 text-sm text-white/90 shadow-lg backdrop-blur-sm">
                  <p className="font-semibold">{frame.name}</p>
                  <p className="text-xs text-slate-300">{formatVnd(currentProduct.price)}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-white/5">
                  <p className="text-sm font-semibold text-slate-900">Tư vấn dáng kính</p>
                  <p className="mt-2 text-sm text-slate-600">{faceAdvice}</p>
                </div>
                <div className="rounded-3xl bg-card p-4 text-center shadow-sm ring-1 ring-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Kích cỡ</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{sizeOption}</p>
                  <p className="text-xs text-slate-500">PD {pd} mm</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="default"
                onClick={startCamera}
                disabled={mode !== "camera" || loadingCamera}
              >
                <Video className="mr-2 h-4 w-4" /> Mở camera
              </Button>
              <Button variant="secondary" onClick={autoAlign} disabled={!faceDetected}>
                <RefreshCw className="mr-2 h-4 w-4" /> Căn chỉnh tự động
              </Button>
              <Button variant="ghost" onClick={stopCamera}>
                <CameraOff className="mr-2 h-4 w-4" /> Dừng
              </Button>
            </div>

            {(permissionError || uploadHint || faceStatus) && (
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary-foreground">
                <p>{permissionError ?? uploadHint ?? faceStatus}</p>
              </div>
            )}

            {mode === "upload" && (
              <div className="rounded-3xl border border-border bg-background p-4">
                <Label htmlFor="ar-upload" className="block text-sm font-semibold">
                  Tải ảnh selfie lên
                </Label>
                <input
                  id="ar-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                  className="mt-3 w-full rounded-xl border border-border bg-slate-950/5 px-3 py-3 text-sm text-slate-700"
                />
              </div>
            )}

            {mode === "preset" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {PRESET_FACES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPresetFace(item)}
                    className={cn(
                      "group overflow-hidden rounded-[1.5rem] border p-4 text-left transition shadow-sm",
                      item.id === presetFace.id
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-white/80 hover:border-primary",
                    )}
                  >
                    <div className="mb-3 h-36 overflow-hidden rounded-3xl bg-slate-950">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.shape}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-[2rem] border border-border bg-card p-5 shadow-inner">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Chọn kích thước</p>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSizeOption(option.id)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-semibold transition",
                          sizeOption === option.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-slate-700 hover:border-primary",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Hiệu ứng tròng</p>
                  <div className="grid gap-2">
                    {LENS_EFFECTS.map((effect) => (
                      <button
                        key={effect.id}
                        type="button"
                        onClick={() => setLensEffect(effect)}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left text-sm transition",
                          lensEffect.id === effect.id
                            ? "border-primary bg-primary-soft"
                            : "border-border bg-background hover:border-primary",
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>{effect.label}</span>
                          <span className="text-xs text-muted-foreground">{effect.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-[2rem] border border-border bg-white/90 p-5 shadow-lg">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold">Chỉnh PD & vị trí</span>
                <span className="text-slate-500">{pd} mm</span>
              </div>
              <input
                type="range"
                min={54}
                max={74}
                value={pd}
                onChange={(event) => setPd(Number(event.target.value))}
                className="w-full accent-primary"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Giãn</p>
                  <p className="mt-2 text-lg font-semibold">{width}%</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Ngang</p>
                  <p className="mt-2 text-lg font-semibold">{top}%</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Nghiêng</p>
                  <p className="mt-2 text-lg font-semibold">{rotate}°</p>
                </div>
              </div>
            </div>

            {shot && (
              <div className="mt-6 rounded-[2rem] border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">So sánh trước / sau</p>
                    <p className="text-xs text-muted-foreground">
                      Di chuyển thanh để thấy hiệu ứng đeo kính.
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                    {beforeAfter}%
                  </span>
                </div>
                <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-border bg-slate-950">
                  <div className="relative h-64">
                    <img
                      src={currentPreview ?? "/images/product-1.jpg"}
                      alt="Trước khi đeo"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                      className="absolute inset-y-0 left-0 overflow-hidden"
                      style={{ width: `${beforeAfter}%` }}
                    >
                      <img
                        src={shot}
                        alt="Sau khi đeo"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={beforeAfter}
                  onChange={(event) => setBeforeAfter(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Layers className="h-4 w-4" />
              <span>Chọn gọng kính</span>
            </div>
            <div className="mt-5 grid gap-3">
              {AR_FRAMES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFrame(item)}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-3xl border px-4 py-3 text-left transition",
                    item.id === frame.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-2xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {item.material} · {item.size}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{formatVnd(item.price)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Layers className="h-4 w-4" />
              <span>Gói trải nghiệm AR</span>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Sản phẩm
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">{frame.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {frame.material} • {frame.size}
                </p>
                <p className="mt-3 text-2xl font-semibold text-primary">{formatVnd(frame.price)}</p>
              </div>

              <div className="rounded-3xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Gợi ý phù hợp
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{faceShape ?? "Chưa xác định"}</p>
                    <p className="text-sm text-slate-500">{faceAdvice}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Tùy chọn nhanh
                </p>
                <div className="mt-3 space-y-3">
                  <button
                    type="button"
                    onClick={() => setLensEffect(LENS_EFFECTS[0]!)}
                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-left text-sm hover:border-primary"
                  >
                    Tròng trong
                  </button>
                  <button
                    type="button"
                    onClick={() => setLensEffect(LENS_EFFECTS[1]!)}
                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-left text-sm hover:border-primary"
                  >
                    Chống ánh sáng xanh
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Mua hàng ngay</p>
            <p className="mt-2 text-sm text-slate-500">Giữ nguyên preview khi mở checkout.</p>
            <div className="mt-4 grid gap-3">
              <Button className="w-full" onClick={addToCart}>
                <ShoppingBag className="mr-2 h-4 w-4" /> Thêm vào giỏ hàng
              </Button>
              <Button className="w-full" variant="primary" onClick={buyNow}>
                Mua ngay
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/dat-lich" search={{ frame: frame.name }}>
                  Đặt lịch đo mắt
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Quyền riêng tư & hiệu năng</span>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Ảnh xử lý ngay trên thiết bị.</li>
              <li>Không lưu camera mà không có quyền.</li>
              <li>Chế độ preset có thể dùng khi không có camera.</li>
            </ul>
          </div>
        </aside>
      </div>

      <CheckoutModal
        item={checkout}
        open={checkout !== null}
        onOpenChange={(open) => !open && setCheckout(null)}
      />
    </>
  );
}
