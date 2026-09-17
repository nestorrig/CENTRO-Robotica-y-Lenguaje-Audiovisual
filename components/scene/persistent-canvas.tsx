"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { EntryScene, getJourneyPageIds } from "@/components/scene/registry";
import { detailScroll, journeyOffset } from "@/lib/journey-store";
import { palette } from "@/lib/palette";
import type { EntradaSlide } from "@/lib/types";

function SceneLights() {
  const { ambient, key, fill } = useControls("Luces", {
    ambient: { value: 2, min: 0, max: 4, step: 0.01 },
    key: { value: 2.5, min: 0, max: 3, step: 0.01 },
    fill: { value: 2, min: 0, max: 2, step: 0.01 },
  });

  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight position={[4.5, 6, 5]} intensity={key} />
      <directionalLight position={[-5, -1.5, 3]} intensity={fill} />
    </>
  );
}

function JourneyScene({ entradas }: { entradas: EntradaSlide[] }) {
  const group = useRef<THREE.Group>(null);
  const { height } = useThree((state) => state.viewport);
  const pageIds = useMemo(
    () => getJourneyPageIds(entradas.map((entrada) => entrada.slug)),
    [entradas],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = journeyOffset.get() * height * (pageIds.length - 1);
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      target,
      10,
      delta,
    );
  });

  return (
    <group ref={group}>
      {pageIds.map((id, page) => (
        <group key={id} position={[0, -height * page, 0]}>
          <EntryScene slug={id} />
        </group>
      ))}
    </group>
  );
}

function DetailScene({ slug }: { slug: string }) {
  const group = useRef<THREE.Group>(null);
  const { height } = useThree((state) => state.viewport);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = detailScroll.get() * height * 1.05;
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      target,
      6,
      delta,
    );
  });

  return (
    <group ref={group}>
      <EntryScene slug={slug} />
    </group>
  );
}

export default function PersistentCanvas({
  entradas,
  detail,
  slug,
}: {
  entradas: EntradaSlide[];
  detail: boolean;
  slug: string | null;
}) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 0, 8], fov: 38, near: 0.1, far: 40 }}
    >
      <color attach="background" args={[palette.ink]} />
      <SceneLights />
      {detail && slug ? (
        <DetailScene slug={slug} />
      ) : (
        <JourneyScene entradas={entradas} />
      )}
    </Canvas>
  );
}
