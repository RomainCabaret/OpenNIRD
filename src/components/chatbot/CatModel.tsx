"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CatModelProps {
  isTalking: boolean;
}

export function CatModel({ isTalking }: CatModelProps) {
  const group = useRef<THREE.Group>(null);
  const [hasWaved, setHasWaved] = useState(false); // Pour ne faire coucou qu'une fois

  // Charge ton modèle
  const { scene, animations } = useGLTF("/models/cat.glb");
  const { actions } = useAnimations(animations, group);

  // --- DEBUG TAILLE ---
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      console.log("📏 DIMENSIONS RÉELLES (x, y, z) :", size);
      console.log("💡 Cible idéale pour Y : entre 1.5 et 3.0");
    }
  }, [scene]);

  // --- GESTION INTELLIGENTE DES ANIMATIONS ---
  useEffect(() => {
    if (!actions) return;

    const keys = Object.keys(actions);
    console.log("🎬 Animations trouvées :", keys);

    if (keys.length > 0) {
      // Recherche intelligente des noms d'animation (insensible à la casse)
      const findAnim = (name: string) =>
        keys.find((k) => k.toLowerCase().includes(name));

      const idleKey = findAnim("idle") || keys[0]; // Fallback sur la 1ère anim si pas d'idle
      const talkKey = findAnim("talk") || findAnim("speak") || idleKey;
      const waveKey =
        findAnim("wave") || findAnim("hello") || findAnim("greet"); // Coucou
      const danceKey = findAnim("dance") || talkKey; // Danse

      const idleAction = actions[idleKey];
      const talkAction = actions[talkKey];
      const waveAction = waveKey ? actions[waveKey] : null;
      const danceAction = actions[danceKey];

      // LOGIQUE D'ANIMATION

      // 1. Priorité : Faire Coucou au démarrage (Intro)
      if (waveAction && !hasWaved) {
        // Stop les autres
        idleAction?.stop();
        talkAction?.stop();

        // Joue Wave une seule fois
        waveAction.reset().fadeIn(0.5).setLoop(THREE.LoopOnce, 1).play();

        // À la fin du coucou, on passe à Idle
        waveAction.clampWhenFinished = true;
        const duration = waveAction.getClip().duration * 1000;

        setTimeout(() => {
          setHasWaved(true);
          waveAction.fadeOut(0.5);
          idleAction?.reset().fadeIn(0.5).play();
        }, duration);

        return; // On sort pour laisser le coucou se finir
      }

      // 2. Si on a déjà fait coucou, on gère la parole
      if (hasWaved || !waveAction) {
        if (isTalking) {
          // Si on parle -> Talk (ou Dance si tu veux qu'il danse en parlant !)
          idleAction?.fadeOut(0.5);
          // Tu peux remplacer talkAction par danceAction ici pour tester la danse :
          talkAction?.reset().fadeIn(0.5).play();
        } else {
          // Sinon -> Idle
          talkAction?.fadeOut(0.5);
          danceAction?.fadeOut(0.5);
          idleAction?.reset().fadeIn(0.5).play();
        }
      }
    }
  }, [actions, isTalking, hasWaved]);

  useFrame((state) => {
    if (group.current) {
      // Le chat suit doucement la souris
      const target = new THREE.Vector3(
        state.pointer.x,
        state.pointer.y * 0.2,
        5
      );
      group.current.lookAt(target);
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive
        object={scene}
        scale={0.002}
        position={[0, -1.5, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload("/models/cat.glb");
