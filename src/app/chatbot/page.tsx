"use client";

import { CatModel } from "@/components/chatbot/CatModel";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import {
  Environment,
  Html,
  OrbitControls,
  Sparkles,
  useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";

// Petit composant pour voir le chargement au milieu de l'écran
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-[#00E5FF] font-bold text-xl animate-pulse whitespace-nowrap">
        CHARGEMENT {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export default function ChatbotPage() {
  const [isBotTalking, setIsBotTalking] = useState(false);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
      {/* 1. LAYER 3D */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
          {/* On remplace null par notre Loader pour voir ce qui se passe */}
          <Suspense fallback={<Loader />}>
            {/* Lumières Studio */}
            <ambientLight intensity={0.5} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={1}
              color="#00E5FF"
            />
            <pointLight
              position={[-10, -10, -10]}
              intensity={0.5}
              color="#ff0000"
            />

            {/* Environnement (Reflets) */}
            <Environment preset="city" />

            {/* Particules d'ambiance */}
            <Sparkles
              count={50}
              scale={5}
              size={2}
              speed={0.4}
              opacity={0.5}
              color="#00E5FF"
            />

            {/* LE CHAT */}
            <CatModel isTalking={isBotTalking} />

            {/* --- CUBE DE DEBUG (Si tu le vois, la scène marche) --- */}
            <mesh position={[2, 0, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="hotpink" />
            </mesh>

            {/* Contrôles caméra limités pour garder le cadre */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI / 1.8}
              minAzimuthAngle={-Math.PI / 4}
              maxAzimuthAngle={Math.PI / 4}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. LAYER UI */}
      <ChatInterface onBotStateChange={setIsBotTalking} />

      {/* Fond dégradé subtil pour lisibilité bas de page */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-0" />
    </div>
  );
}
