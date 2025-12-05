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
      title="Module 4 : Les Abysses"
      miniGame={<BossLevelFour />} // Le Boss est passé ici
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

export default LevelFour;
