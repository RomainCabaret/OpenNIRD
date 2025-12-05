"use client";
import GameResultModal from "@/components/Modal/GameResultModal";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";

// --- TYPES ---
interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  currentCost: number;
  cps: number;
  count: number;
  icon: string;
  desc: string;
  isFinal?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
  isGold?: boolean;
}

interface BossButton {
  id: number;
  top: number;
  left: number;
}

interface Popup {
  id: number;
  x: number;
  y: number;
}

// --- DATA INITIALE ---
const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: "adblock",
    name: "AdBlocker v1",
    baseCost: 10,
    currentCost: 10,
    cps: 1,
    count: 0,
    icon: "🛡️",
    desc: "Bloque les pubs basiques",
  },
  {
    id: "proxy",
    name: "VPN Crypté",
    baseCost: 62,
    currentCost: 62,
    cps: 10,
    count: 0,
    icon: "🌐",
    desc: "Tunnel sécurisé rapide",
  },
  {
    id: "server",
    name: "Botnet Global",
    baseCost: 312,
    currentCost: 312,
    cps: 60,
    count: 0,
    icon: "👾",
    desc: "Armée de machines zombies",
  },
  {
    id: "ai",
    name: "I.A. Quantique",
    baseCost: 1875,
    currentCost: 1875,
    cps: 300,
    count: 0,
    icon: "🧠",
    desc: "Conscience artificielle",
  },
  {
    id: "freedom",
    name: "INTERNET LIBRE",
    baseCost: 12500,
    currentCost: 12500,
    cps: 0,
    count: 0,
    icon: "🕊️",
    desc: "La fin de la surveillance",
    isFinal: true,
  },
];

