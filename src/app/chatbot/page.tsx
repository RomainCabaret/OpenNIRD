// src/app/chatbot/page.tsx

"use client";

import CatSpriteModel from "@/components/chatbot/CatSpriteModel";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import { useState } from "react";

export default function ChatbotPage() {
  const [isBotTalking, setIsBotTalking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("NEUTRAL");

  return (
    // --- MODIFICATION ICI : h-screen devient h-[100dvh] ---
    <main className="relative w-full h-[100dvh] bg-[#050505] overflow-hidden flex flex-col items-center justify-center">
      
      {/* ... le reste du fichier ne change pas ... */}
      <div className="absolute z-0 flex items-center justify-center w-full h-full pointer-events-none">
         <CatSpriteModel 
            isTalking={isBotTalking} 
            isListening={false} 
            emotion={currentEmotion} 
         />
      </div>

      <ChatInterface 
          onBotStateChange={setIsBotTalking} 
          onEmotionChange={setCurrentEmotion}
      />

      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-0" />
    </main>
  );
}