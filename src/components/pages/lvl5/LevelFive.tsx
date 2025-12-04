import { LessonSlide } from "@/components/levelSelector/LessonSlide";
import { PaginationWrapper } from "@/components/pagination/PaginationWrapper";
import React from "react";
import BossLevelFive from "./BossLevelFive";

function LevelFive() {
  return (
    <PaginationWrapper
      title="Module 5 : Les Abysses"
      miniGame={<BossLevelFive />} // Le Boss est passé ici
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

export default LevelFive;
