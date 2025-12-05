"use client";

import { LessonSlide } from "@/components/levelSelector/LessonSlide";
import { PaginationWrapper } from "@/components/pagination/PaginationWrapper";
import React, { useEffect } from "react";
import BossLevelFive from "./BossLevelFive";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

function LevelFive() {
  const router = useRouter();
  const { completeLevel, isLevelUnlocked } = useUser();

  useEffect(() => {
    if (!isLevelUnlocked(5)) {
      router.push("/");
    }
  }, []);
  return (
    <PaginationWrapper
      title="Niveau 5 : U.S.A."
      miniGame={<BossLevelFive />} // Le Boss est passé ici
    >
      {/* --- PAGE 1 --- */}
      <LessonSlide
        title="Le gouffre énergétique"
        subtitle="Histoire"
        image="/LunixDataCenters.png"
      >
        <div className="space-y-4">
          <p>
            Pour son ultime étape, Lunix arrive aux États-Unis. Il fait une chaleur étouffante, 
            mais ce n'est pas le soleil le responsable.
          </p>
          
          <p>
            Devant lui s'étendent des kilomètres de hangars : les <strong>Data Centers</strong>. 
            Ces bâtiments, qui abritent entre autres les cerveaux des Intelligences Artificielles, 
            siphonnent l'électricité de toute la région, plongeant les villes voisines dans le noir.
          </p>
          
          <p>
            D'énormes câbles ont été installés, tirant toute l'électricité alentour pour répondre 
            à des questions futiles posées à des IAs.
          </p>
          
          <p>
            Lunix doit raisonner la machine avant de mettre à plat tout le pays.
          </p>
        </div>
      </LessonSlide>
         {/* --- PAGE 2 --- */}
      <LessonSlide
        title="La matérialité du Cloud et L'IA"
        subtitle="Informations"
        image="/DataCenter.jpg"
      >
        <div className="space-y-6">
          <div className="bg-cyan-500/10 p-5 rounded-xl border-l-4 border-cyan-400">
            <h4 className="font-bold text-cyan-300 text-lg mb-3">☁️ Le mythe du "Cloud"</h4>
            <p className="text-sm leading-relaxed mb-3">
              Le "Cloud" (nuage) est une image trompeuse. Internet repose sur des infrastructures 
              physiques lourdes :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <p className="text-sm font-semibold">🌊 Câbles sous-marins</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <p className="text-sm font-semibold">📡 Antennes 5G</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <p className="text-sm font-semibold">🏢 Data Centers</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-500/10 p-5 rounded-xl border-l-4 border-orange-400">
            <h4 className="font-bold text-orange-300 text-lg mb-3">⚡ Consommation électrique</h4>
            <p className="text-sm leading-relaxed">
              Ces centres de données fonctionnent 24h/24 et consomment une quantité phénoménale d'électricité.
            </p>
          </div>

          <div className="bg-red-500/10 p-5 rounded-xl border-l-4 border-red-400">
            <h4 className="font-bold text-red-300 text-lg mb-3">🤖 L'impact de l'IA générative</h4>
            <p className="text-sm leading-relaxed mb-3">
              L'Intelligence Artificielle (IA) générative (comme ChatGPT) aggrave ce bilan :
            </p>
            <div className="space-y-3">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-sm">L'entraînement d'un modèle d'IA peut émettre autant de CO₂ que plusieurs allers-retours <strong>Paris-New York en avion</strong></p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-sm">Chaque requête consomme de l'énergie</p>
              </div>
            </div>
          </div>
        </div>
      </LessonSlide>
         {/* --- PAGE 3 --- */}
      <LessonSlide
        title="Sobriété Numérique et Régulation"
        subtitle="Informations"
        image="/questionIA.png"
      >
        <div className="space-y-6">
          <p className="text-lg">
            La solution n'est pas d'arrêter le numérique, mais de le raisonner : 
            c'est la <strong>sobriété numérique</strong>.
          </p>

          <div className="space-y-4">
            <div className="bg-green-500/10 p-5 rounded-xl border-l-4 border-green-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🌱</span>
                <div>
                  <h4 className="font-bold text-green-300 text-lg mb-2">Éco-conception</h4>
                  <p className="text-sm leading-relaxed">
                    Créer des sites web et des logiciels plus légers, optimisés pour consommer moins de ressources.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 p-5 rounded-xl border-l-4 border-blue-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🎯</span>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg mb-2">Usage raisonné</h4>
                  <div className="space-y-2 text-sm mt-2">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p>A-t-on besoin de la 4K sur un smartphone ?</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p>A-t-on besoin de l'IA pour écrire un email de deux lignes ?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 p-5 rounded-xl border-l-4 border-purple-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚖️</span>
                <div>
                  <h4 className="font-bold text-purple-300 text-lg mb-2">Régulation</h4>
                  <p className="text-sm leading-relaxed mb-3">
                    Imposer aux hébergeurs de :
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>Utiliser des énergies renouvelables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>Récupérer la chaleur fatale (la chaleur dégagée par les serveurs) pour chauffer des bâtiments</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10 mt-6">
            <p className="text-xs text-gray-400 font-semibold mb-2">Sources :</p>
            <ul className="text-xs space-y-1 text-gray-300">
              <li>• The Shift Project (Impact environnemental du numérique) : <a href="https://theshiftproject.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">theshiftproject.org</a></li>
              <li>• Arcep (Régulation environnementale) : <a href="https://www.arcep.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">arcep.fr</a></li>
            </ul>
          </div>
        </div>
      </LessonSlide>
    </PaginationWrapper>
  );
}

export default LevelFive;
