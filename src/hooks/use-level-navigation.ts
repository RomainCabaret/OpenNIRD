"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NAVIGATION_COOLDOWN = 500;

export function useLevelNavigation(totalLevels: number, initialLevel = 0) {
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [isNavigating, setIsNavigating] = useState(false);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerCooldown = useCallback(() => {
    setIsNavigating(true);

    if (navTimeoutRef.current) {
      clearTimeout(navTimeoutRef.current);
    }

    navTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      navTimeoutRef.current = null;
    }, NAVIGATION_COOLDOWN);
  }, []);

  const selectLevel = useCallback(
    (index: number) => {
      if (isNavigating || index === selectedLevel) return;
      setSelectedLevel(index);
      triggerCooldown();
    },
    [isNavigating, selectedLevel, triggerCooldown]
  );

  const navigate = useCallback(
    (direction: "left" | "right") => {
      if (isNavigating) return;

      setSelectedLevel((prev) => {
        if (direction === "left") {
          return prev > 0 ? prev - 1 : totalLevels - 1;
        } else {
          return prev < totalLevels - 1 ? prev + 1 : 0;
        }
      });
      triggerCooldown();
    },
    [isNavigating, totalLevels, triggerCooldown]
  );

  // Gestion du clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isNavigating) return;

      if (e.key === "ArrowLeft") navigate("left");
      if (e.key === "ArrowRight") navigate("right");
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate, isNavigating]);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) {
        clearTimeout(navTimeoutRef.current);
        setIsNavigating(false);
      }
    };
  }, []);

  return {
    selectedLevel,
    isNavigating,
    selectLevel,
    navigateLeft: () => navigate("left"),
    navigateRight: () => navigate("right"),
  };
}
