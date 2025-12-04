"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Sword } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Si tu as installé sonner comme prévu

export function BossEncounter() {
  const [hp, setHp] = useState(100);

  const handleAttack = () => {
    const dmg = 20;
    const newHp = Math.max(0, hp - dmg);
    setHp(newHp);

    if (newHp === 0) {
      toast.success("BOSS VAINCU ! Niveau terminé !");
    } else {
      toast.info(`Coup critique ! -${dmg} PV`);
    }
  };

  if (hp === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-6 animate-in zoom-in duration-500">
        <h2 className="text-5xl font-black text-[#00E5FF] drop-shadow-[0_0_30px_#00E5FF]">
          VICTOIRE !
        </h2>
        <p className="text-slate-400 text-xl">Tu as maîtrisé cette leçon.</p>
        <button className="bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-110 transition-transform">
          Récupérer ma récompense
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-8 relative">
      {/* Ambiance Rouge Boss */}
      <div className="absolute inset-0 bg-red-500/5 radial-gradient pointer-events-none" />

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative"
      >
        <ShieldAlert className="w-32 h-32 text-red-500 drop-shadow-[0_0_50px_rgba(239,68,68,0.6)]" />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-950/80 px-4 py-1 rounded border border-red-500/50 text-red-500 font-bold text-xs tracking-widest uppercase">
          Gardien du Savoir
        </div>
      </motion.div>

      {/* Barre de vie du Boss */}
      <div className="w-full max-w-md h-6 bg-slate-900 rounded-full border border-red-900 overflow-hidden relative">
        <motion.div
          className="h-full bg-red-600 shadow-[0_0_15px_#dc2626]"
          initial={{ width: "100%" }}
          animate={{ width: `${hp}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
          {hp} / 100 PV
        </span>
      </div>

      <button
        onClick={handleAttack}
        className="flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] hover:scale-105 active:scale-95 transition-all"
      >
        <Sword className="w-6 h-6" />
        Attaquer (Répondre)
      </button>
    </div>
  );
}
