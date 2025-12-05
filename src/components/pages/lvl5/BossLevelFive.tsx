"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Zap, Activity, Music, Upload, AlertCircle, Disc, Link as LinkIcon, Terminal, Bot, Sparkles, Skull, Database } from 'lucide-react';

// --- TYPES & CONSTANTES ---

type NoteType = 'normal' | 'long';

type Note = {
  id: number;
  lane: 0 | 1 | 2;
  y: number;
  type: NoteType;
  length: number;
  hit: boolean;
  isHeld: boolean;
  processed: boolean;
  missed: boolean;
  heldProgress: number; 
};

type GameState = 'MENU' | 'PLAYING' | 'GAMEOVER' | 'VICTORY';
type MascotMood = 'IDLE' | 'HYPE' | 'SUPER_HYPE' | 'ERROR';

const LANE_COUNT = 3;

// --- CONFIGURATION RYTHMIQUE STRICTE (152 BPM) ---
const BPM = 152;
const MS_PER_BEAT = 60000 / BPM; 
const SPAWN_INTERVAL_MS = MS_PER_BEAT * 2; 

const BASE_NOTE_SPEED = 0.48; 
const DIFFICULTY_RAMP_UP_MS = 210000; 

const HIT_ZONE_TOP = 80; 
const HIT_ZONE_BOTTOM = 98; 

// --- CONFIGURATION AUDIO LOCALE ---
const DEFAULT_AUDIO_URL = "/audio/piano-tales-game.mp3"; 
const DEFAULT_TRACK_TITLE = "Piste Locale (Intégrée)";
const FALLBACK_DURATION_MS = 227000; // 3m47s

