"use client";

import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, useMemo, memo } from "react";
import * as THREE from "three";

// --- CONSTANTES ---
const GRID_SIZE = 15;
const TICK_RATE = 150;
const VISUAL_OFFSET = -Math.floor(GRID_SIZE / 2);

type Vector2 = { x: number; y: number };

// TYPES DE DÉCHETS
enum JunkType {
  // ANCIENS
  OldPC = "OldPC",
  BrokenPhone = "BrokenPhone",
  SatellitePart = "SatellitePart",
  FloppyDisk = "FloppyDisk",
  SpaceBattery = "SpaceBattery",
  
  // NOUVEAUX (INFORMATIQUE)
  CRTMonitor = "CRTMonitor",
  RAMStick = "RAMStick",
  OldMouse = "OldMouse",
  HardDrive = "HardDrive",
  WifiRouter = "WifiRouter",

  // LÉGENDAIRES
  Tesla = "Tesla",      // LÉGENDAIRE 1
  Skeleton = "Skeleton", // LÉGENDAIRE 2
  Tardis = "Tardis",     // LÉGENDAIRE 3 (Doctor Who)
  SpaceCore = "SpaceCore", // LÉGENDAIRE 4 (Portal 2)
  WallE = "WallE",         // LÉGENDAIRE 5 (Wall-E)
}

// MAPPING POUR L'UI (Noms, Descriptions et Icônes 2D)
const JUNK_INFO: Record<JunkType, { name: string; desc: string; icon: string; legendary: boolean }> = {
  // ANCIENS
  [JunkType.OldPC]: { name: "Vieux PC", desc: "Il tourne encore sous Windows 95.", icon: "💻", legendary: false },
  [JunkType.BrokenPhone]: { name: "Téléphone Cassé", desc: "L'écran est fissuré, mais il capte la 5G spatiale.", icon: "📱", legendary: false },
  [JunkType.SatellitePart]: { name: "Débris Satellite", desc: "Un morceau de métal qui a vu du pays.", icon: "🛰️", legendary: false },
  [JunkType.FloppyDisk]: { name: "Disquette", desc: "1.44 Mo de pure nostalgie.", icon: "💾", legendary: false },
  [JunkType.SpaceBattery]: { name: "Batterie Spatiale", desc: "Encore chargée à 2%.", icon: "🔋", legendary: false },
  
  // NOUVEAUX (INFORMATIQUE)
  [JunkType.CRTMonitor]: { name: "Écran Cathodique", desc: "Lourd comme un âne mort et magnétique.", icon: "📺", legendary: false },
  [JunkType.RAMStick]: { name: "Barrette de RAM", desc: "Pour télécharger plus de mémoire vive.", icon: "🎫", legendary: false },
  [JunkType.OldMouse]: { name: "Souris à Boule", desc: "Il faut nettoyer la boule encrassée.", icon: "🖱️", legendary: false },
  [JunkType.HardDrive]: { name: "Disque Dur HDD", desc: "Ça gratte quand ça réfléchit.", icon: "💽", legendary: false },
  [JunkType.WifiRouter]: { name: "Routeur Wi-Fi", desc: "Le mot de passe est sous la box.", icon: "📶", legendary: false },

  // LÉGENDAIRES
  [JunkType.Tesla]: { name: "Starman & Tesla", desc: "Il conduit vers l'infini et au-delà depuis 2018.", icon: "🚗", legendary: true },
  [JunkType.Skeleton]: { name: "Skeleton", desc: "Qu'est-ce que ça fait là ça ?", icon: "💀", legendary: true },
  [JunkType.Tardis]: { name: "Cabine Bleue", desc: "C'est plus grand à l'intérieur !", icon: "🟦", legendary: true },
  [JunkType.SpaceCore]: { name: "Sphère Espace", desc: "ESPACE ! JE SUIS DANS L'ESPACE ! OH OUAIS !", icon: "🤪", legendary: true },
  [JunkType.WallE]: { name: "Petit Compacteur", desc: "Il cherche une plante verte désespérément.", icon: "♻️", legendary: true },
};

