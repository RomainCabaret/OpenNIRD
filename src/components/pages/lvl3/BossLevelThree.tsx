"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";

type ItemType = "Recyclage_matières" | "reconditionnement" | "réparation";

interface Item {
  id: number;
  name: string;
  type: ItemType;
  image?: string; // URL de l'image pour l'objet
}

// Données des objets à trier
const items: Item[] = [
  // Recyclage
  { id: 1, name: "Câbles à recycler", type: "Recyclage_matières", image: "/cables_à_recycler-Photoroom.png" },
  { id: 2, name: "Carte à recycler", type: "Recyclage_matières", image: "/carte_à_recycler-Photoroom.png" },
  { id: 3, name: "Écran à recycler", type: "Recyclage_matières", image: "/ecran_à_recycler-Photoroom.png" },
  { id: 4, name: "RAM à recycler", type: "Recyclage_matières", image: "/ram_à_recycler-Photoroom.png" },
  
  // Reconditionnement
  { id: 5, name: "Console à reconditionner", type: "reconditionnement", image: "/console_a_reconditionner-Photoroom.png" },
  { id: 6, name: "Imprimante à reconditionner", type: "reconditionnement", image: "/imprimante_à_reconditionné-Photoroom.png" },
  { id: 7, name: "Tablette à reconditionner", type: "reconditionnement", image: "/tab_a_reconditionner-Photoroom.png" },
  
  // Réparation
  { id: 8, name: "Téléphone à réparer", type: "réparation", image: "/phone_a_reparer-Photoroom.png" },
];

