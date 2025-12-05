"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  RefreshCw,
  Play,
  Trophy,
  Skull,
  Clock,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  DollarSign,
  LucideIcon,
} from "lucide-react";
import GameResultModal from "@/components/Modal/GameResultModal";
import { useRouter } from "next/navigation";

// --- TYPES & INTERFACES ---

interface Vector {
  x: number;
  y: number;
}

interface Ghost {
  x: number;
  y: number;
  type: number; // Index vers BRAND_PATHS
  dir: Vector;
  speed: number;
}

interface Pellet {
  x: number;
  y: number;
  timer: number;
}

interface PacmanEntity {
  x: number;
  y: number;
  dir: Vector;
  nextDir: Vector;
  radius: number;
  mouth: number;
  mouthOpen: boolean;
  angle: number;
}

interface GameState {
  pacman: PacmanEntity;
  ghosts: Ghost[];
  pellets: Pellet[];
  map: number[][];
  frameCount: number;
  powerMode: boolean;
  powerModeTimer: number;
  endTime: number;
  lastTimeRecorded: number;
  ghostLife: number;
}

interface BrandPath {
  color: string;
  path: string;
}

// --- CONFIGURATION DU JEU ---
const BLOCK_SIZE = 20;
const PACMAN_SPEED = 2;
const GHOST_SPEED = 1;
const WALL_COLOR = "#3b82f6";
const DOT_COLOR = "#475569";
const POWER_DOT_COLOR = "#ef4444";
const GAME_DURATION = 180; // 3 minutes en secondes
const TOTAL_GHOST_LIFE = 15;