export default function CookieDestroyer() {
  // --- STATE ---
  const [score, setScore] = useState<number>(0);
  const [cps, setCps] = useState<number>(0);
  // Initialisation directe avec les données constantes pour éviter tout chargement vide
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shake, setShake] = useState<boolean>(false);

  // Cyber Deck (Unités visuelles)
  const [activeUnits, setActiveUnits] = useState<string[]>([]);

  // Popups & Events
  const [activePopup, setActivePopup] = useState<Popup | null>(null);

  // Game Phase
  const [gameState, setGameState] = useState<"PLAYING" | "BOSS" | "VICTORY">(
    "PLAYING"
  );
  const [bossButtons, setBossButtons] = useState<BossButton[]>([]);
  const [bossButtonsRemaining, setBossButtonsRemaining] = useState<number>(10);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clickValue = 1;
  const nextParticleId = useRef(0);

  // --- MATRIX BACKGROUND EFFECT ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resize observer pour gérer proprement le redimensionnement
    const resizeObserver = new ResizeObserver(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
    resizeObserver.observe(document.body);

    const cols = Math.floor(width / 20);
    const ypos = Array(cols).fill(0);

    const matrix = () => {
      ctx.fillStyle = "rgba(5, 5, 7, 0.05)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#4ade80";
      ctx.font = "15px monospace";

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;

        if (Math.random() > 0.95) ctx.fillStyle = "#fff";
        else if (Math.random() > 0.9) ctx.fillStyle = "#8b5cf6";
        else ctx.fillStyle = "#0f0";

        ctx.fillText(text, x, y);
        if (y > height + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 20;
      });
    };

    const interval = setInterval(matrix, 50);

    return () => {
      clearInterval(interval);
      resizeObserver.disconnect();
    };
  }, []);

  // --- GAME LOOP ---
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const loop = setInterval(() => {
      if (cps > 0) {
        setScore((prev) => prev + cps / 10);
      }
      if (cps > 5 && !activePopup && Math.random() < 0.005) {
        const x = Math.random() * (window.innerWidth - 300);
        const y = Math.random() * (window.innerHeight - 100);
        setActivePopup({
          id: Date.now(),
          x: Math.max(0, x),
          y: Math.max(0, y),
        });
        setTimeout(() => setActivePopup(null), 4000);
      }
    }, 100);

    return () => clearInterval(loop);
  }, [cps, gameState, activePopup]);

  // --- ACTIONS ---
  const spawnParticle = useCallback(
    (x: number, y: number, text: string, isGold = false) => {
      const id = nextParticleId.current++;
      setParticles((prev) => [...prev, { id, x, y, text, isGold }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 800);
    },
    []
  );

  const handleMainClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setScore((prev) => prev + clickValue);
    setShake(true);
    setTimeout(() => setShake(false), 200);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    const rX = (Math.random() - 0.5) * 40;

    spawnParticle(x + rX, y - 20, `+${clickValue}`, Math.random() > 0.9);
  };

  const buyUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId);
    if (upgradeIndex === -1) return;

    const upgrade = upgrades[upgradeIndex];
    if (score >= upgrade.currentCost) {
      setScore((prev) => prev - upgrade.currentCost);

      if (upgrade.isFinal) {
        startBossFight();
        return;
      }

      const newUpgrades = [...upgrades];
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        count: upgrade.count + 1,
        currentCost: Math.floor(upgrade.currentCost * 1.2),
      };
      setUpgrades(newUpgrades);
      setCps((prev) => prev + upgrade.cps);
      setActiveUnits((prev) => [...prev, upgrade.icon]);
    }
  };
  const { completeLevel, unlockLevel } = useUser();

  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePopup) return;
    const bonus = Math.floor(cps * 10);
    setScore((prev) => prev + bonus);
    spawnParticle(activePopup.x + 20, activePopup.y, `FIXED: +${bonus}`, true);
    setActivePopup(null);
  };

  const startBossFight = () => {
    setGameState("BOSS");
    const buttons: BossButton[] = [];
    for (let i = 0; i < 10; i++) {
      buttons.push({
        id: i,
        top: Math.random() * 80 + 10,
        left: Math.random() * 80 + 10,
      });
    }
    setBossButtons(buttons);
    setBossButtonsRemaining(10);
  };

  const handleBossClick = (id: number) => {
    setBossButtons((prev) => prev.filter((b) => b.id !== id));
    const newRemaining = bossButtonsRemaining - 1;
    setBossButtonsRemaining(newRemaining);
    spawnParticle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      `${newRemaining} RESTANTS`,
      true
    );
    if (newRemaining <= 0) {
      setGameState("VICTORY");
      completeLevel(4);
      unlockLevel(5);
    }
  };

  const router = useRouter();

  // --- RENDER ---
  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-[#050507] text-[#f3f4f6] font-mono flex flex-col ${
        shake ? "animate-shake" : ""
      }`}
    >
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(0.5) rotate(0deg); }
          50% { transform: translateY(-40px) scale(1.2) rotate(10deg); }
          100% { opacity: 0; transform: translateY(-100px) scale(1) rotate(0deg); }
        }
        @keyframes glitch {
          0% { text-shadow: -2px 0 #ff00c1; transform: translate(2px, 0); }
          2% { text-shadow: 2px 0 #00fff9; transform: translate(-2px, 0); }
          4% { text-shadow: none; transform: none; }
          100% { text-shadow: none; transform: none; }
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        .animate-float { animation: floatUp 0.8s ease-out forwards; }
        .animate-glitch { animation: glitch 3s infinite linear alternate-reverse; }
        .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
      `}</style>

      {/* BACKGROUND */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none z-0"
      />

      {/* POPUP MALWARE */}
      {activePopup && gameState === "PLAYING" && (
        <div
          onClick={handlePopupClick}
          className="absolute z-50 bg-white text-black p-4 border-4 border-red-500 font-bold cursor-pointer shadow-[10px_10px_0_rgba(0,0,0,0.5)] hover:bg-gray-100 select-none animate-bounce"
          style={{
            left: activePopup.x,
            top: activePopup.y,
            fontFamily: "Arial, sans-serif",
          }}
        >
          ⚠️ ALERTE : FAILLES DÉTECTÉES !
        </div>
      )}

      {/* PARTICLES */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute pointer-events-none font-black text-2xl z-[100] animate-float`}
          style={{
            left: p.x,
            top: p.y,
            color: p.isGold ? "#fbbf24" : "#fff",
            textShadow: "0 0 5px #8b5cf6",
          }}
        >
          {p.text}
        </div>
      ))}

      {/* GAME UI - CORRECTION LAYOUT */}
      {gameState === "PLAYING" && (
        // Changement ici : 'md' déclenche désormais le layout horizontal au lieu de 'lg'
        <div className="relative z-10 grid grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-1 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_400px] h-full w-full">
          {/* LEFT PANEL */}
          <div className="flex flex-col p-2 md:p-5 relative overflow-hidden items-center justify-between">
            {/* Header */}
            <div className="text-center mt-2 md:mt-5 mb-2 md:mb-10 w-full">
              <div className="text-violet-300 tracking-[3px] text-xs md:text-base animate-glitch mb-1 md:mb-2">
                CONNEXION SÉCURISÉE...
              </div>
              <div className="text-5xl md:text-7xl font-black font-sans leading-tight drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                {Math.floor(score).toLocaleString()}
              </div>
              <div className="inline-block mt-2 md:mt-4 px-3 py-0.5 md:px-4 md:py-1 rounded-full border border-emerald-500 bg-black/50 text-emerald-500 text-sm md:text-base font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                {cps.toLocaleString()} / sec
              </div>
            </div>

            {/* Clicker Button */}
            <div className="flex-1 flex items-center justify-center relative w-full">
              <button
                id="main-btn"
                onClick={handleMainClick}
                className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full border-4 border-violet-500 text-white text-lg md:text-2xl font-bold cursor-pointer transition-transform active:scale-95 group overflow-visible shadow-[0_0_50px_rgba(139,92,246,0.6),inset_0_0_20px_rgba(0,0,0,0.8)] bg-[radial-gradient(circle,#2e2e3a_0%,#0f0f13_100%)] flex items-center justify-center"
              >
                <span className="relative z-10 text-center">
                  REFUSER
                  <br />
                  COOKIES
                </span>
                <div className="absolute -inset-2.5 rounded-full border-2 border-dashed border-violet-500 opacity-50 animate-spin-slow pointer-events-none" />
              </button>
            </div>

            {/* Cyber Deck (Visualizer) - Réduit sur mobile */}
            <div className="h-[100px] md:h-[180px] w-full bg-black/60 backdrop-blur-sm border-t-2 border-violet-500 p-2 md:p-4 flex flex-col mt-2">
              <div className="text-gray-400 text-[10px] md:text-xs uppercase mb-1 md:mb-2">
                Réseau Actif (Unités)
              </div>
              <div className="flex flex-wrap content-start gap-1 md:gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-violet-900 scrollbar-track-transparent h-full">
                {activeUnits.map((icon, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 md:w-10 md:h-10 bg-white/5 border border-violet-500/60 rounded md:rounded-lg flex items-center justify-center text-lg md:text-2xl relative animate-[popIn_0.3s_ease]"
                  >
                    {icon}
                    <div className="absolute bottom-0.5 right-0.5 w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981] animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (STORE) - Fixé avec une hauteur explicite sur mobile */}
          <div className="bg-[#111116]/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-violet-500/60 flex flex-col h-full overflow-hidden">
            <div className="p-3 md:p-5 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent border-b border-gray-800 text-center shrink-0">
              <h2 className="text-lg md:text-xl font-bold tracking-widest">
                BLACK MARKET
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-3">
              {upgrades.map((u) => {
                const canAfford = score >= u.currentCost;
                return (
                  <div
                    key={u.id}
                    onClick={() => canAfford && buyUpgrade(u.id)}
                    className={`
                      relative p-2 md:p-3 rounded-lg border transition-all duration-200 grid grid-cols-[40px_1fr] md:grid-cols-[50px_1fr] gap-2 md:gap-3 items-center select-none
                      ${
                        canAfford
                          ? "bg-gradient-to-r from-white/5 to-white/10 border-white/10 cursor-pointer hover:border-violet-500 hover:bg-violet-500/10 hover:-translate-x-1"
                          : "opacity-40 grayscale cursor-not-allowed border-transparent bg-white/5"
                      }
                      ${u.isFinal ? "border-red-500/50 bg-red-900/10" : ""}
                    `}
                  >
                    <div className="text-2xl md:text-3xl flex items-center justify-center">
                      {u.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm md:text-base">
                        {u.name}{" "}
                        <span className="text-[10px] md:text-xs opacity-70 ml-1">
                          x{u.count}
                        </span>
                      </h4>
                      <div className="text-amber-400 font-mono font-bold text-xs md:text-sm">
                        {u.currentCost.toLocaleString()}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-400 mt-0.5 leading-tight">
                        {u.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOSS OVERLAY */}
      {gameState === "BOSS" && (
        <div className="fixed inset-0 bg-[#050507] z-50">
          {bossButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleBossClick(btn.id)}
              className="absolute bg-red-600 text-white font-bold py-3 px-6 rounded shadow-[0_0_20px_#ef4444] hover:bg-red-500 active:scale-95 transition-all"
              style={{ top: `${btn.top}%`, left: `${btn.left}%` }}
            >
              DELETE TRACKER
            </button>
          ))}
        </div>
      )}

      {gameState === "VICTORY" && (
        <GameResultModal
          type={gameState === "VICTORY" ? "success" : "failure"}
          score={12500}
          onExit={() => router.push("/")}
          onRestart={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
