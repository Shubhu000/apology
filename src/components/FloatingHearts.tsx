"use client";

import { memo, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HEART_SHAPE = (() => {
  const s = new THREE.Shape();
  const x = 0;
  const y = 0;
  s.moveTo(x + 0.25, y + 0.25);
  s.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
  s.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
  s.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
  s.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
  s.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
  s.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
  return s;
})();

const HEART_GEOMETRY = new THREE.ExtrudeGeometry(HEART_SHAPE, {
  depth: 0.05,
  bevelEnabled: false,
});

const HEART_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#ff6b9d",
  emissive: "#ff6b9d",
  emissiveIntensity: 0.4,
  transparent: true,
  opacity: 0.7,
});

function Heart({
  position,
  speed,
  scale,
}: {
  position: [number, number, number];
  speed: number;
  scale: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const startY = position[1];

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = startY + ((t * 0.3) % 4);
    ref.current.rotation.y = t;
    ref.current.position.x = position[0] + Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      scale={scale}
      rotation={[Math.PI, 0, 0]}
      geometry={HEART_GEOMETRY}
      material={HEART_MATERIAL}
    />
  );
}

function FloatingHeartsInner({ count = 10 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 8,
          Math.random() * 3 - 1,
          (Math.random() - 0.5) * 4 - 2,
        ] as [number, number, number],
        speed: 0.3 + Math.random() * 0.5,
        scale: 0.08 + Math.random() * 0.06,
      })),
    [count],
  );

  return (
    <group>
      {hearts.map((h, i) => (
        <Heart key={i} {...h} />
      ))}
    </group>
  );
}

export const FloatingHearts = memo(FloatingHeartsInner);
