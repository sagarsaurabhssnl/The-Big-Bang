"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshDistortMaterial, MeshTransmissionMaterial, Float } from "@react-three/drei";
import { useStoryStore } from "@/lib/store";

export function CubeCharacter() {
  const meshRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const { currentChapter, progress, reducedMotion, setInteracting } = useStoryStore();
  
  const [hovered, setHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [spinBoost, setSpinBoost] = useState(0);

  // Rotation logic
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current || !cubeRef.current) return;

    // Base continuous rotation
    const baseRotationSpeed = reducedMotion ? 0.05 : 0.2;
    meshRef.current.rotation.y += delta * (baseRotationSpeed + spinBoost);
    meshRef.current.rotation.x += delta * (baseRotationSpeed * 0.5);

    // Smoothly decay spin boost (from double click)
    if (spinBoost > 0) {
      setSpinBoost(prev => Math.max(0, prev * 0.95 - 0.01));
    }

    // Interactive inertia rotation
    currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, 0.1);
    currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, 0.1);
    
    meshRef.current.rotation.x += currentRotation.current.y;
    meshRef.current.rotation.y += currentRotation.current.x;

    // Decaying the interaction offset
    targetRotation.current.x *= 0.9;
    targetRotation.current.y *= 0.9;

    // Chapter 3: Pressure (Hold logic)
    if (currentChapter === 2) {
      const scaleTarget = isPressed ? 0.8 : 1.0;
      cubeRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, scaleTarget), 0.1);
    } else if (currentChapter === 3) {
       // Chapter 4: Fracture (Distortion response)
       cubeRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    } else {
      cubeRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  const handlePointerDown = (e: any) => {
    setIsPressed(true);
    setInteracting(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handlePointerMove = (e: any) => {
    if (isPressed && !reducedMotion) {
      const deltaX = (e.clientX - lastPointerPos.current.x) * 0.01;
      const deltaY = (e.clientY - lastPointerPos.current.y) * 0.01;
      
      targetRotation.current.x = deltaX;
      targetRotation.current.y = deltaY;
      
      lastPointerPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => {
    setHovered(false);
    setIsPressed(false);
  };

  const handleDoubleClick = () => {
    if (currentChapter === 5) {
      setSpinBoost(5); // Big celebratory spin for Artifact
    }
  };

  const handleClick = () => {
    if (currentChapter === 3) {
      // Fracture interaction: temporary scale pop
      if (cubeRef.current) {
        cubeRef.current.scale.set(1.5, 1.5, 1.5);
      }
    }
  };

  // Materials for different chapters
  const materials = useMemo(() => ({
    origin: new THREE.MeshStandardMaterial({ color: "#222", roughness: 0.9, metalness: 0.1 }),
    signal: new THREE.MeshStandardMaterial({ color: "#111", emissive: "#8CBBFF", emissiveIntensity: 2, roughness: 0.5 }),
    pressure: new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.05, metalness: 0.9 }),
    artifact: new THREE.MeshPhysicalMaterial({ color: "#ffd700", metalness: 1, roughness: 0.1, clearcoat: 1 })
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
            color="#FF8C8C" 
            speed={2} 
            distort={0.4} 
            radius={1}
            emissive="#FF8C8C"
            emissiveIntensity={0.5}
          />
        )}
        {currentChapter === 4 && (
          <MeshTransmissionMaterial 
            backside 
            samples={4} 
            thickness={2} 
            chromaticAberration={0.05} 
            anisotropy={0.1} 
            distortion={0.1}
            color="#A0E9FF"
          />
        )}
        {currentChapter === 5 && <primitive object={materials.artifact} attach="material" />}
      </mesh>

      {/* Dynamic light following interactions */}
      <Float speed={5} rotationIntensity={2} floatIntensity={1}>
        <pointLight position={[2, 2, 2]} intensity={hovered ? 30 : 15} color="#8CBBFF" />
      </Float>
    </group>
  );
}
