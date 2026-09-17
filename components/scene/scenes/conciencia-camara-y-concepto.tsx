"use client";

import { SpinGroup } from "@/components/scene/spin-group";
import { palette } from "@/lib/palette";

export function ConcienciaCamaraYConceptoScene() {
  return (
    <>
      <SpinGroup
        position={[-1.2, 0.4, 0.2]}
        rotation={[0.5, -0.4, 0.1]}
        scale={0.85}
        spin={0.09}
        float={0.1}
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
        position={[1.4, 0.2, -0.3]}
        rotation={[0.2, 0.9, -0.2]}
        scale={1.05}
        spin={0.11}
        float={0.09}
      >
        <mesh>
          <coneGeometry args={[0.85, 1.55, 4]} />
          <meshStandardMaterial
            color={palette.primary2}
            roughness={0.6}
            metalness={0.55}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup position={[0.1, -0.9, -0.2]} scale={0.7} float={0.2}>
        <mesh>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial
            color={palette.accent}
            roughness={0.35}
            metalness={0.25}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup
        position={[0.15, 1.25, -0.8]}
        rotation={[0.8, 0.2, 0]}
        scale={0.65}
        spin={0.18}
      >
        <mesh>
          <torusGeometry args={[0.72, 0.22, 16, 48]} />
          <meshStandardMaterial
            color={palette.primary1}
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>
      </SpinGroup>
    </>
  );
}