// --- COULEURS THEME ESPACE ---
const COLORS = {
  spaceshipBody: "#f8fafc",
  spaceshipWindowFrame: "#cbd5e1",
  spaceshipCockpit: "#bae6fd",
  spaceshipEngine: "#ef4444",

  junkMetalDark: "#9ca3af",
  junkMetalLight: "#cbd5e1",
  junkCircuit: "#4ade80",
  junkScreen: "#64748b",
  junkRust: "#d97706",
  junkPlasticBlue: "#3b82f6",
  
  // New IT Colors
  beigePlastic: "#fdf6e3", // Pour CRT et Souris
  pcbGreen: "#15803d",     // Pour RAM
  chipBlack: "#171717",
  hddSilver: "#e2e8f0",
  routerBlack: "#0f172a",
  ledBlue: "#3b82f6",

  teslaRed: "#dc2626",
  starmanWhite: "#ffffff",
  boneColor: "#e5e5e5",
  
  // TARDIS Colors
  tardisBlue: "#1e3a8a",
  tardisWindow: "#e0f2fe",
  tardisLight: "#fef3c7",
  
  // Space Core
  coreWhite: "#f1f5f9",
  coreEyeOrange: "#f59e0b",
  coreBlack: "#1e293b",

  // Wall-E
  wallEYellow: "#fbbf24",
  wallEGrey: "#4b5563",
  wallETracks: "#1f2937",
  wallEEyeLens: "#1e293b",

  laser: "#ff0000",
  laserPost: "#ef4444",
  
  legendaryGold: "#fbbf24", // Or pour le halo légendaire
  normalBlue: "#60a5fa", // Bleu clair pour le halo normal

  // Flying Saucer
  saucerBody: "#c0c0c0",
  saucerCockpit: "#aaffff",
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

const getRandomNormalJunk = (): JunkType => {
  const commonTypes = [
    JunkType.OldPC, 
    JunkType.BrokenPhone, 
    JunkType.SatellitePart, 
    JunkType.FloppyDisk, 
    JunkType.SpaceBattery,
    JunkType.CRTMonitor,
    JunkType.RAMStick,
    JunkType.OldMouse,
    JunkType.HardDrive,
    JunkType.WifiRouter
  ];
  return commonTypes[Math.floor(Math.random() * commonTypes.length)];
};

// --- MODÈLES 3D ---

function FlyingSaucer() {
  const ufoRef = useRef<THREE.Group>(null);
  const cockpitRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ufoRef.current) return;
    const time = state.clock.elapsedTime;

    // Orbite autour du terrain de jeu
    const orbitRadius = 12;
    
    ufoRef.current.position.set(
      Math.cos(time * 0.3) * orbitRadius, // X
      Math.sin(time * 0.3) * orbitRadius, // Y
      3 + Math.sin(time * 1.5) * 0.5 // Z
    );

    // Rotation
    ufoRef.current.rotation.z = time * 0.5;
    ufoRef.current.rotation.x = Math.sin(time) * 0.2;
    ufoRef.current.rotation.y = Math.cos(time) * 0.2; 

    if (cockpitRef.current) {
      const isBlinking = Math.sin(time * 10) > 0;
      (cockpitRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isBlinking ? 0.4 : 0.1;
    }
  });

  return (
    <group ref={ufoRef} scale={1.5}>
      <mesh position-y={0} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial
          color={COLORS.saucerBody}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      <mesh ref={cockpitRef} position-z={0.05} rotation={[Math.PI/2, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={COLORS.saucerCockpit}
          transparent
          opacity={0.6}
          emissive={COLORS.saucerCockpit}
          emissiveIntensity={0.1}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

// --- EFFET HALO NORMAL ---
const NormalHalo = () => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime;
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
      ref.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group ref={ref}>
      <pointLight color={COLORS.normalBlue} distance={2} intensity={1.5} decay={2} />
      <mesh rotation={[Math.PI/2, 0, 0]}>
         <torusGeometry args={[0.5, 0.02, 8, 32]} />
         <meshBasicMaterial color={COLORS.normalBlue} transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
};

// --- EFFET HALO LÉGENDAIRE ---
const LegendaryHalo = () => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime;
      ref.current.rotation.y = t * 0.5;
      ref.current.rotation.z = t * 0.2;
      ref.current.scale.setScalar(1 + Math.sin(t * 4) * 0.05);
    }
  });

  return (
    <group ref={ref}>
      <pointLight color={COLORS.legendaryGold} distance={3} intensity={3} decay={2} />
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
            color={COLORS.legendaryGold} 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI/2, 0, 0]}>
         <torusGeometry args={[0.6, 0.01, 8, 32]} />
         <meshBasicMaterial color={COLORS.legendaryGold} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <mesh rotation={[0, Math.PI/4, 0]}>
         <torusGeometry args={[0.55, 0.01, 8, 32]} />
         <meshBasicMaterial color={COLORS.legendaryGold} transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
};

// --- MODÈLES EXISTANTS ---
const ModelOldPC = memo(() => (
  <group scale={0.6}>
    <mesh castShadow>
      <boxGeometry args={[0.6, 0.8, 0.3]} />
      <meshStandardMaterial color={COLORS.junkMetalDark} roughness={0.5} metalness={0.6} emissive={COLORS.junkMetalDark} emissiveIntensity={0.2} />
    </mesh>
    <mesh position={[0, 0.2, 0.16]}>
      <boxGeometry args={[0.5, 0.1, 0.02]} />
      <meshStandardMaterial color={COLORS.junkMetalLight} emissive={COLORS.junkMetalLight} emissiveIntensity={0.2} />
    </mesh>
  </group>
));

const ModelBrokenPhone = memo(() => (
  <group scale={0.5}>
    <mesh castShadow>
      <boxGeometry args={[0.4, 0.7, 0.05]} />
      <meshStandardMaterial color={COLORS.junkMetalDark} roughness={0.3} metalness={0.8} emissive={COLORS.junkMetalDark} emissiveIntensity={0.2} />
    </mesh>
    <mesh position={[0, 0, 0.03]}>
      <planeGeometry args={[0.35, 0.6]} />
      <meshStandardMaterial color={COLORS.junkScreen} roughness={0.1} metalness={0.5} emissive={COLORS.junkScreen} emissiveIntensity={0.1} />
      <mesh rotation={[0, 0, Math.PI/4]} position={[0,0,0.01]}>
          <planeGeometry args={[0.4, 0.02]} />
          <meshBasicMaterial color="white" />
      </mesh>
    </mesh>
  </group>
));

const ModelSatellite = memo(() => (
  <group scale={0.6}>
    <mesh castShadow rotation={[Math.PI/2, 0, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
      <meshStandardMaterial color={COLORS.junkMetalLight} roughness={0.3} metalness={0.8} emissive={COLORS.junkMetalLight} emissiveIntensity={0.2} />
    </mesh>
    <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI/6]}>
        <boxGeometry args={[0.4, 0.02, 0.5]} />
        <meshStandardMaterial color={COLORS.junkCircuit} roughness={0.6} metalness={0.3} emissive={COLORS.junkCircuit} emissiveIntensity={0.3} />
        <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.38, 0.01, 0.48]} />
            <meshStandardMaterial color="#1e3a8a" emissive="#1e3a8a" emissiveIntensity={0.2} roughness={0.1} metalness={0.9} />
        </mesh>
    </mesh>
    <mesh position={[-0.2, 0.3, 0]} rotation={[0, Math.PI/4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color={COLORS.junkRust} roughness={0.8} metalness={0.5} emissive={COLORS.junkRust} emissiveIntensity={0.2} />
    </mesh>
  </group>
));

const ModelFloppy = memo(() => (
  <group scale={0.7}>
      <mesh castShadow>
          <boxGeometry args={[0.6, 0.6, 0.05]} />
          <meshStandardMaterial color={COLORS.junkPlasticBlue} roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0.03]}>
          <boxGeometry args={[0.3, 0.18, 0.01]} />
          <meshStandardMaterial color={COLORS.junkMetalLight} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.15, 0.03]} rotation={[0,0,0]}>
          <planeGeometry args={[0.5, 0.25]} />
          <meshStandardMaterial color="#f1f5f9" />
      </mesh>
  </group>
));

