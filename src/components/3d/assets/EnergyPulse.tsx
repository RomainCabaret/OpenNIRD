"use client";

import { MAP_COLORS } from "@/lib/constant";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function EnergyPulse({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Vitesse
    const t = (state.clock.elapsedTime * 0.5) % 1;
    const point = curve.getPoint(t);
    meshRef.current.position.copy(point);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color={MAP_COLORS.activeLine}
          transparent
          opacity={0.5}
        />
      </mesh>
    </mesh>
  );
}
