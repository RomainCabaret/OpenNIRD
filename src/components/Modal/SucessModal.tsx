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
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div
            className={`absolute inset-0 blur-xl opacity-40 rounded-full ${
              gameState === "VICTORY" ? "bg-yellow-500" : "bg-red-500"
            }`}
          ></div>
          {gameState === "VICTORY" ? (
            <Trophy
              size={80}
              className="text-yellow-400 relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
            />
          ) : (
            <AlertTriangle
              size={80}
              className="text-red-500 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]"
            />
          )}
        </div>

        <h2 className="text-5xl font-black text-white tracking-wide mb-2 uppercase drop-shadow-md">
          {gameState === "VICTORY" ? "VICTOIRE !" : "ÉCHEC !"}
        </h2>
        <p
          className={`text-sm tracking-[0.2em] font-medium mb-8 ${
            gameState === "VICTORY" ? "text-green-400" : "text-red-400"
          }`}
        >
          {gameState === "VICTORY"
            ? "TOIT DÉTRUIT - ACCÈS ACCORDÉ"
            : "CONNEXION PERDUE - PIRATAGE ÉCHOUÉ"}
        </p>

        <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-80 mb-6 shadow-xl">
          <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Score Final
            </span>
            <span className="text-3xl font-bold text-white">{score}</span>
          </div>
          {gameState === "GAMEOVER" && (
            <div className="text-center text-xs text-red-400 font-mono">
              Vies épuisées
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 w-80">
          <button
            onClick={() => {
              router.push(`/`);
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
          >
            <MapIcon size={18} />
            RETOUR À LA CARTE
          </button>

          <button
            onClick={() => {
              resetGame(true);
              setGameState("MENU");
            }}
            className="w-full py-3 bg-[#1E293B] hover:bg-[#334155] text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/5"
          >
            <RefreshCw size={18} />
            {gameState === "VICTORY" ? "Rejouer le niveau" : "Réessayer"}
          </button>
        </div>
      </div>
    </div>
  );
}
