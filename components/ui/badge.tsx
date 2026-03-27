import { cn } from "@/lib/utils";

export function Badge({
  children,
  className
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <span
      className={cn(
        "admin-badge inline-flex items-center rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600",
        className
      )}
    >
      {children}
    </span>
  );
}