// --- SOUS-COMPOSANT : MASCOTTE HACKER ---
const HackerBuddy = ({ mood, combo, progress }: { mood: MascotMood, combo: number, progress: number }) => {
  let containerClass = "transition-all duration-300 transform";
  let iconColor = "text-green-500";
  let message = "SYSTÈME EN LIGNE";
  let Icon = Bot;

  switch (mood) {
    case 'HYPE':
      containerClass += " scale-110 animate-bounce";
      iconColor = "text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]";
      message = "TRANSFERT...";
      Icon = Sparkles;
      break;
    case 'SUPER_HYPE':
      containerClass += " scale-125 animate-pulse translate-x-1";
      iconColor = "text-yellow-400 drop-shadow-[0_0_15px_#facc15]";
      message = "PALIER ATTEINT !";
      Icon = Zap;
      break;
    case 'ERROR':
      containerClass += " rotate-12 bg-red-900/20 p-2 rounded-lg animate-ping"; 
      iconColor = "text-red-500 drop-shadow-[0_0_10px_red]";
      message = "ERREUR !";
      Icon = Skull; 
      break;
    default: 
      containerClass += " animate-pulse";
      iconColor = "text-green-500/80";
      message = "SURVEILLANCE";
      break;
  }

  return (
    <div className="hidden md:flex flex-col items-center justify-center gap-4 w-40 p-4 border-l border-green-900/30 bg-slate-900/40 backdrop-blur-sm h-[80vh] mt-12 transition-all flex-shrink-0">
       <div className="text-[10px] font-mono text-green-700 mb-2 tracking-widest text-center">ASSISTANT IA</div>
       
       <div className={`relative ${containerClass}`}>
          {mood === 'SUPER_HYPE' && <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse"></div>}
          <Icon size={mood === 'SUPER_HYPE' ? 70 : 56} className={iconColor} strokeWidth={1.5} />
          {mood === 'IDLE' && (
             <div className="absolute top-[35%] left-[25%] w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          )}
       </div>

       <div className={`text-center font-mono font-bold mt-4 ${mood === 'ERROR' ? 'text-red-500' : (mood === 'SUPER_HYPE' ? 'text-yellow-400' : 'text-green-400')}`}>
          <div className="text-sm leading-tight">{message}</div>
          <div className="text-[10px] text-green-800 mt-2">COMBO : {combo}</div>
          {/* Affichage de la progression via props (React State) pour le texte uniquement */}
          <div className="text-[10px] text-green-600 mt-1">PROG : {Math.floor(progress)}%</div>
       </div>

       <div className="flex gap-1 items-end h-12 mt-6 opacity-50">
          {[...Array(4)].map((_, i) => (
             <div key={i} className={`w-1.5 bg-green-500 transition-all duration-100`} 
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    animation: `pulse 0.2s infinite ${i * 0.1}s`
                  }} 
             />
          ))}
       </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

export default function PianoTalesGame() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [progress, setProgress] = useState(0); 
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [mascotMood, setMascotMood] = useState<MascotMood>('IDLE');
  
  const [milestoneTrigger, setMilestoneTrigger] = useState(false);
  
  const [dataGauge, setDataGauge] = useState(100); 
  const [elecGauge, setElecGauge] = useState(100); 

  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(DEFAULT_AUDIO_URL);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [trackName, setTrackName] = useState<string>(DEFAULT_TRACK_TITLE);
  const [urlInput, setUrlInput] = useState("");

  // Refs pour manipulation DOM directe (Performance & Fluidité)
  const leftBarRef = useRef<HTMLDivElement>(null);
  const rightBarRef = useRef<HTMLDivElement>(null);

  const [notes, setNotes] = useState<Note[]>([]); 
  const notesRef = useRef<Note[]>([]); 
  const requestRef = useRef<number>();
  const lastSpawnTime = useRef<number>(0);
  const gameStartTimeRef = useRef<number>(0);
  
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const lastMilestoneRef = useRef(0); 
  const dataRef = useRef(100);
  const elecRef = useRef(100);
  const heldKeysRef = useRef<boolean[]>([false, false, false]); 
  const mascotTimeoutRef = useRef<NodeJS.Timeout>();

  const [activeLanes, setActiveLanes] = useState<boolean[]>([false, false, false]);

  const stopGame = useCallback((finalState: GameState) => {
    setGameState(finalState);
    
    // Force la barre à 100% en cas de victoire pour un finish propre
    if (finalState === 'VICTORY') {
        const full = "100%";
        if (leftBarRef.current) leftBarRef.current.style.height = full;
        if (rightBarRef.current) rightBarRef.current.style.height = full;
        setProgress(100);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  }, []);

  const triggerMascotReaction = (type: 'HIT' | 'MISS' | 'MILESTONE') => {
    if (type === 'MISS') {
        setMascotMood('ERROR');
        if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
        mascotTimeoutRef.current = setTimeout(() => updateMascotMood(0), 500);
    } else if (type === 'MILESTONE') {
        setMascotMood('SUPER_HYPE');
        setMilestoneTrigger(true); 
        setTimeout(() => setMilestoneTrigger(false), 800); 
        
        if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
        mascotTimeoutRef.current = setTimeout(() => updateMascotMood(comboRef.current), 2000);
    } else {
        updateMascotMood(comboRef.current);
    }
  };

  const updateMascotMood = (currentCombo: number) => {
      if (currentCombo > 30) setMascotMood('HYPE'); 
      else if (currentCombo > 10) setMascotMood('HYPE');
      else setMascotMood('IDLE');
  };

  const updateGauges = (dataChange: number, elecChange: number) => {
    dataRef.current = Math.min(100, Math.max(0, dataRef.current + dataChange));
    elecRef.current = Math.min(100, Math.max(0, elecRef.current + elecChange));
    
    if (dataRef.current <= 0 || elecRef.current <= 0) {
      stopGame('GAMEOVER');
    }
    
    setDataGauge(dataRef.current);
    setElecGauge(elecRef.current);
  };

  const checkMilestones = (currentProgress: number) => {
      if (currentProgress >= lastMilestoneRef.current + 15) {
          lastMilestoneRef.current += 15;
          triggerMascotReaction('MILESTONE');
          updateGauges(15, 15);
      }
  };

  const spawnNote = useCallback((timestamp: number, difficulty: number) => {
    const currentSpawnRate = SPAWN_INTERVAL_MS; 

    if (timestamp - lastSpawnTime.current >= currentSpawnRate) {
      
      const availableLanes = [0, 1, 2].sort(() => Math.random() - 0.5);
      let chosenLane = -1;

      for (const lane of availableLanes) {
          const notesInLane = notesRef.current.filter(n => n.lane === lane);
          
          if (notesInLane.length === 0) {
              chosenLane = lane;
              break;
          }

          const lastNote = notesInLane.reduce((prev, curr) => (prev.y < curr.y ? prev : curr)); 
          if (lastNote.y > 5) { 
              chosenLane = lane;
              break;
          }
      }

      if (chosenLane !== -1) {
        const isLong = Math.random() < 0.25;
        const length = isLong ? 25 + Math.random() * 20 : 12; 

        const newNote: Note = {
            id: timestamp,
            lane: chosenLane as 0|1|2,
            y: -length, 
            type: isLong ? 'long' : 'normal',
            length,
            hit: false,
            isHeld: false,
            processed: false,
            missed: false,
            heldProgress: 0,
        };
        notesRef.current.push(newNote);
        
        if (timestamp - lastSpawnTime.current > currentSpawnRate * 2) {
            lastSpawnTime.current = timestamp;
        } else {
            lastSpawnTime.current += currentSpawnRate; 
        }
      } else {
          lastSpawnTime.current += currentSpawnRate; 
      }
    }
  }, []);

  const updatePhysics = useCallback((timestamp: number) => {
    if (gameState !== 'PLAYING') return;

    // --- MISE À JOUR PROGRESSION VIA DOM DIRECT ---
    let currentProgress = 0;
    const audio = audioRef.current;
    const timeElapsed = timestamp - gameStartTimeRef.current;

    // Priorité Audio
    if (audio && !audio.paused && Number.isFinite(audio.duration) && audio.duration > 0) {
        currentProgress = (audio.currentTime / audio.duration) * 100;
    } 
    // Mode Secours
    else {
        currentProgress = Math.min(100, (timeElapsed / FALLBACK_DURATION_MS) * 100);
        if (currentProgress >= 100) stopGame('VICTORY');
    }
    
    // Application directe au DOM pour fluidité maximale (contourne le cycle React)
    const heightStyle = `${currentProgress}%`;
    if (leftBarRef.current) leftBarRef.current.style.height = heightStyle;
    if (rightBarRef.current) rightBarRef.current.style.height = heightStyle;

    // Mise à jour de l'état React pour le texte (peut être un peu moins fréquent, mais ok ici)
    setProgress(currentProgress);
    checkMilestones(currentProgress);

    // --- FIN MISE À JOUR PROGRESSION ---

    if (!heldKeysRef.current.some(k => k)) {
        updateGauges(0, 0.12);
    }

    const difficulty = 1 + (timeElapsed / DIFFICULTY_RAMP_UP_MS); 
    setDifficultyLevel(difficulty); 

    const currentSpeed = BASE_NOTE_SPEED * difficulty;

    spawnNote(timestamp, difficulty);

    notesRef.current.forEach(note => {
      if (!note.processed) {
        note.y += currentSpeed;
      }

      const noteTop = note.y;

      if (note.type === 'long' && note.hit && !note.processed) {
        if (heldKeysRef.current[note.lane]) {
          note.isHeld = true;
          note.heldProgress += currentSpeed;
          
          scoreRef.current += 2; 
          updateGauges(0, 0.05); 
          
          const coverageRatio = note.heldProgress / note.length;
          if (coverageRatio >= 0.60) {
              note.processed = true; 
              note.isHeld = false;
              
              scoreRef.current += 100; 
              triggerMascotReaction('HIT'); 
          }
          else if (noteTop > HIT_ZONE_BOTTOM) {
            note.processed = true;
            note.isHeld = false;
            note.missed = true; 
            updateGauges(-8, -5);
            comboRef.current = 0; 
            triggerMascotReaction('MISS');
          }
        } else {
          note.isHeld = false;
          if (noteTop > HIT_ZONE_TOP) {
             note.processed = true;
             
             const coverageRatio = note.heldProgress / note.length;
             if (coverageRatio < 0.60) {
                 note.missed = true;
                 updateGauges(-5, -2);
                 comboRef.current = 0; 
                 triggerMascotReaction('MISS');
             } else {
                 scoreRef.current += 50; 
             }
          }
        }
      }

      if (noteTop > 100 && !note.hit && !note.missed && !note.processed) {
        note.missed = true;
        note.processed = true;
        updateGauges(-8, -5);
        comboRef.current = 0; 
        triggerMascotReaction('MISS');
      }
    });

    notesRef.current = notesRef.current.filter(note => !note.processed && note.y < 120);

    setScore(scoreRef.current);
    setCombo(comboRef.current);
    setNotes([...notesRef.current]);

    requestRef.current = requestAnimationFrame(updatePhysics);
  }, [gameState, spawnNote, stopGame]); 

  // --- GESTION DES ENTRÉES ---

  const handleInputStart = useCallback((laneIndex: number) => {
    if (gameState !== 'PLAYING') return;

    setActiveLanes(prev => {
      const n = [...prev];
      n[laneIndex] = true;
      return n;
    });

    heldKeysRef.current[laneIndex] = true;

    const hitNoteIndex = notesRef.current.findIndex(n => 
      n.lane === laneIndex && 
      !n.hit && 
      !n.missed && 
      !n.processed &&
      (n.y + n.length > HIT_ZONE_TOP) && 
      (n.y < HIT_ZONE_BOTTOM)          
    );

    if (hitNoteIndex !== -1) {
      const note = notesRef.current[hitNoteIndex];
      note.hit = true;
      
      if (note.type === 'normal') {
        note.processed = true; 
        scoreRef.current += 100;
        updateGauges(2, -1);
        comboRef.current += 1;
        triggerMascotReaction('HIT');
      } else {
        updateGauges(0, -1); 
        comboRef.current += 1;
        triggerMascotReaction('HIT');
      }
    } else {
      updateGauges(0, -2);
    }
  }, [gameState]);

  const handleInputEnd = useCallback((laneIndex: number) => {
    setActiveLanes(prev => {
      const n = [...prev];
      n[laneIndex] = false;
      return n;
    });
    heldKeysRef.current[laneIndex] = false;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'a' || e.key === 'ArrowLeft') handleInputStart(0);
      if (e.key === 's' || e.key === 'ArrowDown') handleInputStart(1);
      if (e.key === 'd' || e.key === 'ArrowRight') handleInputStart(2);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'ArrowLeft') handleInputEnd(0);
      if (e.key === 's' || e.key === 'ArrowDown') handleInputEnd(1);
      if (e.key === 'd' || e.key === 'ArrowRight') handleInputEnd(2);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleInputStart, handleInputEnd]);

  // --- AUDIO & SYNC ---
  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameStartTimeRef.current = performance.now();
      lastSpawnTime.current = performance.now();
      requestRef.current = requestAnimationFrame(updatePhysics);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, updatePhysics]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleEnded = () => stopGame('VICTORY');
    const handleCanPlay = () => { setIsAudioLoaded(true); setAudioError(null); };
    const handleError = (e: Event) => {
        setAudioError("Fichier audio introuvable (verifiez 'public/').");
        setIsAudioLoaded(false);
    };
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    if (audioSrc) {
        audio.load();
    } else { 
        setIsAudioLoaded(false); 
        setAudioError(null); 
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [stopGame, audioSrc]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setTrackName(file.name.replace(/\.[^/.]+$/, ""));
      setUrlInput(""); 
      setIsAudioLoaded(false);
      setAudioError(null);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setAudioSrc(null);
    setAudioError(null);
    setIsAudioLoaded(false);
    setTimeout(() => {
        setAudioSrc(urlInput);
        setTrackName("Flux Web");
    }, 100);
  };

  const startGame = async () => {
    if (!audioSrc) { setAudioError("Aucune source audio."); return; }
    
    notesRef.current = [];
    scoreRef.current = 0;
    comboRef.current = 0;
    lastMilestoneRef.current = 0;
    dataRef.current = 100;
    elecRef.current = 100;
    heldKeysRef.current = [false, false, false];
    setScore(0);
    setCombo(0);
    setProgress(0);
    
    // Reset visuel DOM des barres
    if (leftBarRef.current) leftBarRef.current.style.height = "0%";
    if (rightBarRef.current) rightBarRef.current.style.height = "0%";

    setDataGauge(100);
    setElecGauge(100);
    setNotes([]);
    setDifficultyLevel(1);
    setMascotMood('IDLE');
    setMilestoneTrigger(false);
    
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setGameState('PLAYING');
      } catch (err) { setAudioError("Lecture impossible (CORS ou format)."); }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-green-500 font-mono select-none overflow-hidden touch-none">
      
      {/* Background Matrix Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, #22c55e 25%, #22c55e 26%, transparent 27%, transparent 74%, #22c55e 75%, #22c55e 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #22c55e 25%, #22c55e 26%, transparent 27%, transparent 74%, #22c55e 75%, #22c55e 76%, transparent 77%, transparent)`,
            backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/95 to-green-900/5 pointer-events-none" />
      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="auto" crossOrigin="anonymous" />}

      {/* --- HUD --- */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 bg-gradient-to-b from-slate-950 via-slate-900/90 to-transparent pb-16">
        <div className="max-w-4xl mx-auto space-y-4"> 
          <div className="flex justify-between items-end border-b border-green-800/30 pb-4">
            <div className="flex flex-col">
               <h1 className="text-xl font-bold tracking-widest text-green-500 uppercase flex items-center gap-2 drop-shadow-[0_0_5px_#22c55e]">
                 <Terminal size={20} />
                 INTRUSION TERMINAL
               </h1>
               <div className="flex items-center gap-2 text-xs text-green-700 font-mono mt-1">
                 <Disc size={12} className={gameState === 'PLAYING' ? 'animate-spin' : ''}/>
                 <span className="truncate max-w-[150px]">{trackName}</span>
                 {difficultyLevel > 1 && <span className="text-green-300 ml-2">Surcadençage: x{difficultyLevel.toFixed(2)}</span>}
               </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-4xl font-mono font-bold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] tabular-nums">
                {score.toString().padStart(6, '0')}
              </span>
              <span className="text-xs text-green-800 font-mono">BPM: {BPM}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-green-400 uppercase font-bold tracking-wider">
                    <div className="flex items-center gap-1">
                        <Database size={12} />
                        <span>Intégrité</span> 
                    </div>
                    <span>{Math.round(dataGauge)}%</span>
                </div>
                <div className="h-3 bg-slate-900/80 rounded-sm overflow-hidden border border-green-800 relative">
                    <div 
                        className="h-full bg-gradient-to-r from-green-900 to-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] transition-all duration-300" 
                        style={{ width: `${dataGauge}%` }} 
                    />
                </div>
            </div>
            
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-yellow-400 uppercase font-bold tracking-wider">
                    <div className="flex items-center gap-1">
                        <Zap size={12} />
                        <span>Tension</span> 
                    </div>
                    <span>{Math.round(elecGauge)}%</span>
                </div>
                <div className="h-3 bg-slate-900/80 rounded-sm overflow-hidden border border-yellow-800 relative">
                    <div 
                        className="h-full bg-gradient-to-r from-yellow-900 to-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)] transition-all duration-300" 
                        style={{ width: `${elecGauge}%` }} 
                    />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- WRAPPER PRINCIPAL (Jeu + Mascotte) --- */}
      <div className="flex flex-row items-center gap-8 z-10 w-full justify-center">
        
        {/* --- ZONE DE JEU AVEC PROGRESS BARS LATÉRALES --- */}
        <div className="relative w-full max-w-md h-[80vh] mt-12 transition-all duration-100 flex-shrink-0">
            
            {/* Ligne Progression GAUCHE - DOM DIRECT */}
            <div className={`absolute -left-3 md:-left-6 top-0 bottom-0 w-2 md:w-3 bg-slate-900 border border-green-900/50 rounded-full overflow-hidden transition-all duration-500 ${milestoneTrigger ? 'shadow-[0_0_30px_#fff] border-white scale-110' : ''}`}>
                <div ref={leftBarRef} className={`absolute bottom-0 w-full bg-green-500 ${milestoneTrigger ? 'bg-white' : ''}`} style={{ height: `0%` }}></div>
            </div>

            {/* Ligne Progression DROITE - DOM DIRECT */}
            <div className={`absolute -right-3 md:-right-6 top-0 bottom-0 w-2 md:w-3 bg-slate-900 border border-green-900/50 rounded-full overflow-hidden transition-all duration-500 ${milestoneTrigger ? 'shadow-[0_0_30px_#fff] border-white scale-110' : ''}`}>
                <div ref={rightBarRef} className={`absolute bottom-0 w-full bg-green-500 ${milestoneTrigger ? 'bg-white' : ''}`} style={{ height: `0%` }}></div>
            </div>

            {/* Conteneur principal des notes */}
            <div className={`relative w-full h-full flex border-x border-green-900/30 bg-slate-900/80 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden box-border ${milestoneTrigger ? 'border-white/50 bg-slate-800/80 shadow-[0_0_50px_rgba(255,255,255,0.2)]' : ''} transition-all duration-200`}>
                
                <div className="absolute inset-0 flex pointer-events-none z-0">
                    <div className="flex-1 border-r border-green-900/10"></div>
                    <div className="flex-1 border-r border-green-900/10"></div>
                    <div className="flex-1"></div>
                </div>

                <div className="absolute w-full z-0 pointer-events-none border-t border-green-500/50 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                    style={{ top: `${HIT_ZONE_TOP}%`, height: `${HIT_ZONE_BOTTOM - HIT_ZONE_TOP}%` }}
                />

                {[0, 1, 2].map((laneIndex) => {
                    const activeLongNote = notes.find(n => n.lane === laneIndex && n.type === 'long' && !n.missed && !n.processed && n.hit);
                    const incomingLongNote = notes.find(n => n.lane === laneIndex && n.type === 'long' && !n.missed && !n.processed && !n.hit && (n.y + n.length > HIT_ZONE_TOP));
                    const showHoldCircle = activeLongNote || incomingLongNote;

                    return (
                        <div key={laneIndex} className={`relative flex-1 h-full z-10 transition-all duration-100 ease-out ${activeLanes[laneIndex] ? 'bg-green-900/20 shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]' : ''}`}>
                        {notes.filter(n => n.lane === laneIndex).map(note => {
                            const noteBottomY = note.y + note.length;
                            const circleY = note.isHeld ? HIT_ZONE_TOP : noteBottomY;
                            const showCircle = note.type === 'long' && !note.missed && !note.processed;

                            return (
                            <React.Fragment key={note.id}>
                                {/* Notes ALIGNÉES avec les boutons */}
                                <div className={`absolute w-3/4 left-0 right-0 mx-auto rounded-sm border-2 transition-opacity duration-75 flex flex-col justify-center overflow-hidden ${note.missed ? 'border-red-500 bg-red-900/50 shadow-[0_0_20px_red]' : 'border-green-400 bg-green-900/40 shadow-[0_0_15px_#4ade80]'} `}
                                    style={{ top: `${note.y}%`, height: `${note.length}%`, opacity: note.processed && !note.isHeld ? 0 : (note.missed ? 0.5 : 1) }}
                                >
                                    {!note.missed && (
                                        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.3) 3px)` }}></div>
                                    )}
                                    {note.type === 'long' && !note.missed && (
                                        <>
                                            {/* Ligne de validation à 60% */}
                                            <div 
                                                className="absolute left-0 right-0 h-0.5 bg-green-200/50 border-t border-dashed border-green-100/80 z-20" 
                                                style={{ bottom: '60%' }} 
                                            ></div>
                                            {/* Ligne de fin horizontale en haut de la note */}
                                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-200 shadow-[0_0_15px_white] z-30"></div>
                                            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-green-300/60 z-10"></div>
                                        </>
                                    )}
                                    {note.isHeld && <div className="absolute inset-0 bg-green-300/30 animate-pulse"></div>}
                                </div>

                                {showCircle && (
                                    <div className={`absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center z-30 transition-transform duration-75 ${note.isHeld ? 'border-white bg-green-400 shadow-[0_0_20px_#4ade80] scale-110' : 'border-green-300 bg-green-900 shadow-[0_0_10px_#22c55e]'}`}
                                        style={{ top: `${circleY}%`, marginTop: '-12px' }}
                                    >
                                        <div className={`w-1.5 h-1.5 bg-white rounded-full ${note.isHeld ? 'animate-ping' : ''}`}></div>
                                    </div>
                                )}
                            </React.Fragment>
                            );
                        })}

                        {/* Boutons ALIGNÉS avec les notes */}
                        <div className={`absolute w-3/4 left-0 right-0 mx-auto h-12 border-2 flex items-center justify-center transition-all duration-75 relative ${activeLanes[laneIndex] ? 'border-green-400 bg-green-500/20 shadow-[0_0_15px_#22c55e] translate-y-1' : 'border-green-800 bg-slate-900/60 hover:border-green-600'}`}
                            style={{ top: `${HIT_ZONE_TOP}%` }}
                            onMouseDown={() => handleInputStart(laneIndex)}
                            onMouseUp={() => handleInputEnd(laneIndex)}
                            onMouseLeave={() => handleInputEnd(laneIndex)}
                            onTouchStart={(e) => { e.preventDefault(); handleInputStart(laneIndex); }}
                            onTouchEnd={(e) => { e.preventDefault(); handleInputEnd(laneIndex); }}
                        >
                            <div className={`text-xs font-mono font-bold ${activeLanes[laneIndex] ? 'text-green-300' : 'text-green-900'}`}>{['A', 'S', 'D'][laneIndex]}</div>
                            
                            {showHoldCircle && (
                                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-green-400 flex items-center justify-center ${activeLanes[laneIndex] ? 'scale-110 shadow-[0_0_15px_#4ade80] bg-green-500/30' : 'opacity-50 animate-pulse'}`}>
                                    <div className={`w-2 h-2 bg-green-300 rounded-full ${activeLanes[laneIndex] ? 'animate-ping' : ''}`}></div>
                                </div>
                            )}
                        </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* --- MASCOTTE (Côté Droit) --- */}
        <HackerBuddy mood={mascotMood} combo={combo} progress={progress} />
        
      </div>

      {/* --- MENU DÉMARRAGE --- */}
      {gameState === 'MENU' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-6 font-mono">
          <div className="w-full max-w-sm space-y-8 text-center animate-in fade-in zoom-in duration-500 border border-green-900 p-8 rounded shadow-[0_0_50px_rgba(0,255,0,0.1)]">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-green-500 tracking-tighter drop-shadow-[0_0_10px_#22c55e]">INTRUSION SYSTÈME</h1>
                <p className="text-green-800 text-xs tracking-[0.5em] uppercase">V 6.3 // NO LAG</p>
            </div>
            
            <div className="space-y-4 pt-4 text-left">
              <div className="bg-slate-900/50 p-4 border border-green-800">
                  <p className="text-[10px] text-green-600 mb-2 uppercase">Flux Audio Cible</p>
                  <div className="flex items-center gap-3 text-green-400">
                      <Music size={16} /> <span className="font-mono text-xs truncate">{trackName}</span>
                  </div>
              </div>

              <button onClick={startGame} disabled={!isAudioLoaded && !audioSrc} className={`w-full py-4 border font-bold tracking-widest uppercase transition-all ${isAudioLoaded || audioSrc ? 'border-green-500 bg-green-900/20 text-green-400 hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_#22c55e]' : 'border-green-900 text-green-900 cursor-not-allowed'}`}>
                <div className="flex items-center justify-center gap-3">
                    {isAudioLoaded ? <Play size={18} fill="currentColor" /> : <Terminal size={18} className="animate-pulse"/>}
                    <span>{isAudioLoaded ? "EXÉCUTER" : "INITIALISATION..."}</span>
                </div>
              </button>
              
              
            </div>
            {audioError && <div className="text-red-500 text-xs bg-red-900/10 p-2 border border-red-900 flex items-center justify-center gap-2"><AlertCircle size={14}/> <span>{audioError}</span></div>}
          </div>
        </div>
      )}

      {/* --- GAME OVER / VICTOIRE --- */}
      {(gameState === 'GAMEOVER' || gameState === 'VICTORY') && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/95 text-green-500 font-mono">
          <div className="text-center space-y-8 animate-in slide-in-from-bottom-10 p-8 border border-green-500 bg-slate-900 shadow-[0_0_50px_rgba(34,197,94,0.2)] max-w-sm w-full">
            <div>
                <h2 className={`text-4xl font-bold uppercase tracking-tighter ${gameState === 'VICTORY' ? "text-green-400 drop-shadow-[0_0_10px_#4ade80]" : "text-red-500 drop-shadow-[0_0_10px_red]"}`}>{gameState === 'VICTORY' ? "ACCÈS AUTORISÉ" : "ÉCHEC SYSTÈME"}</h2>
                <div className="h-px w-full mt-4 bg-green-900"></div>
            </div>
            <div className="py-4">
                <p className="text-green-800 text-xs uppercase tracking-widest mb-2">Données Récupérées</p>
                <p className="text-6xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{score}</p>
            </div>
            <button onClick={() => { setGameState('MENU'); }} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-900/20 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-bold uppercase tracking-wider transition-all"><RotateCcw size={18} /> REDÉMARRER SYSTÈME</button>
          </div>
        </div>
      )}
    </div>
  );
}