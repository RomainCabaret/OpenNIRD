"use client";

import { Environment, Html, OrbitControls, useGLTF, Stars } from "@react-three/drei";
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
  OldPC = "OldPC",
  BrokenPhone = "BrokenPhone",
  SatellitePart = "SatellitePart",
  FloppyDisk = "FloppyDisk",
  SpaceBattery = "SpaceBattery",
  Tesla = "Tesla",      // LÉGENDAIRE 1
  Skeleton = "Skeleton", // LÉGENDAIRE 2
  Tardis = "Tardis",     // LÉGENDAIRE 3 (Doctor Who)
}

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
  
  teslaRed: "#dc2626",
  starmanWhite: "#ffffff",
  boneColor: "#e5e5e5",
  
  // TARDIS Colors
  tardisBlue: "#1e3a8a",  // Bleu nuit profond (Blue 900)
  tardisWindow: "#e0f2fe", // Bleu très clair/blanc (Sky 100)
  tardisLight: "#fef3c7", // Jaune pâle pour la lampe
  
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
    JunkType.SpaceBattery
  ];
  return commonTypes[Math.floor(Math.random() * commonTypes.length)];
};

// --- MODÈLES 3D EXTRAITS (Définis AVANT utilisation) ---

// --- SOUCOUPE VOLANTE (MODIFIÉE : Éclairage adouci) ---
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
      {/* Corps principal - MODIFIÉ : Moins métallique, plus rugueux */}
      <mesh position-y={0} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial
          color={COLORS.saucerBody}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      {/* Cockpit */}
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
      // Pulsation lente
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
      ref.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {/* Lumière ponctuelle bleue douce */}
      <pointLight color={COLORS.normalBlue} distance={2} intensity={1.5} decay={2} />
      
      {/* Anneau de halo simple */}
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
      // Pulsation et rotation
      ref.current.rotation.y = t * 0.5;
      ref.current.rotation.z = t * 0.2;
      ref.current.scale.setScalar(1 + Math.sin(t * 4) * 0.05);
    }
  });

  return (
    <group ref={ref}>
      {/* Lumière ponctuelle dorée intense */}
      <pointLight color={COLORS.legendaryGold} distance={3} intensity={3} decay={2} />
      
      {/* Sphère de halo interne */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
            color={COLORS.legendaryGold} 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} // Important pour voir à travers
        />
      </mesh>

      {/* Anneaux d'énergie */}
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

// --- NOUVEAU LÉGENDAIRE : TARDIS (Doctor Who) ---
const ModelTardis = memo(() => (
  <group scale={1} rotation={[0, 0, 0.1]}>
      <LegendaryHalo />
      
      {/* Boite principale */}
      <mesh castShadow>
          <boxGeometry args={[0.3, 0.6, 0.3]} />
          <meshStandardMaterial color={COLORS.tardisBlue} roughness={0.2} metalness={0.4} />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.35, 0.05, 0.35]} />
          <meshStandardMaterial color={COLORS.tardisBlue} roughness={0.2} />
      </mesh>

      {/* Toit */}
      <group position={[0, 0.32, 0]}>
          <mesh>
              <boxGeometry args={[0.32, 0.05, 0.32]} />
              <meshStandardMaterial color={COLORS.tardisBlue} />
          </mesh>
          <mesh position={[0, 0.05, 0]} rotation={[0, Math.PI/4, 0]}>
              <coneGeometry args={[0.2, 0.15, 4]} />
              <meshStandardMaterial color={COLORS.tardisBlue} />
          </mesh>
          {/* Lampe */}
          <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08]} />
              <meshStandardMaterial color={COLORS.tardisLight} emissive={COLORS.tardisLight} emissiveIntensity={1} toneMapped={false} />
          </mesh>
      </group>

      {/* Fenêtres et panneaux */}
      <group>
          {/* Face Avant */}
          <mesh position={[0, 0.15, 0.151]}>
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color={COLORS.tardisWindow} emissive={COLORS.tardisWindow} emissiveIntensity={0.5} />
          </mesh>
          {/* Face Arrière */}
          <mesh position={[0, 0.15, -0.151]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color={COLORS.tardisWindow} emissive={COLORS.tardisWindow} emissiveIntensity={0.5} />
          </mesh>
          {/* Face Gauche */}
          <mesh position={[-0.151, 0.15, 0]} rotation={[0, -Math.PI/2, 0]}>
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color={COLORS.tardisWindow} emissive={COLORS.tardisWindow} emissiveIntensity={0.5} />
          </mesh>
          {/* Face Droite */}
          <mesh position={[0.151, 0.15, 0]} rotation={[0, Math.PI/2, 0]}>
              <planeGeometry args={[0.2, 0.1]} />
              <meshStandardMaterial color={COLORS.tardisWindow} emissive={COLORS.tardisWindow} emissiveIntensity={0.5} />
          </mesh>
      </group>
  </group>
));

