// ICI ON MET TOUTES LES FONCTIONS RÉUTILISABLE SUR NOTRE PROJET (EXEMPLE FONCTION MOYENNE OÙ CALCULE DE PROGRESSION)

export function calculatePercentage(current: number, max: number): number {
  if (max === 0) {
    throw new Error("La valeur maximale (max) ne peut pas être 0.");
  }
  return (current / max) * 100;
}

// LVL 2 -> 100xp
// LVL 3 -> 500xp
// LVL 4 -> 1000xp
export const LEVELS_XP = [1000, 2000, 5000, 10000, 15000, 20000, 25000, 40000];

// ------- 3D

export const IS_DEBUG = false;

export const GLOBE_RADIUS = 2.5;
export const MARKER_RADIUS = 2.52;
export const LINE_RADIUS = 2.52;

export const MAP_COLORS = {
  selected: "#fbbf24", // Gold
  unselected: "#ef4444", // Red
  lockedLine: "#64748b", // Slate 500 (Gris visible mais terne)
  activeLine: "#00E5FF", // Cyan (Néon très vif)
  lockedMarker: "#334155",
  glow: "#fbbf24",
};
