import { MARKER_RADIUS } from "@/lib/constant";
import { latLonToVector3 } from "@/lib/utils";
import { Level } from "@/types/types";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MarkerMesh } from "./MarkerMesh";
interface LevelMarkerInstanceProps {
  level: Level;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export function LevelMarkerInstance({
  level,
  isSelected,
  isLocked,
  onClick,
}: LevelMarkerInstanceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hovered, setHovered] = useState(false);

  const position = useMemo(
    () => latLonToVector3(level.lat, level.lon, MARKER_RADIUS),
    [level.lat, level.lon]
  );

  useEffect(() => {
    if (!groupRef.current) return;
    const target = position.clone().normalize();
    groupRef.current.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      target
    );
  }, [position]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const markerWorldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(markerWorldPos);
    const normal = markerWorldPos.normalize();
    const cameraVector = state.camera.position.clone().normalize();
    setIsVisible(normal.dot(cameraVector) > 0.1);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
      </mesh>

      <MarkerMesh
        isSelected={isSelected}
        isLocked={isLocked}
        isHovered={hovered}
      />

      <Html
        position={[0, 0, 0.6]}
        center
        distanceFactor={12}
        zIndexRange={[100, 0]}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          opacity: isVisible && (isSelected || hovered) ? 1 : 0,
          transition: "opacity 0.2s ease-out",
        }}
      >
        <div className="flex flex-col items-center">
          <span className="font-bold tracking-[0.15em] text-[10px] uppercase whitespace-nowrap text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {level.name}
          </span>
        </div>
      </Html>
    </group>
  );
}
