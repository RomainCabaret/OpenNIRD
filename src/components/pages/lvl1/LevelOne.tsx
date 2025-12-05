"use client";
import { LessonSlide } from "@/components/levelSelector/LessonSlide";
import { PaginationWrapper } from "@/components/pagination/PaginationWrapper";
import React from "react";
import BossLevelOne from "./BossLevelOne";

function LevelOne() {
  return (
    <PaginationWrapper
      title="Niveau 1 : La légende Lunix"
      miniGame={<BossLevelOne />} // Le Boss est passé ici
    >
      {/* --- PAGE 1 --- */}
      <LessonSlide
        title="Un pingouin perdu"
        subtitle="Histoire"
        image="/LunixEspionLycee.png" // Remplace par une vraie image
      >
        <div className="space-y-4">
          <p>
            Dans les sous-sols poussiéreux d'un lycée de banlieue,
            une légende raconte qu'un pingouin ermite nommé <strong>Lunix</strong> erre
            dans la salle serveur de l'école.
          </p>
          
          <p>
            Depuis des années, Lunix observait les habitudes numériques des étudiants. 
            Mais aujourd'hui, avec le développement toujours plus rapide des technologies 
            et leurs usages à mauvais escient, le pingouin ne peut plus rester passif.
          </p>
          
          <p>
            Rester caché ne changera rien. Il doit s'échapper du lycée pour prêcher la bonne parole.
          </p>
          
          <div className="bg-white/10 p-6 rounded-xl border-l-4 border-blue-400 mt-6">
            <p className="text-lg font-semibold text-white">
              Sa mission est claire : parcourir le monde pour enseigner les trois piliers sacrés
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <div className="font-bold text-blue-300">Inclusivité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚖️</div>
                <div className="font-bold text-green-300">Responsabilité</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌱</div>
                <div className="font-bold text-emerald-300">Durabilité</div>
              </div>
            </div>
          </div>
        </div>
      </LessonSlide>

      {/* --- PAGE 2 --- */}
      <LessonSlide
        title="Qu'est ce que le projet NIRD ?"
        subtitle="Informations"
        image="/LogoNIRD.svg"
      >
        <div className="space-y-6">
          <p className="text-lg">
            Le projet <strong>NIRD</strong> est une philosophie d'action pour le système éducatif et la société.
            Il repose sur trois piliers fondamentaux :
          </p>

          <div className="space-y-4">
            <div className="bg-blue-500/10 p-5 rounded-xl border-l-4 border-blue-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🤝</span>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg mb-2">Numérique Inclusif</h4>
                  <p className="text-sm leading-relaxed">
                    Le numérique ne doit laisser personne de côté. Cela signifie garantir l'accessibilité 
                    aux personnes en situation de handicap et lutter contre l'illectronisme (la difficulté 
                    à utiliser les outils numériques) pour que chaque élève, quel que soit son milieu social 
                    ou ses capacités, ait les mêmes chances.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 p-5 rounded-xl border-l-4 border-green-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚖️</span>
                <div>
                  <h4 className="font-bold text-green-300 text-lg mb-2">Numérique Responsable</h4>
                  <p className="text-sm leading-relaxed">
                    C'est adopter une éthique dans l'usage des technologies. Cela implique de protéger 
                    ses données, de respecter celles des autres, et de comprendre les impacts sociétaux 
                    des outils que nous utilisons (cybersécurité, cyberharcèlement).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 p-5 rounded-xl border-l-4 border-emerald-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🌱</span>
                <div>
                  <h4 className="font-bold text-emerald-300 text-lg mb-2">Numérique Durable</h4>
                  <p className="text-sm leading-relaxed">
                    C'est la prise de conscience écologique. Le numérique pollue (fabrication, 
                    consommation électrique). Le but est de réduire cette empreinte environnementale 
                    par la sobriété numérique.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10 mt-6">
            <p className="text-xs text-gray-400 font-semibold mb-2">Sources :</p>
            <ul className="text-xs space-y-1 text-gray-300">
              <li>• Projet NIRD : <a href="https://nird.forge.apps.education.fr/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">nird.forge.apps.education.fr</a></li>
              <li>• Éducation nationale : <a href="https://www.education.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">education.gouv.fr</a></li>
            </ul>
          </div>
        </div>
      </LessonSlide>
    </PaginationWrapper>
  );
}

export default LevelOne;
