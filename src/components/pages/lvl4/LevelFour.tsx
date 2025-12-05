"use client";

import { LessonSlide } from "@/components/levelSelector/LessonSlide";
import { PaginationWrapper } from "@/components/pagination/PaginationWrapper";
import React, { useEffect } from "react";
import BossLevelFour from "./BossLevelFour";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

function LevelFour() {
  const router = useRouter();
  const { completeLevel, isLevelUnlocked } = useUser();

  useEffect(() => {
    if (!isLevelUnlocked(4)) {
      router.push("/");
    }
  }, []);
  return (
    <PaginationWrapper
      title="Niveau 4 : Chine & Data"
      miniGame={<BossLevelFour />} // Le Boss est passé ici
    >
      {/* --- PAGE 1 --- */}
      <LessonSlide
        title="L'usine à données"
        subtitle="Histoire"
        image="/LunixUsineDonnee.png"
      >
        <div className="space-y-4">
          <p>
            Lunix atterrit en Chine, dans ce qui ressemble à une usine, mais sans cheminées ni marteaux. 
            Ici, le produit, c'est l'humain.
          </p>
          
          <p>
            Lunix s'infiltre dans des couloirs où des écrans géants affichent en temps réel les visages, 
            les goûts, et les conversations de millions de personnes à travers le monde. Il voit des chaînes 
            de montage virtuelles où des "Ouvriers de la Data" trient des "Likes", des géolocalisations 
            et des historiques d'achat pour créer des profils publicitaires ultra-précis.
          </p>
          
          <p>
            Tout est aspiré : le moindre clic est enregistré. Lunix se sent observé ; une caméra pivote 
            vers lui. Il comprend qu'ici, la vie privée n'est pas un droit, mais une monnaie d'échange.
          </p>
        </div>
      </LessonSlide>
       {/* --- PAGE 2 --- */}
      <LessonSlide
        title="La Data Privacy et le modèle économique du 'Gratuit'"
        subtitle="Informations"
        image="/espion.png"
      >
        <div className="space-y-6">
          <div className="bg-red-500/10 p-5 rounded-xl border-l-4 border-red-400">
            <p className="text-lg font-bold text-red-300 mb-3">
              💰 "Si c'est gratuit, c'est vous le produit"
            </p>
            <p className="text-sm leading-relaxed">
              Les réseaux sociaux et de nombreuses applications financent leurs services par la collecte 
              massive de données personnelles (Big Data).
            </p>
          </div>

          <div className="bg-orange-500/10 p-5 rounded-xl border-l-4 border-orange-400">
            <h4 className="font-bold text-orange-300 text-lg mb-3">🎯 Utilisation des données</h4>
            <p className="text-sm leading-relaxed">
              Ces données sont analysées par des algorithmes pour :
            </p>
            <ul className="space-y-2 text-sm mt-3">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Prédire nos comportements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Nous cibler avec de la publicité</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">•</span>
                <span>Influencer nos opinions</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-500/10 p-5 rounded-xl border-l-4 border-blue-400">
            <h4 className="font-bold text-blue-300 text-lg mb-3">🔒 Qu'est-ce que la Privacy ?</h4>
            <p className="text-sm leading-relaxed">
              La protection de la vie privée (Privacy) n'est pas seulement cacher des secrets, 
              c'est garder le contrôle sur sa vie numérique et éviter la surveillance de masse.
            </p>
          </div>
        </div>
      </LessonSlide>
       {/* --- PAGE 3 --- */}
      <LessonSlide
        title="Les solutions pour limiter la collecte"
        subtitle="Informations"
        image="/cookies.jpg"
      >
        <div className="space-y-6">
          <p className="text-lg">
            Il est possible de réduire son <strong>empreinte numérique</strong> :
          </p>

          <div className="space-y-4">
            <div className="bg-blue-500/10 p-5 rounded-xl border-l-4 border-blue-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚖️</span>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg mb-2">La loi</h4>
                  <p className="text-sm leading-relaxed">
                    Le RGPD permet de protéger les citoyens européens
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 p-5 rounded-xl border-l-4 border-green-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📉</span>
                <div>
                  <h4 className="font-bold text-green-300 text-lg mb-2">Minimisation</h4>
                  <p className="text-sm leading-relaxed">
                    Ne donner que les infos strictement nécessaires lors d'une inscription
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 p-5 rounded-xl border-l-4 border-yellow-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚙️</span>
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-2">Paramétrage</h4>
                  <p className="text-sm leading-relaxed">
                    Refuser les cookies tiers, désactiver la géolocalisation
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 p-5 rounded-xl border-l-4 border-purple-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🛠️</span>
                <div>
                  <h4 className="font-bold text-purple-300 text-lg mb-2">Outils recommandés</h4>
                  <div className="space-y-2 text-sm mt-2">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p><strong>Moteurs de recherche :</strong> Qwant, DuckDuckGo</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p><strong>Navigateurs :</strong> Firefox, Brave</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p><strong>Messageries chiffrées :</strong> Signal, Olvid</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10 mt-6">
            <p className="text-xs text-gray-400 font-semibold mb-2">Sources :</p>
            <ul className="text-xs space-y-1 text-gray-300">
              <li>• CNIL (Maîtriser ses données) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">cnil.fr</a></li>
              <li>• Internet Society : <a href="https://www.internetsociety.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">internetsociety.org</a></li>
            </ul>
          </div>
        </div>
      </LessonSlide></PaginationWrapper>
  );
}

export default LevelFour;
