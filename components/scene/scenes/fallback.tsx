"use client";

import { SpinGroup } from "@/components/scene/spin-group";
import { palette } from "@/lib/palette";

export function FallbackScene() {
  return (
    <SpinGroup rotation={[0.3, 0.4, 0]} spin={0.1}>
      <mesh>
        <boxGeometry args={[1.35, 1.35, 1.35]} />
        <meshStandardMaterial
          color={palette.primary1}
          roughness={0.7}
          metalness={0.85}
        />
      </mesh>
    </SpinGroup>
  );
}