function BossLevelThree() {
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [usedItems, setUsedItems] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredBin, setHoveredBin] = useState<ItemType | null>(null);

  // Générer un nouvel objet aléatoire
  const generateNewItem = () => {
    const availableItems = items.filter(item => !usedItems.includes(item.id));
    
    if (availableItems.length === 0) {
      setGameWon(true);
      return;
    }
    
    const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    setCurrentItem(randomItem);
    setFeedback("");
  };

  // Initialiser le premier objet
  useEffect(() => {
    generateNewItem();
  }, []);

  // Vérifier si le joueur a choisi le bon bac (par drag & drop)
  const handleDrop = (binType: ItemType) => {
    if (!currentItem || gameOver || gameWon) return;

    setIsDragging(false);
    setHoveredBin(null);

    if (currentItem.type === binType) {
      const newScore = score + 1;
      const newUsedItems = [...usedItems, currentItem.id];
      
      setScore(newScore);
      setFeedback("✓ Correct !");
      setUsedItems(newUsedItems);
      
      // Vérifier si tous les objets ont été triés
      if (newUsedItems.length >= items.length) {
        setTimeout(() => {
          setGameWon(true);
        }, 800);
      } else {
        setTimeout(() => {
          generateNewItem();
        }, 800);
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback("✗ Mauvais bac !");
      
      if (newLives <= 0) {
        setGameOver(true);
      } else {
        setTimeout(() => {
          setFeedback("");
        }, 1000);
      }
    }
  };

  // Redémarrer le jeu
  const resetGame = () => {
    setScore(0);
    setLives(3);
    setUsedItems([]);
    setFeedback("");
    setGameOver(false);
    setGameWon(false);
    generateNewItem();
  };

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ 
        backgroundImage: 'url(/Fond_decheterie.png)',
        backgroundPosition: 'center calc(50% - 4.166%)',
        backgroundSize: 'cover'
      }}
    >
      {/* En-tête avec score */}
      <div className="absolute top-4 left-4 right-4 flex justify-center items-center text-white">
        <div className="text-2xl font-bold bg-black/50 px-6 py-3 rounded-lg">Score: {score}/{items.length}</div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl">
        {!gameOver && !gameWon && currentItem && (
          <>
            {/* Objet à trier - Draggable */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(event, info) => {
                  const pointerEvent = event as PointerEvent;
                  
                  // Attendre un peu pour que le DOM se stabilise
                  setTimeout(() => {
                    // Trouver l'élément draggé et le cacher temporairement
                    const draggedElements = document.querySelectorAll('[data-draggable="true"]');
                    draggedElements.forEach(el => {
                      (el as HTMLElement).style.pointerEvents = 'none';
                    });
                    
                    const element = document.elementFromPoint(
                      pointerEvent.clientX ?? info.point.x,
                      pointerEvent.clientY ?? info.point.y
                    );
                    
                    // Restaurer le pointer-events
                    draggedElements.forEach(el => {
                      (el as HTMLElement).style.pointerEvents = '';
                    });
                    
                    const binElement = element?.closest('[data-bin-type]');
                    if (binElement) {
                      const binType = binElement.getAttribute('data-bin-type') as ItemType;
                      handleDrop(binType);
                    } else {
                      // Aucun bac détecté, on remet l'objet au centre
                      setIsDragging(false);
                    }
                  }, 10);
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: isDragging ? 1.1 : 1, 
                  rotate: 0,
                  cursor: 'grab'
                }}
                whileDrag={{ 
                  scale: 1.15, 
                  cursor: 'grabbing',
                  zIndex: 100
                }}
                exit={{ scale: 0, rotate: 180 }}
                className="mb-12 text-center cursor-grab active:cursor-grabbing"
                data-draggable="true"
              >
                <div className="p-8 min-w-[300px] flex flex-col items-center">
                  {currentItem.image ? (
                    <img 
                      src={currentItem.image} 
                      alt={currentItem.name}
                      className="w-48 h-48 object-contain pointer-events-none"
                    />
                  ) : (
                    <div className="text-8xl pointer-events-none">
                      {currentItem.type === "Recyclage_matières" && "♻️"}
                      {currentItem.type === "reconditionnement" && "🔄"}
                      {currentItem.type === "réparation" && "🔧"}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-2xl font-bold mb-4 px-8 py-4 rounded-lg ${
                  feedback.includes("✓") 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white"
                }`}
              >
                {feedback}
              </motion.div>
            )}

            {/* Bacs de tri - Drop zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
              <motion.div
                data-bin-type="Recyclage_matières"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  scale: hoveredBin === "Recyclage_matières" ? 1.1 : 1
                }}
                onMouseEnter={() => isDragging && setHoveredBin("Recyclage_matières")}
                onMouseLeave={() => setHoveredBin(null)}
                className="relative flex items-center justify-center"
                style={{ height: '300px' }}
              >
                <img 
                  src="/benne_recyclage-removebg-preview.png" 
                  alt="Benne recyclage"
                  className="max-w-full max-h-full object-contain pointer-events-none"
                />
              </motion.div>

              <motion.div
                data-bin-type="reconditionnement"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  scale: hoveredBin === "reconditionnement" ? 1.1 : 1
                }}
                onMouseEnter={() => isDragging && setHoveredBin("reconditionnement")}
                onMouseLeave={() => setHoveredBin(null)}
                className="relative flex items-center justify-center"
                style={{ height: '300px' }}
              >
                <img 
                  src="/benne_reconditionnement-removebg-preview.png" 
                  alt="Benne reconditionnement"
                  className="max-w-full max-h-full object-contain pointer-events-none"
                />
              </motion.div>

              <motion.div
                data-bin-type="réparation"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  scale: hoveredBin === "réparation" ? 1.1 : 1
                }}
                onMouseEnter={() => isDragging && setHoveredBin("réparation")}
                onMouseLeave={() => setHoveredBin(null)}
                className="relative flex items-center justify-center"
                style={{ height: '300px' }}
              >
                <img 
                  src="/benne_reparation-removebg-preview.png" 
                  alt="Benne réparation"
                  className="max-w-full max-h-full object-contain pointer-events-none"
                />
              </motion.div>
            </div>
          </>
        )}

        {/* Écran de fin de jeu */}
        {(gameOver || gameWon) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-12 shadow-2xl text-center"
          >
            <div className="text-8xl mb-6">
              {gameWon ? "🎉" : "😢"}
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {gameWon ? "Félicitations !" : "Game Over"}
            </h2>
            <p className="text-2xl mb-6 text-gray-600">
              Score final: {score}/{items.length}
            </p>
            <Button
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl"
            >
              Quitter
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BossLevelThree;
