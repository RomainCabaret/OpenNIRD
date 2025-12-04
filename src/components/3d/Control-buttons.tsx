"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Lock, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

interface ControlButtonsProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onSelect: () => void;
  isNavigating: boolean;
  isLocked?: boolean;
}

export function ControlButtons({
  onRotateLeft,
  onRotateRight,
  onSelect,
  isNavigating,
  isLocked = false,
}: ControlButtonsProps) {
  
  const router = useRouter();

  return (
    <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#0B1221]/90 p-2 shadow-2xl backdrop-blur-md">
        {/* NAV Gauche */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRotateLeft}
          disabled={isNavigating}
          className="h-12 w-12 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="mx-2 h-8 w-px bg-white/10 hidden md:block" />

        {/* BTN - SÉLECTIONNER */}
        <Button
          onClick={onSelect}
          disabled={isNavigating || isLocked}
          className={cn(
            "mx-2 h-12 gap-3 rounded-full px-8 font-black shadow-lg transition-all active:scale-95",
            isLocked
              ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700/50"
              : "bg-[#00E5FF] text-[#0B1221] shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:bg-[#6FF7FF] hover:scale-105"
          )}
        >
          {isLocked ? (
            <>
              <Lock className="h-5 w-5 opacity-50" />
              <span className="uppercase tracking-widest text-xs">
                VERROUILLÉ
              </span>
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5 fill-current" />
              <span className="uppercase tracking-widest">SÉLECTIONNER</span>
            </>
          )}
        </Button>

        <div className="mx-2 h-8 w-px bg-white/10 hidden md:block" />

        {/* NAV Droite */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onRotateRight}
          disabled={isNavigating}
          className="h-12 w-12 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
