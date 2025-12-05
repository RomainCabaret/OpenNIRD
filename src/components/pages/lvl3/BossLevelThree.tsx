"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, RefreshCcw, Trophy } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import GameResultModal from "@/components/Modal/GameResultModal";
import { useUser } from "@/context/UserContext";

// --- TYPES & DONNÉES ---

type ItemType = "Recyclage_matières" | "reconditionnement" | "réparation";

interface Item {
  id: number;
  name: string;
  type: ItemType;
  image?: string;
  emoji?: string;
}

const ITEMS_DATA: Item[] = [
  {
    id: 1,
    name: "Câbles",
    type: "Recyclage_matières",
    image: "/cables_à_recycler-Photoroom.png",
    emoji: "🔌",
  },
  {
    id: 2,
    name: "Carte Élec.",
    type: "Recyclage_matières",
    image: "/carte_à_recycler-Photoroom.png",
    emoji: "🟩",
  },
  {
    id: 3,
    name: "Écran Cassé",
    type: "Recyclage_matières",
    image: "/ecran_à_recycler-Photoroom.png",
    emoji: "📺",
  },
  {
    id: 4,
    name: "RAM",
    type: "Recyclage_matières",
    image: "/ram_à_recycler-Photoroom.png",
    emoji: "💾",
  },
  {
    id: 5,
    name: "Console",
    type: "reconditionnement",
    image: "/console_a_reconditionner-Photoroom.png",
    emoji: "🎮",
  },
  {
    id: 6,
    name: "Imprimante",
    type: "reconditionnement",
    image: "/imprimante_à_reconditionné-Photoroom.png",
    emoji: "🖨️",
  },
  {
    id: 7,
    name: "Tablette",
    type: "reconditionnement",
    image: "/tab_a_reconditionner-Photoroom.png",
    emoji: "📱",
  },
  {
    id: 8,
    name: "Smartphone",
    type: "réparation",
    image: "/phone_a_reparer-Photoroom.png",
    emoji: "📵",
  },
];

