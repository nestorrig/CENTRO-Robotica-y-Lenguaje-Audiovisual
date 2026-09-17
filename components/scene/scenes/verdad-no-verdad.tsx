"use client";

import { SpinGroup } from "@/components/scene/spin-group";
import { palette } from "@/lib/palette";

export function VerdadNoVerdadScene() {
  return (
    <>
      <SpinGroup
        position={[-1.8, 0.2, 0]}
        rotation={[0.3, 0.5, 0]}
        scale={0.7}
        spin={0.2}
        float={0.16}
      >
        <mesh>
          <boxGeometry args={[1.35, 1.35, 1.35]} />
          <meshStandardMaterial
            color={palette.primary1}
            roughness={0.7}
            metalness={0.85}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup
        position={[0, 0.6, -0.2]}
        rotation={[0.2, 0.8, 0.1]}
        scale={0.55}
        spin={0.28}
        float={0.22}
      >
        <mesh>
          <boxGeometry args={[1.35, 1.35, 1.35]} />
          <meshStandardMaterial
            color={palette.primary2}
            roughness={0.6}
            metalness={0.7}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup
        position={[1.7, -0.15, 0.1]}
        rotation={[0.4, 0.2, 0.2]}
        scale={0.85}
        spin={0.14}
        float={0.12}
      >
        <mesh>
          <boxGeometry args={[1.35, 1.35, 1.35]} />
          <meshStandardMaterial
            color={palette.accent}
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup
        position={[0.2, -1.1, -0.5]}
        rotation={[1.1, 0, 0.2]}
        scale={1.3}
        spin={0.04}
      >
        <mesh>
          <cylinderGeometry args={[1.15, 1.15, 0.22, 64]} />
          <meshStandardMaterial
            color={palette.primary2}
            roughness={0.75}
            metalness={0.3}
          />
        </mesh>
      </SpinGroup>
    </>
  );
}
