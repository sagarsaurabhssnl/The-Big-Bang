"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Stars } from "@react-three/drei";
import { CubeCharacter } from "./CubeCharacter";
import { Suspense, useRef, useState, useEffect } from "react";

export function CanvasContainer() {
  const [eventSource, setEventSource] = useState<HTMLElement | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setEventSource(containerRef.current);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-auto touch-none bg-[#050505]"
      style={{ touchAction: "none" }}
      onPointerDown={() => console.log("[DOM] wrapper down")}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, stencil: false, depth: true }}
        camera={{ position: [0, 0, 8], fov: 35 }}
        eventPrefix="client"
        eventSource={eventSource}
        onPointerDown={() => console.log("[R3F] canvas down")}
        onPointerMissed={() => console.log("[R3F] missed")}
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = "none";
          gl.domElement.style.pointerEvents = "auto";
          console.log("[R3F] Renderer created");
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} color="#8CBBFF" intensity={1} />

          <CubeCharacter />

          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
