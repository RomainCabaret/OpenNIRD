import { BossEncounter } from "@/components/boss/BossEncounter";
import { LessonSlide } from "@/components/levelSelector/LessonSlide";
import { PaginationWrapper } from "@/components/pagination/PaginationWrapper";
import React from "react";

function LevelThree() {
  return (
    <PaginationWrapper
      title="Module 3 : Les Abysses"
      miniGame={<BossEncounter />} // Le Boss est passé ici
    >
      {/* --- PAGE 1 --- */}
      <LessonSlide
        title="Introduction aux Profondeurs"
        subtitle="Chapitre 1"
        image="/clouds-sky-floating-gardens-nimbus.jpg" // Remplace par une vraie image
      >
        <p>AAA</p>
      </LessonSlide>
    </PaginationWrapper>
  );
}

export default LevelThree;
