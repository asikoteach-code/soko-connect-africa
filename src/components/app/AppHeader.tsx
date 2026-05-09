import { Link } from "@tanstack/react-router";
import { Bell, Bookmark, Search, MapPin, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-hero text-primary-foreground rounded-b-3xl shadow-elevated">
      <div className="px-5 pt-5 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium opacity-75 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Nairobi, Kenya
            </p>
            <h1 className="font-display text-2xl font-extrabold mt-0.5">
              Karibu, Amina <span className="opacity-90">👋</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/saved"
              className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/15 grid place-items-center"
              aria-label="Saved"
            >
              <Bookmark className="h-5 w-5" />
            </Link>
            <Link
              to="/notifications"
              className="relative h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/15 grid place-items-center"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold" />
            </Link>
          </div>
        </div>

        <Link
          to="/search"
          className="mt-5 flex items-center gap-3 bg-surface text-foreground rounded-2xl px-4 py-3.5 shadow-card"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground flex-1">
            Search products, jobs, services…
          </span>
          <span className="text-[10px] font-semibold bg-gold/20 text-gold-foreground px-2 py-1 rounded-md">
            AI
          </span>
        </Link>
      </div>
    </header>
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
