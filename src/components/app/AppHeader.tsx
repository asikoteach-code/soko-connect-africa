import { Link } from "@tanstack/react-router";
import { Bell, Bookmark, MapPin, ChevronLeft, Mic, SlidersHorizontal, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function HomeHeader() {
  return (
    <div className="relative">
      <header className="bg-gradient-hero text-primary-foreground rounded-b-[2rem] shadow-elevated pb-10">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-medium opacity-75 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Nairobi, Kenya
              </p>
              <h1 className="font-display text-[19px] leading-tight font-extrabold mt-1 truncate">
                Karibu, Amina <span className="opacity-90">👋</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/saved"
                className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 transition grid place-items-center"
                aria-label="Saved"
              >
                <Bookmark className="h-[18px] w-[18px]" />
              </Link>
              <Link
                to="/notifications"
                className="relative h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 transition grid place-items-center"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold ring-2 ring-[oklch(0.32_0.09_165)]" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Floating AI search card — overlaps header, sticky on scroll */}
      <div className="sticky top-2 z-30 px-4 -mt-7 animate-fade-in">
        <Link
          to="/search"
          className="group flex items-center gap-2.5 bg-card text-foreground rounded-[24px] pl-3 pr-2 py-2.5 shadow-elevated border border-border/60 backdrop-blur-md transition active:scale-[0.99]"
        >
          <span className="h-9 w-9 rounded-2xl bg-gradient-primary grid place-items-center shrink-0 shadow-card">
            <Sparkles className="h-[18px] w-[18px] text-primary-foreground" />
          </span>
          <span className="text-[13px] text-muted-foreground flex-1 truncate font-medium">
            Search products, jobs, services with AI...
          </span>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="h-9 w-9 rounded-2xl hover:bg-muted grid place-items-center shrink-0 transition"
            aria-label="Voice search"
          >
            <Mic className="h-[18px] w-[18px] text-primary" />
          </button>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="h-9 w-9 rounded-2xl bg-primary-soft text-primary grid place-items-center shrink-0 transition hover:bg-primary hover:text-primary-foreground"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-[16px] w-[16px]" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  back = "/",
  right,
}: {
  title: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-3 h-14">
        <Link
          to={back as "/"}
          className="h-10 w-10 grid place-items-center rounded-xl hover:bg-muted active:scale-95 transition"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-base font-bold truncate">{title}</h1>
        <div className="h-10 w-10 grid place-items-center">{right}</div>
      </div>
    </header>
  );
}
