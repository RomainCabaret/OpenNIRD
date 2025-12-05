"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Trophy,
  Map as MapIcon,
  Users,
  Bot,
  Settings,
  ChevronLeft,
  RefreshCw,
  Play,
  AlertTriangle, // Icône pour l'échec
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

// --- CONSTANTES DU JEU ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 6;
const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 8;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 80;
const BRICK_OFFSET_LEFT = 35;
const BRICK_WIDTH =
  (CANVAS_WIDTH -
    BRICK_OFFSET_LEFT * 2 -
    BRICK_PADDING * (BRICK_COLUMN_COUNT - 1)) /
  BRICK_COLUMN_COUNT;
const BRICK_HEIGHT = 25;
const ROOF_HEIGHT = 15;

// Couleurs thématiques
const THEME = {
  bgGradient: "from-[#020617] via-[#0B1221] to-[#020617]",
  sidebarBg: "bg-[#020617]",
  primary: "#3B82F6",
  accent: "#EAB308",
  text: "#F8FAFC",
  paddle: "#60A5FA",
  ball: "#FFFFFF",
  brickColors: ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6"],
  unbreakableBrick: "#475569",
  roofColors: ["transparent", "#EF4444", "#EAB308", "#FFFFFF"],
};

// --- COMPOSANT PRINCIPAL ---
export default function CyberBrickBreaker() {
  const { completeLevel, unlockLevel } = useUser();
  // États du jeu
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("MENU"); // MENU, PLAYING, VICTORY, GAMEOVER
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3); // Ajout des vies

  // Refs pour la logique de jeu
  const gameRef = useRef({
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 30, dx: 4, dy: -4 },
    paddle: { x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2 },
    bricks: [],
    particles: [],
    roofHP: 3,
  });

  const requestRef = useRef();
  const router = useRouter();

  // Initialisation des briques
  const initLevel = useCallback(() => {
    const newBricks = [];
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        const isUnbreakable = Math.random() < 0.2;

        newBricks.push({
          x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
          y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          status: 1,
          type: isUnbreakable ? "UNBREAKABLE" : "NORMAL",
          color: isUnbreakable
            ? THEME.unbreakableBrick
            : THEME.brickColors[r % THEME.brickColors.length],
        });
      }
    }
    gameRef.current.bricks = newBricks;
    gameRef.current.roofHP = 3;
  }, []);

  // Reset du jeu
  const resetGame = (fullReset = false) => {
    if (fullReset) {
      setScore(0);
      setLives(3); // Réinitialiser les vies
      initLevel();
    }

    // Reset balle et paddle uniquement
    gameRef.current.ball = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 40,
      dx: 4,
      dy: -4,
    };
    gameRef.current.paddle = { x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2 };
    gameRef.current.particles = [];
  };

  // Création de particules
  const createParticles = (x, y, color) => {
    for (let i = 0; i < 8; i++) {
      gameRef.current.particles.push({
        x,
        y,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        life: 1,
        color,
      });
    }
  };

  // --- BOUCLE DE JEU (GAME LOOP) ---
  const update = useCallback(() => {
    if (gameState !== "PLAYING") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { ball, paddle, bricks, particles } = gameRef.current;
    let { roofHP } = gameRef.current;

    // 1. Nettoyage
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Dessiner le Toit
    if (roofHP > 0) {
      ctx.beginPath();
      ctx.rect(0, 0, CANVAS_WIDTH, ROOF_HEIGHT);
      ctx.fillStyle = THEME.roofColors[roofHP];
      ctx.shadowBlur = 15;
      ctx.shadowColor = THEME.roofColors[roofHP];
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.closePath();

      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, CANVAS_WIDTH, ROOF_HEIGHT);
    }

    // 3. Dessiner les briques
    bricks.forEach((brick) => {
      if (brick.status === 1) {
        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT, 4);
        ctx.fillStyle = brick.color;

        if (brick.type === "UNBREAKABLE") {
          ctx.strokeStyle = "#94A3B8";
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.shadowBlur = 10;
          ctx.shadowColor = brick.color;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.closePath();
      }
    });

    // 4. Dessiner la raquette
    ctx.beginPath();
    ctx.roundRect(
      paddle.x,
      CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      8
    );
    ctx.fillStyle = THEME.paddle;
    ctx.shadowBlur = 15;
    ctx.shadowColor = THEME.paddle;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();

    // 5. Dessiner la balle
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = THEME.ball;
    ctx.shadowBlur = 10;
    ctx.shadowColor = THEME.ball;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();

    // 6. Particules
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.life -= 0.05;

      if (p.life <= 0) {
        particles.splice(i, 1);
      } else {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // --- LOGIQUE PHYSIQUE ---

    // Gestion du Toit
    if (roofHP > 0) {
      if (ball.y + ball.dy < ROOF_HEIGHT + BALL_RADIUS) {
        ball.dy = Math.abs(ball.dy);
        gameRef.current.roofHP -= 1;
        createParticles(ball.x, ROOF_HEIGHT, "#FFFFFF");
        setScore((s) => s + 100);
      }
    } else {
      // Victoire
      if (ball.y < -BALL_RADIUS * 2) {
        setGameState("VICTORY");
        completeLevel(1);
        unlockLevel(2);
        cancelAnimationFrame(requestRef.current);
        return;
      }
    }

    // Rebond murs latéraux
    if (
      ball.x + ball.dx > CANVAS_WIDTH - BALL_RADIUS ||
      ball.x + ball.dx < BALL_RADIUS
    ) {
      ball.dx = -ball.dx;
    }

    // Gestion de la perte de balle (Vies)
    if (ball.y + ball.dy > CANVAS_HEIGHT - BALL_RADIUS) {
      if (lives > 1) {
        setLives((l) => l - 1);
        resetGame(false); // Reset position balle/raquette
        return; // Pause temporaire implicite par le return avant le requestAnimationFrame suivant (qui sera relancé par l'effect si on voulait, mais ici on continue l'update mais avec positions reset, donc ça "saute" une frame visuellement au reset)
        // Note: Pour une pause plus propre, on pourrait mettre un petit délai, mais ici c'est instantané.
      } else {
        setLives(0);
        setGameState("GAMEOVER");
        cancelAnimationFrame(requestRef.current);
        return;
      }
    }

    // Rebond Raquette
    if (
      ball.y + ball.dy > CANVAS_HEIGHT - PADDLE_HEIGHT - 10 - BALL_RADIUS &&
      ball.x > paddle.x &&
      ball.x < paddle.x + PADDLE_WIDTH
    ) {
      ball.dy = -Math.abs(ball.dy);
      const hitPoint = ball.x - (paddle.x + PADDLE_WIDTH / 2);
      ball.dx = hitPoint * 0.15;
    }

    // Collision Briques
    bricks.forEach((brick) => {
      if (brick.status === 1) {
        if (
          ball.x > brick.x &&
          ball.x < brick.x + BRICK_WIDTH &&
          ball.y > brick.y &&
          ball.y < brick.y + BRICK_HEIGHT
        ) {
          ball.dy = -ball.dy;

          if (brick.type === "UNBREAKABLE") {
            createParticles(
              brick.x + BRICK_WIDTH / 2,
              brick.y + BRICK_HEIGHT / 2,
              "#94A3B8"
            );
          } else {
            brick.status = 0;
            setScore((s) => s + 50);
            createParticles(
              brick.x + BRICK_WIDTH / 2,
              brick.y + BRICK_HEIGHT / 2,
              brick.color
            );
          }
        }
      }
    });

    ball.x += ball.dx;
    ball.y += ball.dy;

    requestRef.current = requestAnimationFrame(update);
  }, [gameState, lives]); // Dépendance lives ajoutée

  // Gestion de la souris
  const handleMouseMove = (e) => {
    if (gameState !== "PLAYING" && gameState !== "MENU") return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const scaleX = CANVAS_WIDTH / rect.width;
    const paddleX = relativeX * scaleX - PADDLE_WIDTH / 2;

    if (paddleX > 0 && paddleX < CANVAS_WIDTH - PADDLE_WIDTH) {
      gameRef.current.paddle.x = paddleX;
    }
  };

  // Init
  useEffect(() => {
    initLevel();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, [initLevel]);

  // Loop trigger
  useEffect(() => {
    if (gameState === "PLAYING") {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, update]);

  // --- RENDU UI ---

  const SidebarItem = ({ icon: Icon, label, active = false }) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
        active
          ? "text-blue-400 bg-blue-900/20 border-l-2 border-blue-400"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#020617] text-white font-sans overflow-hidden">
      {/* MAIN CONTENT */}
      <main className="flex-1 relative flex flex-col">
        {/* HEADER */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0B1221]/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition-colors"></div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 uppercase tracking-widest">
                Score
              </span>
              <span className="text-xl font-bold font-mono text-blue-400">
                {score.toString().padStart(5, "0")}
              </span>
            </div>

            {/* Affichage des Vies */}
            <div className="flex items-center gap-1.5 bg-gray-900/50 px-3 py-1.5 rounded-full border border-white/5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < lives
                      ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-100"
                      : "bg-gray-800 scale-75"
                  }`}
                />
              ))}
            </div>

            {/* Indicateur Objectif */}
            <div className="bg-blue-900/30 px-3 py-1 rounded border border-blue-500/30 text-xs font-medium text-blue-300">
              OBJECTIF : BRISER LE TOIT
            </div>
          </div>
        </header>

        {/* GAME AREA */}
        <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-[#020617] via-[#0B1221] to-[#020617] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />

          {/* CANVAS */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseMove={handleMouseMove}
            className={`rounded-xl border shadow-2xl bg-[#020617]/80 cursor-none max-w-[95%] max-h-[90%] aspect-[4/3] transition-colors duration-500 ${
              gameState === "GAMEOVER"
                ? "border-red-500/30 shadow-red-900/20"
                : "border-white/10"
            }`}
            style={{ touchAction: "none" }}
          />

          {/* MENU START */}
          {gameState === "MENU" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-600 mb-2 drop-shadow-lg">
                CYBER BREAKOUT
              </h1>
              <p className="text-gray-400 mb-8 tracking-widest uppercase text-sm">
                Cassez le pare-feu du toit pour vous échapper
              </p>

              <button
                onClick={() => {
                  setGameState("PLAYING");
                  initLevel();
                }}
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
              >
                <div className="flex items-center gap-2">
                  <Play className="fill-current" />
                  LANCER LE PIRATAGE
                </div>
              </button>
            </div>
          )}

          {/* VICTORY & GAMEOVER MODAL */}
          {(gameState === "VICTORY" || gameState === "GAMEOVER") && (
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
                    <span className="text-3xl font-bold text-white">
                      {score}
                    </span>
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
                    {gameState === "VICTORY"
                      ? "Rejouer le niveau"
                      : "Réessayer"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
