"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

// --- CONFIGURATION DES SPRITES ET ÉMOTIONS ---
const SPRITES = {
  idle: "/sprites/tom_idle.png",
  blink: "/sprites/tom_blink.png",
  listen: "/sprites/tom_react_sideeye.png",
  
  // Séquence variée pour la parole
  talkingSequence: [
    "/sprites/tom_talk_a.png",
    "/sprites/tom_talk_b.png",
    "/sprites/tom_talk_a.png",
    "/sprites/tom_talk_c.png",
    "/sprites/tom_talk_a.png",
    "/sprites/tom_talk_d.png",
  ],
  
  // Réactions d'ennui aléatoires
  reactions: [
    "/sprites/tom_react_eyeroll.png",
    "/sprites/tom_react_disgust.png",
    "/sprites/tom_react_eyebrow.png",
    "/sprites/tom_react_pensive.png",
    "/sprites/tom_react_yawn.png",
    "/sprites/tom_react_flat.png",
  ],

  // MAPPING DES ÉMOTIONS (API -> SPRITES)
  emotionsMap: {
    DISDAIN: ["/sprites/tom_react_eyeroll.png", "/sprites/tom_react_disgust.png"],
    ARROGANT: ["/sprites/tom_blink.png", "/sprites/tom_react_pensive.png"], 
    SKEPTICAL: ["/sprites/tom_react_eyebrow.png"],
    BORED: ["/sprites/tom_react_yawn.png", "/sprites/tom_react_flat.png"],
    NEUTRAL: [] 
  } as { [key: string]: string[] }
};

interface CatSpriteModelProps {
  isTalking: boolean;
  isListening?: boolean;
  emotion: string; // Reçoit l'émotion
}

export function CatSpriteModel({ isTalking, isListening, emotion }: CatSpriteModelProps) {
  const [currentImage, setCurrentImage] = useState(SPRITES.idle);
  
  const talkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emotionDelayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const talkFrameIndex = useRef(0);

  const clearAllTimers = useCallback(() => {
    if (talkIntervalRef.current) clearInterval(talkIntervalRef.current);
    if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    if (emotionDelayTimeoutRef.current) clearTimeout(emotionDelayTimeoutRef.current);
  }, []);

  // Logique de Clignement (Inchangée)
  const scheduleBlink = useCallback(() => {
    if (isTalking) return; 
    const nextBlinkTime = Math.random() * 4000 + 3000;
    blinkTimeoutRef.current = setTimeout(() => {
      if (!isTalking) {
        setCurrentImage(SPRITES.blink);
        setTimeout(() => {
          if (!isTalking) {
             setCurrentImage(isListening ? SPRITES.listen : SPRITES.idle);
             scheduleBlink();
          }
        }, 200); 
      }
    }, nextBlinkTime);
  }, [isTalking, isListening]);

  // Logique des Réactions d'Ennui (Inchangée)
  const scheduleReaction = useCallback(() => {
    if (isTalking || isListening || SPRITES.reactions.length === 0) return;
    const nextReactionTime = Math.random() * 6000 + 6000;
    reactionTimeoutRef.current = setTimeout(() => {
      if (!isTalking && !isListening) {
        const randomReaction = SPRITES.reactions[Math.floor(Math.random() * SPRITES.reactions.length)];
        setCurrentImage(randomReaction);
        setTimeout(() => {
          if (!isTalking && !isListening) {
            setCurrentImage(SPRITES.idle);
            scheduleBlink();
            scheduleReaction();
          }
        }, 2000);
      }
    }, nextReactionTime);
  }, [isTalking, isListening, scheduleBlink]);


  // --- ORCHESTRATION PRINCIPALE ---
  useEffect(() => {
    clearAllTimers();

    if (isTalking) {
      // --- MODE 1 : PAROLE AVEC GESTION DE L'ÉMOTION ---
      
      // 1. Chercher le sprite d'émotion correspondant
      let reactionSprite = null;
      const possibleSprites = SPRITES.emotionsMap[emotion];
      
      if (possibleSprites && possibleSprites.length > 0 && emotion !== "NEUTRAL") {
        reactionSprite = possibleSprites[Math.floor(Math.random() * possibleSprites.length)];
      }

      const startTalkingLoop = () => {
        talkFrameIndex.current = 0;
        talkIntervalRef.current = setInterval(() => {
          const frame = SPRITES.talkingSequence[talkFrameIndex.current];
          setCurrentImage(frame);
          talkFrameIndex.current = (talkFrameIndex.current + 1) % SPRITES.talkingSequence.length;
        }, 110);
      };

      if (reactionSprite) {
        // CAS A : Émotion forte -> On affiche la réaction.
        setCurrentImage(reactionSprite);
        // --- MODIFICATION ICI : Durée passée de 1000ms à 2000ms ---
        emotionDelayTimeoutRef.current = setTimeout(() => {
           startTalkingLoop();
        }, 2000); // <--- C'EST ICI QUE ÇA SE PASSE
        // ---------------------------------------------------------
      } else {
        // CAS B : Neutre -> On parle directement
        startTalkingLoop();
      }

    } else if (isListening) {
      // --- MODE 2 : ÉCOUTE ---
      setCurrentImage(SPRITES.listen);
      scheduleBlink();

    } else {
      // --- MODE 3 : IDLE ---
      setCurrentImage(SPRITES.idle);
      scheduleBlink();
      scheduleReaction();
    }

    return () => clearAllTimers();
  }, [isTalking, isListening, emotion, clearAllTimers, scheduleBlink, scheduleReaction]);


  return (
    <div className="relative w-[450px] h-[450px] flex items-center justify-center pointer-events-none select-none z-0">
      <Image 
        src={currentImage}
        alt="Tom le Chat-rlatan"
        fill
        style={{ objectFit: "contain" }}
        priority
        className="transition-opacity duration-100"
      />
    </div>
  );
}

export default CatSpriteModel;