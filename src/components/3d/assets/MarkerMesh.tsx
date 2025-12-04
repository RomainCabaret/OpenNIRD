import { MAP_COLORS } from "@/lib/constant";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function MarkerMesh({
  isSelected,
  isLocked,
  isHovered,
}: {
  isSelected: boolean;
  isLocked: boolean;
  isHovered: boolean;
}) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const mainColor = isSelected
    ? MAP_COLORS.selected
    : isLocked
    ? MAP_COLORS.lockedMarker
    : MAP_COLORS.unselected;
  const emissiveColor = isSelected
    ? MAP_COLORS.glow
    : isLocked
    ? "#000"
    : "#444";

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (crystalRef.current) {
      crystalRef.current.rotation.z = time * 0.5;
      crystalRef.current.position.z = 0.15 + Math.sin(time * 2) * 0.03;
    }

    if (ringRef.current) {
      if (isSelected || isHovered) {
        const scale = 1 + Math.sin(time * 3) * 0.1;
        ringRef.current.scale.set(scale, scale, scale);
        (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.8;
      } else {
        ringRef.current.scale.set(1, 1, 1);
        (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3;
      }
    }
  });

  return (
    <group>
      <mesh ref={ringRef} position={[0, 0, 0.02]}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial
          color={mainColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={crystalRef} position={[0, 0, 0.15]} scale={[0.6, 0.6, 1.4]}>
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={mainColor}
          emissive={emissiveColor}
          emissiveIntensity={isSelected ? 1.2 : 0.2}
          flatShading
          roughness={0.1}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}
