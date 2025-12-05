"use client";

import { useUser } from "@/context/UserContext";
import { levels } from "@/data/levels-data";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export function CollectiblesCounter() {
  const { user } = useUser();

  const completedLevelsCount = Object.values(user.levels).filter(
    (level) => level.completed
  ).length;

  const totalLevels = levels.length;

  const formattedCompleted = completedLevelsCount.toString().padStart(2, "0");
  const formattedTotal = totalLevels.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B1221]/80 px-5 py-3 shadow-lg backdrop-blur-md transition-all hover:border-[#00E5FF]/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]">
      {/* Icône Trophée avec effet néon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-[0_0_15px_rgba(255,215,0,0.4)]">
        <Trophy className="h-5 w-5 fill-current" />
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Niveaux Complétés
        </span>

        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-black text-white tabular-nums">
            {formattedCompleted}
          </span>
          <span className="text-sm font-bold text-slate-600">
            / {formattedTotal}
          </span>
        </div>
      </div>
    </div>
  );
}
