"use client";

import { Mic, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Fonction utilitaire pour les classes conditionnelles
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

interface ChatInterfaceProps {
  onBotStateChange: (isTalking: boolean) => void;
}

export function ChatInterface({ onBotStateChange }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  // Message d'accueil par défaut
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Salut ! Je suis Tom, ton conseiller très écologique. Pose-moi une question, je te dirai comment consommer moins !",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque nouveau message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    
    // 1. Ajout immédiat du message utilisateur
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    // On active l'animation du chat (il "écoute/réfléchit")
    onBotStateChange(true);

    try {
      // 2. Appel à l'API Gemini (Server-side)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        throw new Error("Erreur réseau");
      }

      const data = await response.json();
      const aiResponse = data.text;

      // 3. Ajout de la réponse du Bot
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: aiResponse,
      };

      setMessages((prev) => [...prev, botMsg]);

      // 4. Gestion de l'animation de parole (Lip-sync approximatif)
      // On estime le temps de lecture : ~50ms par caractère, minimum 2 secondes
      const speakingTime = Math.max(2000, aiResponse.length * 50);

      // Le chat reste en état "talking" pendant ce temps, puis s'arrête
      setTimeout(() => {
        onBotStateChange(false);
      }, speakingTime);

    } catch (error) {
      console.error("Erreur lors de la communication avec le chat:", error);
      
      // Fallback en cas d'erreur API
      setMessages((prev) => [...prev, { 
        id: Date.now().toString(), 
        role: "bot", 
        text: "Oups, mes serveurs polluants sont en surchauffe. Réessaie plus tard !" 
      }]);
      onBotStateChange(false);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-8 pointer-events-none">
      
      {/* HEADER */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-300">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_red]" />
            BAD ADVISOR ONLINE
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-[#fbbf24]">
          <Sparkles className="w-4 h-4 fill-current" />
          <span className="font-black">POLLUTION MAX</span>
        </div>
      </div>

      {/* ZONE DE CHAT */}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 pointer-events-auto">
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 mask-gradient-to-t scrollbar-hide">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "p-4 rounded-2xl max-w-[80%] text-sm font-medium backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-2",
                m.role === "user"
                  ? "self-end bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-white rounded-tr-none"
                  : "self-start bg-red-950/80 border border-red-500/50 text-red-100 rounded-tl-none shadow-[0_0_15px_rgba(220,38,38,0.2)]"
              )}
            >
              {m.text}
            </div>
          ))}
          
          {/* Indicateur de frappe (Typing Indicator) */}
          {isTyping && (
            <div className="self-start bg-red-950/80 border border-red-500/50 px-4 py-3 rounded-2xl rounded-tl-none text-red-200 text-xs flex gap-1 items-center animate-pulse">
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
              onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
              placeholder={isTyping ? "Attends, il réfléchit..." : "Demande un conseil écolo (ou pas)..."}
              disabled={isTyping}
              className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder:text-slate-500 font-medium disabled:opacity-50"
            />
            <button className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-white rounded-xl shadow-lg hover:shadow-[#00E5FF]/25 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;