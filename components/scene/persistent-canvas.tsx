"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { EntryGroup } from "@/components/scene/entry-group";
import { getJourneyScenes, getScene } from "@/components/scene/scenes";
import { detailScroll, journeyOffset } from "@/lib/journey-store";
import { palette } from "@/lib/palette";
import type { EntradaSlide } from "@/lib/types";

function SceneLights() {
  const { ambient, key, fill } = useControls("Luces", {
    ambient: { value: 0.85, min: 0, max: 2, step: 0.01 },
    key: { value: 1.15, min: 0, max: 3, step: 0.01 },
    fill: { value: 0.35, min: 0, max: 2, step: 0.01 },
  });

  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight position={[4.5, 6, 5]} intensity={key} />
      <directionalLight position={[-5, -1.5, 3]} intensity={fill} />
    </>
  );
}

function JourneyScene({
  entradas,
  color,
  roughness,
  metalness,
}: {
  entradas: EntradaSlide[];
  color: string;
  roughness: number;
  metalness: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { height } = useThree((state) => state.viewport);
  const scenes = useMemo(
    () => getJourneyScenes(entradas.map((entrada) => entrada.slug)),
    [entradas],
  );
  const pages = Math.max(scenes.length, 1);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = journeyOffset.get() * height * (pages - 1);
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      target,
      10,
      delta,
    );
  });

  return (
    <group ref={group}>
      {scenes.map((scene, page) => (
        <EntryGroup
          key={scene.id}
          page={page}
          height={height}
          objects={scene.objects}
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      ))}
    </group>
  );
}

function DetailScene({
  slug,
  color,
  roughness,
  metalness,
}: {
  slug: string;
  color: string;
  roughness: number;
  metalness: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { height } = useThree((state) => state.viewport);
  const scene = getScene(slug);

  useFrame((_, delta) => {
    const target = detailScroll.get() * height * 1.05;
    if (!group.current) return;
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      target,
      6,
      delta,
    );
  });

  return (
    <group ref={group}>
      <EntryGroup
        page={0}
        height={height}
        objects={scene.objects}
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </group>
  );
}

function Experience({
  entradas,
  detail,
  slug,
}: {
  entradas: EntradaSlide[];
  detail: boolean;
  slug: string | null;
}) {
  const material = useControls("Material", {
    color: palette.paper,
    roughness: { value: 0.62, min: 0, max: 1, step: 0.01 },
    metalness: { value: 0.06, min: 0, max: 1, step: 0.01 },
  });

  if (detail && slug) {
    return (
      <DetailScene
        slug={slug}
        color={material.color}
        roughness={material.roughness}
        metalness={material.metalness}
      />
    );
  }

  return (
    <JourneyScene
      entradas={entradas}
      color={material.color}
      roughness={material.roughness}
      metalness={material.metalness}
    />
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
      <Experience entradas={entradas} detail={detail} slug={slug} />
    </Canvas>
  );
}
