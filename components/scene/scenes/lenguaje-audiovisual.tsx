"use client";

import { SpinGroup } from "@/components/scene/spin-group";
import { palette } from "@/lib/palette";

export function LenguajeAudiovisualScene() {
  return (
    <>
      <SpinGroup
        position={[0.1, 0.15, 0.2]}
        rotation={[0.2, 0.1, 0.4]}
        scale={1.2}
        spin={0.16}
        float={0.08}
      >
        <mesh>
          <torusGeometry args={[0.72, 0.22, 16, 48]} />
          <meshStandardMaterial
            color={palette.primary1}
            roughness={0.45}
            metalness={0.6}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup
        position={[1.7, -0.5, -0.4]}
        rotation={[1.2, 0.2, 0]}
        scale={0.95}
        spin={0.05}
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
      <SpinGroup position={[-1.6, 0.55, -0.6]} scale={0.55} float={0.18}>
        <mesh>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial
            color={palette.accent}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
      </SpinGroup>
    </>
  );
}
