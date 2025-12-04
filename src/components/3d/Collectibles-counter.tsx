"use client";

import { Star } from "lucide-react";

interface CollectiblesCounterProps {
  total: number;
  label?: string;
}

export function CollectiblesCounter({
  total,
  label = "Total",
}: CollectiblesCounterProps) {
  // (ex: 005)
  const formattedTotal = total.toString().padStart(3, "0");

  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-primary/30 bg-card/80 px-6 py-4 shadow-2xl backdrop-blur-md transition-colors hover:border-primary/50">
      <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <Star className="h-5 w-5 fill-current" />
        </div>

        <span className="font-mono text-3xl font-black tabular-nums text-foreground">
          {formattedTotal}
        </span>
      </div>
    </div>
  );
}
