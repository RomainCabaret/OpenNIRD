"use client";

import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";

export default function Background3D() {
  return (
    // On le place en arrière-plan absolu avec un z-index négatif
    <div className="absolute inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
         {/* Couleur de fond unie pour éviter la transparence */}
         <color attach="background" args={["#050505"]} /> 
         
         {/* Les particules */}
         <Sparkles
           count={150}       // Nombre de particules
           scale={[10, 10, 10]} // Étendue de la zone
           size={2}          // Taille des particules
           speed={0.3}       // Vitesse de mouvement lent
           opacity={0.5}     // Transparence subtile
           color="#00E5FF"   // Couleur cyan pour coller au thème
         />
      </Canvas>
    </div>
  );
}