const ModelBattery = memo(() => (
  <group scale={0.7} rotation={[Math.PI/4, Math.PI/4, 0]}>
       <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
          <meshStandardMaterial color={COLORS.junkMetalDark} metalness={0.6} roughness={0.4} />
      </mesh>
       <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color={COLORS.junkMetalLight} />
      </mesh>
      <mesh position={[0.1, 0, 0.1]}>
          <sphereGeometry args={[0.08]} />
          <meshStandardMaterial color={COLORS.junkCircuit} emissive={COLORS.junkCircuit} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
       <mesh position={[-0.05, -0.1, 0.12]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color={COLORS.junkCircuit} emissive={COLORS.junkCircuit} emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
  </group>
));

// --- NOUVEAUX MODÈLES (INFORMATIQUE) ---

const ModelCRTMonitor = memo(() => (
  <group scale={0.8}>
    {/* Body */}
    <mesh castShadow>
      <boxGeometry args={[0.6, 0.5, 0.4]} />
      <meshStandardMaterial color={COLORS.beigePlastic} roughness={0.6} />
    </mesh>
    {/* Back bulge */}
    <mesh position={[0, 0, -0.3]} castShadow>
      <boxGeometry args={[0.4, 0.3, 0.3]} />
      <meshStandardMaterial color={COLORS.beigePlastic} roughness={0.6} />
    </mesh>
    {/* Screen */}
    <mesh position={[0, 0, 0.21]}>
      <boxGeometry args={[0.5, 0.38, 0.02]} />
      <meshStandardMaterial color="#1f2937" roughness={0.2} />
    </mesh>
    {/* Glare/Glass */}
    <mesh position={[0, 0, 0.22]}>
       <planeGeometry args={[0.45, 0.35]} />
       <meshStandardMaterial color="#374151" transparent opacity={0.3} roughness={0.1} />
    </mesh>
  </group>
));

const ModelRAMStick = memo(() => (
  <group scale={0.8} rotation={[0, 0, Math.PI/4]}>
    {/* PCB */}
    <mesh castShadow>
      <boxGeometry args={[0.8, 0.2, 0.02]} />
      <meshStandardMaterial color={COLORS.pcbGreen} roughness={0.5} />
    </mesh>
    {/* Chips */}
    <group position={[0, 0, 0.02]}>
      <mesh position={[-0.25, 0, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.01]} />
        <meshStandardMaterial color={COLORS.chipBlack} />
      </mesh>
      <mesh position={[-0.08, 0, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.01]} />
        <meshStandardMaterial color={COLORS.chipBlack} />
      </mesh>
      <mesh position={[0.08, 0, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.01]} />
        <meshStandardMaterial color={COLORS.chipBlack} />
      </mesh>
      <mesh position={[0.25, 0, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.01]} />
        <meshStandardMaterial color={COLORS.chipBlack} />
      </mesh>
    </group>
    {/* Pins */}
    <mesh position={[0, -0.11, 0]}>
       <boxGeometry args={[0.78, 0.02, 0.02]} />
       <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
    </mesh>
  </group>
));

const ModelOldMouse = memo(() => (
  <group scale={0.7}>
    {/* Body */}
    <mesh castShadow position={[0, 0, 0]}>
       <boxGeometry args={[0.3, 0.15, 0.5]} />
       <meshStandardMaterial color={COLORS.beigePlastic} roughness={0.4} />
    </mesh>
    {/* Buttons */}
    <mesh position={[0.08, 0.08, 0.15]}>
       <boxGeometry args={[0.12, 0.02, 0.15]} />
       <meshStandardMaterial color="#e5e7eb" />
    </mesh>
    <mesh position={[-0.08, 0.08, 0.15]}>
       <boxGeometry args={[0.12, 0.02, 0.15]} />
       <meshStandardMaterial color="#e5e7eb" />
    </mesh>
    {/* Cable */}
    <mesh position={[0, -0.05, 0.25]} rotation={[Math.PI/2, 0, 0]}>
       <cylinderGeometry args={[0.02, 0.02, 0.2]} />
       <meshStandardMaterial color="#374151" />
    </mesh>
  </group>
));

const ModelHardDrive = memo(() => (
  <group scale={0.7}>
    {/* Case */}
    <mesh castShadow>
      <boxGeometry args={[0.5, 0.7, 0.1]} />
      <meshStandardMaterial color={COLORS.hddSilver} metalness={0.6} roughness={0.3} />
    </mesh>
    {/* Label */}
    <mesh position={[0, 0.05, 0.06]}>
       <planeGeometry args={[0.4, 0.5]} />
       <meshStandardMaterial color="#1e293b" />
    </mesh>
    <mesh position={[0, 0.15, 0.07]}>
       <planeGeometry args={[0.3, 0.1]} />
       <meshStandardMaterial color="white" />
    </mesh>
    {/* Connector */}
    <mesh position={[0, -0.35, 0]}>
       <boxGeometry args={[0.3, 0.05, 0.08]} />
       <meshStandardMaterial color="#0f172a" />
    </mesh>
  </group>
));

const ModelWifiRouter = memo(() => (
  <group scale={0.8}>
    {/* Body */}
    <mesh castShadow>
      <boxGeometry args={[0.6, 0.15, 0.4]} />
      <meshStandardMaterial color={COLORS.routerBlack} roughness={0.2} />
    </mesh>
    {/* Lights */}
    <group position={[0.2, 0.08, 0.15]}>
       <mesh position={[0, 0, 0]}>
         <sphereGeometry args={[0.02]} />
         <meshStandardMaterial color={COLORS.ledBlue} emissive={COLORS.ledBlue} emissiveIntensity={2} toneMapped={false} />
       </mesh>
       <mesh position={[-0.06, 0, 0]}>
         <sphereGeometry args={[0.02]} />
         <meshStandardMaterial color={COLORS.ledBlue} emissive={COLORS.ledBlue} emissiveIntensity={2} toneMapped={false} />
       </mesh>
       <mesh position={[-0.12, 0, 0]}>
         <sphereGeometry args={[0.02]} />
         <meshStandardMaterial color={COLORS.ledBlue} emissive={COLORS.ledBlue} emissiveIntensity={2} toneMapped={false} />
       </mesh>
    </group>
    {/* Antennas */}
    <mesh position={[-0.25, 0.15, -0.15]} rotation={[0, 0, 0.1]}>
      <cylinderGeometry args={[0.02, 0.02, 0.4]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
    <mesh position={[0.25, 0.15, -0.15]} rotation={[0, 0, -0.1]}>
      <cylinderGeometry args={[0.02, 0.02, 0.4]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
  </group>
));

// --- MODÈLES LÉGENDAIRES ---

const ModelTesla = memo(() => (
  <group scale={1} rotation={[0, 0, 0.2]}>
      {/* HALO LÉGENDAIRE */}
      <LegendaryHalo />
      
      {/* Châssis */}
      <mesh castShadow>
          <boxGeometry args={[0.4, 0.8, 0.2]} />
          <meshStandardMaterial color={COLORS.teslaRed} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Pare-brise */}
      <mesh position={[0, 0.1, 0.15]} rotation={[0.5, 0, 0]}>
          <planeGeometry args={[0.38, 0.2]} />
          <meshStandardMaterial color="#a5f3fc" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Roues */}
      <group>
           <mesh position={[0.22, 0.25, -0.05]} rotation={[0, 0, Math.PI/2]}>
               <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
               <meshStandardMaterial color="black" />
           </mesh>
           <mesh position={[-0.22, 0.25, -0.05]} rotation={[0, 0, Math.PI/2]}>
               <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
               <meshStandardMaterial color="black" />
           </mesh>
           <mesh position={[0.22, -0.25, -0.05]} rotation={[0, 0, Math.PI/2]}>
               <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
               <meshStandardMaterial color="black" />
           </mesh>
           <mesh position={[-0.22, -0.25, -0.05]} rotation={[0, 0, Math.PI/2]}>
               <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
               <meshStandardMaterial color="black" />
           </mesh>
      </group>
      {/* Starman */}
      <group position={[0, -0.1, 0.15]}>
          <mesh position={[0, 0, 0.15]}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial color={COLORS.starmanWhite} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.15, 0.1, 0.15]} />
              <meshStandardMaterial color={COLORS.starmanWhite} />
          </mesh>
      </group>
  </group>
));

