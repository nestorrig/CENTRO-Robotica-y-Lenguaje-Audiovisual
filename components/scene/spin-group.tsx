"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

export type Vec3 = [number, number, number];

export function SpinGroup({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  spin = 0,
  float = 0,
  children,
}: {
  position?: Vec3;
  rotation?: Vec3;
  scale?: number | Vec3;
  spin?: number;
  float?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const xyz: Vec3 = typeof scale === "number" ? [scale, scale, scale] : scale;
  const base = useMemo(
    () => ({ position, rotation, scale: xyz }),
    [position, rotation, xyz],
  );

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    group.position.set(
      base.position[0],
      base.position[1] + Math.sin(t * 0.7 + group.id) * float,
      base.position[2],
    );
    group.rotation.set(...base.rotation);
    group.rotation.y += t * spin;
    group.scale.set(...base.scale);
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={xyz}>
      {children}
    </group>
  );
}