// SVG PATHS pour les logos
const BRAND_PATHS: BrandPath[] = [
  // 0: WINDOWS
  {
    color: "#0078d7",
    path: "M3 12V3H12V12H3ZM3 21V13H12V21H3ZM13 3H22V12H13V3ZM13 21V13H22V21H13Z",
  },
  // 1: APPLE
  {
    color: "#A2AAAD",
    path: "M17.65 19.16C16.83 20.36 15.65 21.84 14.16 21.82C12.72 21.79 12.3 20.98 10.63 20.98C8.94 20.98 8.44 21.79 7.07 21.82C5.65 21.87 4.25 20.25 3.32 18.9C1.41 16.14 0 11.23 3.65 9.1C4.6 8.56 5.8 8.19 6.85 8.24C8.25 8.3 9.3 9.17 10.13 9.17C10.93 9.17 12.26 8.1 13.9 8.21C14.56 8.25 16.48 8.5 17.66 10.21C17.55 10.28 15.6 11.42 15.63 14.16C15.66 16.45 17.69 17.5 17.76 17.55C17.66 17.82 17.26 19.33 16.5 20.45L17.65 19.16ZM12.95 6.09C13.67 5.21 14.15 4 14.03 2.76C12.87 2.89 11.58 3.56 10.79 4.47C10.08 5.27 9.53 6.55 9.69 7.74C10.96 7.84 12.23 6.96 12.95 6.09Z",
  },
  // 2: FACEBOOK
  {
    color: "#1877f2",
    path: "M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.71 6 13.5 6H16V9H14.5C13.67 9 13 9.67 13 10.5V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z",
  },
  // 3: GOOGLE
  {
    color: "#EA4335",
    path: "M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12H12V10H20C20.07 10.66 20.1 11.33 20.1 12C20.1 16.43 16.43 20.1 12 20.1C7.57 20.1 3.9 16.43 3.9 12C3.9 7.57 7.57 3.9 12 3.9C14.15 3.9 16.03 4.75 17.41 6.09L16 7.5C15.06 6.58 13.66 5.9 12 5.9Z",
  },
  // 4: AMAZON
  {
    color: "#ff9900",
    path: "M15.5,15.7c-0.3-0.5-0.7-0.9-1.2-1.3c-0.5-0.4-1.1-0.7-1.7-0.9c-0.6-0.2-1.3-0.3-2-0.3 c-1.3,0-2.4,0.3-3.3,0.9C6.4,14.6,5.8,15.6,5.5,16.8l2,0.5c0.2-0.7,0.5-1.3,1-1.7c0.5-0.4,1.1-0.6,1.9-0.6c0.6,0,1,0.1,1.4,0.3 c0.4,0.2,0.7,0.5,0.8,0.9c0.1,0.4,0.2,1,0.2,1.8l-3.8,0.4c-1.5,0.2-2.7,0.6-3.4,1.2c-0.8,0.7-1.2,1.5-1.2,2.6 c0,1.1,0.4,2.1,1.2,2.8c0.8,0.7,2,1.1,3.5,1.1c1.2,0,2.3-0.3,3.1-0.8c0.8-0.5,1.5-1.2,1.9-2h0.1v1.8h2v-7.2 C16.2,16.8,15.9,16.2,15.5,15.7z M11.8,24.1c-0.8,0-1.5-0.2-2-0.6c-0.5-0.4-0.7-0.9-0.7-1.5c0-0.6,0.2-1.1,0.7-1.5 c0.5-0.4,1.2-0.7,2.3-0.8l2.2-0.3v0.6c0,0.8-0.2,1.6-0.7,2.2C13.2,23.7,12.6,24.1,11.8,24.1z",
  },
  // 5: INSTAGRAM
  {
    color: "#E1306C",
    path: "M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5Z",
  },
  // 6: WHATSAPP
  {
    color: "#25D366",
    path: "M12,2C6.48,2 2,6.48 2,12C2,13.92 2.53,15.73 3.46,17.3L2.5,21.5L6.7,20.54C8.27,21.47 10.08,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,19.5C10.5,19.5 9.07,19.08 7.84,18.33L7.54,18.15L4.85,18.84L5.56,16.15L5.38,15.86C4.63,14.65 4.23,13.26 4.25,11.85C4.28,7.66 7.74,4.25 12,4.25C14.07,4.25 16.02,5.06 17.48,6.53C18.94,8 19.75,9.94 19.75,12C19.75,16.18 16.27,19.5 12,19.5Z",
  },
  // 7: NETFLIX
  { color: "#E50914", path: "M4 2v20h4.5l8-14v14H20V2h-4.5l-8 14V2H4z" },
  // 8: TESLA
  {
    color: "#cc0000",
    path: "M12,2C12,2 4,4 4,4V6H7C7,6 10,5 12,5C14,5 17,6 17,6H20V4C20,4 12,2 12,2M8,8V10C8,10 10,9 12,9C14,9 16,10 16,10V8H13L12,18L11,8H8Z",
  },
  // 9: X (Twitter)
  {
    color: "white",
    path: "M18.9 5H21L14.5 12.3L22 22H17.2L13.2 16.6L8.8 22H6.5L13.5 14L6 5H10.9L14.4 9.7L18.9 5ZM18.2 20.7H19.3L9.8 6.5H8.6L18.2 20.7Z",
  },
  // 10: YOUTUBE
  {
    color: "#FF0000",
    path: "M19.6 3H4.4C2.5 3 2 4.3 2 4.3V19.7C2 19.7 2.5 21 4.4 21H19.6C21.5 21 22 19.7 22 19.7V4.3C22 4.3 21.5 3 19.6 3ZM9 15V9L15 12L9 15Z",
  },
  // 11: ANDROID
  {
    color: "#3DDC84",
    path: "M6 14v4h2v-4h8v4h2v-4c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2zm1.5-9.3l1.3 1.3C9.3 5.7 10.1 5.5 11 5.4l-.8-2.6c-.1-.3.1-.6.4-.7.3-.1.6.1.7.4l.8 2.6c1.1.1 2.2.4 3.2 1l1.3-1.3c.2-.2.5-.2.7 0 .2.2.2.5 0 .7l-1.3 1.3C17.1 8 18 9.4 18 11H6c0-1.6.9-3 2.1-4.1l-1.3-1.3c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0z",
  },
  // 12: SPOTIFY
  {
    color: "#1DB954",
    path: "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.5,16.5C16.3,16.8 15.8,16.9 15.5,16.7C12.8,15.1 9.4,14.7 5.5,15.6C5.1,15.7 4.7,15.4 4.6,15C4.5,14.6 4.8,14.2 5.2,14.1C9.5,13.1 13.3,13.5 16.3,15.3C16.6,15.5 16.7,16.1 16.5,16.5M17.8,13.4C17.5,13.9 16.9,14 16.4,13.7C13.4,11.9 8.9,11.4 5.3,12.5C4.8,12.6 4.2,12.3 4,11.8C3.9,11.3 4.2,10.7 4.7,10.6C8.8,9.4 13.9,10 17.4,12.1C17.9,12.4 18.1,13 17.8,13.4M17.9,10.2C14.3,8 8.3,7.8 4.8,8.9C4.2,9.1 3.6,8.7 3.4,8.1C3.2,7.5 3.6,6.9 4.2,6.7C8.3,5.4 14.9,5.7 19.1,8.2C19.6,8.5 19.8,9.2 19.5,9.7C19.2,10.3 18.5,10.4 17.9,10.2Z",
  },
  // 13: TIKTOK
  {
    color: "#ff0050",
    path: "M16.6 5.82C15.6 5.5 14.8 4.8 14.2 4V2H11V14.5C11 16.4 9.4 18 7.5 18C5.6 18 4 16.4 4 14.5C4 12.6 5.6 11 7.5 11C8.1 11 8.6 11.1 9 11.4V8.2C8.5 8.1 8 8 7.5 8C3.9 8 1 10.9 1 14.5C1 18.1 3.9 21 7.5 21C11.1 21 14 18.1 14 14.5V8.5C15.5 9.6 17.4 10.2 19.4 10.2V7C18.3 7 17.3 6.6 16.6 5.82Z",
  },
  // 14: LINKEDIN
  {
    color: "#0077b5",
    path: "M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M8.5 18V9H5.5V18H8.5M7 7.69C8.04 7.69 8.88 6.85 8.88 5.81C8.88 4.77 8.04 3.94 7 3.94C5.96 3.94 5.13 4.77 5.13 5.81C5.13 6.85 5.96 7.69 7 7.69M18.5 18V13.81C18.5 11.75 17.38 10.81 15.88 10.81C14.63 10.81 14.06 11.5 13.75 12V10.94H10.75V18H13.75V13.13C13.75 12.06 14.69 11.81 14.88 11.81C15.25 11.81 15.5 12.06 15.5 13.13V18H18.5Z",
  },
];

