import { FixedCamera } from "@/components/3d/assets/Camera/PerspectiveCamera";
import { CollectiblesCounter } from "@/components/3d/Collectibles-counter";
import { ControlButtons } from "@/components/3d/Control-buttons";
import { GlobeScene } from "@/components/3d/Globe-scene";
import { LevelPreview } from "@/components/3d/Level-preview";
import { useUser } from "@/context/UserContext";
import { useLevelNavigation } from "@/hooks/use-level-navigation";
import { Level } from "@/types/types";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

export function GlobeInterface({
  levels,
  IS_DEBUG,
}: {
  levels: Level[];
  IS_DEBUG?: boolean;
}) {
  const controlsRef = useRef<OrbitControlsType>(null);

  const { isLevelUnlocked, getLastUnlockedLevelId } = useUser();

  const {
    selectedLevel,
    isNavigating,
    selectLevel,
    navigateLeft,
    navigateRight,
  } = useLevelNavigation(levels.length, getLastUnlockedLevelId() - 1);
  const totalCollectibles = levels.reduce(
    (acc, level) => acc + level.collected,
    0
  );

  // Calcul de l'état verrouillé pour le niveau ACTUELLEMENT SÉLECTIONNÉ
  const currentLevel = levels[selectedLevel];
  const isCurrentLevelUnlocked = isLevelUnlocked(currentLevel.id);
  const isCurrentLevelLocked = !isCurrentLevelUnlocked;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0B1221] to-[#020617] -z-10" />

      {/* UI LAYER */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="pointer-events-auto absolute top-8 left-8 animate-in slide-in-from-left-10 fade-in duration-700">
          <LevelPreview level={levels[selectedLevel]} />
        </div>
      </div>

      <div className="absolute top-8 right-8 z-20 pointer-events-auto">
        <CollectiblesCounter total={totalCollectibles} />
      </div>

      {/* 3D SCENE */}
      <div className="absolute inset-0 z-10">
        <Canvas
          className="block h-full w-full"
          resize={{ scroll: false, debounce: 0 }}
        >
          <FixedCamera />
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            enableRotate={IS_DEBUG}
            rotateSpeed={0.5}
            target={[0, 0, 0]}
          />
          <GlobeScene
            levels={levels}
            selectedLevel={selectedLevel}
            onLevelSelect={selectLevel}
            debug={IS_DEBUG}
          />
        </Canvas>
      </div>

      <ControlButtons
        onRotateLeft={navigateLeft}
        onRotateRight={navigateRight}
        onSelect={() => {
          if (!isCurrentLevelLocked) {
            console.log("Navigation vers:", currentLevel.name);
            // router.push(`/play/${currentLevel.id}`)
          }
        }}
        isNavigating={isNavigating}
        isLocked={isCurrentLevelLocked}
      />
    </div>
  );
}
