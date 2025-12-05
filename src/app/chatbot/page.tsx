"use client";

import CatSpriteModel from "@/components/chatbot/CatSpriteModel";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import Background3D from "@/components/chatbot/Background3D";
import { useState } from "react";

export default function ChatbotPage() {
  const [isBotTalking, setIsBotTalking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("NEUTRAL");

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center">
      
      {/* FOND 3D */}
      <Background3D />

      {/* COUCHE DU CHAT 2D */}
      {/* --- MODIFICATION ICI : Ajout de '-mt-32' pour remonter le chat --- */}
      <div className="absolute z-0 flex items-center justify-center w-full h-full pointer-events-none -mt-32">
         <CatSpriteModel 
            isTalking={isBotTalking} 
            isListening={false} 
            emotion={currentEmotion} 
         />
      </div>

      {/* COUCHE DE L'INTERFACE */}
      <ChatInterface 
          onBotStateChange={setIsBotTalking} 
          onEmotionChange={setCurrentEmotion}
      />

      {/* Fond dégradé (Optionnel) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-0" />
    </main>
  );
}