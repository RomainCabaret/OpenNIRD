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
      title="Module 2 : Les Abysses"
      miniGame={<BossLevelTwo />} // Le Boss est passé ici
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

export default LevelTwo;
