"use client";

import CatSpriteModel from "@/components/chatbot/CatSpriteModel";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
// NOUVEL IMPORT
import Background3D from "@/components/chatbot/Background3D";
import { useState } from "react";

export default function ChatbotPage() {
  const [isBotTalking, setIsBotTalking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("NEUTRAL");

  return (
    // On retire le bg-[#050505] ici car c'est le Canvas 3D qui va gérer le fond
    <main className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center">
      
      {/* --- NOUVEAU : LE FOND 3D (EN PREMIER) --- */}
      <Background3D />
      {/* --------------------------------------- */}

      {/* COUCHE DU CHAT 2D (Derrière l'interface, devant le fond) */}
      <div className="absolute z-0 flex items-center justify-center w-full h-full pointer-events-none">
         <CatSpriteModel 
            isTalking={isBotTalking} 
            isListening={false} 
            emotion={currentEmotion} 
         />
      </div>

      {/* COUCHE DE L'INTERFACE (Devant) */}
      <ChatInterface 
          onBotStateChange={setIsBotTalking} 
          onEmotionChange={setCurrentEmotion}
      />

      {/* Fond dégradé esthétique (Optionnel, peut être retiré si le fond 3D suffit) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-0" />
    </main>
  );
}