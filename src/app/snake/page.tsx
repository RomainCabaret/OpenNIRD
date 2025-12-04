"use client";

import { CatModel } from "@/components/chatbot/CatModel";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import { Snake3D } from "@/components/snake/Snake3D";
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

  return <Snake3D></Snake3D>;
}
