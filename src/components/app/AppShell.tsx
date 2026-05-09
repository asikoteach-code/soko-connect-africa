import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({
  children,
  hideNav = false,
  className = "",
}: {
  children: ReactNode;
  hideNav?: boolean;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className={`mx-auto max-w-md ${hideNav ? "pb-0" : "pb-24"} ${className}`}>
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}
