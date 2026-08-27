"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { PrimitiveType, SceneObject, Vec3 } from "@/components/scene/scenes";

function Geometry({ type }: { type: PrimitiveType }) {
  switch (type) {
    case "disc":
      return <cylinderGeometry args={[1.15, 1.15, 0.22, 64]} />;
    case "pyramid":
      return <coneGeometry args={[0.85, 1.55, 4]} />;
    case "sphere":
      return <sphereGeometry args={[0.75, 32, 32]} />;
    case "torus":
      return <torusGeometry args={[0.72, 0.22, 16, 48]} />;
    default:
      return <boxGeometry args={[1.35, 1.35, 1.35]} />;
  }
}

function toScale(scale: number | Vec3): Vec3 {
  return typeof scale === "number" ? [scale, scale, scale] : scale;
}

function Primitive({
  object,
  color,
  roughness,
  metalness,
}: {
  object: SceneObject;
  color: string;
  roughness: number;
  metalness: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const base = useMemo(
    () => ({
      position: object.position,
      rotation: object.rotation,
      scale: toScale(object.scale),
    }),
    [object],
  );

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const float = Math.sin(t * 0.7 + group.id) * (object.float ?? 0);
    group.position.set(base.position[0], base.position[1] + float, base.position[2]);
    group.rotation.set(base.rotation[0], base.rotation[1], base.rotation[2]);
    group.rotation.y += t * (object.spin ?? 0);
    group.scale.set(...base.scale);
  });

  return (
    <group ref={ref} position={object.position} rotation={object.rotation} scale={toScale(object.scale)}>
      <mesh>
        <Geometry type={object.type} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>
    </group>
  );
}

export function EntryGroup({
  page,
  height,
  objects,
  color,
  roughness,
  metalness,
}: {
  page: number;
  height: number;
  objects: SceneObject[];
  color: string;
  roughness: number;
  metalness: number;
}) {
  return (
    <group position={[0, -height * page, 0]}>
      {objects.map((object) => (
        <Primitive
          key={object.id}
          object={object}
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      ))}
    </group>
  );
}
