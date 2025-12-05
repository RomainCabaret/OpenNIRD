"use client";

import { levels as levelsData } from "@/data/levels-data"; // Import de la source de vérité
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/crypto";
import React, { createContext, useContext, useEffect, useState } from "react";

// --- TYPES ---

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  collected: number;
  stars: number;
}

interface UserData {
  username: string;
  gems: number;
  xp: number;
  levels: { [levelId: number]: LevelProgress };
}

interface UserContextType {
  user: UserData;
  setUser: (user: UserData) => void;

  // Actions
  unlockLevel: (levelId: number) => void;
  completeLevel: (levelId: number) => void;
  updateCollectibles: (levelId: number, count: number) => void;
  addCollectibles: (levelId: number, amount: number) => void;

  // Getters
  isLevelCompleted: (levelId: number) => boolean;
  isLevelUnlocked: (levelId: number) => boolean;
  getLevelData: (levelId: number) => LevelProgress;
  getLastUnlockedLevelId: () => number;

  // Global
  changeUsername: (newUsername: string) => void;
  resetUser: () => void;
}

const DEFAULT_LEVEL_STATE: LevelProgress = {
  unlocked: false,
  completed: false,
  collected: 0,
  stars: 0,
};

const LOCAL_STORAGE_KEY = "H2OCEAN-USER-DATA";

// --- HELPER D'INITIALISATION ---
// Construit l'objet levels par défaut basé sur le fichier de configuration
const getInitialLevelsState = () => {
  const initialLevels: { [key: number]: LevelProgress } = {};

  levelsData.forEach((level) => {
    initialLevels[level.id] = {
      ...DEFAULT_LEVEL_STATE,
      unlocked: level.id === 1, // Seul le niveau 1 est ouvert par défaut
    };
  });

  return initialLevels;
};

const DEFAULT_USER: UserData = {
  username: "Invité",
  gems: 0,
  xp: 0,
  levels: getInitialLevelsState(),
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData>(DEFAULT_USER);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- ACTIONS ---

  const unlockLevel = (levelId: number) => {
    setUser((prev) => {
      // Sécurité : Vérifie si le niveau existe dans les données statiques
      if (!levelsData.find((l) => l.id === levelId)) return prev;

      if (prev.levels[levelId]?.unlocked) return prev;

      return {
        ...prev,
        levels: {
          ...prev.levels,
          [levelId]: {
            ...(prev.levels[levelId] || DEFAULT_LEVEL_STATE),
            unlocked: true,
          },
        },
      };
    });
  };

  const completeLevel = (levelId: number) => {
    setUser((prev) => {
      // 1. Marquer le niveau actuel comme complété
      const currentLevel = prev.levels[levelId] || DEFAULT_LEVEL_STATE;
      const updatedLevels = {
        ...prev.levels,
        [levelId]: { ...currentLevel, completed: true },
      };

      // 2. Tenter de débloquer le niveau suivant
      const nextLevelId = levelId + 1;

      // VÉRIFICATION CRITIQUE : Le niveau suivant existe-t-il dans la config ?
      const nextLevelExists = levelsData.some((l) => l.id === nextLevelId);

      if (nextLevelExists) {
        updatedLevels[nextLevelId] = {
          ...(updatedLevels[nextLevelId] || DEFAULT_LEVEL_STATE),
          unlocked: true,
        };
      }

      return { ...prev, levels: updatedLevels };
    });
  };

  const updateCollectibles = (levelId: number, count: number) => {
    setUser((prev) => ({
      ...prev,
      levels: {
        ...prev.levels,
        [levelId]: {
          ...(prev.levels[levelId] || DEFAULT_LEVEL_STATE),
          collected: count,
        },
      },
    }));
  };

  const addCollectibles = (levelId: number, amount: number) => {
    setUser((prev) => {
      const current = prev.levels[levelId] || DEFAULT_LEVEL_STATE;
      return {
        ...prev,
        levels: {
          ...prev.levels,
          [levelId]: {
            ...current,
            collected: Math.max(0, current.collected + amount),
          },
        },
      };
    });
  };

  const changeUsername = (newUsername: string) => {
    setUser((prev) => ({ ...prev, username: newUsername }));
  };

  const resetUser = () => {
    // On remet l'état par défaut propre (basé sur levelsData)
    const freshUser = {
      ...DEFAULT_USER,
      levels: getInitialLevelsState(),
    };
    setUser(freshUser);
    saveToLocalStorage(LOCAL_STORAGE_KEY, freshUser);
  };

  // --- GETTERS ---

  const isLevelUnlocked = (levelId: number): boolean => {
    return user.levels[levelId]?.unlocked || false;
  };

  const isLevelCompleted = (levelId: number): boolean => {
    return user.levels[levelId]?.completed || false;
  };

  const getLevelData = (levelId: number): LevelProgress => {
    return user.levels[levelId] || DEFAULT_LEVEL_STATE;
  };

  const getLastUnlockedLevelId = (): number => {
    if (!user.levels) return 1;

    // On utilise les clés de l'objet utilisateur, qui sont maintenant garanties d'être propres
    const unlockedIds = Object.keys(user.levels)
      .map(Number)
      .filter((id) => user.levels[id]?.unlocked);

    if (unlockedIds.length === 0) return 1;
    return Math.max(...unlockedIds);
  };

  // --- PERSISTENCE & HYDRATION ---

  useEffect(() => {
    const savedUser = loadFromLocalStorage(
      LOCAL_STORAGE_KEY
    ) as UserData | null;

    console.log("Loaded raw user data:", savedUser);

    if (savedUser && savedUser.levels) {
      // --- SANITIZATION (Nettoyage) ---
      // On reconstruit un objet levels propre pour éliminer les clés corrompues (0, undefined, etc.)
      const cleanLevels = getInitialLevelsState(); // Commence avec état par défaut propre

      Object.keys(savedUser.levels).forEach((key) => {
        const id = Number(key);
        // Si cet ID existe vraiment dans notre fichier de config, on restaure la sauvegarde
        if (levelsData.some((l) => l.id === id)) {
          cleanLevels[id] = {
            ...cleanLevels[id], // Garde les defaults
            ...savedUser.levels[id], // Écrase avec la sauvegarde valide
          };
        }
      });

      setUser({
        ...savedUser,
        levels: cleanLevels,
      });
    } else {
      console.log("Nouvelle partie ou données invalides.");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveToLocalStorage(LOCAL_STORAGE_KEY, user);
    }
  }, [user, isInitialized]);

  if (!isInitialized) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        unlockLevel,
        completeLevel,
        updateCollectibles,
        addCollectibles,
        isLevelUnlocked,
        isLevelCompleted,
        getLevelData,
        getLastUnlockedLevelId,
        changeUsername,
        resetUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser doit être utilisé dans un UserProvider");
  }
  return context;
};
