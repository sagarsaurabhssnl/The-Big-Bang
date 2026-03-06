
"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshDistortMaterial, MeshTransmissionMaterial, Float } from "@react-three/drei";
import { useStoryStore } from "@/lib/store";
import { gsap } from "gsap";

export function CubeCharacter() {
  const meshRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const { currentChapter, progress, reducedMotion, setInteracting } = useStoryStore();
  
  const [hovered, setHovered] = useState(false);
  const mousePos = useRef(new THREE.Vector2());

  // Animation values for Lerping
  const rotationOffset = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Base rotation
    const rotationSpeed = reducedMotion ? 0.05 : 0.2;
    meshRef.current.rotation.y += delta * rotationSpeed;
    meshRef.current.rotation.x += delta * (rotationSpeed * 0.5);

    // Interaction inertia
    rotationOffset.current.x = THREE.MathUtils.lerp(rotationOffset.current.x, targetRotation.current.x, 0.1);
    rotationOffset.current.y = THREE.MathUtils.lerp(rotationOffset.current.y, targetRotation.current.y, 0.1);
    
    meshRef.current.rotation.x += rotationOffset.current.y * 0.1;
    meshRef.current.rotation.y += rotationOffset.current.x * 0.1;

    // Scroll-driven effects
    if (cubeRef.current) {
      // Chapter 3: Pressure (Scale compression)
      if (currentChapter === 2) {
        const p = (progress - 2) * 6; // Local progress in chapter
        const scaleZ = 1 - Math.sin(p * Math.PI) * 0.2;
        cubeRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, scaleZ), 0.1);
      } else {
        cubeRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
    
    // Decay interaction
    targetRotation.current.x *= 0.95;
    targetRotation.current.y *= 0.95;
  });

  const handlePointerMove = (e: any) => {
    if (reducedMotion) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotation.current.x = x * 0.5;
    targetRotation.current.y = y * 0.5;
    setInteracting(true);
  };

  const handlePointerDown = () => setInteracting(true);

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
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
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

      {/* Floating particles or accents */}
      <Float speed={5} rotationIntensity={2} floatIntensity={1}>
        <pointLight position={[2, 2, 2]} intensity={hovered ? 20 : 10} color="#8CBBFF" />
      </Float>
    </group>
  );
}
