"use client";

import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type CharacterProps = {
  gender: "man" | "woman";
  position: [number, number, number];
  isTalking?: boolean;
  isHugging?: boolean;
};

function CharacterInner({
  gender,
  position,
  isTalking = false,
  isHugging = false,
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mouthRef = useRef<THREE.Mesh>(null);

  const leftArmRef = useRef<THREE.Group>(null);

  const rightArmRef = useRef<THREE.Group>(null);

  const timeRef = useRef(0);

  const isMan = gender === "man";

  // ================= COLORS =================

  const skin = isMan ? "#e8b896" : "#f6c7a8";

  const shirt = isMan ? "#4a6fa5" : "#ff4f93";

  const pants = isMan ? "#2d3a4f" : "#b02f6b";

  const hairBase = isMan ? "#3d2914" : "#1f0d08";

  const aquaBlue = "#53f2ff";

  // ================= ANIMATION =================

  useFrame((_, delta) => {
    timeRef.current += delta;

    const t = timeRef.current;

    // =========================================
    // HUGGING
    // =========================================

    if (isHugging && groupRef.current) {
      const targetX = isMan ? -0.45 : 0.45;

      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.05,
      );

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        isMan ? 0.25 : -0.25,
        0.05,
      );

      groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.02;

      // LEFT ARM
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = isMan ? -1 : 1;
        leftArmRef.current.rotation.x = -0.4;
      }

      // RIGHT ARM
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = isMan ? 1 : -1;
        rightArmRef.current.rotation.x = -0.4;
      }

      return;
    }

    // =========================================
    // NORMAL FLOATING
    // =========================================

    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] +
        (isTalking && isMan
          ? Math.sin(t * 8) * 0.03
          : Math.sin(t * 1.5) * 0.01);

      groupRef.current.position.x = position[0];

      groupRef.current.rotation.y = 0;
    }

    // =========================================
    // TALKING MOUTH
    // =========================================

    if (mouthRef.current && isMan) {
      const scale = isTalking ? 1 + Math.abs(Math.sin(t * 16)) * 0.9 : 1;

      mouthRef.current.scale.y = scale;
    }

    // =========================================
    // TALKING ARM
    // =========================================

    if (leftArmRef.current) {
      if (isTalking && isMan) {
        leftArmRef.current.rotation.z = Math.sin(t * 6) * 0.25 - 0.2;
      } else {
        leftArmRef.current.rotation.z = 0;
        leftArmRef.current.rotation.x = 0;
      }
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = 0;
      rightArmRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ================================================= */}
      {/* ================= FEMALE HAIR =================== */}
      {/* ================================================= */}

      {!isMan ? (
        <>
          {/* BACK LONG HAIR */}
          <mesh position={[0, 1.38, -0.12]}>
            <capsuleGeometry args={[0.3, 0.75, 10, 20]} />
            <meshStandardMaterial color={hairBase} roughness={0.35} />
          </mesh>

          {/* TOP HAIR */}
          <mesh position={[0, 1.72, 0]}>
            <sphereGeometry args={[0.34, 32, 32]} />
            <meshStandardMaterial color={hairBase} roughness={0.25} />
          </mesh>

          {/* FRONT BANGS */}
          <mesh position={[0, 1.57, 0.2]}>
            <boxGeometry args={[0.42, 0.18, 0.08]} />
            <meshStandardMaterial color={hairBase} />
          </mesh>

          {/* LEFT SIDE HAIR */}
          <mesh position={[-0.23, 1.4, 0.05]} rotation={[0, 0, 0.08]}>
            <capsuleGeometry args={[0.08, 0.45, 8, 16]} />
            <meshStandardMaterial color={hairBase} />
          </mesh>

          {/* RIGHT SIDE HAIR */}
          <mesh position={[0.23, 1.4, 0.05]} rotation={[0, 0, -0.08]}>
            <capsuleGeometry args={[0.08, 0.45, 8, 16]} />
            <meshStandardMaterial color={hairBase} />
          </mesh>

          {/* AQUA HIGHLIGHT LEFT */}
          <mesh position={[-0.18, 1.42, 0.14]} rotation={[0, 0, 0.05]}>
            <capsuleGeometry args={[0.025, 0.4, 6, 12]} />
            <meshStandardMaterial
              color={aquaBlue}
              emissive={aquaBlue}
              emissiveIntensity={0.7}
            />
          </mesh>

          {/* AQUA HIGHLIGHT RIGHT */}
          <mesh position={[0.18, 1.42, 0.14]} rotation={[0, 0, -0.05]}>
            <capsuleGeometry args={[0.025, 0.4, 6, 12]} />
            <meshStandardMaterial
              color={aquaBlue}
              emissive={aquaBlue}
              emissiveIntensity={0.7}
            />
          </mesh>
        </>
      ) : (
        <>
          {/* MALE HAIR */}
          <mesh position={[0, 1.72, 0]}>
            <boxGeometry args={[0.42, 0.18, 0.38]} />
            <meshStandardMaterial color={hairBase} />
          </mesh>
        </>
      )}

      {/* ================================================= */}
      {/* =================== HEAD ======================== */}
      {/* ================================================= */}

      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={skin} />
      </mesh>

      {/* ================================================= */}
      {/* ==================== EYES ======================= */}
      {/* ================================================= */}

      {/* Left Eye White */}
      <mesh position={[-0.1, 1.5, 0.225]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Right Eye White */}
      <mesh position={[0.1, 1.5, 0.225]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Left Iris */}
      <mesh position={[-0.1, 1.5, 0.26]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial
          color={isMan ? "#2a1f14" : "#53f2ff"}
          emissive={!isMan ? "#53f2ff" : "#000000"}
          emissiveIntensity={!isMan ? 0.4 : 0}
        />
      </mesh>

      {/* Right Iris */}
      <mesh position={[0.1, 1.5, 0.26]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial
          color={isMan ? "#2a1f14" : "#53f2ff"}
          emissive={!isMan ? "#53f2ff" : "#000000"}
          emissiveIntensity={!isMan ? 0.4 : 0}
        />
      </mesh>

      {/* ================================================= */}
      {/* ==================== LIPS ======================= */}
      {/* ================================================= */}

      {isMan ? (
        <mesh ref={mouthRef} position={[0, 1.37, 0.24]}>
          <boxGeometry args={[0.1, 0.04, 0.02]} />
          <meshStandardMaterial color="#c45c5c" />
        </mesh>
      ) : (
        <>
          {/* Upper Lip */}
          <mesh position={[0, 1.385, 0.245]}>
            <sphereGeometry args={[0.045, 16, 16, 0, Math.PI]} />
            <meshStandardMaterial
              color="#ff5fa2"
              roughness={0.25}
              metalness={0.1}
            />
          </mesh>

          {/* Lower Lip */}
          <mesh position={[0, 1.355, 0.245]}>
            <sphereGeometry args={[0.05, 16, 16, 0, Math.PI]} />
            <meshStandardMaterial
              color="#ff7eb6"
              roughness={0.2}
              metalness={0.15}
            />
          </mesh>

          {/* Lip Shine */}
          <mesh position={[0.015, 1.375, 0.27]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </mesh>
        </>
      )}

      {/* ================================================= */}
      {/* ==================== BODY ======================= */}
      {/* ================================================= */}

      <mesh position={[0, 0.95, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.45, 8, 16]} />
        <meshStandardMaterial color={shirt} roughness={0.4} />
      </mesh>

      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.32, 1.05, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.07, 0.35, 6, 12]} />
          <meshStandardMaterial color={shirt} />
        </mesh>

        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.32, 1.05, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.07, 0.35, 6, 12]} />
          <meshStandardMaterial color={shirt} />
        </mesh>

        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      </group>

      {/* LEGS */}
      <mesh position={[-0.12, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.5, 6, 12]} />
        <meshStandardMaterial color={pants} />
      </mesh>

      <mesh position={[0.12, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.5, 6, 12]} />
        <meshStandardMaterial color={pants} />
      </mesh>

      {/* SHOES */}
      <mesh position={[-0.12, 0.05, 0.04]}>
        <boxGeometry args={[0.14, 0.08, 0.22]} />
        <meshStandardMaterial color={isMan ? "#1a1a1a" : "#ff9ec4"} />
      </mesh>

      <mesh position={[0.12, 0.05, 0.04]}>
        <boxGeometry args={[0.14, 0.08, 0.22]} />
        <meshStandardMaterial color={isMan ? "#1a1a1a" : "#ff9ec4"} />
      </mesh>
    </group>
  );
}

export const Character = memo(CharacterInner);
