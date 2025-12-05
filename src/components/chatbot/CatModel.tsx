// Updated CatModel.tsx with blinking and listening animation

"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CatModelProps {
  isTalking: boolean;
  isListening?: boolean;
}

export function CatModel({ isTalking, isListening }: CatModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, nodes } = useGLTF("/models/cat.glb") as any;

  const initialRotations = useRef<{ [key: string]: THREE.Quaternion }>({});

  const bones = useRef<{
    head?: THREE.Bone;
    spine?: THREE.Bone;
    eyelidUp?: THREE.Bone;
    eyelidDown?: THREE.Bone;
    armL?: THREE.Bone;
    armR?: THREE.Bone;
    foreArmL?: THREE.Bone;
    foreArmR?: THREE.Bone;
  }>({});

  const blinkTimer = useRef(0);
  const [blinkSpeed] = useState(() => 0.15);

  useEffect(() => {
    if (!nodes) return;

    const findBone = (search: string[]) => {
      return Object.values(nodes).find(
        (node: any) => node.isBone && search.some(s => node.name.toLowerCase().includes(s.toLowerCase()))
      ) as THREE.Bone | undefined;
    };

    bones.current = {
      head: findBone(["head", "neck"]),
      spine: findBone(["spine", "hips"]),
      eyelidUp: findBone(["eyelid", "upperlid", "eye_up"]),
      eyelidDown: findBone(["eyelid", "lowerlid", "eye_down"]),
      armL: findBone(["leftarm", "l_arm"]),
      armR: findBone(["rightarm", "r_arm"]),
      foreArmL: findBone(["leftforearm", "l_forearm"]),
      foreArmR: findBone(["rightforearm", "r_forearm"]),
    };

    Object.entries(bones.current).forEach(([k, bone]) => {
      if (bone) initialRotations.current[k] = bone.quaternion.clone();
    });
  }, [nodes]);

  const animateBone = (
    boneName: keyof typeof bones.current,
    x: number,
    y: number,
    z: number,
    delta: number
  ) => {
    const bone = bones.current[boneName];
    const base = initialRotations.current[boneName];
    if (!bone || !base) return;

    const target = base.clone();
    const offset = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
    target.multiply(offset);

    bone.quaternion.slerp(target, 4 * delta);
  };

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // BREATHING
    const breath = Math.sin(time * 2) * 0.05;
    animateBone("spine", breath, 0, 0, delta);
    animateBone("head", -breath * 0.5, 0, 0, delta);

    // LISTENING (head tilt + small idle motion)
    if (!isTalking && isListening) {
      const tilt = Math.sin(time * 3) * 0.1;
      animateBone("head", tilt, tilt * 0.3, 0, delta);
    }

    // TALKING OR IDLE ARM ANIMATION
    if (isTalking) {
      const gesture = Math.sin(time * 10) * 0.1;
      animateBone("armL", 0.2, 0, -0.5 + gesture, delta);
      animateBone("foreArmL", 0.5, 0, 0, delta);
      animateBone("armR", 0.2, 0, 0.5 - gesture, delta);
      animateBone("foreArmR", 0.5, 0, 0, delta);
    } else {
      animateBone("armL", 0.3, -0.8, 0.5, delta);
      animateBone("foreArmL", 2.0, 0, 0, delta);
      animateBone("armR", 0.3, 0.8, -0.5, delta);
      animateBone("foreArmR", 2.0, 0, 0, delta);
    }

    // BLINKING SYSTEM
    blinkTimer.current -= delta;
    if (blinkTimer.current <= 0) {
      blinkTimer.current = 2 + Math.random() * 3;
    }

    // During blink (100 ms)
    const blinkProgress = Math.max(0, 0.1 - blinkTimer.current);
    if (blinkProgress > 0) {
      const blinkAmt = Math.sin((blinkProgress / 0.1) * Math.PI);
      animateBone("eyelidUp", -0.3 * blinkAmt, 0, 0, delta);
      animateBone("eyelidDown", 0.3 * blinkAmt, 0, 0, delta);
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={0.003} position={[0, -2.8, -2]} />
    </group>
  );
}

useGLTF.preload("/models/cat.glb");
export default CatModel;
