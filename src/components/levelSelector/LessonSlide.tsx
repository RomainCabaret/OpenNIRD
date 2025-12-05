"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import Image from "next/image";
import React from "react";

interface LessonSlideProps {
  title: string;
  subtitle?: string;
  image?: string; // URL de l'image (optionnel)
  children: React.ReactNode; // Le texte du cours
  className?: string;
}

export function LessonSlide({
  title,
  subtitle,
  image,
  children,
  className,
}: LessonSlideProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-8 h-full max-w-7xl mx-auto",
        className
      )}
    >
      {/* --- COLONNE GAUCHE : CONTENU TEXTUEL --- */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-4">
        {/* Header de la leçon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-b border-white/10 pb-4"
        >
          {subtitle && (
            <span className="text-[#00E5FF] font-bold uppercase tracking-widest text-xs mb-2 block">
              {subtitle}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {title}
          </h2>
        </motion.div>

        {/* Corps du texte */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg text-slate-300 leading-relaxed"
        >
          {children}
        </motion.div>

        {/* Boîte "Le Saviez-vous ?" (Exemple de slot statique sympa) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-auto bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-2xl p-4 flex gap-4"
        >
          <div className="bg-[#00E5FF]/20 p-2 rounded-lg h-fit">
            <Lightbulb className="w-6 h-6 text-[#00E5FF]" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Note de l'Expert</h4>
            <p className="text-sm text-slate-400">
              N'oublie pas de bien lire les détails, ils pourraient servir
              contre le Boss !
            </p>
          </div>
        </motion.div>
      </div>

      {/* --- COLONNE DROITE : VISUEL (Optionnel) --- */}
      {image && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-1/3 min-h-[200px] md:h-auto relative rounded-3xl overflow-hidden border-4 border-white/5 bg-black/20 shadow-2xl max-md:hidden"
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
          {/* Overlay gradient pour le style */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-transparent to-transparent opacity-60" />
        </motion.div>
      )}
    </div>
  );
}