// Carte
const MAP_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 4, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 4, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 2, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 2, 2, 1, 0, 1, 2, 2, 2, 3, 2, 2, 2, 1, 0, 1, 2, 2, 1],
  [1, 1, 1, 1, 0, 1, 2, 1, 1, 2, 1, 1, 2, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 4, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// --- AUDIO ---
const audioCtx =
  typeof window !== "undefined"
    ? new (window.AudioContext || (window as any).webkitAudioContext)()
    : null;
const playSound = (type: string, enabled: boolean) => {
  if (!enabled || !audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (type === "waka") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.linearRampToValueAtTime(400, now + 0.1);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  } else if (type === "eat") {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } else if (type === "die") {
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(500, now);
    oscillator.frequency.exponentialRampToValueAtTime(50, now + 1);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 1);
    oscillator.start(now);
    oscillator.stop(now + 1);
  } else if (type === "win") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.setValueAtTime(800, now + 0.2);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 1.0);
    oscillator.start(now);
    oscillator.stop(now + 1.0);
  }
};

// --- COMPOSANT MASCOTTE BOSS ---
interface BossMascotProps {
  life: number;
  maxLife: number;
  hitTrigger: number;
}

const BossMascot: React.FC<BossMascotProps> = ({
  life,
  maxLife,
  hitTrigger,
}) => {
  const [isHit, setIsHit] = useState(false);
  const lifeRatio = life / maxLife;

  // Déterminer l'état du boss
  let mood = "confident";
  let faceColor = "#60a5fa"; // Blue-400

  if (lifeRatio < 0.3) {
    mood = "panic";
    faceColor = "#ef4444"; // Red-500
  } else if (lifeRatio < 0.6) {
    mood = "worried";
    faceColor = "#fb923c"; // Orange-400
  }

  // Gestion de l'animation de coup
  useEffect(() => {
    if (hitTrigger > 0) {
      setIsHit(true);
      const timer = setTimeout(() => setIsHit(false), 500);
      return () => clearTimeout(timer);
    }
  }, [hitTrigger]);

  return (
    <div
      className={`relative w-32 h-40 md:w-40 md:h-56 bg-gray-900 border-2 ${
        lifeRatio < 0.3 ? "border-red-600 animate-pulse" : "border-gray-700"
      } rounded-xl p-2 flex flex-col items-center justify-between transition-all duration-300 ${
        isHit ? "translate-x-1 rotate-3 bg-red-900/30" : ""
      }`}
    >
      {/* Titre */}
      <div className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest text-center">
        PDG GAFAM
      </div>

      {/* Tête / Écran */}
      <div
        className={`relative w-20 h-20 md:w-24 md:h-24 bg-black rounded-lg border-4 ${
          lifeRatio < 0.3 ? "border-red-500" : "border-gray-600"
        } shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center transition-colors duration-300`}
      >
        {/* Scanlines effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />

        {/* VISAGE SVG */}
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full transition-transform duration-100 ${
            isHit ? "scale-90" : "scale-100"
          }`}
        >
          {/* Yeux */}
          {mood === "confident" && (
            <>
              <path
                d="M 25 35 Q 35 25 45 35"
                stroke={faceColor}
                strokeWidth="5"
                fill="none"
              />
              <path
                d="M 55 35 Q 65 25 75 35"
                stroke={faceColor}
                strokeWidth="5"
                fill="none"
              />
              {/* Sourire */}
              <path
                d="M 30 65 Q 50 80 70 65"
                stroke={faceColor}
                strokeWidth="5"
                fill="none"
              />
            </>
          )}
          {mood === "worried" && (
            <>
              <circle cx="35" cy="40" r="5" fill={faceColor} />
              <circle cx="65" cy="40" r="5" fill={faceColor} />
              {/* Bouche ligne droite tremblante */}
              <path
                d="M 30 70 L 40 68 L 50 72 L 60 68 L 70 70"
                stroke={faceColor}
                strokeWidth="4"
                fill="none"
              />
              {/* Sueur */}
              <path
                d="M 80 30 L 80 45"
                stroke="cyan"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            </>
          )}
          {mood === "panic" && (
            <>
              {/* Yeux X */}
              <path
                d="M 25 30 L 45 50 M 45 30 L 25 50"
                stroke={faceColor}
                strokeWidth="6"
              />
              <path
                d="M 55 30 L 75 50 M 75 30 L 55 50"
                stroke={faceColor}
                strokeWidth="6"
              />
              {/* Bouche ouverte cri */}
              <rect
                x="35"
                y="65"
                width="30"
                height="15"
                stroke={faceColor}
                strokeWidth="4"
                fill="none"
              />
              {/* Fissure écran */}
              <path
                d="M 10 10 L 30 30 L 20 50"
                stroke="white"
                strokeWidth="1"
                opacity="0.5"
              />
            </>
          )}
        </svg>
      </div>

      {/* Corps / Costume */}
      <div className="relative w-full h-12 md:h-16 flex justify-center">
        {/* Costume */}
        <div
          className={`w-24 md:w-32 h-full ${
            lifeRatio < 0.3 ? "bg-gray-800" : "bg-blue-900"
          } rounded-t-xl relative overflow-hidden transition-colors`}
        >
          {/* Col */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white" />
          {/* Cravate */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full ${
              mood === "panic"
                ? "bg-red-700 rotate-12 translate-x-2"
                : "bg-red-600"
            } transition-transform`}
          />

          {/* Dommages vêtements */}
          {mood === "panic" && (
            <>
              <div className="absolute top-4 left-2 w-6 h-1 bg-black -rotate-12" />
              <div className="absolute bottom-2 right-4 w-4 h-4 bg-black rounded-full" />
            </>
          )}
        </div>
      </div>

      {/* Effets de perte d'argent (Particules) */}
      {isHit && (
        <>
          <div className="absolute top-1/2 left-0 animate-[floatUp_0.8s_ease-out_forwards] text-green-400 font-bold opacity-0 pointer-events-none flex items-center">
            <DollarSign size={16} /> <span className="text-xs">$$$</span>
          </div>
          <div className="absolute top-1/3 right-0 animate-[floatUp_0.6s_ease-out_forwards_0.1s] text-green-400 font-bold opacity-0 pointer-events-none">
            <TrendingDown size={20} className="text-red-500" />
          </div>
          <div className="absolute -top-4 right-0 animate-[floatUp_1s_ease-out_forwards] text-red-500 font-bold text-sm md:text-lg whitespace-nowrap opacity-0 pointer-events-none">
            - $50 Mrd
          </div>
        </>
      )}

      <style>{`
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
                }
            `}</style>
    </div>
  );
};

