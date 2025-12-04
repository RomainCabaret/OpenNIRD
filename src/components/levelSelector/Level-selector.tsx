"use client";

import { useEffect, useState } from "react";

// Components
import { levels as staticLevels } from "@/data/levels-data";

// Context
import { useUser } from "@/context/UserContext";

// Hook
import { useMediaQuery } from "@/hooks/use-media-query";
import { IS_DEBUG } from "@/lib/constant";
import { GlobeInterface } from "./Desktop/GlobeInterface";
import { MobileStoreInterface } from "./Mobile/MobileStoreInterface";

export function LevelSelector() {
  const isSmallScreen = useMediaQuery("(max-width: 1100px)");
  const [mounted, setMounted] = useState(false);

  const { user, isLevelUnlocked } = useUser();

  const levelsWithProgress = staticLevels.map((level, index) => {
    const userLevelData = user.levels[index];
    const currentCollected = userLevelData?.collected ?? 0;

    return {
      ...level,
      collected: currentCollected,
    };
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-[#0B1221]" />;

  if (isSmallScreen)
    return <MobileStoreInterface levels={levelsWithProgress} />;
  return <GlobeInterface levels={levelsWithProgress} IS_DEBUG={IS_DEBUG} />;
}
