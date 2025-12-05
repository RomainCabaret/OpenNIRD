"use client";

import { LessonSlide } from "@/components/levelSelector/LessonSlide";
import { PaginationWrapper } from "@/components/pagination/PaginationWrapper";
import React, { useEffect } from "react";
import BossLevelTwo from "./BossLevelTwo";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

function LevelTwo() {
  const router = useRouter();
  const { completeLevel, isLevelUnlocked } = useUser();

  useEffect(() => {
    if (!isLevelUnlocked(2)) {
      router.push("/");
    }
  }, []);

  return (
    <PaginationWrapper
      title="Niveau 2 : La souveraineté de l'Europe"
      miniGame={<BossLevelTwo />} // Le Boss est passé ici
    >
      {/* --- PAGE 1 --- */}
      <LessonSlide
        title="David contre Goliath"
        subtitle="Histoire"
        image="/LunixGuideVsGAFAM.png"
      >
        <div className="space-y-4">
          <p>
            Lunix arrive en Europe, pensant trouver une terre de liberté. Au lieu de cela, 
            il découvre une cité grise où les citoyens font la queue devant d'immenses guichets 
            marqués des logos des <strong>GAFAM</strong> (Google, Apple, Facebook, Amazon, Microsoft).
          </p>
          
          <p>
            Pour envoyer un simple message ou ouvrir un document, les habitants doivent payer 
            leur passage ou acheter une licence coûteuse. Lunix tente de proposer des alternatives, 
            mais l'aura des GAFAM est trop forte.
          </p>
          
          <div className="bg-yellow-500/10 p-6 rounded-xl border-l-4 border-yellow-400 mt-6">
            <p className="text-lg font-semibold text-yellow-300">
              🔍 Mission : Trouver le "Code Européen"
            </p>
            <p className="text-sm mt-2">
              Un ensemble de lois puissantes capables de briser ce monopole.
            </p>
          </div>
        </div>
      </LessonSlide>
      {/* --- PAGE 2 --- */}
      <LessonSlide
        title="La souveraineté numérique et les GAFAM"
        subtitle="Informations"
        image="/gafam.jpg"
      >
        <div className="space-y-6">
          <p className="text-lg">
            La <strong>souveraineté numérique</strong> est la capacité d'un État ou d'un continent 
            (comme l'Europe) à agir dans le cyberespace de manière autonome.
          </p>

          <div className="bg-red-500/10 p-5 rounded-xl border-l-4 border-red-400">
            <h4 className="font-bold text-red-300 text-lg mb-3">⚠️ Le problème de dépendance</h4>
            <p className="text-sm leading-relaxed mb-4">
              Aujourd'hui, l'Europe est en situation de dépendance vis-à-vis des <strong>GAFAM</strong> 
              (les géants américains) et des <strong>BATX</strong> (leurs homologues chinois).
            </p>
            <div className="space-y-2">
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-sm">☁️ <strong>Infrastructures</strong> : Cloud computing</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-sm">💻 <strong>Systèmes d'exploitation</strong> : Windows, iOS</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <p className="text-sm">📱 <strong>Réseaux sociaux</strong> : Facebook, Instagram, X</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-500/10 p-5 rounded-xl border-l-4 border-orange-400">
            <h4 className="font-bold text-orange-300 text-lg mb-3">🚨 Les risques</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Problèmes de <strong>sécurité nationale</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Atteintes à la <strong>protection de la vie privée</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Menaces pour la <strong>concurrence économique</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Risque de <strong>paralysie</strong> si un géant coupe ses services</span>
              </li>
            </ul>
          </div>
        </div>
      </LessonSlide>
      

    
      {/* --- PAGE 3 --- */}
      <LessonSlide
        title="La réponse européenne"
        subtitle="Informations"
        image="/europe_solution.jpeg"
      >
        <div className="space-y-6">
          <p className="text-lg">
            L'Union Européenne a mis en place <strong>l'arsenal législatif le plus strict au monde</strong> 
            pour reprendre le contrôle :
          </p>

          <div className="space-y-4">
            <div className="bg-blue-500/10 p-5 rounded-xl border-l-4 border-blue-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔒</span>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg mb-2">
                    RGPD (Règlement Général sur la Protection des Données)
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Il protège les données personnelles des citoyens européens et leur donne 
                    le contrôle sur leurs informations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 p-5 rounded-xl border-l-4 border-purple-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚖️</span>
                <div>
                  <h4 className="font-bold text-purple-300 text-lg mb-2">
                    DMA (Digital Markets Act)
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Il empêche les géants du numérique d'abuser de leur position dominante 
                    et favorise la concurrence (anti-monopole).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 p-5 rounded-xl border-l-4 border-green-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🛡️</span>
                <div>
                  <h4 className="font-bold text-green-300 text-lg mb-2">
                    DSA (Digital Services Act)
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Il impose aux plateformes de modérer les contenus illégaux et d'être 
                    transparentes sur leurs algorithmes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 p-5 rounded-xl border-l-4 border-emerald-400">
            <p className="text-sm leading-relaxed">
              <strong className="text-emerald-300">🎯 Objectif final :</strong> Favoriser l'émergence 
              d'alternatives européennes et de logiciels libres pour réduire la dépendance.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10 mt-6">
            <p className="text-xs text-gray-400 font-semibold mb-2">Sources :</p>
            <ul className="text-xs space-y-1 text-gray-300">
              <li>• CNIL (Comprendre le RGPD) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">cnil.fr</a></li>
              <li>• Commission Européenne (DMA/DSA) : <a href="https://digital-strategy.ec.europa.eu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">digital-strategy.ec.europa.eu</a></li>
            </ul>
          </div>
        </div>
      </LessonSlide>
    
    </PaginationWrapper>
  );
}

export default LevelTwo;