const PacmanNeo: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [ghostLife, setGhostLife] = useState<number>(TOTAL_GHOST_LIFE);
  const [gameState, setGameState] = useState<
    "start" | "playing" | "gameover" | "won"
  >("start");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION);
  const [hitTrigger, setHitTrigger] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Initialisation de l'état du jeu avec des valeurs par défaut pour satisfaire TypeScript
  // Ces valeurs seront écrasées par initGame
  const gameRef = useRef<GameState>({
    pacman: {
      x: 0,
      y: 0,
      dir: { x: 0, y: 0 },
      nextDir: { x: 0, y: 0 },
      radius: 0,
      mouth: 0,
      mouthOpen: false,
      angle: 0,
    },
    ghosts: [],
    pellets: [],
    map: [],
    frameCount: 0,
    powerMode: false,
    powerModeTimer: 0,
    endTime: 0,
    lastTimeRecorded: GAME_DURATION,
    ghostLife: TOTAL_GHOST_LIFE,
  });

  const initGame = useCallback(() => {
    const newMap = MAP_LAYOUT.map((row) => [...row]);
    const pellets: Pellet[] = [];

    MAP_LAYOUT.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 4) pellets.push({ x, y, timer: 0 });
      });
    });

    const pacman: PacmanEntity = {
      x: 9 * BLOCK_SIZE + BLOCK_SIZE / 2,
      y: 12 * BLOCK_SIZE + BLOCK_SIZE / 2,
      dir: { x: 0, y: 0 },
      nextDir: { x: 0, y: 0 },
      radius: BLOCK_SIZE * 0.4,
      mouth: 0.2,
      mouthOpen: true,
      angle: 0,
    };

    const createGhost = (idx: number): Ghost => ({
      x: (8 + (idx % 3)) * BLOCK_SIZE + BLOCK_SIZE / 2,
      y: 8 * BLOCK_SIZE + BLOCK_SIZE / 2,
      type: idx % 15,
      dir: { x: Math.random() > 0.5 ? 1 : -1, y: 0 },
      speed: GHOST_SPEED,
    });

    const ghosts: Ghost[] = [
      createGhost(0),
      createGhost(1),
      createGhost(2),
      createGhost(3),
    ];

    gameRef.current = {
      pacman,
      ghosts,
      pellets,
      map: newMap,
      frameCount: 0,
      ghostLife: TOTAL_GHOST_LIFE,
      powerMode: false,
      powerModeTimer: 0,
      endTime: Date.now() + GAME_DURATION * 1000,
      lastTimeRecorded: GAME_DURATION,
    };

    setScore(0);
    setGhostLife(TOTAL_GHOST_LIFE);
    setTimeLeft(GAME_DURATION);
    setHitTrigger(0);
    setGameState("playing");
  }, []);

  const handleInput = useCallback(
    (x: number, y: number) => {
      if (gameState !== "playing") return;
      gameRef.current.pacman.nextDir = { x, y };
    },
    [gameState]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: Vector } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        handleInput(keyMap[e.key].x, keyMap[e.key].y);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput]);

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = gameRef.current;

    ctx.fillStyle = "rgba(17, 24, 39, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((state.endTime - now) / 1000));

    if (remaining <= 0) {
      setGameState("gameover");
      playSound("die", soundEnabled);
      return;
    }
    if (remaining !== state.lastTimeRecorded) {
      state.lastTimeRecorded = remaining;
      setTimeLeft(remaining);
    }

    const p = state.pacman;

    state.pellets.forEach((pellet) => {
      if (state.map[pellet.y][pellet.x] === 2) {
        pellet.timer++;
        if (pellet.timer > 600) {
          state.map[pellet.y][pellet.x] = 4;
          pellet.timer = 0;
        }
      }
    });

    const centerX = Math.floor(p.x / BLOCK_SIZE) * BLOCK_SIZE + BLOCK_SIZE / 2;
    const centerY = Math.floor(p.y / BLOCK_SIZE) * BLOCK_SIZE + BLOCK_SIZE / 2;
    const dist = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);

    if (dist < PACMAN_SPEED) {
      const nextCol = Math.floor((p.x + p.nextDir.x * BLOCK_SIZE) / BLOCK_SIZE);
      const nextRow = Math.floor((p.y + p.nextDir.y * BLOCK_SIZE) / BLOCK_SIZE);
      if (state.map[nextRow] && state.map[nextRow][nextCol] !== 1) {
        p.dir = { ...p.nextDir };
        if (p.dir.x !== 0) p.y = centerY;
        if (p.dir.y !== 0) p.x = centerX;
      } else {
        const currCol = Math.floor((p.x + p.dir.x * BLOCK_SIZE) / BLOCK_SIZE);
        const currRow = Math.floor((p.y + p.dir.y * BLOCK_SIZE) / BLOCK_SIZE);
        if (state.map[currRow] && state.map[currRow][currCol] === 1)
          p.dir = { x: 0, y: 0 };
      }
    }

    const nextX = p.x + p.dir.x * PACMAN_SPEED;
    const nextY = p.y + p.dir.y * PACMAN_SPEED;
    const wallX = Math.floor(
      (p.x + p.dir.x * (BLOCK_SIZE / 2 + 1)) / BLOCK_SIZE
    );
    const wallY = Math.floor(
      (p.y + p.dir.y * (BLOCK_SIZE / 2 + 1)) / BLOCK_SIZE
    );

    if (state.map[wallY] && state.map[wallY][wallX] !== 1) {
      p.x = nextX;
      p.y = nextY;
    }

    state.frameCount++;
    if (state.frameCount % 5 === 0) p.mouthOpen = !p.mouthOpen;
    p.mouth = p.mouthOpen ? 0.25 : 0.05;
    if (p.dir.x === 1) p.angle = 0;
    if (p.dir.x === -1) p.angle = Math.PI;
    if (p.dir.y === 1) p.angle = Math.PI / 2;
    if (p.dir.y === -1) p.angle = -Math.PI / 2;

    const gX = Math.floor(p.x / BLOCK_SIZE);
    const gY = Math.floor(p.y / BLOCK_SIZE);

    if (state.map[gY][gX] === 0) {
      state.map[gY][gX] = 2;
      setScore((s) => s + 10);
    } else if (state.map[gY][gX] === 4) {
      state.map[gY][gX] = 2;
      state.powerMode = true;
      state.powerModeTimer = 400;
      playSound("win", soundEnabled);
    }

    if (state.powerMode) {
      state.powerModeTimer--;
      if (state.powerModeTimer <= 0) state.powerMode = false;
    }

    for (let i = state.ghosts.length - 1; i >= 0; i--) {
      const g = state.ghosts[i];

      const gCX = Math.floor(g.x / BLOCK_SIZE) * BLOCK_SIZE + BLOCK_SIZE / 2;
      const gCY = Math.floor(g.y / BLOCK_SIZE) * BLOCK_SIZE + BLOCK_SIZE / 2;
      const gDist = Math.sqrt((g.x - gCX) ** 2 + (g.y - gCY) ** 2);

      const lookX = g.x + g.dir.x * (BLOCK_SIZE / 2 + 2);
      const lookY = g.y + g.dir.y * (BLOCK_SIZE / 2 + 2);
      const wallX = Math.floor(lookX / BLOCK_SIZE);
      const wallY = Math.floor(lookY / BLOCK_SIZE);

      let changeDir = false;
      if (state.map[wallY][wallX] === 1) {
        changeDir = true;
        g.x = gCX;
        g.y = gCY;
      } else if (gDist < 4 && Math.random() < 0.1) {
        changeDir = true;
      }

      if (changeDir) {
        const dirs = [
          { x: 1, y: 0 },
          { x: -1, y: 0 },
          { x: 0, y: 1 },
          { x: 0, y: -1 },
        ];
        const valid = dirs.filter((d) => {
          const tx = Math.floor((g.x + d.x * BLOCK_SIZE) / BLOCK_SIZE);
          const ty = Math.floor((g.y + d.y * BLOCK_SIZE) / BLOCK_SIZE);
          return state.map[ty] && state.map[ty][tx] !== 1;
        });
        if (valid.length > 0)
          g.dir = valid[Math.floor(Math.random() * valid.length)];
        else g.dir = { x: -g.dir.x, y: -g.dir.y };
      }
      g.x += g.dir.x * g.speed;
      g.y += g.dir.y * g.speed;

      const distP = Math.sqrt((g.x - p.x) ** 2 + (g.y - p.y) ** 2);
      if (distP < BLOCK_SIZE * 0.9) {
        if (state.powerMode) {
          state.ghosts.splice(i, 1);
          state.ghostLife--;
          setGhostLife(state.ghostLife);
          setHitTrigger((h) => h + 1);
          setScore((s) => s + 500);
          playSound("eat", soundEnabled);

          if (state.ghostLife > state.ghosts.length) {
            state.ghosts.push({
              x: 9 * BLOCK_SIZE + BLOCK_SIZE / 2,
              y: 8 * BLOCK_SIZE + BLOCK_SIZE / 2,
              type: Math.floor(Math.random() * 15),
              dir: { x: Math.random() > 0.5 ? 1 : -1, y: 0 },
              speed: GHOST_SPEED,
            });
          }
        } else {
          setGameState("gameover");
          playSound("die", soundEnabled);
        }
      }
    }

    if (state.ghostLife <= 0) {
      setGameState("won");
      playSound("win", soundEnabled);
    }

    // --- RENDER ---
    state.map.forEach((row, y) => {
      row.forEach((cell, x) => {
        const px = x * BLOCK_SIZE;
        const py = y * BLOCK_SIZE;
        if (cell === 1) {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = WALL_COLOR;
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 4, py + 4, BLOCK_SIZE - 8, BLOCK_SIZE - 8);
        } else if (cell === 0) {
          ctx.fillStyle = DOT_COLOR;
          ctx.beginPath();
          ctx.arc(px + BLOCK_SIZE / 2, py + BLOCK_SIZE / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (cell === 4) {
          if (state.frameCount % 10 < 5) {
            ctx.fillStyle = POWER_DOT_COLOR;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "red";
            ctx.beginPath();
            ctx.arc(
              px + BLOCK_SIZE / 2,
              py + BLOCK_SIZE / 2,
              6,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });
    });

    ctx.fillStyle = "#fbbf24";
    ctx.shadowBlur = 0;
    ctx.beginPath();
    const startAngle = p.angle + p.mouth;
    const endAngle = p.angle + 2 * Math.PI - p.mouth;
    ctx.arc(p.x, p.y, p.radius, startAngle, endAngle);
    ctx.lineTo(p.x, p.y);
    ctx.fill();

    state.ghosts.forEach((g) => {
      const cx = g.x;
      const cy = g.y;

      if (state.powerMode) {
        ctx.fillStyle = "#3b82f6";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#3b82f6";
        ctx.beginPath();
        ctx.arc(cx, cy - 2, BLOCK_SIZE * 0.4, Math.PI, 0);
        ctx.lineTo(cx + BLOCK_SIZE * 0.4, cy + BLOCK_SIZE * 0.4);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(cx - 4, cy - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 4, cy - 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // RENDER ICONS VIA SVG PATH (VECTOR)
        const brand = BRAND_PATHS[g.type % BRAND_PATHS.length];
        const size = BLOCK_SIZE * 0.8;

        ctx.save();
        ctx.translate(cx - size / 2, cy - size / 2);
        ctx.scale(size / 24, size / 24); // Scale 24x24 path to fit

        // Fond blanc rond pour contraste
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(12, 12, 13, 0, Math.PI * 2);
        ctx.fill();

        // Logo
        ctx.fillStyle = brand.color;
        const path = new Path2D(brand.path);
        ctx.fill(path);

        ctx.restore();
      }
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, soundEnabled]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  const lifePercentage = (ghostLife / TOTAL_GHOST_LIFE) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  interface ArrowButtonProps {
    dir: string;
    icon: LucideIcon;
    onClick: () => void;
  }

  const ArrowButton: React.FC<ArrowButtonProps> = ({
    dir,
    icon: Icon,
    onClick,
  }) => (
    <button
      className="w-10 h-10 bg-gray-800 border-2 border-blue-500 rounded-lg flex items-center justify-center active:scale-95 active:bg-blue-900/50 transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)] touch-manipulation"
      onClick={onClick}
      onPointerDown={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <Icon size={20} className="text-blue-400" />
    </button>
  );

  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-slate-900 p-2 md:p-4 font-sans select-none overflow-y-auto overflow-x-hidden pb-20">
      {/* Header */}
      <div className="w-full max-w-[600px] relative z-10 flex flex-col items-center mb-4">
        <div className="flex justify-between w-full items-end gap-2 px-2">
          <div className="bg-gray-800 p-2 rounded-lg border border-gray-700 shadow-xl flex-grow">
            <div className="flex justify-between text-[10px] md:text-xs text-red-400 font-mono mb-1">
              <span>INTÉGRITÉ</span>
              <span>
                {ghostLife}/{TOTAL_GHOST_LIFE}
              </span>
            </div>
            <div className="h-3 md:h-4 w-full bg-gray-900 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300 ease-out"
                style={{ width: `${lifePercentage}%` }}
              />
            </div>
          </div>

          <div
            className={`bg-gray-800 p-2 rounded-lg border border-gray-700 shadow-xl flex items-center gap-2 ${
              timeLeft < 30
                ? "text-red-500 animate-pulse border-red-500"
                : "text-blue-400"
            }`}
          >
            <Clock size={16} />
            <span className="font-mono text-lg font-bold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {(gameState === "won" || gameState === "gameover") && (
        <GameResultModal
          type={gameState === "won" ? "success" : "failure"}
          score={score}
          onExit={() => router.push("/")}
          onRestart={() => {
            initGame;
            setGameState("start");
          }}
        />
      )}

      {/* Main Layout Area: Grid for Game & Mascot */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-4 w-full max-w-[600px]">
        {/* Game Container */}
        <div className="relative p-1 rounded-xl bg-gradient-to-b from-blue-500/20 to-purple-600/20 shadow-[0_0_50px_rgba(59,130,246,0.15)] border border-white/10 w-full max-w-[380px] aspect-[19/16] mx-auto md:mx-0">
          <canvas
            ref={canvasRef}
            width={MAP_LAYOUT[0].length * BLOCK_SIZE}
            height={MAP_LAYOUT.length * BLOCK_SIZE}
            className="bg-gray-900/90 rounded-lg shadow-inner block w-full h-full"
          />

          {/* OVERLAYS */}
          {gameState === "start" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg z-20 p-4 text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
              <button
                onClick={() => {
                  setSoundEnabled(true);
                  initGame();
                }}
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg mb-4"
              >
                <div className="flex items-center gap-2">
                  <Play size={20} fill="currentColor" />
                  <span>JOUER</span>
                </div>
              </button>
              <p className="text-red-200/80 text-xs font-mono">
                Détruisez les 15 cibles GAFAM.
                <br />
                Utilisez les flèches ou le pad tactile.
              </p>
            </div>
          )}
        </div>

        {/* MASCOTTE BOSS À DROITE (Uniquement sur Desktop) */}
        <div className="hidden md:block">
          <BossMascot
            life={ghostLife}
            maxLife={TOTAL_GHOST_LIFE}
            hitTrigger={hitTrigger}
          />
        </div>
      </div>

      {/* CONTROLES MOBILES (ARCADE PAD) */}
      <div className="mt-6 flex flex-col items-center w-full max-w-[300px]">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <ArrowButton
            dir="up"
            icon={ChevronUp}
            onClick={() => handleInput(0, -1)}
          />
          <div />
          <ArrowButton
            dir="left"
            icon={ChevronLeft}
            onClick={() => handleInput(-1, 0)}
          />
          <div className="flex items-center justify-center">
            {/* Bouton Son Central */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full transition-all border ${
                soundEnabled
                  ? "bg-blue-500/20 border-blue-400 text-blue-400"
                  : "bg-gray-800 border-gray-700 text-gray-500"
              }`}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
          <ArrowButton
            dir="right"
            icon={ChevronRight}
            onClick={() => handleInput(1, 0)}
          />
          <div />
          <ArrowButton
            dir="down"
            icon={ChevronDown}
            onClick={() => handleInput(0, 1)}
          />
          <div />
        </div>
      </div>
    </div>
  );
};

export default PacmanNeo;