// --- COMPOSANTS INTERMÉDIAIRES (Définis AVANT usage) ---

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

  const isLegendary = type === JunkType.Tesla || type === JunkType.Skeleton || type === JunkType.Tardis;

  return (
    <group ref={mesh} position={position}>
      {/* Ajoute le Halo Normal si ce n'est pas un légendaire */}
      {!isLegendary && <NormalHalo />}

      <group visible={type === JunkType.OldPC}><ModelOldPC /></group>
      <group visible={type === JunkType.BrokenPhone}><ModelBrokenPhone /></group>
      <group visible={type === JunkType.SatellitePart}><ModelSatellite /></group>
      <group visible={type === JunkType.FloppyDisk}><ModelFloppy /></group>
      <group visible={type === JunkType.SpaceBattery}><ModelBattery /></group>
      <group visible={type === JunkType.Tesla}><ModelTesla /></group>
      <group visible={type === JunkType.Skeleton}><ModelSkeleton /></group>
      <group visible={type === JunkType.Tardis}><ModelTardis /></group>
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

// --- MAIN COMPONENT (Définition à la fin) ---

export function Snake3D() {
  const [snake, setSnake] = useState<Vector2[]>([
    { x: 7, y: 7 },
    { x: 7, y: 6 },
    { x: 7, y: 5 },
  ]);
  const [food, setFood] = useState<Vector2>({ x: 10, y: 10 });
  const [foodType, setFoodType] = useState<JunkType>(JunkType.OldPC);
  const [direction, setDirection] = useState<Vector2>({ x: 0, y: 1 });
  
  const [hasTeslaSpawned, setHasTeslaSpawned] = useState(false);
  const [hasSkeletonSpawned, setHasSkeletonSpawned] = useState(false);
  const [hasTardisSpawned, setHasTardisSpawned] = useState(false); // NOUVEAU

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
        // --- LOGIQUE DE JEU AVEC ACCÈS DIRECT À L'ÉTAT ACTUEL ---
        const head = snake[0];
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
          snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          return;
        }

        const newSnake = [newHead, ...snake];

        // MANGER
        if (newHead.x === food.x && newHead.y === food.y) {
          const isLegendary = foodType === JunkType.Tesla || foodType === JunkType.Skeleton || foodType === JunkType.Tardis;
          const points = isLegendary ? 50 : 10;
          setScore((s) => s + points);
          
          setFood(getRandomPos(newSnake));
          
          // Logique Légendaire
          const availableLegendaries = [];
          if (!hasTeslaSpawned) availableLegendaries.push(JunkType.Tesla);
          if (!hasSkeletonSpawned) availableLegendaries.push(JunkType.Skeleton);
          if (!hasTardisSpawned) availableLegendaries.push(JunkType.Tardis);

          // 10% de chance de spawn un légendaire (si dispo)
          if (availableLegendaries.length > 0 && Math.random() < 0.1) {
             const nextLegendary = availableLegendaries[Math.floor(Math.random() * availableLegendaries.length)];
             setFoodType(nextLegendary);
             if (nextLegendary === JunkType.Tesla) setHasTeslaSpawned(true);
             if (nextLegendary === JunkType.Skeleton) setHasSkeletonSpawned(true);
             if (nextLegendary === JunkType.Tardis) setHasTardisSpawned(true);
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
  }, [snake, food, gameOver, gameStarted, isPaused, hasTeslaSpawned, hasSkeletonSpawned, hasTardisSpawned, foodType]); 

  // --- CONTROLS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p") {
        if (!gameOver && gameStarted) setIsPaused((prev) => !prev);
        return;
      }
      if (!gameStarted && e.code === "Space") {
        setGameStarted(true);
        setFoodType(getRandomNormalJunk());
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
          if (currentDir.y !== -1) {
            const newDir = { x: 0, y: 1 };
            directionRef.current = newDir;
            setDirection(newDir);
          }
          break;
        case "ArrowDown":
          if (currentDir.y !== 1) {
            const newDir = { x: 0, y: -1 };
            directionRef.current = newDir;
            setDirection(newDir);
          }
          break;
        case "ArrowLeft":
          if (currentDir.x !== 1) {
            const newDir = { x: -1, y: 0 };
            directionRef.current = newDir;
            setDirection(newDir);
          }
          break;
        case "ArrowRight":
          if (currentDir.x !== -1) {
            const newDir = { x: 1, y: 0 };
            directionRef.current = newDir;
            setDirection(newDir);
          }
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
    setFoodType(getRandomNormalJunk());
    setHasTeslaSpawned(false);
    setHasSkeletonSpawned(false);
    setHasTardisSpawned(false); // Reset Tardis
    setDirection({ x: 0, y: 1 });
    directionRef.current = { x: 0, y: 1 };
    lastProcessedDirection.current = { x: 0, y: 1 };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setIsPaused(false);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* UI SCORE & MESSAGES */}
      <div className="absolute top-8 left-8 z-10 font-black text-white text-3xl tracking-widest pointer-events-none drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
        SCORE: <span className="text-red-400">{score}</span>
      </div>

      {isPaused && !gameOver && gameStarted && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-3xl border border-red-900 bg-slate-900/90 p-8 text-center shadow-2xl shadow-red-900/20">
            <h1 className="text-5xl font-black text-white tracking-widest animate-pulse drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">PAUSE</h1>
            <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-wider">Appuie sur P pour reprendre</p>
          </div>
        </div>
      )}

      {(!gameStarted || gameOver) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900/90 border border-red-900 rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(255,0,0,0.2)] transform transition-all hover:scale-105">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 uppercase italic mb-4 drop-shadow-sm">
              {gameOver ? "SYSTEM FAILURE" : "SPACE SNAKE"}
            </h1>
            <p className="text-slate-300 font-bold tracking-wider mb-8 animate-bounce bg-slate-800 px-6 py-3 rounded-full border border-slate-700">
              Appuie sur ESPACE pour {gameOver ? "rebooter" : "initialiser"}
            </p>
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