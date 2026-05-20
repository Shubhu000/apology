"use client";

import { memo, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
import type { WebGLRenderer } from "three";
import { Character } from "./Character";
import { FloatingHearts } from "./FloatingHearts";

type Scene3DProps = {
  manTalking: boolean;
  showHearts: boolean;
  isHugging: boolean;
};

function WebGLRecovery() {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const onLost = (event: Event) => {
      event.preventDefault();
    };

    const onRestored = () => {
      invalidate();
    };

    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl, invalidate]);

  return null;
}

function Stage({ manTalking, showHearts, isHugging }: Scene3DProps) {
  return (
    <>
      <color attach="background" args={["#0a0612"]} />
      <fog attach="fog" args={["#0a0612", 8, 22]} />

      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#c77dff", "#1a1028", 0.35]} />

      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffd4a8" />

      <pointLight position={[-3, 4, 2]} intensity={0.6} color="#c77dff" />

      <pointLight position={[3, 2, 4]} intensity={0.5} color="#ff6b9d" />

      <Stars radius={80} depth={40} count={1500} factor={3} fade speed={0.5} />

      <Sparkles
        count={40}
        scale={[12, 6, 8]}
        size={2}
        speed={0.3}
        color="#ff9ec4"
        opacity={0.5}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[6, 32]} />

        <meshStandardMaterial color="#1a1028" roughness={0.8} metalness={0.2} />
      </mesh>

      <Character
        gender="man"
        position={[-0.9, 0, 0.3]}
        isTalking={manTalking}
        isHugging={isHugging}
      />

      <Character
        gender="woman"
        position={[0.9, 0, 0.3]}
        isTalking={false}
        isHugging={isHugging}
      />

      {showHearts && <FloatingHearts count={10} />}

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={6}
        maxDistance={12}
        target={[0, 1, 0]}
      />

      <WebGLRecovery />
    </>
  );
}

function SceneCanvas({ manTalking, showHearts, isHugging }: Scene3DProps) {
  const onCreated = useCallback(({ gl }: { gl: WebGLRenderer }) => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      frameloop="always"
      camera={{
        position:
          typeof window !== "undefined" && window.innerWidth < 768
            ? [0, 2, 8.8]
            : [0, 2.2, 7],
        fov: typeof window !== "undefined" && window.innerWidth < 768 ? 52 : 45,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
      onCreated={onCreated}
    >
      <Stage
        manTalking={manTalking}
        showHearts={showHearts}
        isHugging={isHugging}
      />
    </Canvas>
  );
}

function Scene3DInner({ manTalking, showHearts, isHugging }: Scene3DProps) {
  return (
    <div className="fixed inset-0 z-0 h-screen w-screen" aria-hidden>
      <SceneCanvas
        manTalking={manTalking}
        showHearts={showHearts}
        isHugging={isHugging}
      />
    </div>
  );
}

export const Scene3D = memo(Scene3DInner, (prev, next) => {
  return (
    prev.manTalking === next.manTalking &&
    prev.showHearts === next.showHearts &&
    prev.isHugging === next.isHugging
  );
});
