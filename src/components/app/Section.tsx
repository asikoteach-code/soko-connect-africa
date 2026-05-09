import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function SectionHeader({
  title,
  action,
  to,
}: {
  title: string;
  action?: string;
  to?: string;
}) {
  return (
    <div className="flex items-end justify-between px-5 mt-6 mb-3">
      <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
      {action && to && (
        <Link to={to as "/"} className="text-xs font-semibold text-primary">
          {action} →
        </Link>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6">
      <div className="mx-auto h-20 w-20 rounded-3xl bg-primary-soft text-primary grid place-items-center">
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg mt-5">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
