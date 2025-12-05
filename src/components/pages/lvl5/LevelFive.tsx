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