const ModelSkeleton = memo(() => (
  <group scale={1}>
      {/* HALO LÉGENDAIRE */}
      <LegendaryHalo />

      <group>
          {/* Crâne */}
          <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color={COLORS.boneColor} roughness={0.6} />
          </mesh>
          {/* Mâchoire */}
          <mesh position={[0, -0.12, 0.05]}>
              <boxGeometry args={[0.16, 0.12, 0.15]} />
              <meshStandardMaterial color={COLORS.boneColor} roughness={0.6} />
          </mesh>
          {/* Yeux */}
          <mesh position={[-0.07, 0.05, 0.16]}>
              <sphereGeometry args={[0.055]} />
              <meshStandardMaterial color="#111827" roughness={1} />
          </mesh>
          <mesh position={[0.07, 0.05, 0.16]}>
              <sphereGeometry args={[0.055]} />
              <meshStandardMaterial color="#111827" roughness={1} />
          </mesh>
          {/* Nez */}
          <mesh position={[0, -0.02, 0.17]}>
              <coneGeometry args={[0.03, 0.06, 3]} />
              <meshStandardMaterial color="#111827" roughness={1} />
          </mesh>
      </group>
  </group>
));

const ModelTardis = memo(() => (
  <group scale={1} rotation={[0, 0, 0.1]}>
      <LegendaryHalo />
      <mesh castShadow>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
          <meshStandardMaterial color={COLORS.tardisBlue} roughness={0.2} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.35, 0.05, 0.35]} />
          <meshStandardMaterial color={COLORS.tardisBlue} roughness={0.2} />
      </mesh>
      <group position={[0, 0.32, 0]}>
          <mesh>
              <boxGeometry args={[0.32, 0.05, 0.32]} />
              <meshStandardMaterial color={COLORS.tardisBlue} />
          </mesh>
          <mesh position={[0, 0.05, 0]} rotation={[0, Math.PI/4, 0]}>
              <coneGeometry args={[0.2, 0.15, 4]} />
              <meshStandardMaterial color={COLORS.tardisBlue} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08]} />
              <meshStandardMaterial color={COLORS.tardisLight} emissive={COLORS.tardisLight} emissiveIntensity={1} toneMapped={false} />
          </mesh>
      </group>
      <group>
          <mesh position={[0, 0.15, 0.151]}>
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color={COLORS.tardisWindow} emissive={COLORS.tardisWindow} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 0.15, -0.151]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color={COLORS.tardisWindow} emissive={COLORS.tardisWindow} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.151, 0.15, 0]} rotation={[0, -Math.PI/2, 0]}>
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color={COLORS.tardisWindow} emissive={COLORS.tardisWindow} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.151, 0.15, 0]} rotation={[0, Math.PI/2, 0]}>
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color={COLORS.tardisWindow} emissive={COLORS.tardisWindow} emissiveIntensity={0.5} />
          </mesh>
      </group>
  </group>
));

