"use client";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import type { Level } from "@/types/types";
import { ArrowRight, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LevelPreviewProps {
  level: Level;
}

export function LevelPreview({ level }: LevelPreviewProps) {
  const { isLevelUnlocked, unlockLevel } = useUser();

  const router = useRouter();

  const percentage =
    level.collectibles > 0
      ? Math.min(100, Math.max(0, (level.collected / level.collectibles) * 100))
      : 0;

  const isUnlocked = isLevelUnlocked(level.id);

  const isLocked = !isUnlocked;

  return (
    <div
      className={cn(
        " group relative w-[400px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0B1221]/95 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,180,216,0.2)]",
        isLocked && "border-slate-800 bg-[#0B1221]/95 grayscale blur-[1px]"
      )}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-[32px]">
        <Image
          src={level.image || "/placeholder.svg"}
          alt={level.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-transparent to-transparent" />

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-600 bg-black/50 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <Lock className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-6 z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00E5FF]">
            <span>ZONE {level.difficulty}</span>
            <span className="h-1 w-1 rounded-full bg-white/50" />
            <span>SECTEUR SOLAIRE</span>
          </div>
          <h2 className="mt-1 text-3xl font-black text-white drop-shadow-lg">
            {level.name}
          </h2>
        </div>
      </div>

      <div className="p-6">
        <p className="mb-6 text-sm leading-relaxed text-slate-400">
          {level.description}
        </p>

        <div className="mb-6">
          <div className="mb-2 flex items-end justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Collectibles
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-white">
                {level.collected}
              </span>
              <span className="text-sm font-bold text-slate-600">
                / {level.collectibles}
              </span>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF9F1C] to-[#FF4B1F] shadow-[0_0_10px_rgba(255,75,31,0.5)] transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <button
          className={cn(
            " group/btn relative w-full overflow-hidden rounded-xl bg-[#0066FF] py-4 text-center font-bold text-white transition-all hover:bg-[#0052CC] hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] active:scale-[0.98]",
            isLocked &&
              "cursor-not-allowed bg-slate-800 text-slate-500 hover:shadow-none hover:bg-slate-800"
          )}
          onClick={() => {
            router.push(`/niveau/${level.id}`);
          }}
        >
          <span
            className={cn(
              "relative z-10 flex items-center justify-center gap-2"
            )}
          >
            EXPLORER{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </span>
        </button>
      </div>
    </div>
  );
}
