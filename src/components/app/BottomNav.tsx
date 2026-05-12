import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Home,
  Search,
  Plus,
  MessageCircle,
  User,
  Tag,
  Briefcase,
  Wrench,
  Users,
  Rocket,
  X,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof Home };
const items: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/chat", label: "Chats", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
];

type FabAction = {
  to: string;
  label: string;
  icon: typeof Tag;
  tint: string;
};

const fabActions: FabAction[] = [
  { to: "/post", label: "Sell Product", icon: Tag, tint: "bg-gradient-primary text-primary-foreground" },
  { to: "/post", label: "Offer Service", icon: Wrench, tint: "bg-accent text-accent-foreground" },
  { to: "/post", label: "Post Job", icon: Briefcase, tint: "bg-gold text-gold-foreground" },
  { to: "/jobs", label: "Find Worker", icon: Users, tint: "bg-primary-soft text-primary" },
  { to: "/wallet", label: "Boost Listing", icon: Rocket, tint: "bg-foreground text-background" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const left = items.slice(0, 2);
  const right = items.slice(2);

  return (
    <>
      {/* Backdrop + radial menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-foreground/40 backdrop-blur-md"
          aria-label="Close menu"
        />

        {/* Semi-circle arc menu anchored above the FAB */}
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md">
          {/* Hint label */}
          <p
            className={`absolute left-1/2 -translate-x-1/2 bottom-[360px] whitespace-nowrap rounded-full bg-card/90 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shadow-card transition-all duration-300 ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            What do you want to do?
          </p>

          {/* Arc container — pivot point sits roughly at FAB center, lifted above bottom nav */}
          <div className="relative mx-auto h-[340px] w-full max-w-[380px] px-2">
            {fabActions.map(({ to, label, icon: Icon, tint }, i) => {
              const total = fabActions.length;
              // Wider arc: 200° spread for spacious distribution
              const startDeg = -190;
              const endDeg = -10;
              const t = total === 1 ? 0.5 : i / (total - 1);
              const angle = (startDeg + (endDeg - startDeg) * t) * (Math.PI / 180);
              // Responsive radius scales with viewport (~32% larger than before)
              const x = `calc(cos(${angle}rad) * clamp(140px, 42vw, 165px))`;
              const y = `calc(sin(${angle}rad) * clamp(140px, 42vw, 165px))`;

              return (
                <Link
                  key={label}
                  to={to as "/post"}
                  onClick={() => setOpen(false)}
                  aria-label={label}
                  style={{
                    left: "50%",
                    bottom: "100px",
                    transform: open
                      ? `translate(calc(-50% + ${x}), ${y}) scale(1)`
                      : `translate(-50%, 0) scale(0.4)`,
                    opacity: open ? 1 : 0,
                    transitionDelay: open ? `${i * 70}ms` : `${(total - i) * 25}ms`,
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    animation: open ? `float-soft 4s ease-in-out ${i * 0.2}s infinite` : "none",
                  }}
                  className="absolute flex flex-col items-center gap-2 transition-all duration-[600ms] will-change-transform"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${tint} shadow-elevated ring-1 ring-white/40 backdrop-blur-xl active:scale-90 transition-transform`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.4} />
                  </span>
                  <span className="rounded-full bg-card/95 backdrop-blur px-3 py-1 text-[11px] font-semibold text-foreground shadow-card whitespace-nowrap max-w-[130px] text-center">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 mx-auto max-w-md border-t border-border bg-surface/95 backdrop-blur-lg safe-bottom">
        <ul className="grid grid-cols-5 items-end px-2 pt-2">
          {left.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <li key={to}>
                <Link
                  to={to as "/"}
                  className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}

          {/* Center FAB */}
          <li className="flex justify-center -mt-6">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close create menu" : "Open create menu"}
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elevated transition-all duration-300 active:scale-90 ${
                open ? "rotate-45 scale-105" : "rotate-0"
              }`}
            >
              {/* pulse ring */}
              <span
                className={`absolute inset-0 rounded-2xl bg-primary/30 transition-all duration-500 ${
                  open ? "scale-150 opacity-0" : "scale-100 opacity-0 animate-pulse"
                }`}
              />
              {open ? (
                <X className="h-6 w-6 -rotate-45" strokeWidth={2.6} />
              ) : (
                <Plus className="h-6 w-6" strokeWidth={2.6} />
              )}
            </button>
          </li>

          {right.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <li key={to}>
                <Link
                  to={to as "/"}
                  className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
