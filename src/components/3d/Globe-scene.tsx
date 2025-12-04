"use client";

import { Stars } from "@react-three/drei";

import type { Level } from "@/types/types";
import { Globe3D } from "./Globe-3d";

interface GlobeSceneProps {
  levels: Level[];
  selectedLevel: number;
  onLevelSelect: (index: number) => void;
  debug?: boolean;
}

export function GlobeScene({
  levels,
  selectedLevel,
  onLevelSelect,
  debug = false,
}: GlobeSceneProps) {
  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4169e1" />

      <Globe3D
        selectedLevel={selectedLevel}
        levels={levels}
        onLevelSelect={onLevelSelect}
        debug={debug}
      />
    </>
  );
}
