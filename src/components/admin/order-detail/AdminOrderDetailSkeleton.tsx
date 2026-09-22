import React from "react";

const Block = ({ className }: { className: string }) => <div className={`rounded-lg bg-muted/60 ${className}`} />;

export function AdminOrderDetailSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse" aria-label="Loading order details" role="status">
      <div className="flex items-center justify-between"><Block className="h-4 w-32" /><Block className="h-4 w-28" /></div>
      <div className="rounded-3xl bg-card border border-border/70 shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-7 border-b border-border/50 bg-muted/15 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div className="space-y-3"><Block className="h-9 w-52" /><Block className="h-4 w-64" /></div><div className="flex gap-2.5"><Block className="h-10 w-32" /><Block className="h-10 w-28" /></div></div>
          <div className="rounded-2xl border border-border/50 p-4 space-y-3"><Block className="h-4 w-36" /><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[1, 2, 3, 4].map((item) => <Block key={item} className="h-10 w-full" />)}</div></div>
          <Block className="h-14 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-7 space-y-5"><div className="flex justify-between"><Block className="h-5 w-32" /><Block className="h-5 w-20" /></div><div className="space-y-4">{[1, 2, 3].map((item) => <div key={item} className="flex gap-3 border-b border-border/40 pb-4"><Block className="h-16 w-16 shrink-0" /><div className="flex-1 space-y-2"><Block className="h-4 w-3/4" /><Block className="h-3 w-1/2" /></div><Block className="h-4 w-16" /></div>)}</div><div className="ml-auto max-w-xs space-y-3 pt-2"><Block className="h-4 w-full" /><Block className="h-4 w-full" /><Block className="h-6 w-full" /></div></div>
          <div className="lg:col-span-5 p-4 sm:p-6 lg:p-7 space-y-5"><div className="rounded-2xl bg-muted/25 p-4 space-y-3"><Block className="h-5 w-36" /><Block className="h-4 w-48" /><Block className="h-4 w-36" /></div><div className="rounded-2xl bg-muted/25 p-4 space-y-3"><Block className="h-5 w-40" /><Block className="h-4 w-full" /><Block className="h-4 w-4/5" /></div><div className="rounded-2xl bg-muted/25 p-4 space-y-3"><Block className="h-5 w-32" /><Block className="h-10 w-full" /><Block className="h-10 w-full" /></div></div>
        </div>
      </div>
    </div>
  );
}
