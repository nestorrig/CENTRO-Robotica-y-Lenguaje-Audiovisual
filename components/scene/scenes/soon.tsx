"use client";

import { SpinGroup } from "@/components/scene/spin-group";
import { palette } from "@/lib/palette";

export function SoonScene() {
  return (
    <>
      <SpinGroup
        position={[-2.1, 0.4, -0.3]}
        rotation={[0.9, -0.2, 0.1]}
        scale={1.05}
        spin={0.07}
      >
        <mesh>
          <cylinderGeometry args={[1.15, 1.15, 0.22, 64]} />
          <meshStandardMaterial
            color={palette.primary1}
            roughness={0.7}
            metalness={0.85}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup
        position={[2.0, 0.1, -0.5]}
        rotation={[0.3, 0.7, 0.2]}
        scale={0.95}
        spin={0.1}
      >
        <mesh>
          <coneGeometry args={[0.85, 1.55, 4]} />
          <meshStandardMaterial
            color={palette.accent}
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup
        position={[0.1, -1.15, 0]}
        rotation={[0.2, 0.5, 0.3]}
        scale={0.8}
        spin={0.06}
      >
        <mesh>
          <boxGeometry args={[1.35, 1.35, 1.35]} />
          <meshStandardMaterial
            color={palette.primary2}
            roughness={0.65}
            metalness={0.7}
          />
        </mesh>
      </SpinGroup>
    </>
  );
}
