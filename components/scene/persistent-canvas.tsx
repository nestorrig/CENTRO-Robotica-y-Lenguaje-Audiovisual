"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { EntryScene, getJourneyPageIds } from "@/components/scene/registry";
import { detailScroll, journeyOffset } from "@/lib/journey-store";
import { palette } from "@/lib/palette";
import type { EntradaSlide } from "@/lib/types";

const CAMERA_FOV = 38;
const DESKTOP_Z = 8;

function cameraDistance(aspect: number) {
  const desktopAspect = 16 / 9;
  return THREE.MathUtils.clamp(
    DESKTOP_Z * (desktopAspect / Math.max(aspect, 0.35)),
    DESKTOP_Z,
    20,
  );
}

function pageWorldHeight(z: number) {
  return 2 * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV) / 2) * z;
}

function useFrameLayout() {
  const size = useThree((state) => state.size);
  const width =
    size.width || (typeof window !== "undefined" ? window.innerWidth : 1280);
  const height =
    size.height || (typeof window !== "undefined" ? window.innerHeight : 720);
  const z = cameraDistance(width / Math.max(height, 1));

  return { z, pageHeight: pageWorldHeight(z) };
}

function ResponsiveCamera() {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const { z } = useFrameLayout();

  useLayoutEffect(() => {
    camera.position.set(0, 0, z);
    invalidate();
  }, [camera, invalidate, z]);

  return null;
}

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
  const { pageHeight } = useFrameLayout();
  const pageIds = useMemo(
    () => getJourneyPageIds(entradas.map((entrada) => entrada.slug)),
    [entradas],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = journeyOffset.get() * pageHeight * (pageIds.length - 1);
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
        <group key={id} position={[0, -pageHeight * page, 0]}>
          <EntryScene slug={id} />
        </group>
      ))}
    </group>
  );
}

function DetailScene({ slug }: { slug: string }) {
  const group = useRef<THREE.Group>(null);
  const { pageHeight } = useFrameLayout();

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = detailScroll.get() * pageHeight * 1.05;
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
      camera={{
        position: [
          0,
          0,
          cameraDistance(
            typeof window === "undefined"
              ? 16 / 9
              : window.innerWidth / window.innerHeight,
          ),
        ],
        fov: CAMERA_FOV,
        near: 0.1,
        far: 40,
      }}
    >
      <color attach="background" args={[palette.ink]} />
      <ResponsiveCamera />
      <SceneLights />
      {detail && slug ? (
        <DetailScene slug={slug} />
      ) : (
        <JourneyScene entradas={entradas} />
      )}
    </Canvas>
  );
}
