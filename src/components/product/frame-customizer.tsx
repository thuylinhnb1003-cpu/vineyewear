import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { cn } from "@/lib/utils";

export const FRAME_COLORS = [
  { id: "black", label: "Đen classic", hex: "#1a1a1a" },
  { id: "tortoise", label: "Nâu đồi mồi", hex: "#7a4a1e" },
  { id: "gold", label: "Vàng kim", hex: "#c9a227" },
  { id: "silver", label: "Bạc titan", hex: "#b9bcc2" },
  { id: "orange", label: "Cam Vin", hex: "#ff6600" },
] as const;

export const LENS_TYPES = [
  { id: "clear", label: "Tròng trong", color: "#e8f1f7", opacity: 0.25, roughness: 0.05 },
  {
    id: "photochromic",
    label: "Đổi màu (photochromic)",
    color: "#6b5f8a",
    opacity: 0.55,
    roughness: 0.08,
  },
  {
    id: "polarized",
    label: "Chống chói (polarized)",
    color: "#2f3a46",
    opacity: 0.7,
    roughness: 0.02,
  },
  { id: "blue", label: "Chống ánh sáng xanh", color: "#c9d8ff", opacity: 0.32, roughness: 0.06 },
] as const;

type Lens = (typeof LENS_TYPES)[number];

function Glasses({ frameColor, lens }: { frameColor: string; lens: Lens }) {
  const metal = frameColor === "#c9a227" || frameColor === "#b9bcc2";
  return (
    <group rotation={[0.1, 0.5, 0]}>
      {[-0.85, 0.85].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.68, 0.075, 20, 48]} />
            <meshStandardMaterial
              color={frameColor}
              metalness={metal ? 0.9 : 0.25}
              roughness={metal ? 0.25 : 0.45}
            />
          </mesh>
          <mesh>
            <circleGeometry args={[0.66, 48]} />
            <meshPhysicalMaterial
              color={lens.color}
              transparent
              opacity={lens.opacity}
              roughness={lens.roughness}
              metalness={0.1}
              side={2}
            />
          </mesh>
        </group>
      ))}

      {/* Cầu kính */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.36, 0.08, 0.08]} />
        <meshStandardMaterial color={frameColor} metalness={metal ? 0.9 : 0.25} roughness={0.4} />
      </mesh>

      {/* Càng kính */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 0.18, -0.6]} rotation={[0, x > 0 ? -0.35 : 0.35, 0]}>
          <boxGeometry args={[0.07, 0.08, 1.5]} />
          <meshStandardMaterial color={frameColor} metalness={metal ? 0.9 : 0.25} roughness={0.4} />
        </mesh>
      ))}

      <ContactShadows position={[0, -0.95, 0]} opacity={0.35} blur={2.4} scale={6} far={2} />
    </group>
  );
}

/** Tùy biến gọng 3D: đổi màu gọng và loại tròng ngay trên model (three.js + R3F + drei). */
export function FrameCustomizer() {
  const [color, setColor] = React.useState<string>(FRAME_COLORS[0].hex);
  const [lensId, setLensId] = React.useState<string>(LENS_TYPES[0].id);
  const lens = LENS_TYPES.find((l) => l.id === lensId) ?? LENS_TYPES[0];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-secondary">
        <Canvas camera={{ position: [0, 0.5, 4.2], fov: 42 }} className="aspect-square w-full">
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 4, 5]} intensity={1.6} />
          <directionalLight position={[-4, -2, -3]} intensity={0.5} />
          <Glasses frameColor={color} lens={lens} />
          <OrbitControls enablePan={false} minDistance={2.6} maxDistance={6.5} />
        </Canvas>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Màu gọng</p>
        <div className="flex flex-wrap gap-2">
          {FRAME_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setColor(c.hex)}
              aria-label={c.label}
              aria-pressed={color === c.hex}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition",
                color === c.hex ? "border-primary ring-2 ring-primary/30" : "border-border",
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Loại tròng</p>
        <div className="flex flex-wrap gap-2">
          {LENS_TYPES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLensId(l.id)}
              aria-pressed={lensId === l.id}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm font-medium transition",
                lensId === l.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input text-muted-foreground hover:text-foreground",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-caption">
        Kéo để xoay model, cuộn để phóng to. Màu và loại tròng chỉ mang tính minh hoạ hiển thị.
      </p>
    </div>
  );
}

export default FrameCustomizer;
