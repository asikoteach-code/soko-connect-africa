import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type ThemeMode = "system" | "light" | "dark";
const STORAGE_KEY = "soko-theme";

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(mode);
  document.documentElement.dataset.theme = resolved;
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = (typeof localStorage !== "undefined" &&
      (localStorage.getItem(STORAGE_KEY) as ThemeMode | null)) || "system";
    setMode(stored);
    applyTheme(stored);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || "system";
      if (current === "system") applyTheme("system");
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const set = (m: ThemeMode) => {
    setMode(m);
    try { localStorage.setItem(STORAGE_KEY, m); } catch {}
    applyTheme(m);
  };

  const options: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
    { value: "system", label: "System", Icon: Monitor },
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
  ];

  return (
    <div className="bg-card rounded-2xl shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold">Appearance</p>
          <p className="text-xs text-muted-foreground">Choose how Soko looks</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl">
        {options.map(({ value, label, Icon }) => {
          const active = mode === value;
          return (
            <button
              key={value}
              onClick={() => set(value)}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "text-muted-foreground active:scale-95"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
