"use client";

import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const COLORS = {
  saucerBody: "#c0c0c0",
  saucerCockpit: "#aaffff",
  satellitePanel: "#4169e1",
};

export function GlobeEnvironment() {
  return (
    <group>
      <FlyingSaucer />
      <AsteroidField />
      <OrbitingSatellite />
    </group>
  );
}

function FlyingSaucer() {
  const ufoRef = useRef<THREE.Group>(null);
  const cockpitRef = useRef<THREE.Mesh>(null);
  const router = useRouter(); // 2. Initialisation du router
  const [hovered, setHovered] = useState(false); // 3. État pour le survol

  // Gestion du curseur : change en "pointer" quand on survole la soucoupe
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  useFrame((state) => {
    if (!ufoRef.current) return;
    const time = state.clock.elapsedTime;

    const orbitRadius = 4.3;
    ufoRef.current.position.set(
      Math.sin(time * 0.3) * orbitRadius,
      1.8 + Math.sin(time * 1.5) * 0.15,
      Math.cos(time * 0.3) * orbitRadius
    );

    ufoRef.current.rotation.y = time * 0.2;
    ufoRef.current.rotation.z = Math.sin(time) * 0.1;

    if (cockpitRef.current) {
      const isBlinking = Math.sin(time * 10) > 0;
      (
        cockpitRef.current.material as THREE.MeshStandardMaterial
      ).emissiveIntensity = isBlinking ? 1 : 0.1;
    }
  });

  return (
    <group
      ref={ufoRef}
      scale={0.9}
      onClick={() => router.push("/snake")}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position-y={0}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial
          color={hovered ? "#e0e0e0" : COLORS.saucerBody} // Petit effet visuel au survol (optionnel)
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={cockpitRef} position-y={0.05}>
        <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={COLORS.saucerCockpit}
          transparent
          opacity={0.7}
          emissive={COLORS.saucerCockpit}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
function AsteroidField() {
  const groupRef = useRef<THREE.Group>(null);

  const asteroids = useMemo(() => {
    const temp = [];
    const geometry = new THREE.IcosahedronGeometry(0.1, 0);
    const material = new THREE.MeshStandardMaterial({
      color: "#8B4513",
      roughness: 0.8,
      emissive: "#8B4513",
      emissiveIntensity: 0.1,
    });

    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3.5 + Math.random() * 2;
      temp.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 1.5,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ] as [number, number, number],
        scale: 0.5 + Math.random() * 1.5,
        geometry,
        material,
      });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.015;
  });

  return (
    <group ref={groupRef}>
      {asteroids.map((asteroid, i) => (
        <mesh
          key={i}
          position={asteroid.position}
          rotation={asteroid.rotation}
          scale={[asteroid.scale, asteroid.scale, asteroid.scale]}
          geometry={asteroid.geometry}
          material={asteroid.material}
        />
      ))}
    </group>
  );
}

function OrbitingSatellite() {
  const satRef = useRef<THREE.Group>(null);
  const startPos = useMemo(() => new THREE.Vector3(15, 7, -10), []);

  useFrame((state, delta) => {
    if (!satRef.current) return;
    satRef.current.position.x -= delta * 2.0;
    satRef.current.position.y -= delta * 1.0;
    if (satRef.current.position.x < -15) satRef.current.position.copy(startPos);
  });

  const panelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.satellitePanel,
        emissive: COLORS.satellitePanel,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <group ref={satRef} position={startPos}>
      <group scale={0.5} rotation-z={Math.PI / 4}>
        <mesh>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color={COLORS.saucerBody}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-0.5, 0, 0]} material={panelMaterial}>
          <planeGeometry args={[0.6, 0.2]} />
        </mesh>
        <mesh position={[0.5, 0, 0]} material={panelMaterial}>
          <planeGeometry args={[0.6, 0.2]} />
        </mesh>
      </group>
    </group>
  );
}
