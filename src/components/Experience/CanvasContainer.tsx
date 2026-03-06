"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Stars } from "@react-three/drei";
import { CubeCharacter } from "./CubeCharacter";
import { Suspense, useRef } from "react";

export function CanvasContainer() {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-0 pointer-events-auto bg-[#050505]"
      style={{ touchAction: "none" }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, stencil: false, depth: true }}
        camera={{ position: [0, 0, 8], fov: 35 }}
        eventPrefix="client"
        onCreated={(state) => {
          const { gl, events } = state;
          gl.domElement.style.touchAction = "none";
          gl.domElement.style.pointerEvents = "auto";
          gl.domElement.style.display = "block";
        
          if (wrapRef.current && events?.connect) {
            events.connect(wrapRef.current);
          }
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          {/* Main Key Light */}
          <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={3} castShadow />
          {/* Rim / Back Light */}
          <pointLight position={[-10, -10, -10]} color="#8CBBFF" intensity={1.5} />
          {/* Fill Light */}
          <directionalLight position={[0, -5, 5]} intensity={0.5} color="#C166ED" />

          <CubeCharacter />

          <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={20} blur={2.5} far={4.5} />
          <Stars radius={100} depth={50} count={6000} factor={7} saturation={0} fade speed={4} />
          
          {/* Environment provides the vital reflections for Physical Materials */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
