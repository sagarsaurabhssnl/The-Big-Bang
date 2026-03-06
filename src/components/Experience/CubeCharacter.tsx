"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MeshDistortMaterial, MeshTransmissionMaterial, Float } from "@react-three/drei";
import { useStoryStore } from "@/lib/store";

export function CubeCharacter() {
  const meshRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const { currentChapter, reducedMotion, setInteracting } = useStoryStore();
  
  const [hovered, setHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [spinBoost, setSpinBoost] = useState(0);

  // Advanced Interaction State
  const rotationInertia = useRef({ x: 0, y: 0 });
  const targetScale = useRef(1);
  const pointerPos = useRef({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current || !cubeRef.current) return;

    // 1. Base Continuous Idle Rotation
    const baseSpeed = reducedMotion ? 0.05 : 0.15;
    meshRef.current.rotation.y += delta * (baseSpeed + spinBoost);
    meshRef.current.rotation.x += delta * (baseSpeed * 0.4);

    // 2. Inertia Decay (smoothly slow down after user interaction)
    rotationInertia.current.x *= 0.92;
    rotationInertia.current.y *= 0.92;
    
    meshRef.current.rotation.y += rotationInertia.current.x;
    meshRef.current.rotation.x += rotationInertia.current.y;

    // 3. Spin Boost Decay (from double clicks)
    if (spinBoost > 0) {
      setSpinBoost(prev => Math.max(0, prev * 0.98 - 0.02));
    }

    // 4. Responsive Scaling
    // Calculate target scale based on chapter and press state
    let baseScale = 1;
    if (currentChapter === 2) { // Pressure Chapter
      baseScale = isPressed ? 0.7 : 1.1; // More dramatic compression
    } else if (isPressed) {
      baseScale = 0.9; // Standard press feedback
    } else if (hovered) {
      baseScale = 1.05; // Hover feedback
    }

    // Lerp scale for smoothness
    const lerpFactor = delta * 10;
    cubeRef.current.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), lerpFactor);

    // 5. Dynamic Material Adjustments
    if (currentChapter === 3) { // Fracture
      // Add subtle shake if pressed
      if (isPressed) {
        cubeRef.current.position.x = (Math.random() - 0.5) * 0.05;
        cubeRef.current.position.y = (Math.random() - 0.5) * 0.05;
      } else {
        cubeRef.current.position.set(0, 0, 0);
      }
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsPressed(true);
    setInteracting(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handlePointerMove = (e: any) => {
    if (isPressed) {
      const dx = (e.clientX - lastPointerPos.current.x) * 0.005;
      const dy = (e.clientY - lastPointerPos.current.y) * 0.005;
      
      rotationInertia.current.x = dx;
      rotationInertia.current.y = dy;
      
      lastPointerPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => {
    setHovered(false);
    setIsPressed(false);
  };

  const handleDoubleClick = () => {
    if (currentChapter === 5) { // Artifact
      setSpinBoost(10); // Massive celebratory spin
    } else {
      setSpinBoost(4); // General responsive spin
    }
  };

  const handleClick = () => {
    if (currentChapter === 3) { // Fracture interaction
      // Temporary expansion "pop"
      if (cubeRef.current) {
        cubeRef.current.scale.set(1.4, 1.4, 1.4);
      }
    }
  };

  // Pre-compiled materials for performance and clarity
  const materials = useMemo(() => ({
    origin: new THREE.MeshStandardMaterial({ color: "#111", roughness: 1, metalness: 0 }),
    signal: new THREE.MeshStandardMaterial({ 
      color: "#050505", 
      emissive: "#8CBBFF", 
      emissiveIntensity: 4, 
      roughness: 0.2 
    }),
    pressure: new THREE.MeshStandardMaterial({ 
      color: "#0a0a0a", 
      roughness: 0.1, 
      metalness: 1.0,
      envMapIntensity: 2
    }),
    artifact: new THREE.MeshPhysicalMaterial({ 
      color: "#ffd700", 
      metalness: 1, 
      roughness: 0.05, 
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      reflectivity: 1
    })
  }), []);

  return (
    <group 
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      <mesh ref={cubeRef} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        
        {currentChapter === 0 && <primitive object={materials.origin} attach="material" />}
        {currentChapter === 1 && <primitive object={materials.signal} attach="material" />}
        {currentChapter === 2 && <primitive object={materials.pressure} attach="material" />}
        {currentChapter === 3 && (
          <MeshDistortMaterial 
            color="#FF4D4D" 
            speed={4} 
            distort={0.6} 
            radius={1}
            emissive="#FF0000"
            emissiveIntensity={0.8}
          />
        )}
        {currentChapter === 4 && (
          <MeshTransmissionMaterial 
            backside 
            samples={6} 
            thickness={1.5} 
            chromaticAberration={0.1} 
            anisotropy={0.2} 
            distortion={0.2}
            distortionScale={0.5}
            color="#A0E9FF"
            transmission={1}
          />
        )}
        {currentChapter === 5 && <primitive object={materials.artifact} attach="material" />}
      </mesh>

      {/* Interactive Light Feedback */}
      <pointLight 
        position={[3, 3, 3]} 
        intensity={hovered ? 50 : 20} 
        color={isPressed ? "#FFFFFF" : "#8CBBFF"} 
      />
    </group>
  );
}