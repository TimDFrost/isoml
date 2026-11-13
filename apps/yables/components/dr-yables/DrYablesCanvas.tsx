"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { DrYablesEmotion } from "@ohya/ai";

function Robot({ emotion }: { emotion: DrYablesEmotion }) {
  const group = useRef<Group>(null);
  const blink = useRef(0);

  const eyeScale = useMemo(() => {
    if (emotion === "surprised") return 1.25;
    if (emotion === "thinking") return 0.85;
    return 1;
  }, [emotion]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduced) {
      const listen = emotion === "listening" ? Math.sin(t * 3) * 0.08 : 0;
      const speak = emotion === "speaking" ? Math.sin(t * 10) * 0.04 : 0;
      const happy = emotion === "happy" ? Math.sin(t * 2) * 0.06 : 0;
      group.current.rotation.y = Math.sin(t * 0.6) * 0.15 + listen;
      group.current.rotation.x = speak + happy;
      group.current.position.y = Math.sin(t * 1.4) * 0.05;
      blink.current = Math.sin(t * 2.2) > 0.92 ? 0.15 : 1;
    }
  });

  return (
    <group ref={group} position={[0, 0.15, 0]}>
      {/* body */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <capsuleGeometry args={[0.45, 0.55, 8, 16]} />
        <meshStandardMaterial color="#f7f4ef" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* jacket suggestion */}
      <mesh position={[0, -0.2, 0.02]}>
        <capsuleGeometry args={[0.48, 0.35, 6, 16]} />
        <meshStandardMaterial color="#6b4a32" roughness={0.8} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      {/* spectacles */}
      <mesh position={[-0.15, 0.72, 0.36]}>
        <torusGeometry args={[0.1, 0.015, 8, 20]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.15, 0.72, 0.36]}>
        <torusGeometry args={[0.1, 0.015, 8, 20]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.15, 0.72, 0.38]} scale={[1, blink.current * eyeScale, 1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1d1a17" />
      </mesh>
      <mesh position={[0.15, 0.72, 0.38]} scale={[1, blink.current * eyeScale, 1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1d1a17" />
      </mesh>
      {/* mustache */}
      <mesh position={[0, 0.58, 0.38]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.12, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#3a2a22" />
      </mesh>
      {/* antenna */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
        <meshStandardMaterial color="#c9a45b" metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color={emotion === "curious" ? "#7a2430" : "#c9a45b"}
          emissive={emotion === "speaking" ? "#7a2430" : "#000000"}
          emissiveIntensity={emotion === "speaking" ? 0.4 : 0}
        />
      </mesh>
    </group>
  );
}

export function DrYablesCanvas({ emotion }: { emotion: DrYablesEmotion }) {
  return (
    <div className="panel relative aspect-square max-h-[480px] overflow-hidden bg-[linear-gradient(160deg,#fffdf8,#f3d5c4)]">
      <Canvas camera={{ position: [0, 0.4, 3.2], fov: 40 }} dpr={[1, 1.75]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} castShadow />
        <Robot emotion={emotion} />
        <ContactShadows opacity={0.35} scale={8} blur={2.5} position={[0, -0.95, 0]} />
        <Environment preset="city" />
      </Canvas>
      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--burgundy)]">
        Dr. Yables · AI interviewer
      </div>
    </div>
  );
}