export default function BossLevelThree() {
  const { completeLevel, unlockLevel } = useUser();

  // --- STATE ---
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [usedItems, setUsedItems] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [hoveredBin, setHoveredBin] = useState<ItemType | null>(null);

  // Refs
  const constraintsRef = useRef<HTMLDivElement>(null);
  const binsRefs = {
    Recyclage_matières: useRef<HTMLDivElement>(null),
    reconditionnement: useRef<HTMLDivElement>(null),
    réparation: useRef<HTMLDivElement>(null),
  };

  // --- LOGIQUE JEU ---

  const generateNewItem = (excludeIds: number[] = []) => {
    const available = ITEMS_DATA.filter(
      (item) => !excludeIds.includes(item.id)
    );
    if (available.length === 0) {
      setGameState("won");
      completeLevel(3);
      unlockLevel(4);

      return;
    }
    const random = available[Math.floor(Math.random() * available.length)];
    setCurrentItem(random);
    setIsDropping(false);
    setFeedback(null);
  };

  useEffect(() => {
    generateNewItem();
  }, []);

  const handleDragEnd = (info: any) => {
    setIsDragging(false);
    setHoveredBin(null);
    if (!currentItem || gameState !== "playing") return;

    const point = { x: info.point.x, y: info.point.y };
    let droppedBin: ItemType | null = null;

    (Object.keys(binsRefs) as ItemType[]).forEach((type) => {
      const ref = binsRefs[type];
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (
          point.x >= rect.left &&
          point.x <= rect.right &&
          point.y >= rect.top &&
          point.y <= rect.bottom
        ) {
          droppedBin = type;
        }
      }
    });

    if (droppedBin) {
      validateDrop(droppedBin);
    }
  };

  const handleDrag = (info: any) => {
    const point = { x: info.point.x, y: info.point.y };
    let newHoveredBin: ItemType | null = null;

    (Object.keys(binsRefs) as ItemType[]).forEach((type) => {
      const ref = binsRefs[type];
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (
          point.x >= rect.left &&
          point.x <= rect.right &&
          point.y >= rect.top &&
          point.y <= rect.bottom
        ) {
          newHoveredBin = type;
        }
      }
    });

    if (newHoveredBin !== hoveredBin) {
      setHoveredBin(newHoveredBin);
    }
  };

  const validateDrop = (binType: ItemType) => {
    if (!currentItem) return;

    if (currentItem.type === binType) {
      setIsDropping(true);
      setFeedback({ type: "success", text: "Parfait !" }); // Texte plus court pour mobile
      const newUsed = [...usedItems, currentItem.id];
      setUsedItems(newUsed);
      setScore((s) => s + 1);

      setTimeout(() => {
        if (newUsed.length >= ITEMS_DATA.length) {
          setGameState("won");
          completeLevel(3);
          unlockLevel(4);
        } else {
          generateNewItem(newUsed);
        }
      }, 600);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({ type: "error", text: "Erreur !" }); // Texte plus court pour mobile

      if (newLives <= 0) {
        setGameState("lost");
      } else {
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setUsedItems([]);
    setFeedback(null);
    setGameState("playing");
    setIsDropping(false);
    generateNewItem([]);
  };

  const router = useRouter();

  return (
    // h-[100dvh] assure le plein écran sur mobile même avec les barres d'URL dynamiques
    <div className="relative w-full h-[100dvh] flex flex-col items-center justify-between bg-[#0B1221] overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40 blur-[2px]"
          style={{
            backgroundImage: "url(/Fond_decheterie.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1221]/80 via-transparent to-[#0B1221]" />
      </div>

      {/* --- HUD --- */}
      <div className="relative z-20 w-full max-w-5xl px-4 pt-4 md:px-6 md:pt-6 flex justify-between items-start shrink-0">
        {/* SCORE */}
        <div className="flex flex-col gap-0.5 md:gap-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 shadow-lg">
          <span className="text-[8px] md:text-[10px] font-bold uppercase text-[#00E5FF] tracking-widest">
            Triés
          </span>
          <div className="flex items-baseline gap-1 md:gap-2">
            <span className="text-2xl md:text-4xl font-black text-white tabular-nums">
              {String(score).padStart(2, "0")}
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-500">
              / {String(ITEMS_DATA.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* FEEDBACK (Mobile: centré en haut un peu plus bas) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-16 md:top-8 pointer-events-none w-full flex justify-center z-50">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className={`px-6 py-2 md:px-8 md:py-3 rounded-full font-black text-xs md:text-sm uppercase tracking-widest shadow-xl border backdrop-blur-md ${
                  feedback.type === "success"
                    ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                    : "bg-red-500/20 border-red-500 text-red-500"
                }`}
              >
                {feedback.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* VIES */}
        <div className="flex items-center gap-1 md:gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 md:px-4 md:py-3 shadow-lg">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i < lives ? 1 : 0.8,
                opacity: i < lives ? 1 : 0.2,
              }}
            >
              <Heart
                className={`w-4 h-4 md:w-6 md:h-6 ${
                  i < lives
                    ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                    : "text-slate-600"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {(gameState === "won" || gameState === "lost") && (
        <GameResultModal
          type={gameState === "won" ? "success" : "failure"}
          score={score}
          onRestart={resetGame}
          onExit={() => router.push("/")}
        />
      )}
      {/* --- ZONE DE JEU PRINCIPALE (Avec ref pour contraintes) --- */}
      <div
        ref={constraintsRef}
        className="relative z-10 flex-1 w-full max-w-7xl flex flex-col items-center justify-center min-h-0"
      >
        {/* MODAL FIN DE JEU */}

        {/* OBJET À TRIER */}
        <div className="flex-1 w-full flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {gameState === "playing" && currentItem && !isDropping && (
              <motion.div
                key={currentItem.id}
                drag
                dragConstraints={constraintsRef} // Contraintes basées sur la zone parente
                dragElastic={0.1}
                dragMomentum={false} // Arrêt immédiat pour meilleure précision sur mobile
                onDragStart={() => setIsDragging(true)}
                onDrag={(e, info) => handleDrag(info)}
                onDragEnd={(_, info) => handleDragEnd(info)}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 50 }}
                className="absolute touch-none cursor-grab z-30" // touch-none essentiel pour mobile
              >
                {/* Carte responsive */}
                <div className="w-32 h-48 md:w-48 md:h-72 bg-[#161e2e]/90 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center p-3 md:p-6 overflow-hidden">
                  <div className="relative w-full flex-1 flex items-center justify-center mb-2 md:mb-4">
                    {currentItem.image ? (
                      <img
                        src={currentItem.image}
                        alt={currentItem.name}
                        className="w-full h-full object-contain pointer-events-none select-none"
                        draggable={false}
                      />
                    ) : (
                      <span className="text-6xl md:text-8xl select-none">
                        {currentItem.emoji}
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-black/40 rounded-lg md:rounded-xl py-2 px-2 md:px-4 text-center border border-white/5">
                    <h3 className="text-white font-bold text-xs md:text-sm uppercase truncate">
                      {currentItem.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- BACS DE TRI (Footer) --- */}
      {/* Modification clé : grid-cols-3 même sur mobile pour tout avoir en visuel */}
      <div className="w-full grid grid-cols-3 gap-2 px-2 pb-4 md:gap-8 md:px-12 md:pb-8 shrink-0 z-20">
        <Bin
          type="Recyclage_matières"
          label="Recyclage"
          subLabel="Matériaux"
          image="/benne_recyclage-removebg-preview.png"
          accentColor="text-green-400"
          borderColor="border-green-500/30"
          refProp={binsRefs["Recyclage_matières"]}
          isDragging={isDragging}
          isHovered={hoveredBin === "Recyclage_matières"}
        />
        <Bin
          type="reconditionnement"
          label="Recondit." // Abréviation pour mobile
          subLabel="Seconde vie"
          image="/benne_reconditionnement-removebg-preview.png"
          accentColor="text-blue-400"
          borderColor="border-blue-500/30"
          refProp={binsRefs["reconditionnement"]}
          isDragging={isDragging}
          isHovered={hoveredBin === "reconditionnement"}
        />
        <Bin
          type="réparation"
          label="Réparation"
          subLabel="Remise état"
          image="/benne_reparation-removebg-preview.png"
          accentColor="text-orange-400"
          borderColor="border-orange-500/30"
          refProp={binsRefs["réparation"]}
          isDragging={isDragging}
          isHovered={hoveredBin === "réparation"}
        />
      </div>
    </div>
  );
}

// --- COMPOSANT BAC RESPONSIVE ---
interface BinProps {
  type: ItemType;
  label: string;
  subLabel: string;
  image: string;
  accentColor: string;
  borderColor: string;
  refProp: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  isHovered: boolean;
}

function Bin({
  label,
  subLabel,
  image,
  accentColor,
  borderColor,
  refProp,
  isDragging,
  isHovered,
}: BinProps) {
  return (
    <div
      ref={refProp}
      // Hauteur et largeur flexibles (h-28 sur mobile, h-64 sur desktop)
      className={`w-full h-28 md:h-64 relative flex flex-col items-center justify-end rounded-xl md:rounded-3xl border md:border-2 transition-all duration-300 overflow-hidden ${
        isHovered
          ? `bg-white/10 scale-105 ${borderColor} shadow-[0_0_20px_rgba(255,255,255,0.1)]`
          : isDragging
          ? "bg-white/5 border-white/20"
          : "bg-black/20 border-transparent md:bg-black/20"
      }`}
    >
      {/* Image du bac - Taille adaptative */}
      <div
        className={`absolute inset-0 flex items-center justify-center p-2 md:p-6 pointer-events-none transition-transform duration-500 ${
          isHovered ? "scale-110 -translate-y-2" : "scale-100"
        }`}
      >
        <img
          src={image}
          alt={label}
          className="w-auto h-3/5 md:h-3/5 object-contain opacity-90"
        />
      </div>

      {/* Label du bac */}
      <div
        className={`relative z-10 w-full bg-black/60 backdrop-blur-sm p-1 md:p-4 text-center border-t border-white/5 ${
          isHovered ? "bg-black/80" : ""
        }`}
      >
        <div
          className={`text-[9px] md:text-sm font-black uppercase tracking-wider truncate ${
            isHovered ? "text-white" : "text-slate-300"
          }`}
        >
          {label}
        </div>
        <div
          className={`hidden md:block text-[10px] font-bold uppercase tracking-wide mt-1 ${accentColor}`}
        >
          {subLabel}
        </div>
      </div>
    </div>
  );
}