const ModelSpaceCore = memo(() => {
    const eyeRef = useRef<THREE.Mesh>(null);
    useFrame(({clock}) => {
        if (eyeRef.current) {
            // L'oeil bouge de panique
            eyeRef.current.position.x = Math.sin(clock.elapsedTime * 10) * 0.02;
            eyeRef.current.position.y = Math.cos(clock.elapsedTime * 8) * 0.02;
        }
    });

    return (
        <group scale={1} rotation={[0, 0, 0.1]}>
            <LegendaryHalo />
            {/* Body Sphere */}
            <mesh castShadow>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color={COLORS.coreWhite} roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Eye Ring */}
            <mesh position={[0, 0, 0.2]} rotation={[Math.PI/2, 0, 0]}>
                <torusGeometry args={[0.12, 0.03, 16, 32]} />
                <meshStandardMaterial color={COLORS.coreBlack} />
            </mesh>
            {/* Eye Pupil */}
            <mesh ref={eyeRef} position={[0, 0, 0.22]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={COLORS.coreEyeOrange} emissive={COLORS.coreEyeOrange} emissiveIntensity={2} toneMapped={false} />
            </mesh>
            {/* Handles */}
            <mesh position={[0.22, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                <torusGeometry args={[0.08, 0.02, 8, 16]} />
                <meshStandardMaterial color={COLORS.coreBlack} />
            </mesh>
            <mesh position={[-0.22, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                <torusGeometry args={[0.08, 0.02, 8, 16]} />
                <meshStandardMaterial color={COLORS.coreBlack} />
            </mesh>
        </group>
    );
});

const ModelWallE = memo(() => (
    <group scale={1} rotation={[0, -Math.PI/4, 0]}>
        <LegendaryHalo />
        {/* Body */}
        <mesh castShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color={COLORS.wallEYellow} roughness={0.7} />
        </mesh>
        {/* Tracks */}
        <mesh position={[0.18, -0.1, 0]}>
            <boxGeometry args={[0.05, 0.15, 0.35]} />
            <meshStandardMaterial color={COLORS.wallETracks} />
        </mesh>
        <mesh position={[-0.18, -0.1, 0]}>
            <boxGeometry args={[0.05, 0.15, 0.35]} />
            <meshStandardMaterial color={COLORS.wallETracks} />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 0.2, -0.1]}>
            <cylinderGeometry args={[0.03, 0.03, 0.2]} />
            <meshStandardMaterial color={COLORS.wallEGrey} />
        </mesh>
        {/* Eyes */}
        <group position={[0, 0.3, -0.05]} rotation={[0.2, 0, 0]}>
            <mesh position={[0.08, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.15]} rotation={[Math.PI/2, 0, 0]} />
                <meshStandardMaterial color={COLORS.wallEGrey} />
                <mesh position={[0, 0.08, 0]}>
                    <sphereGeometry args={[0.04]} />
                    <meshStandardMaterial color={COLORS.wallEEyeLens} roughness={0.1} />
                </mesh>
            </mesh>
            <mesh position={[-0.08, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.15]} rotation={[Math.PI/2, 0, 0]} />
                <meshStandardMaterial color={COLORS.wallEGrey} />
                <mesh position={[0, 0.08, 0]}>
                    <sphereGeometry args={[0.04]} />
                    <meshStandardMaterial color={COLORS.wallEEyeLens} roughness={0.1} />
                </mesh>
            </mesh>
        </group>
    </group>
));

// --- COMPOSANTS INTERMÉDIAIRES ---

function Food({ position, type }: { position: [number, number, number], type: JunkType }) {
  const mesh = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mesh.current) {
      const t = state.clock.elapsedTime;
      mesh.current.position.z = position[2] + Math.sin(t * 2) * 0.1 + 0.2;
      mesh.current.rotation.x = t * 0.5;
      mesh.current.rotation.y = t * 0.7;
      mesh.current.rotation.z = t * 0.3;
    }
  });

  const isLegendary = [JunkType.Tesla, JunkType.Skeleton, JunkType.Tardis, JunkType.SpaceCore, JunkType.WallE].includes(type);

  return (
    <group ref={mesh} position={position}>
      {!isLegendary && <NormalHalo />}
      <group visible={type === JunkType.OldPC}><ModelOldPC /></group>
      <group visible={type === JunkType.BrokenPhone}><ModelBrokenPhone /></group>
      <group visible={type === JunkType.SatellitePart}><ModelSatellite /></group>
      <group visible={type === JunkType.FloppyDisk}><ModelFloppy /></group>
      <group visible={type === JunkType.SpaceBattery}><ModelBattery /></group>
      
      {/* NOUVEAUX (INFORMATIQUE) */}
      <group visible={type === JunkType.CRTMonitor}><ModelCRTMonitor /></group>
      <group visible={type === JunkType.RAMStick}><ModelRAMStick /></group>
      <group visible={type === JunkType.OldMouse}><ModelOldMouse /></group>
      <group visible={type === JunkType.HardDrive}><ModelHardDrive /></group>
      <group visible={type === JunkType.WifiRouter}><ModelWifiRouter /></group>

      <group visible={type === JunkType.Tesla}><ModelTesla /></group>
      <group visible={type === JunkType.Skeleton}><ModelSkeleton /></group>
      <group visible={type === JunkType.Tardis}><ModelTardis /></group>
      <group visible={type === JunkType.SpaceCore}><ModelSpaceCore /></group>
      <group visible={type === JunkType.WallE}><ModelWallE /></group>
    </group>
  );
}

// --- SHOWCASE ITEM POUR LE MODAL ---
function ShowcaseItem({ type }: { type: JunkType }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={ref} scale={2}>
      {type === JunkType.Tesla && <ModelTesla />}
      {type === JunkType.Skeleton && <ModelSkeleton />}
      {type === JunkType.Tardis && <ModelTardis />}
      {type === JunkType.SpaceCore && <ModelSpaceCore />}
      {type === JunkType.WallE && <ModelWallE />}
      
      {/* Support pour les items normaux si jamais on voulait les voir en grand aussi */}
      {type === JunkType.CRTMonitor && <ModelCRTMonitor />}
      {type === JunkType.RAMStick && <ModelRAMStick />}
      {type === JunkType.OldMouse && <ModelOldMouse />}
      {type === JunkType.HardDrive && <ModelHardDrive />}
      {type === JunkType.WifiRouter && <ModelWifiRouter />}
    </group>
  );
}

interface SnakeSegmentProps {
  position: [number, number, number];
  direction: Vector2;
  isHead: boolean;
  isTail: boolean;
  index: number;
}

