"use client";

import { cn } from "@/lib/utils";
import { Mic, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Salut ! Je suis Tom, ton compagnon d'exploration. Comment puis-je t'aider aujourd'hui ?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Ajouter le message utilisateur
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 2. Simuler la réponse du bot (API Call ici plus tard)
    setTimeout(() => {
      onBotStateChange(true); // Le chat commence à parler

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "C'est une excellente question sur les océans ! Savais-tu que...",
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      // Le chat arrête de parler après 3 secondes (simulation)
      setTimeout(() => onBotStateChange(false), 3000);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-8 pointer-events-none">
      {/* HEADER (XP / Status) */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-300">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          SYSTEM ONLINE • VOICE MODULE ACTIVE
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-[#fbbf24]">
          <Sparkles className="w-4 h-4 fill-current" />
          <span className="font-black">1,250 XP</span>
        </div>
      </div>

      {/* ZONE DE CONVERSATION (Bas de page comme sur le design) */}
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 pointer-events-auto">
        {/* Historique des messages (flottant au dessus de l'input) */}
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 mask-gradient-to-t">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "p-4 rounded-2xl max-w-[80%] text-sm font-medium backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-2",
                m.role === "user"
                  ? "self-end bg-[#00E5FF]/20 border border-[#00E5FF]/30 text-white rounded-tr-none"
                  : "self-start bg-black/60 border border-white/10 text-slate-200 rounded-tl-none"
              )}
            >
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div className="self-start bg-black/60 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none text-slate-400 text-xs animate-pulse">
              Tom est en train d'écrire...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/20 to-blue-600/20 rounded-2xl blur-xl group-hover:opacity-100 transition-opacity opacity-50" />
          <div className="relative flex items-center gap-2 bg-[#0B1221]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 pr-2 shadow-2xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Pose une question à Tom..."
              className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder:text-slate-500 font-medium"
            />

            <button className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              <Mic className="w-5 h-5" />
            </button>

            <button
              onClick={handleSend}
              className="p-3 bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-white rounded-xl shadow-lg hover:shadow-[#00E5FF]/25 hover:scale-105 transition-all"
            >
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
