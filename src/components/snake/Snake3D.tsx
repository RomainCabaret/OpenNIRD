"use client";

import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";

// --- CONSTANTES ---
const GRID_SIZE = 15;
const TICK_RATE = 150;
const VISUAL_OFFSET = -Math.floor(GRID_SIZE / 2);

type Vector2 = { x: number; y: number };

// --- COULEURS CARTOON ---
const COLORS = {
  snakeHead: "#4ade80", // Vert clair
  snakeBodyA: "#86efac", // Rayure A
  snakeBodyB: "#4ade80", // Rayure B
  snakeTail: "#22c55e",
  appleRed: "#ef4444",
  appleLeaf: "#65a30d",
  grass: "#a3e635",
  dirt: "#92400e",
  water: "#0ea5e9",
  tongue: "#f43f5e",
};

// --- UTILITAIRES ---
const getRandomPos = (snake: Vector2[]): Vector2 => {
  let newPos: Vector2;
  do {
    newPos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((seg) => seg.x === newPos.x && seg.y === newPos.y));
  return newPos;
};

export function Snake3D() {
  const [snake, setSnake] = useState<Vector2[]>([
    { x: 7, y: 7 },
    { x: 7, y: 6 },
    { x: 7, y: 5 },
  ]);
  const [food, setFood] = useState<Vector2>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Vector2>({ x: 0, y: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  const lastProcessedDirection = useRef(direction);

  // --- GAME LOOP ---
  useEffect(() => {
    if (gameOver || !gameStarted || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Colisions
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(getRandomPos(newSnake));
        } else {
          newSnake.pop();
        }

        lastProcessedDirection.current = directionRef.current;
        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(gameInterval);
  }, [food, gameOver, gameStarted, isPaused]);

  // --- CONTROLS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p") {
        if (!gameOver && gameStarted) setIsPaused((prev) => !prev);
        return;
      }
      if (!gameStarted && e.code === "Space") {
        setGameStarted(true);
        return;
      }
      if (gameOver && e.code === "Space") {
        resetGame();
        return;
      }
      if (isPaused) return;

      const currentDir = lastProcessedDirection.current;
      switch (e.key) {
        case "ArrowUp":
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case "ArrowDown":
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case "ArrowLeft":
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver, isPaused]);

  const resetGame = () => {
    setSnake([
      { x: 7, y: 7 },
      { x: 7, y: 6 },
      { x: 7, y: 5 },
    ]);
    setFood(getRandomPos([{ x: 7, y: 7 }]));
    setDirection({ x: 0, y: 1 });
    directionRef.current = { x: 0, y: 1 };
    lastProcessedDirection.current = { x: 0, y: 1 };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setIsPaused(false);
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-sky-300 to-sky-100">
      {/* UI SCORE */}
      <div className="absolute top-8 left-8 z-10 font-black text-white text-3xl tracking-widest pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
        SCORE: <span className="text-yellow-300">{score}</span>
      </div>

      {/* UI PAUSE */}
      {isPaused && !gameOver && gameStarted && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="rounded-3xl bg-white/90 p-8 text-center shadow-2xl">
            <h1 className="text-5xl font-black text-sky-500 tracking-widest animate-pulse">
              PAUSE
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-wider">
              Appuie sur P pour reprendre
            </p>
          </div>
        </div>
      )}

      {/* UI START / GAMEOVER */}
      {(!gameStarted || gameOver) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white/90 rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(0,0,0,0.2)] transform transition-all hover:scale-105">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 uppercase italic mb-4 drop-shadow-sm">
              {gameOver ? "GAME OVER" : "SNAKE ISLAND"}
            </h1>
            <p className="text-slate-600 font-bold tracking-wider mb-8 animate-bounce bg-sky-100/50 px-6 py-3 rounded-full">
              Appuie sur ESPACE pour {gameOver ? "recommencer" : "jouer"}
            </p>
            {!gameStarted && !gameOver && (
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500 uppercase font-bold">
                <span className="bg-slate-200 px-3 py-1 rounded-full">
                  ⬆️ Haut
                </span>
                <span className="bg-slate-200 px-3 py-1 rounded-full">
                  ⬇️ Bas
                </span>
                <span className="bg-slate-200 px-3 py-1 rounded-full">
                  ⬅️ Gauche
                </span>
                <span className="bg-slate-200 px-3 py-1 rounded-full">
                  ➡️ Droite
                </span>
                <span className="bg-sky-200 text-sky-700 px-3 py-1 rounded-full">
                  P : Pause
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SCÈNE 3D --- */}
      <Canvas camera={{ position: [0, -2, 20], fov: 50 }} shadows>
        <ambientLight intensity={0.8} color="#fffbeb" />
        <directionalLight
          position={[10, 20, 15]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          color="#fef3c7"
        />

        <Environment preset="park" background blur={0.5} />
        <OrbitControls enabled={false} target={[0, 0, 0]} />

        <group rotation={[-Math.PI * 0.05, 0, 0]}>
          <FloatingIsland />

          {/* SERPENT */}
          <group position={[0, 0, 0.5]}>
            {snake.map((segment, i) => {
              // Calcul de la direction pour chaque segment (pour qu'il regarde le suivant)
              let segmentDir = direction; // Tête : suit l'input
              if (i > 0) {
                const prev = snake[i - 1];
                segmentDir = { x: prev.x - segment.x, y: prev.y - segment.y };
              }
              // Cas rare de superposition
              if (segmentDir.x === 0 && segmentDir.y === 0)
                segmentDir = { x: 0, y: 1 };

              return (
                <SnakeSegment
                  // IMPORTANT: Utiliser l'index comme clé assure que React réutilise
                  // le même composant Mesh pour "le segment 1", "le segment 2", etc.
                  // C'est ce qui permet à l'interpolation (lerp) de fonctionner fluidement.
                  key={i}
                  position={[
                    segment.x + VISUAL_OFFSET,
                    segment.y + VISUAL_OFFSET,
                    0,
                  ]}
                  direction={segmentDir}
                  isHead={i === 0}
                  isTail={i === snake.length - 1}
                  index={i}
                />
              );
            })}
          </group>

          {/* POMME */}
          <group position={[0, 0, 0.5]}>
            <Food
              position={[food.x + VISUAL_OFFSET, food.y + VISUAL_OFFSET, 0]}
            />
          </group>
        </group>
      </Canvas>
    </div>
  );
}

// --- COMPOSANTS 3D ---

interface SnakeSegmentProps {
  position: [number, number, number];
  direction: Vector2;
  isHead: boolean;
  isTail: boolean;
  index: number;
}

function SnakeSegment({
  position,
  direction,
  isHead,
  isTail,
  index,
}: SnakeSegmentProps) {
  const ref = useRef<THREE.Group>(null);

  // Cibles pour l'animation
  const targetPos = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position]
  );
  const mounted = useRef(false);

  // Calcule la rotation cible (LookAt)
  // On crée un point imaginaire devant le segment pour orienter la géométrie
  const targetLookAt = useMemo(() => {
    return new THREE.Vector3(
      position[0] + direction.x,
      position[1] + direction.y,
      position[2]
    );
  }, [position, direction]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Animation fluide
    if (!mounted.current) {
      ref.current.position.copy(targetPos);
      ref.current.lookAt(targetLookAt);
      mounted.current = true;
    } else {
      // Position
      ref.current.position.lerp(targetPos, delta * 20);

      // Rotation (Création d'une matrice temporaire pour calculer le quaternion cible)
      const dummy = new THREE.Object3D();
      dummy.position.copy(ref.current.position);
      dummy.lookAt(targetLookAt); // Regarde vers la cible
      ref.current.quaternion.slerp(dummy.quaternion, delta * 20);
    }
  });

  return (
    <group ref={ref}>
      {/* TÊTE DU SERPENT */}
      {isHead ? (
        <group>
          {/* Crâne */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={COLORS.snakeHead} roughness={0.3} />
          </mesh>
          {/* Museau */}
          <mesh position={[0, 0, 0.2]} scale={[1, 0.8, 1]} castShadow>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={COLORS.snakeHead} roughness={0.3} />
          </mesh>
          {/* Yeux */}
          <group position={[0, 0.25, 0.2]} rotation={[-0.2, 0, 0]}>
            <mesh position={[-0.2, 0, 0]}>
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshBasicMaterial color="white" />
              <mesh position={[0, 0.05, 0.12]}>
                <sphereGeometry args={[0.06]} />
                <meshBasicMaterial color="black" />
              </mesh>
            </mesh>
            <mesh position={[0.2, 0, 0]}>
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshBasicMaterial color="white" />
              <mesh position={[0, 0.05, 0.12]}>
                <sphereGeometry args={[0.06]} />
                <meshBasicMaterial color="black" />
              </mesh>
            </mesh>
          </group>
          {/* Langue animée */}
          <Tongue />
        </group>
      ) : isTail ? (
        // QUEUE POINTUE
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.35, 0.8, 32]} />
          <meshStandardMaterial color={COLORS.snakeTail} roughness={0.4} />
        </mesh>
      ) : (
        // CORPS (Alternance de couleurs)
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          {/* Capsule pour le corps = Cylindre avec bouts ronds simulés */}
          <cylinderGeometry args={[0.42, 0.42, 0.8, 32]} />
          {/* Pour faire simple et joli : Sphère aplatie */}
          {/* <sphereGeometry args={[0.45, 32, 32]} /> */}
          <meshStandardMaterial
            color={index % 2 === 0 ? COLORS.snakeBodyA : COLORS.snakeBodyB}
            roughness={0.4}
          />
        </mesh>
      )}
    </group>
  );
}

