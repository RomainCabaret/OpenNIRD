import React from "react";
import { Trophy, AlertTriangle, Map as MapIcon, RefreshCw } from "lucide-react";

/**
 * @param {string} type - 'success' | 'failure'
 * @param {number} score - Le score du joueur
 * @param {function} onRestart - Fonction pour relancer le niveau
 * @param {function} onExit - Fonction pour quitter (retour map)
 */
export default function GameResultModal({
  type = "success",
  score = 0,
  onRestart,
  onExit,
}: {
  type: string;
  score: number;
  onRestart: () => void;
  onExit: () => void;
}) {
  const isSuccess = type === "success";

  // Configuration dynamique selon le type (Couleurs, Textes, Icônes)
  const config = {
    title: isSuccess ? "VICTOIRE !" : "ÉCHEC !",
    subtitle: isSuccess
      ? "NIVEAU TERMINÉ - ACCÈS ACCORDÉ"
      : "CONNEXION PERDUE - PIRATAGE ÉCHOUÉ",
    icon: isSuccess ? Trophy : AlertTriangle,
    mainColor: isSuccess ? "text-yellow-400" : "text-red-500",
    glowColor: isSuccess ? "bg-yellow-500" : "bg-red-500",
    subtitleColor: isSuccess ? "text-green-400" : "text-red-400",
    shadowColor: isSuccess
      ? "drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]"
      : "drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]",
    buttonRestartText: isSuccess ? "Rejouer le niveau" : "Réessayer",
  };

  const IconComponent = config.icon;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col items-center">
        {/* ICÔNE AVEC EFFET DE GLOW */}
        <div className="relative mb-6">
          <div
            className={`absolute inset-0 blur-xl opacity-40 rounded-full ${config.glowColor}`}
          ></div>
          <IconComponent
            size={80}
            className={`${config.mainColor} relative z-10 ${config.shadowColor}`}
          />
        </div>

        {/* TITRES */}
        <h2 className="text-5xl font-black text-white tracking-wide mb-2 uppercase drop-shadow-md">
          {config.title}
        </h2>
        <p
          className={`text-sm tracking-[0.2em] font-medium mb-8 ${config.subtitleColor}`}
        >
          {config.subtitle}
        </p>

        {/* SCORE CARD */}
        <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-80 mb-6 shadow-xl">
          <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Score Final
            </span>
            <span className="text-3xl font-bold text-white">{score}</span>
          </div>
          {!isSuccess && (
            <div className="text-center text-xs text-red-400 font-mono">
              Vies épuisées
            </div>
          )}
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="flex flex-col gap-3 w-80">
          <button
            onClick={onExit}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
          >
            <MapIcon size={18} />
            RETOUR À LA CARTE
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-[#1E293B] hover:bg-[#334155] text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/5"
          >
            <RefreshCw size={18} />
            {config.buttonRestartText}
          </button>
        </div>
      </div>
    </div>
  );
}
