"use client";

import { SpinGroup } from "@/components/scene/spin-group";
import { palette } from "@/lib/palette";

export function HomeScene() {
  return (
    <>
      <SpinGroup
        position={[0, 0.8, 0.2]}
        rotation={[1, 0, 0.1]}
        scale={0.9}
        spin={0.8}
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
        position={[2.4, -0.2, -0.8]}
        rotation={[1.1, 0.2, 0.3]}
        scale={1.1}
        spin={0.1}
      >
        <mesh>
          <cylinderGeometry args={[1.15, 1.15, 0.22, 64]} />
          <meshStandardMaterial
            color={palette.primary2}
            roughness={0.7}
            metalness={0.85}
          />
        </mesh>
      </SpinGroup>
      <SpinGroup
        position={[-2.4, 0.2, -0.8]}
        rotation={[1.1, 0.2, 0.3]}
        scale={0.8}
        spin={0.5}
      >
        <mesh>
          <cylinderGeometry args={[1.15, 1.15, 0.22, 64]} />
          <meshStandardMaterial
            color={palette.primary2}
            roughness={0.7}
            metalness={0.8}
          />
        </mesh>
      </SpinGroup>
    </>
  );
}