function Tongue() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      // Animation de "flick" (langue qui sort et rentre)
      const t = clock.elapsedTime * 10;
      const scale = Math.max(0, Math.sin(t)); // Uniquement positif
      ref.current.scale.z = scale;
      ref.current.visible = scale > 0.1;
    }
  });

  return (
    <group ref={ref} position={[0, -0.1, 0.5]} rotation={[0.2, 0, 0]}>
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[0.08, 0.02, 0.4]} />
        <meshStandardMaterial color={COLORS.tongue} />
      </mesh>
      {/* Bout fourchu */}
      <mesh position={[-0.03, 0, 0.4]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color={COLORS.tongue} />
      </mesh>
      <mesh position={[0.03, 0, 0.4]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.15]} />
        <meshStandardMaterial color={COLORS.tongue} />
      </mesh>
    </group>
  );
}

function Food({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mesh.current) {
      const t = state.clock.elapsedTime;
      mesh.current.position.z = position[2] + Math.sin(t * 3) * 0.1 + 0.15; // Flottement plus rapide
      mesh.current.rotation.y = t;
      // Petit effet de "squash" quand elle flotte
      const scale = 1 + Math.sin(t * 10) * 0.05;
      mesh.current.scale.set(scale, 1 / scale, scale);
    }
  });

  return (
    <group ref={mesh} position={position}>
      {/* Pomme Low Poly mais ronde */}
      <mesh castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={COLORS.appleRed} roughness={0.2} />
      </mesh>
      {/* Tige */}
      <group position={[0, 0.35, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.04, 0.02, 0.2, 8]} />
          <meshStandardMaterial color="#4a2c2a" />
        </mesh>
        <mesh position={[0.15, 0.05, 0]} rotation={[0, 0, Math.PI / 3]}>
          <sphereGeometry args={[0.15, 16, 16]} scale={[1, 0.2, 0.5]} />
          <meshStandardMaterial color={COLORS.appleLeaf} />
        </mesh>
      </group>
    </group>
  );
}

// --- L'ÎLE FLOTTANTE ---
function FloatingIsland() {
  const width = GRID_SIZE;
  const height = GRID_SIZE;
  const thickness = 2;

  return (
    <group position={[0, 0, -thickness / 2]}>
      {/* Herbe */}
      <mesh receiveShadow position={[0, 0, thickness / 2]}>
        <boxGeometry args={[width + 1, height + 1, 0.5]} />
        <meshStandardMaterial color={COLORS.grass} roughness={0.8} />
      </mesh>
      {/* Terre */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width + 0.8, height + 0.8, thickness - 0.5]} />
        <meshStandardMaterial color={COLORS.dirt} roughness={1} />
      </mesh>
      {/* Eau */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[width + 2.5, height + 2.5, thickness * 0.8]} />
        <meshStandardMaterial
          color={COLORS.water}
          transparent
          opacity={0.6}
          roughness={0}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}
