"use client";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import type { Level } from "@/types/types";
import { ArrowRight, Lock, MapPin, Trophy } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LevelPreviewProps {
  level: Level;
}

export function LevelPreview({ level }: LevelPreviewProps) {
  const { isLevelUnlocked, isLevelCompleted } = useUser();
  const router = useRouter();

  // Pourcentage de collectibles
  const percentage = isLevelCompleted(level.id) ? 100 : 0;

  const isUnlocked = isLevelUnlocked(level.id);
  const isCompleted = isLevelCompleted(level.id);
  const isLocked = !isUnlocked;

  return (
    <div
      className={cn(
        "group relative w-[300px] overflow-hidden rounded-3xl bg-[#0B1221] shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,229,255,0.2)] hover:-translate-y-1",
        // CORRECTION : Suppression de 'opacity-80' pour éviter la transparence du fond
        isLocked && "grayscale hover:shadow-none hover:translate-y-0"
      )}
    >
      {/* --- IMAGE DE FOND (FULL HEIGHT) --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src={level.image || "/placeholder.svg"}
          alt={level.name}
          fill
          className={cn(
            "object-cover transition-transform duration-700 ease-out group-hover:scale-110",
            isLocked && "blur-[2px]"
          )}
        />
        {/* Gradient Overlay : Plus sombre plus vite pour la lisibilité sur petite surface */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/90 to-transparent" />

        {/* Overlay supplémentaire si locked */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        )}
      </div>

      {/* --- CONTENU --- */}
      <div className="relative z-10 p-5 flex flex-col h-full min-h-[340px]">
        {/* HEADER : Badges */}
        <div className="flex justify-between items-start mb-auto">
          {/* Badge Difficulté */}
          <div className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#00E5FF]">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                level.difficulty >= 3 ? "bg-red-500" : "bg-green-500"
              )}
            />
            Zone {level.difficulty}
          </div>

          {/* Cadenas si Locked */}
          {isLocked && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/80 border border-white/10 text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* BODY : Titre & Infos */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-[#00E5FF]" />
            Secteur Solaire
          </div>

          <h2 className="text-2xl font-black text-white leading-none mb-3 drop-shadow-md">
            {level.name}
          </h2>

          <p className="text-xs text-slate-300 line-clamp-2 mb-4 font-medium leading-relaxed">
            {level.description}
          </p>

          {/* Barre de Progression */}
          <div className="mb-4 space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider"></div>

            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF9F1C] to-[#FF4B1F] shadow-[0_0_10px_#FF4B1F]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* BOUTON D'ACTION */}
          <button
            onClick={() => {
              if (!isLocked) router.push(`/niveau/${level.id}`);
            }}
            disabled={isLocked}
            className={cn(
              "w-full py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden",
              isLocked
                ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                : "bg-[#00E5FF] text-[#0B1221] hover:bg-[#6FF7FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            )}
          >
            {isLocked ? (
              <>
                <Lock className="w-3 h-3" /> Verrouillé
              </>
            ) : (
              <>
                Explorer{" "}
                <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
