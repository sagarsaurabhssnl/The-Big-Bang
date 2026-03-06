"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
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

  const draggingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const rotationInertia = useRef({ x: 0, y: 0 });
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const springScale = useRef(1);
  const interactionGlow = useRef(0);
  const spinBoostRef = useRef(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeSetPointerCapture = (pointerId: number) => {
    try {
      gl.domElement.setPointerCapture(pointerId);
    } catch (e) {}
  };

  const safeReleasePointerCapture = (pointerId: number) => {
    try {
      gl.domElement.releasePointerCapture(pointerId);
    } catch (e) {}
  };

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const endInteraction = useCallback(() => {
    clearHoldTimer();
  
    const pid = activePointerIdRef.current;
    if (pid != null) safeReleasePointerCapture(pid);
  
    activePointerIdRef.current = null;
    draggingRef.current = false;
    setIsPressed(false);
    setInteracting(false);
  }, [setInteracting]);

  useEffect(() => {
    const onVis = () => { if (document.hidden) endInteraction(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [endInteraction]);

  useFrame((state, delta) => {
    if (!meshRef.current || !cubeRef.current) return;

    // 1) Rotational Logic
    const baseSpeed = reducedMotion ? 0.02 : 0.08 + currentChapter * 0.03;
    meshRef.current.rotation.y += delta * (baseSpeed + spinBoostRef.current);
    meshRef.current.rotation.x += delta * (baseSpeed * 0.25);

    const decay = draggingRef.current ? 0.94 : 0.88;
    rotationInertia.current.x *= decay;
    rotationInertia.current.y *= decay;

    meshRef.current.rotation.y += rotationInertia.current.x;
    meshRef.current.rotation.x += rotationInertia.current.y;

    meshRef.current.rotation.x = THREE.MathUtils.clamp(
      meshRef.current.rotation.x,
      -1.2,
      1.2
    );

    if (spinBoostRef.current > 0) {
      spinBoostRef.current = Math.max(0, spinBoostRef.current * 0.95 - 0.01);
    }

    // 2) Tactile Scaling
    let targetScale = 1;
    if (draggingRef.current) targetScale = 0.85;
    else if (hovered) targetScale = 1.1;

    springScale.current = THREE.MathUtils.lerp(springScale.current, targetScale, delta * 20);
    cubeRef.current.scale.setScalar(springScale.current);

    // 3) Material & Glow Dynamics
    const targetGlow = draggingRef.current ? 5 : hovered ? 2 : 0;
    interactionGlow.current = THREE.MathUtils.lerp(interactionGlow.current, targetGlow, delta * 15);

    const mat = cubeRef.current.material as any;
    if (mat && "emissiveIntensity" in mat) {
      // Add a natural pulse for the "Signal" chapter
      const pulse = currentChapter === 1 ? Math.sin(state.clock.elapsedTime * 4) * 0.5 + 1 : 1;
      mat.emissiveIntensity = (1 + interactionGlow.current) * pulse;
    }

    // 4) Chapter-Specific Positional Jitter (Fracture)
    if (currentChapter === 3 && draggingRef.current) {
      cubeRef.current.position.x = (Math.random() - 0.5) * 0.05;
      cubeRef.current.position.y = (Math.random() - 0.5) * 0.05;
    } else {
      cubeRef.current.position.x = THREE.MathUtils.lerp(cubeRef.current.position.x, 0, delta * 10);
      cubeRef.current.position.y = THREE.MathUtils.lerp(cubeRef.current.position.y, 0, delta * 10);
    }
  });
  

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
  
    activePointerIdRef.current = e.pointerId;
    draggingRef.current = true;
    safeSetPointerCapture(e.pointerId);
  
    setHovered(false);
    setInteracting(true);
  
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  
    clearHoldTimer();
    holdTimerRef.current = setTimeout(() => {
      if (draggingRef.current && activePointerIdRef.current === e.pointerId) {
        setIsPressed(true);
        springScale.current = 0.7;
      }
    }, 150);
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    if (activePointerIdRef.current !== e.pointerId) return;
    endInteraction();
  };

  const handlePointerMove = (e: any) => {
    if (!draggingRef.current) return;
    if (activePointerIdRef.current !== e.pointerId) return;
  
    const moveX = e.clientX - lastPointerPos.current.x;
    const moveY = e.clientY - lastPointerPos.current.y;
  
    if (Math.abs(moveX) > 2 || Math.abs(moveY) > 2) {
      clearHoldTimer();
    }
  
    const sensitivity = reducedMotion ? 0.005 : 0.015;
    const dx = moveX * sensitivity;
    const dy = moveY * sensitivity;
  
    rotationInertia.current.x = THREE.MathUtils.lerp(rotationInertia.current.x, dx, 0.35);
    rotationInertia.current.y = THREE.MathUtils.lerp(rotationInertia.current.y, dy, 0.35);
  
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    spinBoostRef.current = 15;
  };

  const materials = useMemo(
    () => ({
      origin: new THREE.MeshPhysicalMaterial({ 
        color: "#080808", 
        roughness: 0.9, 
        metalness: 0.1,
        reflectivity: 0.1 
      }),
      signal: new THREE.MeshPhysicalMaterial({
        color: "#020202",
        emissive: "#8CBBFF",
        emissiveIntensity: 1,
        roughness: 0.2,
        metalness: 0.5,
      }),
      pressure: new THREE.MeshPhysicalMaterial({
        color: "#1a0033",
        roughness: 0.05,
        metalness: 0.9,
        emissive: "#C166ED",
        emissiveIntensity: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      }),
      artifact: new THREE.MeshPhysicalMaterial({
        color: "#ffd700",
        metalness: 1.0,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.0,
        emissive: "#FFA500",
        emissiveIntensity: 0.2,
      }),
    }),
    []
  );

  return (
    <group
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      <mesh ref={cubeRef} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        {currentChapter === 0 && <primitive object={materials.origin} attach="material" />}
        {currentChapter === 1 && <primitive object={materials.signal} attach="material" />}
        {currentChapter === 2 && <primitive object={materials.pressure} attach="material" />}
        {currentChapter === 3 && (
          <MeshDistortMaterial
            color="#FF4D4D"
            speed={8}
            distort={0.8}
            radius={1}
            emissive="#FF0000"
            emissiveIntensity={2}
          />
        )}
        {currentChapter === 4 && (
          <MeshTransmissionMaterial
            backside
            samples={12}
            thickness={3}
            chromaticAberration={0.3}
            anisotropy={0.5}
            distortion={0.4}
            color="#A0E9FF"
            transmission={1}
            ior={1.5}
          />
        )}
        {currentChapter === 5 && <primitive object={materials.artifact} attach="material" />}
      </mesh>
      <pointLight
        position={[3, 3, 3]}
        intensity={draggingRef.current ? 180 : hovered ? 100 : 0}
        color={currentChapter === 3 ? "#FF0000" : "#8CBBFF"}
      />
    </group>
  );
}
