"use client";

import { SpinGroup } from "@/components/scene/spin-group";
import { palette } from "@/lib/palette";

export function ConceptoIdeaSolucionScene() {
  return (
    <>
      <SpinGroup
        position={[-1.75, -0.05, 0.15]}
        rotation={[0.35, 0.7, 0.12]}
        scale={1}
        spin={0.1}
        float={0.12}
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
        position={[1.55, -0.4, -0.35]}
        rotation={[1.05, 0.15, 0.2]}
        scale={1.15}
        spin={0.06}
        float={0.08}
      >
        <mesh>
          <cylinderGeometry args={[1.15, 1.15, 0.22, 64]} />
          <meshStandardMaterial
            color={palette.primary2}
            roughness={0.65}
            metalness={0.7}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup
        position={[0.4, 1.2, -0.75]}
        rotation={[-0.15, 0.45, 0.1]}
        scale={1}
        spin={0.12}
        float={0.1}
      >
        <mesh>
          <coneGeometry args={[0.85, 1.55, 4]} />
          <meshStandardMaterial
            color={palette.accent}
            roughness={0.5}
            metalness={0.35}
          />
        </mesh>
      </SpinGroup>
    </>
  );
}
