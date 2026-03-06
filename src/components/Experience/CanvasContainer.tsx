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
      // className="fixed inset-0 z-0 bg-[#050505]"
      // style={{ touchAction: "none" }}
      className="fixed inset-0 z-0 pointer-events-auto bg-[#050505]"
      style={{ touchAction: "pan-y" }}
      onPointerDown={() => console.log("[DOM] wrapper pointerdown")} // DEBUG
    >
      <Canvas
        onPointerDown={() => console.log("[R3F] canvas pointerdown")} // DEBUG
        onPointerMissed={() => console.log("[R3F] pointer missed all objects")} // DEBUG
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, stencil: false, depth: true }}
        camera={{ position: [0, 0, 8], fov: 35 }}
        eventPrefix="client"
        onCreated={(state) => {
          const { gl, events } = state;
        
          gl.domElement.style.touchAction = "pan-y";
          gl.domElement.style.pointerEvents = "auto";
          gl.domElement.style.display = "block";
        
          if (wrapRef.current && events?.connect) {
            events.connect(wrapRef.current);
          }
        
          console.log("[R3F] events connected:", !!wrapRef.current);
        }}
        
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} color="#8CBBFF" intensity={1} />

          <CubeCharacter />

          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}