function SnakeSegment({ position, direction, isHead, isTail, index }: SnakeSegmentProps) {
  const ref = useRef<THREE.Group>(null);
  const targetPos = useMemo(() => new THREE.Vector3(position[0], position[1], position[2]), [position]);
  const mounted = useRef(false);
  const targetLookAt = useMemo(() => new THREE.Vector3(position[0] + direction.x, position[1] + direction.y, position[2]), [position, direction]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.up.set(0, 0, 1);
    if (!mounted.current) {
      ref.current.position.copy(targetPos);
      ref.current.lookAt(targetLookAt);
      mounted.current = true;
    } else {
      ref.current.position.lerp(targetPos, delta * 20);
      const dummy = new THREE.Object3D();
      dummy.up.set(0, 0, 1);
      dummy.position.copy(ref.current.position);
      dummy.lookAt(targetLookAt);
      ref.current.quaternion.slerp(dummy.quaternion, delta * 20);
    }
  });

  return (
    <group ref={ref}>
      {isHead ? (
        <group>
          <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.4, 1, 32]} />
            <meshStandardMaterial color={COLORS.spaceshipBody} roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.25, 0.3]} rotation={[Math.PI / 2 - Math.PI / 6, 0, 0]}>
            <mesh>
                <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
                <meshStandardMaterial color={COLORS.spaceshipCockpit} roughness={0} metalness={1} emissive={COLORS.spaceshipCockpit} emissiveIntensity={0.8} />
            </mesh>
            <mesh rotation={[Math.PI/2, 0, 0]}>
                <torusGeometry args={[0.16, 0.04, 16, 32]} />
                <meshStandardMaterial color={COLORS.spaceshipWindowFrame} roughness={0.3} metalness={0.9} />
            </mesh>
          </mesh>
          <mesh position={[0.45, 0, -0.15]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.05, 0.6]} />
            <meshStandardMaterial color={COLORS.spaceshipBody} roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[-0.45, 0, -0.15]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.5, 0.05, 0.6]} />
            <meshStandardMaterial color={COLORS.spaceshipBody} roughness={0.2} metalness={0.8} />
          </mesh>
          <group position={[0, 0, -0.5]}>
            <mesh position={[0.25, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 0.3, 16]} />
              <meshStandardMaterial color={COLORS.spaceshipBody} roughness={0.2} metalness={0.8} />
              <mesh position={[0, -0.15, 0]}>
                <sphereGeometry args={[0.08]} />
                <meshBasicMaterial color={COLORS.spaceshipEngine} />
              </mesh>
            </mesh>
            <mesh position={[-0.25, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 0.3, 16]} />
              <meshStandardMaterial color={COLORS.spaceshipBody} roughness={0.2} metalness={0.8} />
              <mesh position={[0, -0.15, 0]}>
                <sphereGeometry args={[0.08]} />
                <meshBasicMaterial color={COLORS.spaceshipEngine} />
              </mesh>
            </mesh>
          </group>
        </group>
      ) : isTail ? (
        <group>
          <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.4, 0.8, 32]} />
            <meshStandardMaterial color={COLORS.spaceshipBody} roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
                <sphereGeometry args={[0.15]} />
                <meshBasicMaterial color={COLORS.spaceshipEngine} />
          </mesh>
        </group>
      ) : (
        <group>
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.8, 32]} />
            <meshStandardMaterial color={COLORS.spaceshipBody} roughness={0.2} metalness={0.8} />
            <mesh rotation={[Math.PI/2, 0, 0]}>
                <torusGeometry args={[0.42, 0.05, 16, 32]} />
                <meshStandardMaterial color={COLORS.spaceshipWindowFrame} roughness={0.3} metalness={0.9} />
            </mesh>
            </mesh>
        </group>
      )}
    </group>
  );
}

function LaserPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 8]} rotation={[Math.PI/2, 0, 0]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={COLORS.laserPost} emissive={COLORS.laserPost} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  )
}

function LaserBeam({ position, rotation, length }: { position: [number, number, number], rotation: [number, number, number], length: number }) {
    const ref = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (ref.current) ref.current.material.opacity = 0.6 + Math.sin(clock.elapsedTime * 5) * 0.2;
    })
    return (
        <group position={position} rotation={rotation}>
            <mesh>
                <cylinderGeometry args={[0.03, 0.03, length, 8]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} toneMapped={false} />
            </mesh>
            <mesh ref={ref}>
                <cylinderGeometry args={[0.15, 0.15, length, 8]} />
                <meshBasicMaterial color={COLORS.laser} transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>
        </group>
    )
}

