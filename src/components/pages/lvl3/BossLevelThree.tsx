"use client";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function BossLevelThree() {
  const router = useRouter();
  const { completeLevel, isLevelUnlocked } = useUser();

  useEffect(() => {
    if (!isLevelUnlocked(3)) {
      router.push("/");
    }
  }, []);
  return <div>BossLevelThree</div>;
}

export default BossLevelThree;
