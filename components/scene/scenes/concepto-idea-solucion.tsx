"use client";

import { palette } from "@/lib/palette";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import type CustomShaderMaterialType from "three-custom-shader-material/vanilla";
import { cameraDistance } from "../persistent-canvas";

const MAX_STRIPE_COLORS = 8;

const BAND_COLORS = [
  new THREE.Color(palette.primary1),
  new THREE.Color(palette.primary2),
  new THREE.Color(palette.accent),
];

const AXIS = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
} as const;

const stripesVertexShader = /* glsl */ `
  varying vec3 vLocalPosition;
  // varying vec3 vWorldPosition;

  void main() {
    // vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vLocalPosition = position;
  }
`;

const stripesFragmentShader = /* glsl */ `
  varying vec3 vLocalPosition;
  // varying vec3 vWorldPosition;
  uniform float uTime;
  uniform float uPositionFrequency;
  uniform float uTimeFrequency;
  uniform float uColorsLength;
  uniform float uColorsOffset;
  uniform vec3 uAxis;
  uniform vec3 uColors[8];

  void main() {
    float along = dot(vLocalPosition, uAxis);
    float pattern = fract(along * uPositionFrequency - uTime * uTimeFrequency);
    int last = int(uColorsLength) - 1;
    int index = clamp(int(floor(pattern * (uColorsLength + uColorsOffset))), 0, last);
    csm_DiffuseColor = vec4(uColors[index], 1.0);
  }
`;

function padColors(colors: THREE.Color[]) {
  const used = colors.slice(0, MAX_STRIPE_COLORS);
  const last = used[used.length - 1] ?? new THREE.Color(0xffffff);
  return Array.from({ length: MAX_STRIPE_COLORS }, (_, i) => used[i] ?? last);
}

function StripeMaterial({
  colors = BAND_COLORS,
  uColorsOffset = 1,
  axis = "x",
  positionFrequency = 1.5,
  timeFrequency = 0.35,
}: {
  colors?: THREE.Color[];
  uColorsOffset?: number;
  axis?: keyof typeof AXIS;
  positionFrequency?: number;
  timeFrequency?: number;
}) {
  const materialRef =
    useRef<CustomShaderMaterialType<typeof THREE.MeshStandardMaterial>>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPositionFrequency: { value: positionFrequency },
      uTimeFrequency: { value: timeFrequency },
      uColorsLength: { value: Math.min(colors.length, MAX_STRIPE_COLORS) },
      uColorsOffset: { value: uColorsOffset },
      uAxis: { value: AXIS[axis].clone() },
      uColors: { value: padColors(colors) },
    }),
    [axis, colors, positionFrequency, timeFrequency, uColorsOffset],
  );

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <CustomShaderMaterial
      ref={materialRef}
      baseMaterial={THREE.MeshStandardMaterial}
      vertexShader={stripesVertexShader}
      fragmentShader={stripesFragmentShader}
      uniforms={uniforms}
      roughness={0.1}
      metalness={0.2}
    />
  );
}

const sphereGeometry = new THREE.SphereGeometry(1, 56, 48);

export function ConceptoIdeaSolucionScene() {
  const ballsGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const ballsGroup = ballsGroupRef.current;
    if (!ballsGroup) return;

    const items = ballsGroup.children.length;
    const radius = Math.max(
      cameraDistance(window.innerWidth / window.innerHeight) * 0.18,
      1.7,
    );
    console.log(radius);

    ballsGroup.children.forEach((child, i) => {
      console.log(child);

      const angle = Math.PI / 2 + ((Math.PI * 2) / items) * i;
      child.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    });
  }, []);

  useFrame((state) => {
    const ballsGroup = ballsGroupRef.current;
    if (!ballsGroup) return;

    const elapsedTime = state.clock.elapsedTime;
    ballsGroup.rotation.y = elapsedTime * 0.55;
    ballsGroup.rotation.x = elapsedTime * 0.15;
    ballsGroup.rotation.z = elapsedTime * 0.35;
  });

  return (
    <group ref={ballsGroupRef}>
      <mesh position={[0, 0, 0]} geometry={sphereGeometry}>
        <StripeMaterial
          axis="y"
          colors={[
            new THREE.Color(palette.primary1),
            new THREE.Color(palette.accent),
            new THREE.Color(palette.primary2),
          ]}
          uColorsOffset={1}
        />
      </mesh>

      <mesh position={[0, 0, 0]} geometry={sphereGeometry}>
        <StripeMaterial
          axis="z"
          colors={[
            new THREE.Color(palette.accent),
            new THREE.Color(palette.primary2),
            new THREE.Color(palette.primary1),
          ]}
          uColorsOffset={4}
        />
      </mesh>

      <mesh position={[0, 0, 0]} geometry={sphereGeometry}>
        <StripeMaterial axis="x" colors={BAND_COLORS} uColorsOffset={6} />
      </mesh>
    </group>
  );
}