function LaserArena() {
  const border = GRID_SIZE / 2;
  return (
    <group>
      <gridHelper args={[GRID_SIZE, GRID_SIZE, 0xff0000, 0x1e293b]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <meshBasicMaterial transparent opacity={0.1} color={COLORS.laser} />
      </gridHelper>
      <LaserPost position={[-border, -border, 0]} />
      <LaserPost position={[border, -border, 0]} />
      <LaserPost position={[-border, border, 0]} />
      <LaserPost position={[border, border, 0]} />
      <LaserBeam position={[0, border, 0]} rotation={[0, 0, Math.PI / 2]} length={GRID_SIZE} />
      <LaserBeam position={[0, -border, 0]} rotation={[0, 0, Math.PI / 2]} length={GRID_SIZE} />
      <LaserBeam position={[-border, 0, 0]} rotation={[0, 0, 0]} length={GRID_SIZE} />
      <LaserBeam position={[border, 0, 0]} rotation={[0, 0, 0]} length={GRID_SIZE} />
    </group>
  );
}

// --- MAIN COMPONENT ---

export function Snake3D() {
  const [snake, setSnake] = useState<Vector2[]>([
    { x: 7, y: 7 },
    { x: 7, y: 6 },
    { x: 7, y: 5 },
  ]);
  const [food, setFood] = useState<Vector2>({ x: 10, y: 10 });
  const [foodType, setFoodType] = useState<JunkType>(JunkType.OldPC);
  const [direction, setDirection] = useState<Vector2>({ x: 0, y: 1 });
  
  // États de jeu (Légendaires)
  const [hasTeslaSpawned, setHasTeslaSpawned] = useState(false);
  const [hasSkeletonSpawned, setHasSkeletonSpawned] = useState(false);
  const [hasTardisSpawned, setHasTardisSpawned] = useState(false);
  const [hasSpaceCoreSpawned, setHasSpaceCoreSpawned] = useState(false);
  const [hasWallESpawned, setHasWallESpawned] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Nouveaux états pour l'inventaire et le déblocage
  const [inventory, setInventory] = useState<JunkType[]>([]);
  const [showUnlockModal, setShowUnlockModal] = useState<JunkType | null>(null);

  const directionRef = useRef(direction);
  const lastProcessedDirection = useRef(direction);

  // --- ACTIONS ---
  const startGame = () => {
    setGameStarted(true);
    setFoodType(getRandomNormalJunk());
  };

  const handleReset = () => {
    resetGame();
  };

  // --- GAME LOOP ---
  useEffect(() => {
    // On met en pause la boucle si on affiche le modal de déblocage
    if (gameOver || !gameStarted || isPaused || showUnlockModal) return;

    const moveSnake = () => {
        const head = snake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          return;
        }

        const newSnake = [newHead, ...snake];

        // MANGER
        if (newHead.x === food.x && newHead.y === food.y) {
          const eatenType = foodType;
          const isLegendary = [JunkType.Tesla, JunkType.Skeleton, JunkType.Tardis, JunkType.SpaceCore, JunkType.WallE].includes(eatenType);
          const points = isLegendary ? 50 : 10;
          
          setScore((s) => s + points);
          setInventory((prev) => [...prev, eatenType]); // Ajout à l'inventaire
          
          // Si légendaire, on met en pause et on affiche le modal
          if (isLegendary) {
            setShowUnlockModal(eatenType);
            setIsPaused(true); // PAUSE AUTOMATIQUE POUR EVITER LE CRASH
          }

          setFood(getRandomPos(newSnake));
          
          const availableLegendaries = [];
          if (!hasTeslaSpawned && eatenType !== JunkType.Tesla) availableLegendaries.push(JunkType.Tesla);
          if (!hasSkeletonSpawned && eatenType !== JunkType.Skeleton) availableLegendaries.push(JunkType.Skeleton);
          if (!hasTardisSpawned && eatenType !== JunkType.Tardis) availableLegendaries.push(JunkType.Tardis);
          if (!hasSpaceCoreSpawned && eatenType !== JunkType.SpaceCore) availableLegendaries.push(JunkType.SpaceCore);
          if (!hasWallESpawned && eatenType !== JunkType.WallE) availableLegendaries.push(JunkType.WallE);

          // Taux 10%
          if (availableLegendaries.length > 0 && Math.random() < 0.1) {
             const nextLegendary = availableLegendaries[Math.floor(Math.random() * availableLegendaries.length)];
             setFoodType(nextLegendary);
             if (nextLegendary === JunkType.Tesla) setHasTeslaSpawned(true);
             if (nextLegendary === JunkType.Skeleton) setHasSkeletonSpawned(true);
             if (nextLegendary === JunkType.Tardis) setHasTardisSpawned(true);
             if (nextLegendary === JunkType.SpaceCore) setHasSpaceCoreSpawned(true);
             if (nextLegendary === JunkType.WallE) setHasWallESpawned(true);
          } else {
             setFoodType(getRandomNormalJunk());
          }
        } else {
          newSnake.pop();
        }

        setSnake(newSnake);
        lastProcessedDirection.current = directionRef.current;
    };

    const gameInterval = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(gameInterval);
  }, [snake, food, gameOver, gameStarted, isPaused, showUnlockModal, hasTeslaSpawned, hasSkeletonSpawned, hasTardisSpawned, hasSpaceCoreSpawned, hasWallESpawned, foodType]); 

  // --- CONTROLS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Si modal de déblocage ouvert, espace/P pour fermer
      if (showUnlockModal) {
        if (e.code === "Space" || e.key.toLowerCase() === "p") {
          setShowUnlockModal(null);
          setIsPaused(false); // <--- MODIFICATION ICI : On enlève la pause manuelle
        }
        return;
      }

      if (e.key.toLowerCase() === "p") {
        if (!gameOver && gameStarted) setIsPaused((prev) => !prev);
        return;
      }
      if (!gameStarted && e.code === "Space") {
        startGame();
        return;
      }
      if (gameOver && e.code === "Space") {
        handleReset();
        return;
      }
      if (isPaused) return;

      const currentDir = lastProcessedDirection.current;
      
      switch (e.key) {
        case "ArrowUp": if (currentDir.y !== -1) { directionRef.current = { x: 0, y: 1 }; setDirection({ x: 0, y: 1 }); } break;
        case "ArrowDown": if (currentDir.y !== 1) { directionRef.current = { x: 0, y: -1 }; setDirection({ x: 0, y: -1 }); } break;
        case "ArrowLeft": if (currentDir.x !== 1) { directionRef.current = { x: -1, y: 0 }; setDirection({ x: -1, y: 0 }); } break;
        case "ArrowRight": if (currentDir.x !== -1) { directionRef.current = { x: 1, y: 0 }; setDirection({ x: 1, y: 0 }); } break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver, isPaused, showUnlockModal]);

  const resetGame = () => {
    setSnake([{ x: 7, y: 7 }, { x: 7, y: 6 }, { x: 7, y: 5 }]);
    setFood(getRandomPos([{ x: 7, y: 7 }]));
    setFoodType(getRandomNormalJunk());
    setHasTeslaSpawned(false);
    setHasSkeletonSpawned(false);
    setHasTardisSpawned(false);
    setHasSpaceCoreSpawned(false);
    setHasWallESpawned(false);
    setDirection({ x: 0, y: 1 });
    directionRef.current = { x: 0, y: 1 };
    lastProcessedDirection.current = { x: 0, y: 1 };
    setScore(0);
    setInventory([]);
    setGameOver(false);
    setGameStarted(true);
    setIsPaused(false);
    setShowUnlockModal(null);
  };

  // --- RENDER UI HELPERS ---
  const renderInventoryList = () => {
    // On veut afficher les derniers objets récoltés (ex: 8 max)
    const recentItems = [...inventory].reverse().slice(0, 10);
    return (
      <div className="flex gap-2 bg-black/30 backdrop-blur-md p-2 rounded-full border border-white/10 mx-auto">
        {recentItems.map((item, idx) => (
          <div key={idx} className="text-xl" title={JUNK_INFO[item].name}>
            {JUNK_INFO[item].icon}
          </div>
        ))}
      </div>
    );
  };

  const renderFullInventory = () => {
    const legendaryItems = inventory.filter(item => JUNK_INFO[item].legendary);
    const normalItems = inventory.filter(item => !JUNK_INFO[item].legendary);

    return (
      <div className="flex flex-col gap-6 max-w-lg mt-4 p-6 bg-slate-800/50 rounded-xl mx-auto">
        
        {/* SECTION LÉGENDAIRE */}
        {legendaryItems.length > 0 && (
            <div>
                <h3 className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-3 border-b border-yellow-400/30 pb-1">
                    Trésors Légendaires
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {legendaryItems.map((item, idx) => (
                        <div key={`leg-${idx}`} className="group relative text-3xl cursor-help hover:scale-125 transition-transform hover:z-50">
                             {/* Lueur dorée derrière */}
                            <div className="absolute inset-0 bg-yellow-500/30 blur-md rounded-full -z-10 animate-pulse"></div>
                            <div className="drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                                {JUNK_INFO[item].icon}
                            </div>
                            
                            {/* Tooltip */}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg border border-yellow-500/50">
                                <span className="font-bold block text-center text-yellow-400">{JUNK_INFO[item].name}</span>
                                <span className="text-[10px] text-slate-300 italic block text-center">{JUNK_INFO[item].desc}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* SECTION NORMALE */}
        {normalItems.length > 0 && (
             <div>
                {legendaryItems.length > 0 && <div className="w-full h-px bg-slate-700/50 my-2"></div>}
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-3">
                    Bric-à-brac
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                    {normalItems.map((item, idx) => (
                         <div key={`norm-${idx}`} className="group relative text-2xl cursor-help hover:scale-125 transition-transform hover:z-50 opacity-80 hover:opacity-100">
                            {JUNK_INFO[item].icon}
                            {/* Tooltip */}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg border border-slate-700">
                                <span className="font-bold block text-center">{JUNK_INFO[item].name}</span>
                                <span className="text-[10px] text-slate-300 italic block text-center">{JUNK_INFO[item].desc}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden font-sans">
      {/* HUD - TOP BAR */}
      <div className="absolute top-8 left-8 right-8 z-10 flex justify-between items-start pointer-events-none">
        <div className="font-black text-white text-3xl tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
          SCORE: <span className="text-red-400">{score}</span>
        </div>
        {/* INVENTAIRE EN JEU */}
        {inventory.length > 0 && (
          <div className="pointer-events-auto">
            {renderInventoryList()}
          </div>
        )}
      </div>

      {/* MODAL DE DÉBLOCAGE LÉGENDAIRE */}
      {showUnlockModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 mb-8 tracking-tighter drop-shadow-lg animate-pulse">
              OBJET LÉGENDAIRE !
            </h2>
            
            {/* CANVAS DEDIE POUR L'OBJET */}
            <div className="w-64 h-64 md:w-96 md:h-96 relative">
              <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <ShowcaseItem type={showUnlockModal} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={5} />
              </Canvas>
            </div>

            <div className="mt-8 text-center px-4">
              <p className="text-3xl text-white font-bold mb-2">{JUNK_INFO[showUnlockModal].name}</p>
              {/* DESCRIPTION AJOUTÉE ICI */}
              <p className="text-xl text-slate-300 italic mb-8 max-w-md text-center">{JUNK_INFO[showUnlockModal].desc}</p>
              
              <button 
                onClick={() => {
                  setShowUnlockModal(null);
                  setIsPaused(false);
                }}
                className="text-slate-500 uppercase tracking-widest text-sm border-t border-slate-700 pt-4 hover:text-white cursor-pointer"
              >
                Appuie sur ESPACE pour continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAUSE */}
      {isPaused && !gameOver && gameStarted && !showUnlockModal && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-3xl border border-red-900 bg-slate-900/90 p-8 text-center shadow-2xl shadow-red-900/20">
            <h1 className="text-5xl font-black text-white tracking-widest animate-pulse drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">PAUSE</h1>
            <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-wider">Appuie sur P pour reprendre</p>
          </div>
        </div>
      )}

      {/* GAME OVER / START */}
      {(!gameStarted || gameOver) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900/90 border border-red-900 rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(255,0,0,0.2)] transform transition-all hover:scale-105 max-w-2xl w-full">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 uppercase italic mb-4 drop-shadow-sm">
              {gameOver ? "SYSTEM FAILURE" : "SPACE SNAKE"}
            </h1>
            
            {gameOver && inventory.length > 0 && (
              <div className="mb-8">
                <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Butin Récolté</p>
                {renderFullInventory()}
              </div>
            )}

            <button 
                onClick={gameOver ? handleReset : startGame}
                className="text-slate-300 font-bold tracking-wider mb-8 animate-bounce bg-slate-800 px-6 py-3 rounded-full border border-slate-700 inline-block hover:bg-slate-700 hover:text-white cursor-pointer transition-colors"
            >
              Appuie sur ESPACE pour {gameOver ? "rebooter" : "initialiser"}
            </button>
            
            {!gameStarted && !gameOver && (
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 uppercase font-bold">
                <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">⬆️ Haut</span>
                <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">⬇️ Bas</span>
                <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">⬅️ Gauche</span>
                <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">➡️ Droite</span>
                <span className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full border border-red-800">P : Pause</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCÈNE PRINCIPALE */}
      <Canvas camera={{ position: [0, -8, 20], fov: 45 }} shadows>
        <color attach="background" args={['#020617']} />
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={0.5} />
        <ambientLight intensity={0.2} color="#ff0000" />
        <pointLight position={[0, 0, 10]} intensity={0.5} color="#ffffff" />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow color="#fca5a5" />
        <Environment preset="city" />
        <OrbitControls enabled={false} target={[0, 0, 0]} />

        <group rotation={[-Math.PI * 0.05, 0, 0]}>
          <LaserArena />
          <FlyingSaucer />
          
          <group position={[0, 0, 0.5]}>
            {snake.map((segment, i) => {
              let segmentDir = direction;
              if (i > 0) {
                const prev = snake[i - 1];
                segmentDir = { x: prev.x - segment.x, y: prev.y - segment.y };
              }
              if (segmentDir.x === 0 && segmentDir.y === 0) segmentDir = { x: 0, y: 1 };
              return <SnakeSegment key={i} position={[segment.x + VISUAL_OFFSET, segment.y + VISUAL_OFFSET, 0]} direction={segmentDir} isHead={i === 0} isTail={i === snake.length - 1} index={i} />;
            })}
          </group>

          <group position={[0, 0, 0.5]}>
            <Food position={[food.x + VISUAL_OFFSET, food.y + VISUAL_OFFSET, 0]} type={foodType} />
          </group>
        </group>
      </Canvas>
    </div>
  );
}