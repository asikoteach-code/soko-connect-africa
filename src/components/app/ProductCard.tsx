import { Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { formatPrice, type Product } from "@/lib/mock-data";

export function ProductCard({ p, compact = false }: { p: Product; compact?: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="group block bg-card rounded-2xl overflow-hidden shadow-card active:scale-[0.98] transition"
    >
      <div className={`relative ${compact ? "aspect-square" : "aspect-[4/3]"} bg-muted overflow-hidden`}>
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
        />
        {p.boosted && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-gradient-gold text-gold-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-gold">
            <Sparkles className="h-3 w-3" /> Boosted
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setSaved((s) => !s);
          }}
          className="absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full bg-surface/90 backdrop-blur shadow-sm"
          aria-label="Save"
        >
          <Heart
            className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : "text-foreground"}`}
          />
        </button>
      </div>
      <div className="p-3">
        <p className="font-display font-bold text-[15px] leading-snug line-clamp-2 min-h-[40px]">
          {formatPrice(p.price, p.currency)}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{p.title}</p>
        <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{p.location}</span>
          </span>
          {p.seller.verified && (
            <span className="flex items-center gap-0.5 text-primary font-medium">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
