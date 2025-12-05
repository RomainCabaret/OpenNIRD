"use client";

import { Mic, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- SOUS-COMPOSANT : EFFET MACHINE À ÉCRIRE ---
const TypewriterMessage = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    hasCompleted.current = false;
    index.current = 0;
    setDisplayedText("");

    // Vitesse de frappe
    const typingSpeed = 30;

    const timer = setInterval(() => {
      if (index.current < text.length - 1) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current++;
      } else {
        setDisplayedText(text);
        clearInterval(timer);
        if (!hasCompleted.current) {
            hasCompleted.current = true;
            onComplete();
        }
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [text, onComplete]);

  return <>{displayedText || <span className="animate-pulse">|</span>}</>;
};
// -------------------------------------------------------


interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

interface ChatInterfaceProps {
  onBotStateChange: (isTalking: boolean) => void;
  onEmotionChange: (emotion: string) => void;
}

export function ChatInterface({ onBotStateChange, onEmotionChange }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Salut ! Je suis Tom, ton conseiller très écologique. Pose-moi une question, je te dirai comment consommer moins !",
    },
  ]);
  
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, streamingMessage]);

  const handleTypewriterComplete = useCallback(() => {
    if (streamingMessage) {
        setMessages((prev) => [...prev, {
            id: Date.now().toString(),
            role: "bot",
            text: streamingMessage
        }]);
        setStreamingMessage(null);
        onBotStateChange(false);
    }
  }, [streamingMessage, onBotStateChange]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", text: userText }]);
    setInput("");
    setIsTyping(true);
    
    onBotStateChange(true);
    onEmotionChange("NEUTRAL");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) throw new Error("Erreur réseau");

      const data = await response.json();
      const aiResponseText = data.text;
      const aiEmotion = data.emotion || "NEUTRAL";

      onEmotionChange(aiEmotion);
      setIsTyping(false);
      setStreamingMessage(aiResponseText);

    } catch (error) {
      console.error("Erreur API:", error);
      setMessages((prev) => [...prev, { 
        id: Date.now().toString(), 
        role: "bot", 
        text: "Oups, mes serveurs polluants sont en surchauffe. Réessaie plus tard !" 
      }]);
      onBotStateChange(false);
      onEmotionChange("NEUTRAL");
      setIsTyping(false);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none h-[100dvh]">
      
      {/* HEADER */}
      <div className="flex justify-between items-start pointer-events-auto p-4 md:p-8">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-300">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_red]" />
            BAD ADVISOR ONLINE
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-[#fbbf24]">
          <Sparkles className="w-4 h-4 fill-current" />
          <span className="font-black">POLLUTION MAX</span>
        </div>
      </div>

      {/* ZONE DE CHAT (Messages + Input) */}
      {/* On garde le padding de sécurité de base */}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 pointer-events-auto shrink-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-8 md:pb-8">
        
        {/* Liste des messages */}
        <div className="flex flex-col gap-3 max-h-[55vh] md:max-h-[300px] overflow-y-auto pr-2 mask-gradient-to-t scrollbar-hide">
          
          {/* Historique */}
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "p-4 rounded-2xl max-w-[80%] text-sm font-medium backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-2",
                m.role === "user"
                  ? "self-end bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-white rounded-tr-none"
                  : "self-start bg-red-950/30 border border-red-500/30 text-red-100 rounded-tl-none shadow-[0_0_15px_rgba(220,38,38,0.1)]"
              )}
            >
              {m.text}
            </div>
          ))}

           {/* Message en cours de frappe */}
           {streamingMessage && (
            <div className="self-start bg-red-950/30 border border-red-500/30 p-4 rounded-2xl rounded-tl-none text-red-100 max-w-[80%] text-sm font-medium backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                <TypewriterMessage text={streamingMessage} onComplete={handleTypewriterComplete} />
            </div>
          )}
          
          {/* Indicateur ... */}
          {isTyping && !streamingMessage && (
            <div className="self-start bg-red-950/30 border border-red-500/30 px-4 py-3 rounded-2xl rounded-tl-none text-red-200 text-xs flex gap-1 items-center animate-pulse">
              <span>Tom réfléchit à une bêtise</span>
              <span className="animate-bounce delay-75">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/20 to-blue-600/20 rounded-2xl blur-xl group-hover:opacity-100 transition-opacity opacity-50" />
          <div className="relative flex items-center gap-2 bg-[#0B1221]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 pr-2 shadow-2xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isTyping && !streamingMessage && handleSend()}
              placeholder={isTyping || streamingMessage ? "Chut, il parle..." : "Demande un conseil écolo..."}
              disabled={isTyping || streamingMessage !== null}
              className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder:text-slate-500 font-medium disabled:opacity-50"
            />
            <button className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping || streamingMessage !== null}
              className="p-3 bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-white rounded-xl shadow-lg hover:shadow-[#00E5FF]/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* --- ESPACEUR MOBILE POUR LE CLAVIER --- */}
        <div className="h-32 md:hidden" />
        {/* --------------------------------------- */}

      </div>
    </div>
  );
}

export default ChatInterface;