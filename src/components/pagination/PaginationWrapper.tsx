"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Skull,
  SkullIcon,
  Star,
} from "lucide-react";
import React, { useState } from "react";

interface PaginationWrapperProps {
  children: React.ReactNode; // Liste des leçons (<div>Leçon 1</div>, <div>Leçon 2</div>...)
  miniGame?: React.ReactNode; // Composant Mini-Jeu (Boss) optionnel pour la fin

  title?: string;
  className?: string;

  // Props de contrôle (Optionnelles - pour forcer l'état depuis le parent si besoin)
  defaultPage?: number;
  onPageChange?: (page: number) => void;
}

export function PaginationWrapper({
  children,
  miniGame,
  title = "Progression",
  className,
  defaultPage = 1,
  onPageChange,
}: PaginationWrapperProps) {
  // 1. Convertir les enfants en tableau pour pouvoir y accéder par index
  const pages = React.Children.toArray(children);

  // 2. Calculer le nombre total de pages (Leçons + Mini-Jeu si présent)
  const totalPages = pages.length + (miniGame ? 1 : 0);

  // 3. Gestion de l'état (Interne par défaut)
  const [internalPage, setInternalPage] = useState(defaultPage);

  // On utilise l'état interne, sauf si le parent veut absolument contrôler la navigation (rare ici)
  const currentPage = internalPage;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setInternalPage(newPage);
      if (onPageChange) onPageChange(newPage);
    }
  };

  // 4. Déterminer le contenu à afficher
  let currentContent: React.ReactNode = null;

  if (currentPage <= pages.length) {
    // C'est une leçon standard
    currentContent = pages[currentPage - 1];
  } else if (currentPage === totalPages && miniGame) {
    // C'est la page du Boss (Mini-Jeu)
    currentContent = miniGame;
  }

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full bg-[#0B1221] text-white relative overflow-hidden",
        className
      )}
    >
      {/* --- HEADER : PROGRESS BAR & TITLE --- */}
      {!(currentPage === totalPages && miniGame) && (
        <div
          className={cn(
            "w-full pt-8 pb-6 px-6 md:px-12 flex flex-col gap-6 z-10 bg-gradient-to-b from-[#0B1221] via-[#0B1221] to-transparent",
            currentPage === totalPages && miniGame && "!max-sm:hidden"
          )}
        >
          {/* Titre et Compteur */}
          <div className="flex justify-between items-end">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white drop-shadow-md">
              {title}
            </h1>
            <span className="font-mono text-[#00E5FF] font-bold text-lg">
              {String(currentPage).padStart(2, "0")}
              <span className="text-slate-600 mx-1">/</span>
              {String(totalPages).padStart(2, "0")}
            </span>
          </div>

          {/* BARRE DE PROGRESSION SEGMENTÉE */}
          <div className="flex items-center justify-between gap-2 w-full px-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              const isPast = pageNum < currentPage;
              const isLast = pageNum === totalPages; // Le Boss est toujours le dernier

              return (
                <React.Fragment key={i}>
                  {/* Segment de barre */}
                  <div className="relative flex-1 h-3 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-full",
                        isPast || isActive
                          ? "bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"
                          : "bg-transparent"
                      )}
                      initial={{ width: isPast ? "100%" : "0%" }}
                      animate={{ width: isPast || isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-white/30"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear",
                        }}
                      />
                    )}
                  </div>

                  {/* Indicateur */}
                  <div className="relative flex items-center justify-center">
                    {isLast ? (
                      // ÉTOILE DU BOSS (Finale)
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500",
                          isActive
                            ? "bg-red-500 shadow-[0_0_20px_#fa4c02] scale-110"
                            : isPast
                            ? "bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"
                            : "bg-slate-800 border-2 border-slate-600"
                        )}
                      >
                        <SkullIcon
                          className={cn(
                            "w-5 h-5 transition-colors",
                            isActive || isPast
                              ? "text-[#0B1221]"
                              : "fill-none text-slate-500"
                          )}
                        />
                      </div>
                    ) : (
                      // POINT STANDARD
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 transition-all duration-300 z-10",
                          isActive
                            ? "border-[#00E5FF] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] scale-125"
                            : isPast
                            ? "border-[#00E5FF] bg-[#00E5FF]"
                            : "border-slate-600 bg-slate-800"
                        )}
                      />
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* --- CONTENU PRINCIPAL (Dynamique) --- */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-4 relative z-0 scroll-smooth">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full"
        >
          {currentContent}
        </motion.div>
      </div>

      {/* --- FOOTER : CONTRÔLES --- */}
      <div
        className={cn(
          "p-6 md:px-12 flex justify-between items-center border-t border-white/5 bg-[#0B1221]/90 backdrop-blur-md z-20 mb-[80px]",
          currentPage === totalPages && miniGame && "hidden"
        )}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden md:inline">Précédent</span>
        </button>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-[#0B1221] transition-all shadow-lg",
            currentPage === totalPages
              ? "bg-slate-700 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-[#00E5FF] hover:bg-[#6FF7FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95"
          )}
        >
          <span className="hidden md:inline">
            {currentPage === totalPages - 1 && miniGame
              ? "Affronter le Boss"
              : "Suivant"}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
