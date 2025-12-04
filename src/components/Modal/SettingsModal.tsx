"use client";

import { useUser } from "@/context/UserContext";
import { levels as staticLevels } from "@/data/levels-data";
import { IS_DEBUG } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { Check, Lock, Plus, RotateCcw, Unlock, User, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
// Import de la librairie Sonner
import { Toaster, toast } from "sonner";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, changeUsername, unlockLevel, resetUser, addCollectibles } =
    useUser();

  const [tempUsername, setTempUsername] = useState(user.username);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempUsername(user.username);
  }, [user.username]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Fonction de sauvegarde avec Toast
  const handleSaveUsername = () => {
    changeUsername(tempUsername);
    toast.success("Profil mis à jour avec succès !", {
      description: `Désormais connu sous : ${tempUsername}`,
      duration: 3000,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300"
      onClick={handleBackdropClick}
    >
      {/* Ajout du Toaster ici avec un z-index élevé pour passer au-dessus du modal */}
      <Toaster
        position="top-center"
        richColors
        theme="dark"
        style={{ zIndex: 9999 }}
      />

      <div
        ref={modalRef}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B1221] shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* --- HEADER SIMPLE --- */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0B1221] px-6 py-4">
          <h2 className="text-lg font-bold uppercase tracking-widest text-white">
            Paramètres
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="overflow-y-auto p-6 flex flex-col gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {/* 1. PROFIL (Minimaliste) */}
          <section className="flex gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-[#00E5FF]">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-4 font-bold text-white focus:border-[#00E5FF] focus:outline-none"
                placeholder="Pseudo..."
              />
              <button
                onClick={handleSaveUsername}
                className="rounded-lg bg-[#00E5FF] px-4 font-bold text-[#0B1221] hover:bg-[#6FF7FF] transition-colors"
              >
                OK
              </button>
            </div>
          </section>

          {/* 2. LISTE DES NIVEAUX (Compacte) */}
          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Niveaux & Progression
            </h3>

            {staticLevels.map((level) => {
              const userLevel = user.levels[level.id];
              const isUnlocked = userLevel?.unlocked;
              const isCompleted = userLevel?.completed;

              return (
                <div
                  key={level.id}
                  className="flex flex-col rounded-lg border border-white/5 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between">
                    {/* Info Niveau */}
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 overflow-hidden rounded bg-slate-800 shrink-0">
                        <Image
                          src={level.image}
                          alt={level.name}
                          fill
                          className="object-cover opacity-80"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-bold",
                              isUnlocked ? "text-white" : "text-slate-500"
                            )}
                          >
                            {level.name}
                          </span>
                          {/* Badges d'état */}
                          {isCompleted && (
                            <Check className="h-3 w-3 text-green-500" />
                          )}
                          {!isUnlocked && (
                            <Lock className="h-3 w-3 text-slate-600" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {userLevel?.collected ?? 0}/{level.collectibles}{" "}
                          collectibles
                        </div>
                      </div>
                    </div>

                    {/* Actions Debug (Visible uniquement en mode Debug) */}
                    {IS_DEBUG && (
                      <div className="flex items-center gap-2">
                        {/* Bouton Unlock manuel (Retirer le lock) */}
                        {!isUnlocked && (
                          <button
                            onClick={() => {
                              unlockLevel(level.id);
                              toast.success(`Niveau ${level.name} débloqué !`);
                            }}
                            className="flex items-center gap-1 rounded bg-green-500/20 px-2 py-1 text-[10px] font-bold text-green-400 hover:bg-green-500 hover:text-black transition-colors"
                            title="Retirer le verrou (Débloquer)"
                          >
                            <Unlock className="h-3 w-3" />
                            Ouvrir
                          </button>
                        )}

                        {/* Boutons +Collectibles */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              addCollectibles(level.id, 1);
                              toast.info("+1 Collectible ajouté");
                            }}
                            className="flex items-center gap-1 rounded bg-orange-500/20 px-2 py-1 text-[10px] font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition-colors"
                            title="Ajouter 1 collectible"
                          >
                            <Plus className="h-3 w-3" />1
                          </button>
                          <button
                            onClick={() => {
                              addCollectibles(level.id, 5);
                              toast.info("+5 Collectibles ajoutés");
                            }}
                            className="flex items-center gap-1 rounded bg-orange-500/20 px-2 py-1 text-[10px] font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition-colors"
                            title="Ajouter 5 collectibles"
                          >
                            <Plus className="h-3 w-3" />5
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* 3. DANGER ZONE (Footer) */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <button
              onClick={() => {
                if (confirm("Tout effacer et recommencer à zéro ?")) {
                  resetUser();
                  toast.error("Progression réinitialisée à zéro.");
                  onClose();
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-3 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
            >
              <RotateCcw className="h-3 w-3" />
              RÉINITIALISER TOUTE MA PROGRESSION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
