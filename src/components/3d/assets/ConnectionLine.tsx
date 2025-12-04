"use client";

import { LINE_RADIUS, MAP_COLORS } from "@/lib/constant";
import { useMemo } from "react";
import { EnergyPulse } from "./EnergyPulse";

import * as THREE from "three";

export function ConnectionLine({
  from,
  to,
  isActive,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  isActive: boolean;
}) {
  const { curve, geometry } = useMemo(() => {
    const points = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = new THREE.Vector3().lerpVectors(from, to, t);
      const arcHeight = Math.sin(t * Math.PI) * 0.4;
      point.normalize().multiplyScalar(LINE_RADIUS + arcHeight);
      points.push(point);
    }
    const curve = new THREE.CatmullRomCurve3(points);

    const geometry = new THREE.TubeGeometry(
      curve,
      32,
      isActive ? 0.04 : 0.02,
      6,
      false
    );
    return { curve, geometry };
  }, [from, to, isActive]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={isActive ? MAP_COLORS.activeLine : MAP_COLORS.lockedLine}
          transparent
          opacity={isActive ? 1 : 0.4}
          depthWrite={false}
        />
      </mesh>

      {isActive && <EnergyPulse curve={curve} />}
    </group>
  );
}
