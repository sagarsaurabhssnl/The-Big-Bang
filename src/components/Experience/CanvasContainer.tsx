
"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment, ContactShadows, Stars } from "@react-three/drei";
import { CubeCharacter } from "./CubeCharacter";
import { useStoryStore } from "@/lib/store";
import { Suspense } from "react";

export function CanvasContainer() {
  const { currentChapter } = useStoryStore();

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto bg-[#050505]">
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ antialias: true, stencil: false, depth: true }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
          
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} color="#8CBBFF" intensity={1} />
          
          <CubeCharacter />
          
          <ContactShadows 
            position={[0, -3.5, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2.4} 
            far={4.5} 
          />
          
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
