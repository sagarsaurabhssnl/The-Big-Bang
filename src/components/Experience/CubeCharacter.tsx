
"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MeshDistortMaterial, MeshTransmissionMaterial } from "@react-three/drei";
import { useStoryStore } from "@/lib/store";

export function CubeCharacter() {
  const meshRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const { currentChapter, reducedMotion, setInteracting } = useStoryStore();
  
  const [hovered, setHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [spinBoost, setSpinBoost] = useState(0);

  // High-performance interaction state
  const rotationInertia = useRef({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const springScale = useRef(1);

  useFrame((state, delta) => {
    if (!meshRef.current || !cubeRef.current) return;

    // 1. Base Idle Rotation (Dynamic based on chapter)
    const baseSpeed = reducedMotion ? 0.02 : 0.1 + (currentChapter * 0.05);
    meshRef.current.rotation.y += delta * (baseSpeed + spinBoost);
    meshRef.current.rotation.x += delta * (baseSpeed * 0.3);

    // 2. Hyper-Responsive Inertia Decay
    const decay = isPressed ? 0.98 : 0.94;
    rotationInertia.current.x *= decay;
    rotationInertia.current.y *= decay;
    
    meshRef.current.rotation.y += rotationInertia.current.x;
    meshRef.current.rotation.x += rotationInertia.current.y;

    // 3. Spin Boost Decay
    if (spinBoost > 0) {
      setSpinBoost(prev => Math.max(0, prev * 0.95 - 0.05));
    }

    // 4. Spring-Physics Scaling
    let targetScale = 1;
    if (isPressed) {
      targetScale = currentChapter === 2 ? 0.65 : 0.85; // Compression feedback
    } else if (hovered) {
      targetScale = 1.15; // Magnetic hover feel
    }

    // Rapid lerping for "snappy" spring feel
    springScale.current = THREE.MathUtils.lerp(springScale.current, targetScale, delta * 15);
    cubeRef.current.scale.setScalar(springScale.current);

    // 5. Reactive Lighting/Emissive Intensity
    if (cubeRef.current.material && 'emissiveIntensity' in cubeRef.current.material) {
      const targetIntensity = (isPressed ? 6 : (hovered ? 3 : 1)) * (currentChapter === 1 ? 2 : 1);
      (cubeRef.current.material as any).emissiveIntensity = THREE.MathUtils.lerp(
        (cubeRef.current.material as any).emissiveIntensity || 0,
        targetIntensity,
        delta * 10
      );
    }
    
    // 6. Fracture Movement (Chapter 3)
    if (currentChapter === 3 && isPressed) {
      cubeRef.current.position.x = (Math.random() - 0.5) * 0.1;
      cubeRef.current.position.y = (Math.random() - 0.5) * 0.1;
    } else {
      cubeRef.current.position.lerp(new THREE.Vector3(0, 0, 0), delta * 5);
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    // Use pointer capture to handle movement outside the element
    e.target.setPointerCapture(e.pointerId);
    setIsPressed(true);
    setInteracting(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: any) => {
    e.target.releasePointerCapture(e.pointerId);
    setIsPressed(false);
  };

  const handlePointerMove = (e: any) => {
    if (isPressed) {
      // Significantly increased sensitivity
      const dx = (e.clientX - lastPointerPos.current.x) * 0.025;
      const dy = (e.clientY - lastPointerPos.current.y) * 0.025;
      
      rotationInertia.current.x = dx;
      rotationInertia.current.y = dy;
      
      lastPointerPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleDoubleClick = () => {
    if (currentChapter === 5) {
      setSpinBoost(15); // Maximum "Hero" spin
    } else {
      setSpinBoost(8);
    }
  };

  const handleClick = () => {
    if (currentChapter === 3) {
      // Immediate "Impact" visual
      springScale.current = 1.8;
    }
  };

  const materials = useMemo(() => ({
    origin: new THREE.MeshStandardMaterial({ color: "#080808", roughness: 0.9, metalness: 0.1 }),
    signal: new THREE.MeshStandardMaterial({ 
      color: "#020202", 
      emissive: "#8CBBFF", 
      emissiveIntensity: 2, 
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
      onPointerOut={() => {
        setHovered(false);
        setIsPressed(false);
      }}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
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
            distort={0.7} 
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

      {/* Dynamic Interaction Light */}
      <pointLight 
        position={[4, 4, 4]} 
        intensity={isPressed ? 120 : (hovered ? 80 : 30)} 
        color={isPressed ? "#FFFFFF" : "#8CBBFF"} 
      />
    </group>
  );
}
