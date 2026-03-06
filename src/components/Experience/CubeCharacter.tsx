"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MeshDistortMaterial, MeshTransmissionMaterial } from "@react-three/drei";
import { useStoryStore } from "@/lib/store";

export function CubeCharacter() {
  const { gl } = useThree();
  const meshRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const { currentChapter, reducedMotion, setInteracting } = useStoryStore();
  
  const [hovered, setHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [spinBoost, setSpinBoost] = useState(0);

  // Interaction refs
  const rotationInertia = useRef({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const springScale = useRef(1);
  const interactionGlow = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current || !cubeRef.current) return;

    // 1. Dynamic Base Rotation
    const baseSpeed = reducedMotion ? 0.01 : 0.05 + (currentChapter * 0.02);
    meshRef.current.rotation.y += delta * (baseSpeed + spinBoost);
    meshRef.current.rotation.x += delta * (baseSpeed * 0.5);

    // 2. High-Sensitivity Inertia Decay
    const decay = isPressed ? 0.98 : 0.92;
    rotationInertia.current.x *= decay;
    rotationInertia.current.y *= decay;
    
    meshRef.current.rotation.y += rotationInertia.current.x;
    meshRef.current.rotation.x += rotationInertia.current.y;

    // 3. Spin Boost (for Hero moments)
    if (spinBoost > 0) {
      setSpinBoost(prev => Math.max(0, prev * 0.95 - 0.01));
    }

    // 4. Spring Physics Scaling
    let targetScale = 1;
    if (isPressed) {
      targetScale = 0.85; 
    } else if (hovered) {
      targetScale = 1.1; 
    }
    
    springScale.current = THREE.MathUtils.lerp(springScale.current, targetScale, delta * 20);
    cubeRef.current.scale.setScalar(springScale.current);

    // 5. Reactive Emissive Glow
    const targetGlow = isPressed ? 5 : (hovered ? 2 : 0);
    interactionGlow.current = THREE.MathUtils.lerp(interactionGlow.current, targetGlow, delta * 15);

    if (cubeRef.current.material && 'emissiveIntensity' in cubeRef.current.material) {
      (cubeRef.current.material as any).emissiveIntensity = 1 + interactionGlow.current;
    }
    
    // 6. Chapter Specific Micro-Movements
    if (currentChapter === 3 && isPressed) {
      cubeRef.current.position.x = (Math.random() - 0.5) * 0.05;
    } else {
      cubeRef.current.position.x = THREE.MathUtils.lerp(cubeRef.current.position.x, 0, delta * 10);
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    // Correct way to capture pointer in R3F for global tracking
    gl.domElement.setPointerCapture(e.pointerId);
    
    setIsPressed(true);
    setInteracting(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    springScale.current = 0.7; 
  };

  const handlePointerUp = (e: any) => {
    gl.domElement.releasePointerCapture(e.pointerId);
    setIsPressed(false);
    setInteracting(false);
  };

  const handlePointerMove = (e: any) => {
    if (isPressed) {
      const sensitivity = 0.04;
      const dx = (e.clientX - lastPointerPos.current.x) * sensitivity;
      const dy = (e.clientY - lastPointerPos.current.y) * sensitivity;
      
      rotationInertia.current.x = dx;
      rotationInertia.current.y = dy;
      
      lastPointerPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleDoubleClick = () => {
    setSpinBoost(10);
  };

  const materials = useMemo(() => ({
    origin: new THREE.MeshStandardMaterial({ color: "#080808", roughness: 0.9, metalness: 0.1 }),
    signal: new THREE.MeshStandardMaterial({ 
      color: "#020202", 
      emissive: "#8CBBFF", 
      emissiveIntensity: 1, 
      roughness: 0.1 
    }),
    pressure: new THREE.MeshStandardMaterial({ 
      color: "#050505", 
      roughness: 0, 
      metalness: 1.0,
      emissive: "#C166ED",
      emissiveIntensity: 0.5
    }),
    artifact: new THREE.MeshPhysicalMaterial({ 
      color: "#ffd700", 
      metalness: 1, 
      roughness: 0.02, 
      clearcoat: 1,
      reflectivity: 1,
      emissive: "#FFA500",
      emissiveIntensity: 0.2
    })
  }), []);

  return (
    <group 
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onDoubleClick={handleDoubleClick}
      onPointerCancel={handlePointerUp}
    >
      <mesh ref={cubeRef} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        
        {currentChapter === 0 && <primitive object={materials.origin} attach="material" />}
        {currentChapter === 1 && <primitive object={materials.signal} attach="material" />}
        {currentChapter === 2 && <primitive object={materials.pressure} attach="material" />}
        {currentChapter === 3 && (
          <MeshDistortMaterial 
            color="#FF4D4D" 
            speed={6} 
            distort={0.6} 
            radius={1}
            emissive="#FF0000"
            emissiveIntensity={1}
          />
        )}
        {currentChapter === 4 && (
          <MeshTransmissionMaterial 
            backside 
            samples={8} 
            thickness={2} 
            chromaticAberration={0.2} 
            anisotropy={0.5} 
            distortion={0.3}
            color="#A0E9FF"
            transmission={1}
          />
        )}
        {currentChapter === 5 && <primitive object={materials.artifact} attach="material" />}
      </mesh>

      <pointLight 
        position={[3, 3, 3]} 
        intensity={isPressed ? 100 : (hovered ? 50 : 0)} 
        color={currentChapter === 3 ? "#FF0000" : "#8CBBFF"} 
      />
    </group>
  );
}
