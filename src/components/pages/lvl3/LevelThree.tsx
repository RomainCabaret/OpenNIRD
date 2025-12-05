"use client";
import { LessonSlide } from "@/components/levelSelector/LessonSlide";
import { PaginationWrapper } from "@/components/pagination/PaginationWrapper";

import React from "react";
import BossLevelThree from "./BossLevelThree";

function LevelThree() {
  return (
    <PaginationWrapper
      title="Niveau 3: Inde, cimetière électronique"
      miniGame={<BossLevelThree />}
    >
      {/* --- PAGE 1 --- */}
      <LessonSlide
        title="Décharge à ciel ouvert"
        subtitle="Histoire"
        image="/LunixDechargeInde.png"
      >
        <div className="space-y-4">
          <p>
            Le voyage mène Lunix en Inde. Le ciel est obscurci par une fumée noire et épaisse. 
            D'un côté, il voit des avions cargos décharger des milliers de smartphones, à peine 
            vieux d'un an, directement dans des montagnes d'ordures.
          </p>
          
          <p>
            De l'autre côté, des usines rutilantes assemblent la dernière version de l'iPhone 
            avec des ressources rares fraîchement minées.
          </p>
          
          <p>
            Lunix marche dans les allées de la décharge où des enfants désossent des ordinateurs 
            à mains nues pour récupérer un peu de cuivre. Le sol est jonché de batteries qui fuient.
          </p>
          
        
        </div>
      </LessonSlide>

      {/* --- PAGE 2 --- */}
      <LessonSlide
        title="Le cycle des produits et l'épuisement des ressources"
        subtitle="Informations"
        image="/carriere.jpg"
      >
        <div className="space-y-6">
          <div className="bg-blue-500/10 p-5 rounded-xl border-l-4 border-blue-400">
            <h4 className="font-bold text-blue-300 text-lg mb-3">🔄 Le cycle de vie d'un appareil numérique</h4>
            <p className="text-sm leading-relaxed mb-3">
              Le cycle comprend 4 étapes :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <div className="text-2xl mb-2">⛏️</div>
                <p className="text-xs font-semibold">Extraction</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <div className="text-2xl mb-2">🏭</div>
                <p className="text-xs font-semibold">Fabrication</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <div className="text-2xl mb-2">📱</div>
                <p className="text-xs font-semibold">Utilisation</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <div className="text-2xl mb-2">♻️</div>
                <p className="text-xs font-semibold">Fin de vie</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-500/10 p-5 rounded-xl border-l-4 border-orange-400">
            <h4 className="font-bold text-orange-300 text-lg mb-3">🚨 L'étape la plus polluante : la fabrication</h4>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-lg font-bold text-center mb-2">📱 200g de smartphone</p>
              <p className="text-center text-3xl font-bold text-orange-300">= 70kg</p>
              <p className="text-sm text-center mt-2">de matières premières extraites !</p>
            </div>
          </div>

          <div className="bg-red-500/10 p-5 rounded-xl border-l-4 border-red-400">
            <h4 className="font-bold text-red-300 text-lg mb-3">⚠️ Épuisement des ressources rares</h4>
            <p className="text-sm leading-relaxed">
              Nous épuisons des ressources précieuses souvent extraites dans des conditions 
              humaines déplorables :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <p className="text-sm font-semibold">🌍 Terres rares</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <p className="text-sm font-semibold">🪙 Or</p>
              </div>
              <div className="bg-white/5 p-3 rounded-lg text-center">
                <p className="text-sm font-semibold">⚫ Cobalt</p>
              </div>
            </div>
          </div>
        </div>
      </LessonSlide>

      {/* --- PAGE 3 --- */}
      <LessonSlide
        title="Obsolescence programmée"
        subtitle="Informations"
        image="/sablier.png"
      >
        <div className="space-y-6">
          <p className="text-lg">
            L'<strong>obsolescence programmée</strong> est l'ensemble des techniques (matérielles ou logicielles) 
            visant à réduire la durée de vie d'un produit pour en accélérer le remplacement.
          </p>

          <div className="space-y-4">
            <div className="bg-purple-500/10 p-5 rounded-xl border-l-4 border-purple-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💻</span>
                <div>
                  <h4 className="font-bold text-purple-300 text-lg mb-2">Obsolescence logicielle</h4>
                  <p className="text-sm leading-relaxed">
                    Mises à jour qui ralentissent l'appareil ou le rendent incompatible avec 
                    de nouvelles applications.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-pink-500/10 p-5 rounded-xl border-l-4 border-pink-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">✨</span>
                <div>
                  <h4 className="font-bold text-pink-300 text-lg mb-2">Obsolescence esthétique</h4>
                  <p className="text-sm leading-relaxed">
                    L'effet de mode et les stratégies marketing qui poussent au renouvellement 
                    constant des appareils encore fonctionnels.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 p-5 rounded-xl border-l-4 border-yellow-400">
            <h4 className="font-bold text-yellow-300 text-lg mb-3">📊 Les conséquences</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">•</span>
                <span>Augmentation massive des déchets électroniques (DEEE)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">•</span>
                <span>Surconsommation de ressources naturelles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">•</span>
                <span>Impact environnemental et social considérable</span>
              </li>
            </ul>
          </div>
        </div>
      </LessonSlide>

      {/* --- PAGE 4 --- */}
      <LessonSlide
        title="Les 5R et le tri des DEEE"
        subtitle="Informations"
        image="/5r.png"
      >
        <div className="space-y-6">
          <p className="text-lg">
            Pour limiter l'impact environnemental du numérique, la solution réside dans 
            l'application rigoureuse des <strong>5 R</strong> :
          </p>

          <div className="space-y-3">
            <div className="bg-red-500/10 p-4 rounded-xl border-l-4 border-red-400">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">1️⃣</span>
                <div>
                  <h4 className="font-bold text-red-300 mb-1">Refuser</h4>
                  <p className="text-sm">Mettre en question l'achat d'un nouvel appareil</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 p-4 rounded-xl border-l-4 border-orange-400">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">2️⃣</span>
                <div>
                  <h4 className="font-bold text-orange-300 mb-1">Réduire</h4>
                  <p className="text-sm">Limiter le nombre d'appareils et leur renouvellement</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 p-4 rounded-xl border-l-4 border-yellow-400">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">3️⃣</span>
                <div>
                  <h4 className="font-bold text-yellow-300 mb-1">Réutiliser (Reconditionner)</h4>
                  <p className="text-sm">Donner une seconde vie à un appareil d'occasion (vente, don, reconditionnement professionnel)</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 p-4 rounded-xl border-l-4 border-blue-400">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">4️⃣</span>
                <div>
                  <h4 className="font-bold text-blue-300 mb-1">Réparer</h4>
                  <p className="text-sm">Changer une pièce défectueuse plutôt que l'appareil entier</p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 p-4 rounded-xl border-l-4 border-green-400">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">5️⃣</span>
                <div>
                  <h4 className="font-bold text-green-300 mb-1">Recycler (le Tri !)</h4>
                  <p className="text-sm">C'est l'étape cruciale de la fin de vie</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 p-5 rounded-xl border-l-4 border-emerald-400">
            <h4 className="font-bold text-emerald-300 text-lg mb-3">♻️ Le Tri des DEEE : Le bon geste</h4>
            <p className="text-sm leading-relaxed mb-3">
              Un appareil numérique en fin de vie doit être déposé dans un point de collecte dédié 
              (magasin, déchetterie, point de collecte associatif).
            </p>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-sm font-semibold text-emerald-300 mb-2">Le tri permet de :</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Dépolluer</strong> le matériel en retirant les substances dangereuses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Récupérer</strong> les matières premières et les métaux rares contenus dans l'appareil, réduisant ainsi le besoin d'extraction minière</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </LessonSlide>
    </PaginationWrapper>
  );
}

export default LevelThree;
