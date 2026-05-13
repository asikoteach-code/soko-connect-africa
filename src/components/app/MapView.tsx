import { useMemo, useState } from "react";
import {
  BadgeCheck,
  MapPin,
  MessageCircle,
  Navigation,
  Plus,
  Minus,
  Locate,
  X,
  Sparkles,
} from "lucide-react";
import { formatPrice, type Product } from "@/lib/mock-data";
import { Link } from "@tanstack/react-router";

export type MapPin = Product & { distanceKm: number; x: number; y: number };

// Deterministic pseudo-random scatter from product id
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
export function withGeo(p: Product): MapPin {
  const h = hash(p.id);
  const x = 12 + ((h % 76) | 0); // 12-88%
  const y = 18 + (((h >> 4) % 60) | 0); // 18-78%
  const distanceKm = +(0.4 + ((h >> 8) % 50) / 10).toFixed(1); // 0.4 - 5.4
  return { ...p, x, y, distanceKm };
}

export function MapView({
  pins,
  city = "Nairobi",
  onClose,
}: {
  pins: MapPin[];
  city?: string;
  onClose?: () => void;
}) {
  const [active, setActive] = useState<string | null>(pins[0]?.id ?? null);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<"All" | "Verified" | "New" | "Used" | "Cheapest" | "Fast">(
    "All",
  );
  const [radius, setRadius] = useState(5);

  const filtered = useMemo(() => {
    let list = pins.filter((p) => p.distanceKm <= radius);
    if (filter === "Verified") list = list.filter((p) => p.seller.verified);
    if (filter === "New") list = list.filter((p) => p.condition === "New");
    if (filter === "Used") list = list.filter((p) => p.condition === "Used");
    if (filter === "Cheapest") list = [...list].sort((a, b) => a.price - b.price);
    return list;
  }, [pins, filter, radius]);

  const activePin = filtered.find((p) => p.id === active) ?? filtered[0];

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      {/* Map canvas */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, oklch(0.95 0.04 180) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, oklch(0.94 0.05 80) 0%, transparent 55%), linear-gradient(160deg, oklch(0.97 0.01 200), oklch(0.93 0.02 150))",
        }}
      >
        {/* Faux roads + grid */}
        <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.85 0.02 200)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <path
            d="M0,200 Q200,150 400,260 T800,280"
            stroke="oklch(0.82 0.03 180)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M120,0 Q180,300 90,600"
            stroke="oklch(0.82 0.03 180)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M0,420 Q300,400 700,500"
            stroke="oklch(0.85 0.03 60)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Pins */}
        <div
          className="absolute inset-0 transition-transform duration-500"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* You-are-here */}
          <div
            className="absolute"
            style={{ left: "50%", top: "55%", transform: "translate(-50%,-50%)" }}
          >
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-primary ring-4 ring-primary/30" />
            </span>
          </div>

          {filtered.map((p, i) => {
            const isActive = p.id === active;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`absolute -translate-x-1/2 -translate-y-full transition-all duration-300 ${
                  isActive ? "z-20 scale-110" : "z-10 hover:scale-105"
                }`}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  animation: `fade-in 0.5s ease-out ${i * 60}ms both`,
                }}
              >
                <div
                  className={`flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full shadow-elevated ring-2 transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground ring-white"
                      : "bg-card text-foreground ring-white/80"
                  }`}
                >
                  <span className="h-7 w-7 rounded-full overflow-hidden ring-2 ring-white/80 bg-muted">
                    <img src={p.image} alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="text-[11px] font-bold whitespace-nowrap">
                    {p.currency} {(p.price / 1000).toFixed(0)}k
                  </span>
                  {p.seller.verified && (
                    <BadgeCheck
                      className={`h-3 w-3 ${isActive ? "text-white" : "text-primary"}`}
                    />
                  )}
                </div>
                <div
                  className={`mx-auto h-2 w-2 -mt-0.5 rotate-45 ${
                    isActive ? "bg-primary" : "bg-card"
                  } ring-2 ring-white/80`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 p-3 flex items-center gap-2">
        <button
          onClick={onClose}
          className="h-11 w-11 grid place-items-center rounded-full bg-card/95 backdrop-blur shadow-elevated active:scale-95"
          aria-label="Close map"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex-1 bg-card/95 backdrop-blur rounded-full shadow-elevated px-4 py-2.5 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-none">Showing near</p>
            <p className="text-sm font-bold leading-tight truncate">{city} · {radius}km radius</p>
          </div>
        </div>
        <button
          className="h-11 w-11 grid place-items-center rounded-full bg-card/95 backdrop-blur shadow-elevated active:scale-95"
          aria-label="Recenter"
        >
          <Locate className="h-5 w-5 text-primary" />
        </button>
      </div>

      {/* Filter chips */}
      <div className="absolute top-[68px] inset-x-0 px-3 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(["All", "Verified", "New", "Used", "Cheapest", "Fast"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur shadow-card transition ${
                filter === f
                  ? "bg-foreground text-background"
                  : "bg-card/90 text-foreground"
              }`}
            >
              {f === "Fast" ? "⚡ Fast delivery" : f}
            </button>
          ))}
          <div className="shrink-0 inline-flex items-center gap-1 bg-card/90 backdrop-blur shadow-card rounded-full pl-2 pr-1 py-1">
            <span className="text-[11px] font-semibold">{radius}km</span>
            <input
              type="range"
              min={1}
              max={10}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-20 accent-primary"
              aria-label="Radius"
            />
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col bg-card/95 backdrop-blur rounded-2xl shadow-elevated overflow-hidden">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.15, 1.6))}
          className="h-10 w-10 grid place-items-center active:bg-muted"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div className="h-px bg-border" />
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.7))}
          className="h-10 w-10 grid place-items-center active:bg-muted"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom carousel + active mini-card */}
      <div className="absolute bottom-0 inset-x-0 pb-4">
        {activePin && (
          <div className="px-3 mb-3 animate-fade-in" key={activePin.id}>
            <div className="bg-card rounded-3xl shadow-elevated ring-1 ring-border overflow-hidden">
              <div className="flex gap-3 p-3">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-muted shrink-0">
                  <img
                    src={activePin.image}
                    alt={activePin.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display font-bold text-[15px] leading-tight line-clamp-2">
                      {activePin.title}
                    </p>
                    {activePin.condition && (
                      <span
                        className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          activePin.condition === "New"
                            ? "bg-success/15 text-success"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {activePin.condition}
                      </span>
                    )}
                  </div>
                  <p className="text-[15px] font-bold text-primary mt-0.5">
                    {formatPrice(activePin.price, activePin.currency)}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Navigation className="h-3 w-3" /> {activePin.distanceKm} km
                    </span>
                    <span>·</span>
                    <span className="truncate">{activePin.seller.name}</span>
                    {activePin.seller.verified && (
                      <BadgeCheck className="h-3 w-3 text-primary shrink-0" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 px-3 pb-3">
                <Link
                  to="/chat/$id"
                  params={{ id: activePin.seller.id }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-muted text-foreground font-semibold text-sm py-2.5 rounded-xl active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4" /> Message
                </Link>
                <Link
                  to="/product/$id"
                  params={{ id: activePin.id }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-xl shadow-card active:scale-[0.98]"
                >
                  View deal
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="px-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/80 bg-card/90 backdrop-blur px-2.5 py-1 rounded-full shadow-card inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> {filtered.length} near you
            </p>
          </div>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`shrink-0 w-[160px] text-left bg-card rounded-2xl shadow-card ring-1 transition ${
                  p.id === active ? "ring-primary" : "ring-border"
                } active:scale-[0.98]`}
              >
                <div className="aspect-[4/3] bg-muted rounded-t-2xl overflow-hidden">
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="text-[12px] font-bold leading-tight line-clamp-1">
                    {p.title.split("—")[0]}
                  </p>
                  <p className="text-[12px] font-bold text-primary mt-0.5">
                    {formatPrice(p.price, p.currency)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Navigation className="h-2.5 w-2.5" /> {p.distanceKm} km away
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
