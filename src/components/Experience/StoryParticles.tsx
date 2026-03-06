"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStoryStore } from "@/lib/store";

const PARTICLE_COUNT = 2000;

export function StoryParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { currentChapter } = useStoryStore();

  const [positions, step] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const s = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      s[i] = Math.random();
    }
    return [pos, s];
  }, []);

  const chapterConfigs = [
    { color: "#ffffff", speed: 0.1, size: 0.015, spread: 15, orbit: 0 },   // Origin
    { color: "#8CBBFF", speed: 0.5, size: 0.02, spread: 12, orbit: 0.2 }, // Signal
    { color: "#C166ED", speed: 2.0, size: 0.025, spread: 8, orbit: 1.5 },  // Pressure
    { color: "#FF4D4D", speed: 8.0, size: 0.04, spread: 20, orbit: 0.5 },  // Fracture
    { color: "#A0E9FF", speed: 1.0, size: 0.02, spread: 10, orbit: 0.8 }, // Alignment
    { color: "#FFD700", speed: 0.3, size: 0.03, spread: 6, orbit: 0.4 },  // Artifact
  ];

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const config = chapterConfigs[currentChapter] || chapterConfigs[0];
    const time = state.clock.elapsedTime;

    // Smooth color transition
    const targetColor = new THREE.Color(config.color);
    (pointsRef.current.material as THREE.PointsMaterial).color.lerp(targetColor, delta * 2);
    (pointsRef.current.material as THREE.PointsMaterial).size = THREE.MathUtils.lerp(
      (pointsRef.current.material as THREE.PointsMaterial).size,
      config.size,
      delta * 2
    );

    // Dynamic movement
    pointsRef.current.rotation.y += delta * config.orbit * 0.2;
    pointsRef.current.rotation.z += delta * config.speed * 0.05;

    // Pulsing effect for Signal and Artifact
    if (currentChapter === 1 || currentChapter === 5) {
      pointsRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    } else {
      pointsRef.current.scale.setScalar(THREE.MathUtils.lerp(pointsRef.current.scale.x, 1, delta * 5));
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
