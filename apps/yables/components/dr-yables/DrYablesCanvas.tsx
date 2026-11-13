"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import type { DrYablesEmotion } from "@ohya/ai";
import {
  blendExpressions,
  expressionFor,
  type FaceExpression,
} from "@/components/dr-yables/AvatarExpressionController";

function Robot({
  emotion,
  speakingAmplitude = 0,
}: {
  emotion: DrYablesEmotion;
  speakingAmplitude?: number;
}) {
  const group = useRef<Group>(null);
  const leftEye = useRef<Mesh>(null);
  const rightEye = useRef<Mesh>(null);
  const mouth = useRef<Mesh>(null);
  const antennaTip = useRef<Mesh>(null);
  const blink = useRef(1);
  const blend = useRef(1);
  const fromExpr = useRef<FaceExpression>(expressionFor("idle"));
  const toExpr = useRef<FaceExpression>(expressionFor(emotion));

  useEffect(() => {
    fromExpr.current = toExpr.current;
    toExpr.current = expressionFor(emotion);
    blend.current = 0;
  }, [emotion]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    blend.current = Math.min(1, blend.current + delta * 4);
    const expr = blendExpressions(fromExpr.current, toExpr.current, blend.current);
    const amp = emotion === "speaking" ? Math.max(speakingAmplitude, 0.35 + Math.sin(t * 12) * 0.25) : 0;

    if (!reduced) {
      group.current.rotation.y = Math.sin(t * 0.55) * expr.headTilt;
      group.current.rotation.z = Math.sin(t * 0.8) * 0.03;
      group.current.position.y = Math.sin(t * 1.35) * expr.bodyBounce;
      blink.current = Math.sin(t * 2.1) > 0.93 ? 0.12 : 1;
      if (antennaTip.current) {
        antennaTip.current.position.y = 1.3 + Math.sin(t * 3.2) * 0.03;
      }
    }

    const eyeY = expr.eyeScaleY * blink.current;
    if (leftEye.current) leftEye.current.scale.set(1, eyeY, 1);
    if (rightEye.current) rightEye.current.scale.set(1, eyeY, 1);
    if (mouth.current) {
      mouth.current.scale.set(1, Math.max(0.15, expr.mouthOpen + amp * 0.5), 1);
    }
  });

  const faceColor = useMemo(() => "#111318", []);

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      {/* body */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <capsuleGeometry args={[0.42, 0.5, 8, 16]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.32} metalness={0.04} />
      </mesh>
      {/* tweed waistcoat suggestion */}
      <mesh position={[0, -0.18, 0.03]}>
        <capsuleGeometry args={[0.45, 0.28, 6, 16]} />
        <meshStandardMaterial color="#6a4a31" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.05, 0.28]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#c9a45b" metalness={0.5} />
      </mesh>
      {/* head shell */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.22} />
      </mesh>
      {/* digital face panel */}
      <mesh position={[0, 0.7, 0.28]}>
        <boxGeometry args={[0.55, 0.38, 0.04]} />
        <meshStandardMaterial color={faceColor} roughness={0.4} />
      </mesh>
      {/* spectacles */}
      <mesh position={[-0.14, 0.74, 0.34]}>
        <torusGeometry args={[0.09, 0.012, 8, 24]} />
        <meshStandardMaterial color="#1b1b1b" metalness={0.65} roughness={0.25} />
      </mesh>
      <mesh position={[0.14, 0.74, 0.34]}>
        <torusGeometry args={[0.09, 0.012, 8, 24]} />
        <meshStandardMaterial color="#1b1b1b" metalness={0.65} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.74, 0.34]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
        <meshStandardMaterial color="#1b1b1b" />
      </mesh>
      {/* eyes on digital face */}
      <mesh ref={leftEye} position={[-0.14, 0.74, 0.37]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#f5f7fa" emissive="#9ad7ff" emissiveIntensity={0.2} />
      </mesh>
      <mesh ref={rightEye} position={[0.14, 0.74, 0.37]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#f5f7fa" emissive="#9ad7ff" emissiveIntensity={0.2} />
      </mesh>
      {/* mouth display */}
      <mesh ref={mouth} position={[0, 0.6, 0.37]}>
        <boxGeometry args={[0.16, 0.035, 0.02]} />
        <meshStandardMaterial color="#7dffb0" emissive="#2fbf7b" emissiveIntensity={0.35} />
      </mesh>
      {/* mustache */}
      <mesh position={[0, 0.56, 0.36]} rotation={[0.25, 0, 0]}>
        <torusGeometry args={[0.11, 0.022, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#d9d5cf" />
      </mesh>
      {/* antennae */}
      <mesh position={[-0.12, 1.12, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color="#c9a45b" metalness={0.55} />
      </mesh>
      <mesh position={[0.12, 1.12, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color="#c9a45b" metalness={0.55} />
      </mesh>
      <mesh ref={antennaTip} position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color="#c9a45b"
          emissive="#7a2430"
          emissiveIntensity={expressionFor(emotion).antennaGlow}
        />
      </mesh>
    </group>
  );
}

export function DrYablesCanvas({
  emotion,
  speakingAmplitude = 0,
}: {
  emotion: DrYablesEmotion;
  speakingAmplitude?: number;
}) {
  return (
    <div className="panel relative aspect-[4/5] max-h-[560px] overflow-hidden bg-[linear-gradient(160deg,#fffdf8,#f3d5c4)]">
      <Canvas camera={{ position: [0, 0.45, 3.05], fov: 40 }} dpr={[1, 1.75]}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 2]} intensity={1.15} castShadow />
        <Robot emotion={emotion} speakingAmplitude={speakingAmplitude} />
        <ContactShadows opacity={0.35} scale={8} blur={2.5} position={[0, -0.95, 0]} />
        <Environment preset="city" />
      </Canvas>
      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[var(--burgundy)]">
        Dr. Yables · AI interviewer (not a therapist)
      </div>
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 text-center text-[11px] text-[var(--ink-muted)]">
        Procedural placeholder rig — swap official GLB when available. Face/eye/antenna states are live.
      </div>
    </div>
  );
}
