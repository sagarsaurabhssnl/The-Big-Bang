"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Stars, PerspectiveCamera } from "@react-three/drei";
import { CubeCharacter } from "./CubeCharacter";
import { StoryParticles } from "./StoryParticles";
import { Suspense, useRef } from "react";

export function CanvasContainer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<HTMLDivElement>(null!);

  return (
    <div
      ref={(el) => {
        if (el) {
          wrapRef.current = el;
          // @ts-ignore - manual assignment for R3F event source
          eventSourceRef.current = el;
        }
      }}
      className="fixed inset-0 z-0 bg-[#050505] touch-none"
      style={{ touchAction: "none" }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, stencil: false, depth: true }}
        eventSource={eventSourceRef}
        eventPrefix="client"
        onCreated={(state) => {
          const { gl } = state;
          gl.domElement.style.touchAction = "none";
          gl.domElement.style.pointerEvents = "auto";
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
        
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          
          {/* High-impact narrative lighting */}
          <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={4} castShadow />
          <pointLight position={[-10, -10, -10]} color="#8CBBFF" intensity={2} />
          <directionalLight position={[0, -5, 5]} intensity={0.8} color="#C166ED" />

          <CubeCharacter />
          <StoryParticles />

          <ContactShadows 
            position={[0, -3.5, 0]} 
            opacity={0.4} 
            scale={15} 
            blur={2} 
            far={4.5} 
          />
          
          <Stars 
            radius={100} 
            depth={50} 
            count={7000} 
            factor={6} 
            saturation={0} 
            fade 
            speed={2} 
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
