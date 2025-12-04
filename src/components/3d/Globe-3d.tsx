"use client";

import { useUser } from "@/context/UserContext"; // Import du contexte
import { GLOBE_RADIUS, LINE_RADIUS } from "@/lib/constant";
import { latLonToVector3 } from "@/lib/utils";
import type { Level } from "@/types/types";
import { Html } from "@react-three/drei";
import { useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GlobeEnvironment } from "./Globe-environment";
import { ConnectionLine } from "./assets/ConnectionLine";
import { LevelMarkerInstance } from "./assets/LevelMarkerInstance";

interface Globe3DProps {
  selectedLevel: number;
  levels: Level[];
  onLevelSelect: (index: number) => void;
  debug?: boolean;
}

export function Globe3D({
  selectedLevel,
  levels,
  onLevelSelect,
  debug = false,
}: Globe3DProps) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const { isLevelUnlocked } = useUser();

  const [debugCoords, setDebugCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const targetRotationRef = useRef({ y: 0, x: 0 });
  const currentRotationRef = useRef({ y: 0, x: 0 });

  const [colorMap, bumpMap, displacementMap] = useLoader(THREE.TextureLoader, [
    "/textures/00_earthmap1k.jpg",
    "/textures/01_earthbump1k.jpg",
    "/textures/01_earthbump1k.jpg",
  ]);

  // GESTION ROTATION
  useEffect(() => {
    if (selectedLevel >= 0 && selectedLevel < levels.length) {
      const level = levels[selectedLevel];
      const currentAnimatedY = currentRotationRef.current.y;

      const baseTargetY = Math.PI / 2 - (level.lon + 180) * (Math.PI / 180);
      const targetX = (level.lat * Math.PI) / 180;

      let deltaY = baseTargetY - currentAnimatedY;
      while (deltaY > Math.PI) deltaY -= 2 * Math.PI;
      while (deltaY < -Math.PI) deltaY += 2 * Math.PI;

      targetRotationRef.current = {
        y: currentAnimatedY + deltaY,
        x: targetX,
      };
    }
  }, [selectedLevel, levels]);

  useFrame((state, delta) => {
    if (!globeGroupRef.current) return;

    const lerpSpeed = Math.min(5 * delta, 1);
    currentRotationRef.current.y = THREE.MathUtils.lerp(
      currentRotationRef.current.y,
      targetRotationRef.current.y,
      lerpSpeed
    );
    currentRotationRef.current.x = THREE.MathUtils.lerp(
      currentRotationRef.current.x,
      targetRotationRef.current.x,
      lerpSpeed
    );

    globeGroupRef.current.rotation.y = currentRotationRef.current.y;
    globeGroupRef.current.rotation.x = currentRotationRef.current.x;
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!debug || !globeGroupRef.current) return;
    e.stopPropagation();

    const localPoint = globeGroupRef.current.worldToLocal(e.point.clone());
    const R = GLOBE_RADIUS;

    const phi = Math.acos(localPoint.y / R);
    const lat = 90 - (phi * 180) / Math.PI;

    const theta = Math.atan2(localPoint.z, -localPoint.x);
    const lon = (theta * 180) / Math.PI - 180;

    setDebugCoords({ lat, lon });
  };

  return (
    <group>
      <group ref={globeGroupRef}>
        <mesh
          ref={meshRef}
          onPointerMove={handlePointerMove}
          onPointerOut={() => setDebugCoords(null)}
        >
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          <meshPhongMaterial
            map={colorMap}
            bumpMap={bumpMap}
            bumpScale={0.05}
            displacementMap={displacementMap}
            displacementScale={0.15}
            emissive="#0B1221"
            emissiveIntensity={0.1}
          />
        </mesh>

        {levels.map((level, index) => (
          <LevelMarkerInstance
            key={level.id}
            level={level}
            isSelected={index === selectedLevel}
            isLocked={!isLevelUnlocked(level.id)}
            onClick={() => onLevelSelect(index)}
          />
        ))}

        {levels.map((level, index) => {
          if (index >= levels.length - 1) return null;

          const nextLevel = levels[index + 1];
          const isPathActive = isLevelUnlocked(nextLevel.id);

          return (
            <ConnectionLine
              key={`line-${level.id}`}
              from={latLonToVector3(level.lat, level.lon, LINE_RADIUS)}
              to={latLonToVector3(nextLevel.lat, nextLevel.lon, LINE_RADIUS)}
              isActive={isPathActive}
            />
          );
        })}

        {debug && debugCoords && (
          <Html fullscreen style={{ pointerEvents: "none" }}>
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/90 text-white px-6 py-4 rounded-xl font-mono text-sm border-2 border-primary/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col items-center gap-2 z-50">
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                Curseur
              </div>
              <div className="flex gap-8 text-xl font-black">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-blue-400 font-bold mb-1">
                    LAT
                  </span>
                  {debugCoords.lat.toFixed(1)}°
                </div>
                <div className="w-px bg-white/20 h-full mx-2" />
                <div className="flex flex-col items-center">
                  <span className="text-xs text-green-400 font-bold mb-1">
                    LON
                  </span>
                  {debugCoords.lon.toFixed(1)}°
                </div>
              </div>
            </div>
          </Html>
        )}
      </group>

      <GlobeEnvironment />
    </group>
  );
}
