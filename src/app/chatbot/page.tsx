"use client";

import CatSpriteModel from "@/components/chatbot/CatSpriteModel";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import { useState } from "react";

export default function ChatbotPage() {
  const [isBotTalking, setIsBotTalking] = useState(false);
  // Nouvel état pour stocker l'émotion actuelle
  const [currentEmotion, setCurrentEmotion] = useState("NEUTRAL");

  return (
    <main className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center">
      
      {/* COUCHE DU CHAT 2D (Derrière) */}
      <div className="absolute z-0 flex items-center justify-center w-full h-full pointer-events-none">
         {/* On passe l'émotion au modèle */}
         <CatSpriteModel 
            isTalking={isBotTalking} 
            isListening={false} 
            emotion={currentEmotion} 
         />
      </div>

      {/* COUCHE DE L'INTERFACE (Devant) */}
      {/* L'interface peut changer l'état de parole et l'émotion */}
      <ChatInterface 
          onBotStateChange={setIsBotTalking} 
          onEmotionChange={setCurrentEmotion}
      />

      {/* Fond dégradé esthétique */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-0" />
    </main>
  );
}