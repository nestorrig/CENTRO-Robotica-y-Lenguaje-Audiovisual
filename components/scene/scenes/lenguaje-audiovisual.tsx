"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { palette } from "@/lib/palette";

const RULES = {
  thirds: 0,
  frameWithinFrame: 1,
  goldenTriangle: 2,
  goldenSpiral: 3,
  onePointPerspective: 4,
  symmetry: 5,
} as const;

const RULE_LIST = Object.values(RULES);
const PANEL_COUNT = 12;
const PANEL_WIDTH = 1.6;
const PANEL_HEIGHT = 0.9;
const PANEL_GAP = 0.3;
const RING_SPEED = 0.18;
const MOBILE_BREAKPOINT = 768;

// Radio con el que `count` paneles y sus separaciones llenan la circunferencia.
function ringRadius(count: number) {
  return ((PANEL_WIDTH + PANEL_GAP) * count) / (Math.PI * 2);
}

// Tramo de cilindro abierto: el arco mide PANEL_WIDTH, así el shader conserva el 16:9.
function createPanelGeometry(radius: number) {
  const arc = PANEL_WIDTH / radius;
  return new THREE.CylinderGeometry(
    radius,
    radius,
    PANEL_HEIGHT,
    10,
    1,
    true,
    -arc / 2,
    arc,
  );
}

const RING_RADIUS = ringRadius(PANEL_COUNT);
const panelGeometry = createPanelGeometry(RING_RADIUS);

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// La onda se evalúa a lo largo del listón (uWaveOffset es la posición del panel sobre
// él), así la banda y los paneles que viajan encima comparten exactamente la misma curva.
// Una segunda onda (wobble) con su propio ritmo rompe la regularidad; la suma se
// normaliza para no rebasar uWaveAmplitude / uWaveDepth.
const ribbonVertexShader = /* glsl */ `
  uniform float uWaveTime;
  uniform float uWaveSpeed;
  uniform float uWaveAmplitude;
  uniform float uWaveFrequency;
  uniform float uWaveDepth;
  uniform float uWavePhase;
  uniform float uWaveOffset;
  uniform float uWobbleAmount;
  uniform float uWobbleFrequency;
  uniform float uWobbleSpeed;
  uniform float uWobblePhase;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    float x = position.x + uWaveOffset;
    float wave = x * uWaveFrequency - uWaveTime * uWaveSpeed + uWavePhase;
    float wobble = x * uWobbleFrequency - uWaveTime * uWobbleSpeed + uWobblePhase;
    float norm = 1.0 / (1.0 + uWobbleAmount);
    vec3 bent = vec3(
      x,
      position.y + uWaveAmplitude * (sin(wave) + uWobbleAmount * sin(wobble)) * norm,
      position.z + uWaveDepth * (cos(wave) + uWobbleAmount * cos(wobble)) * norm
    );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(bent, 1.0);
  }
`;

const ribbonBandFragmentShader = /* glsl */ `
  uniform vec3 uColor;

  void main() {
    gl_FragColor = vec4(uColor, 1.0);
    #include <colorspace_fragment>
  }
`;

const fragmentShader = /* glsl */ `
  uniform int uRule;
  uniform float uAspect;
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uBackground;
  uniform vec3 uLine;

  varying vec2 vUv;

  const float PHI = 1.61803398875;
  const float PI = 3.14159265359;
  const float HALF_PI = 1.57079632679;
  const float TAU = 6.28318530718;
  const float LINE_WIDTH = 0.008;
  const float FOCAL_RADIUS = 0.1;
  const float MERGE_RADIUS = 0.02;

  float segment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  float boxEdge(vec2 p, vec2 center, vec2 halfSize) {
    vec2 d = abs(p - center) - halfSize;
    return abs(length(max(d, 0.0)) + min(max(d.x, d.y), 0.0));
  }

  float footParam(vec2 p, vec2 a, vec2 b) {
    vec2 ba = b - a;
    return dot(p - a, ba) / dot(ba, ba);
  }

  // Curvas de https://github.com/glslify/glsl-easings (Robert Penner).
  // Las potencias van como productos: pow() con base negativa no está definido en GLSL.
  float cubicInOut(float t) {
    if (t < 0.5) return 4.0 * t * t * t;
    float f = 2.0 * t - 2.0;
    return 0.5 * f * f * f + 1.0;
  }

  float quarticInOut(float t) {
    if (t < 0.5) return 8.0 * t * t * t * t;
    float f = t - 1.0;
    return -8.0 * f * f * f * f + 1.0;
  }

  float exponentialInOut(float t) {
    if (t <= 0.0 || t >= 1.0) return t;
    return t < 0.5
      ? 0.5 * pow(2.0, 20.0 * t - 10.0)
      : -0.5 * pow(2.0, 10.0 - 20.0 * t) + 1.0;
  }

  float backInOut(float t) {
    float f = t < 0.5 ? 2.0 * t : 1.0 - (2.0 * t - 1.0);
    float g = f * f * f - f * sin(f * PI);
    return t < 0.5 ? 0.5 * g : 0.5 * (1.0 - g) + 0.5;
  }
  // Ida y vuelta 0 → 1 → 0 con una pausa de \`hold\` en cada extremo.
  float pingPong(float period, float phase, float hold) {
    float tri = 1.0 - abs(2.0 * fract(uTime / period + phase) - 1.0);
    return clamp((tri - hold) / (1.0 - 2.0 * hold), 0.0, 1.0);
  }

  // Avance 0 → 1 dentro de cada tramo, quieto durante la primera fracción \`hold\`.
  float stepProgress(float period, float phase, float hold) {
    float f = fract(uTime / period + phase);
    return clamp((f - hold) / (1.0 - hold), 0.0, 1.0);
  }

  float stepIndex(float period, float phase) {
    return floor(uTime / period + phase);
  }

  // Smooth min polinomial: k es la distancia a la que las formas empiezan a fundirse.
  float smoothUnion(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float hash(float n, float k) {
    return fract(sin(n * 127.1 + k * 311.7 + uSeed * 74.7) * 43758.5453);
  }

  // Marco aleatorio para el paso n: xy = centro, zw = medio tamaño. Siempre dentro del plano.
  // mod acota n para no perder precisión en sin(); el ciclo de 64 pasos no se nota.
  vec4 frameKey(float n, float w) {
    float key = mod(n, 64.0);
    vec2 extent = vec2(
      w * mix(0.12, 0.45, hash(key, 1.0)),
      mix(0.1, 0.4, hash(key, 2.0))
    );
    const float margin = 0.05;
    vec2 center = vec2(
      mix(extent.x + margin, w - extent.x - margin, hash(key, 3.0)),
      mix(extent.y + margin, 1.0 - extent.y - margin, hash(key, 4.0))
    );
    return vec4(center, extent);
  }

  vec2 frameSlide(float n) {
    float key = mod(n, 64.0);
    return vec2(mix(-0.6, 0.6, hash(key, 7.0)), mix(-0.3, 0.3, hash(key, 8.0)));
  }

  // Escala del focal según la fase de su propio movimiento: quieto en la pausa, se encoge
  // al acelerar y recupera su tamaño al desacelerar. La campana sigue el perfil de
  // velocidad de los easings in-out, con mínimo a media carrera.
  float focalPulse(float cycle, float hold) {
    float f = fract(cycle);
    if (f < hold) return 1.0;
    float t = (f - hold) / (1.0 - hold);
    float speed = sin(PI * t);
    return 1.0 - 0.45 * speed * speed;
  }

  vec2 perspectiveKey(float n, float w) {
    float key = mod(n, 64.0);
    return vec2(w * mix(0.15, 0.85, hash(key, 5.0)), mix(0.15, 0.85, hash(key, 6.0)));
  }

  // Recorrido aleatorio evaluado en un tiempo dado, para poder muestrearlo con retraso.
  vec2 perspectivePath(float time, float w) {
    const float period = 2.4;
    const float hold = 0.35;
    float cycle = time / period + uSeed;
    float progress = clamp((fract(cycle) - hold) / (1.0 - hold), 0.0, 1.0);
    return mix(
      perspectiveKey(floor(cycle), w),
      perspectiveKey(floor(cycle) + 1.0, w),
      quarticInOut(progress)
    );
  }

  // Esquinas recorridas en orden: dos consecutivas comparten línea.
  vec2 thirdsKey(int i, vec2 center, vec2 gap) {
    vec2 side = i == 0 ? vec2(1.0, 1.0)
      : i == 1 ? vec2(-1.0, 1.0)
      : i == 2 ? vec2(-1.0, -1.0)
      : vec2(1.0, -1.0);
    return center + side * gap;
  }

  // x = separación respecto al eje; el gemelo reflejado aparece al alejarse.
  // Un tercio de las paradas cae sobre el eje para que los gemelos vuelvan a fundirse.
  vec2 symmetryKey(float n) {
    float key = mod(n, 64.0);
    float separation = hash(key, 9.0) < 0.33 ? 0.0 : mix(0.1, 0.6, hash(key, 10.0));
    return vec2(separation, mix(0.2, 0.8, hash(key, 11.0)));
  }

  void main() {
    float w = uAspect;
    vec2 p = vec2(vUv.x * w, vUv.y);
    float d = 1e3;
    vec2 focal = vec2(w * 0.5, 0.5);
    float maxRadius = 1.0;
    // Ciclo y pausa del movimiento del focal en cada regla, para sincronizar su rebote.
    float motionCycle = 0.0;
    float motionHold = 0.0;

    if (uRule == 0) {
      float gapX = w * mix(0.1, 0.24, quarticInOut(pingPong(5.0, uSeed, 0.15)));
      float gapY = mix(0.1, 0.24, quarticInOut(pingPong(6.5, uSeed + 0.25, 0.15)));
      d = min(d, abs(p.x - (w * 0.5 - gapX)));
      d = min(d, abs(p.x - (w * 0.5 + gapX)));
      d = min(d, abs(p.y - (0.5 - gapY)));
      d = min(d, abs(p.y - (0.5 + gapY)));

      vec2 center = vec2(w * 0.5, 0.5);
      vec2 gap = vec2(gapX, gapY);
      // La dirección multiplica el índice para que el destino de un tramo sea el origen del siguiente.
      float direction = uSeed > 0.5 ? 1.0 : -1.0;
      float corner = stepIndex(3.2, uSeed) * direction + floor(uSeed * 4.0);
      int key = int(mod(corner, 4.0));
      int next = int(mod(corner + direction, 4.0));
      focal = mix(
        thirdsKey(key, center, gap),
        thirdsKey(next, center, gap),
        quarticInOut(stepProgress(3.2, uSeed, 0.4))
      );
      motionCycle = uTime / 3.2 + uSeed;
      motionHold = 0.4;
    } else if (uRule == 1) {
      float frameStep = stepIndex(3.4, uSeed);
      float frameEase = backInOut(stepProgress(3.4, uSeed, 0.3));
      vec4 frame = mix(frameKey(frameStep, w), frameKey(frameStep + 1.0, w), frameEase);
      vec2 center = frame.xy;
      vec2 halfSize = frame.zw;
      d = boxEdge(p, center, halfSize);
      vec2 slide = mix(frameSlide(frameStep), frameSlide(frameStep + 1.0), frameEase);
      focal = center + halfSize * slide;
      maxRadius = halfSize.y * 0.5;
      motionCycle = uTime / 3.4 + uSeed;
      motionHold = 0.3;
    } else if (uRule == 2) {
      vec2 a = vec2(0.0, 0.0);
      vec2 b = vec2(w, 1.0);
      vec2 topLeft = vec2(0.0, 1.0);
      vec2 bottomRight = vec2(w, 0.0);
      float shift = mix(-0.14, 0.14, exponentialInOut(pingPong(7.0, uSeed, 0.12)));
      float tA = clamp(footParam(topLeft, a, b) + shift, 0.05, 0.95);
      float tB = clamp(footParam(bottomRight, a, b) - shift, 0.05, 0.95);
      vec2 hitA = mix(a, b, tA);
      vec2 hitB = mix(a, b, tB);
      d = segment(p, a, b);
      d = min(d, segment(p, topLeft, hitA));
      d = min(d, segment(p, bottomRight, hitB));

      // Recorre cada línea corta y salta entre ellas: al despegarse se nota la fusión.
      vec2 keys[4];
      keys[0] = hitA;
      keys[1] = mix(topLeft, hitA, 0.45);
      keys[2] = hitB;
      keys[3] = mix(bottomRight, hitB, 0.45);
      int key = int(mod(stepIndex(3.0, uSeed) + floor(uSeed * 4.0), 4.0));
      focal = mix(
        keys[key],
        keys[(key + 1) % 4],
        quarticInOut(stepProgress(3.0, uSeed, 0.35))
      );
      motionCycle = uTime / 3.0 + uSeed;
      motionHold = 0.35;
    } else if (uRule == 3) {
      // Cada cuarto de arco mide 1/PHI del anterior; invertir esa serie geométrica
      // convierte la distancia recorrida en (arco, avance) y la velocidad queda constante.
      const float SPIRAL_ARCS = 8.0;
      float travel = cubicInOut(pingPong(10.0, uSeed, 0.06));
      float along = -log(1.0 - travel * (1.0 - pow(PHI, -SPIRAL_ARCS))) / log(PHI);
      int arc = int(min(floor(along), SPIRAL_ARCS - 1.0));
      float arcProgress = along - float(arc);
      float arcSize = w;

      float rectHeight = w / PHI;
      vec4 r = vec4(0.0, (1.0 - rectHeight) * 0.5, w, rectHeight);

      // Solo se dibuja la línea que separa cada cuadrado del resto: sin contorno exterior.
      for (int i = 0; i < 10; i++) {
        int side = i % 4;
        float s = 0.0;
        vec2 dividerA = vec2(0.0);
        vec2 dividerB = vec2(0.0);
        vec2 center = vec2(0.0);
        vec2 quadrant = vec2(0.0);

        if (side == 0) {
          s = r.w;
          dividerA = vec2(r.x + s, r.y);
          dividerB = vec2(r.x + s, r.y + r.w);
          center = vec2(r.x + s, r.y);
          quadrant = vec2(-1.0, 1.0);
          r.x += s;
          r.z -= s;
        } else if (side == 1) {
          s = r.z;
          dividerA = vec2(r.x, r.y + r.w - s);
          dividerB = vec2(r.x + r.z, r.y + r.w - s);
          center = vec2(r.x, r.y + r.w - s);
          quadrant = vec2(1.0, 1.0);
          r.w -= s;
        } else if (side == 2) {
          s = r.w;
          dividerA = vec2(r.x + r.z - s, r.y);
          dividerB = vec2(r.x + r.z - s, r.y + r.w);
          center = vec2(r.x + r.z - s, r.y + s);
          quadrant = vec2(1.0, -1.0);
          r.z -= s;
        } else {
          s = r.z;
          dividerA = vec2(r.x, r.y + s);
          dividerB = vec2(r.x + r.z, r.y + s);
          center = vec2(r.x + s, r.y + s);
          quadrant = vec2(-1.0, -1.0);
          r.y += s;
          r.w -= s;
        }

        d = min(d, segment(p, dividerA, dividerB));
        vec2 pc = p - center;
        if (pc.x * quadrant.x >= 0.0 && pc.y * quadrant.y >= 0.0) {
          d = min(d, abs(length(pc) - s));
        }

        // Los arcos se encadenan girando -90° por iteración, empezando en 180°.
        if (i == arc) {
          float theta = PI - (float(i) + arcProgress) * HALF_PI;
          focal = center + s * vec2(cos(theta), sin(theta));
          arcSize = s * pow(PHI, -arcProgress);
        }
      }

      maxRadius = max(arcSize * 0.45, 0.012);
      // El ping-pong tiene dos viajes por periodo y pausa en ambos extremos de cada viaje;
      // desplazar la fase por la pausa deja la llegada al inicio de cada ciclo.
      motionCycle = 2.0 * (uTime / 10.0 + uSeed) + 0.06;
      motionHold = 0.12;
    } else if (uRule == 4) {
      // El punto de fuga recorre el mismo camino que el focal, con retraso.
      focal = perspectivePath(uTime, w);
      motionCycle = uTime / 2.4 + uSeed;
      motionHold = 0.35;
      vec2 vanishing = perspectivePath(uTime - 0.4, w);
      vec2 pv = p - vanishing;
      for (int i = 0; i < 12; i++) {
        float angle = float(i) / 12.0 * TAU;
        vec2 dir = vec2(cos(angle), sin(angle));
        float t = max(dot(pv, dir), 0.0);
        d = min(d, length(pv - dir * t));
      }
    } else {
      d = abs(p.x - w * 0.5);
      float symmetryStep = stepIndex(1.8, uSeed);
      vec2 offset = mix(
        symmetryKey(symmetryStep),
        symmetryKey(symmetryStep + 1.0),
        exponentialInOut(stepProgress(1.8, uSeed, 0.6))
      );
      focal = vec2(w * 0.5 + abs(offset.x), offset.y);
      motionCycle = uTime / 1.8 + uSeed;
      motionHold = 0.6;
      // Plegar p sobre el eje dibuja el focal y su reflejo con una sola distancia.
      p.x = w * 0.5 + abs(p.x - w * 0.5);
    }

    float radius = clamp(
      FOCAL_RADIUS * focalPulse(motionCycle, motionHold),
      0.01,
      maxRadius
    );
    float focalSdf = length(p - focal) - radius;
    float lineSdf = d - LINE_WIDTH;

    float shapeSdf = smoothUnion(focalSdf, lineSdf, MERGE_RADIUS);
    float aa = fwidth(shapeSdf);
    float shape = 1.0 - smoothstep(-aa, aa, shapeSdf);
    vec3 color = mix(uBackground, uLine, shape);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Panel = {
  rule: number;
  background: string;
  line: string;
  seed: number;
};

const PANEL_SWATCHES = [palette.ink, palette.primary2, palette.accent];

function buildPanels(
  count: number,
  colorSeed: number,
  motionSeed: number,
  ruleOffset = 0,
): Panel[] {
  const random = mulberry32(colorSeed);
  const seeds = mulberry32(motionSeed);

  return Array.from({ length: count }, (_, i) => {
    const [background, line] = shuffle(PANEL_SWATCHES, random);
    return {
      rule: RULE_LIST[(i + ruleOffset) % RULE_LIST.length],
      background,
      line,
      seed: seeds(),
    };
  });
}

const PANELS = buildPanels(PANEL_COUNT, 2026, 73);

function useSceneScale() {
  return useThree((state) => (state.size.width < MOBILE_BREAKPOINT ? 2 : 1));
}

type RibbonWobble = {
  amount: number;
  frequency: number;
  speed: number;
  phase: number;
};

type RibbonWave = {
  amplitude: number;
  frequency: number;
  depth: number;
  speed: number;
  phase: number;
  wobble?: RibbonWobble;
};

function ribbonUniforms(ribbon?: RibbonWave) {
  return {
    uWaveTime: { value: 0 },
    uWaveSpeed: { value: ribbon?.speed ?? 0 },
    uWaveAmplitude: { value: ribbon?.amplitude ?? 0 },
    uWaveFrequency: { value: ribbon?.frequency ?? 0 },
    uWaveDepth: { value: ribbon?.depth ?? 0 },
    uWavePhase: { value: ribbon?.phase ?? 0 },
    uWaveOffset: { value: 0 },
    uWobbleAmount: { value: ribbon?.wobble?.amount ?? 0 },
    uWobbleFrequency: { value: ribbon?.wobble?.frequency ?? 0 },
    uWobbleSpeed: { value: ribbon?.wobble?.speed ?? 0 },
    uWobblePhase: { value: ribbon?.wobble?.phase ?? 0 },
  };
}

function CompositionPanel({
  panel,
  angle,
  geometry = panelGeometry,
  rotationY = angle,
  ribbon,
  ribbonOffset,
}: {
  panel: Panel;
  angle: number;
  geometry?: THREE.BufferGeometry;
  rotationY?: number;
  ribbon?: RibbonWave;
  // Posición del panel a lo largo del listón en función del tiempo.
  ribbonOffset?: (time: number) => number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uRule: { value: panel.rule },
      uAspect: { value: PANEL_WIDTH / PANEL_HEIGHT },
      uTime: { value: 0 },
      uSeed: { value: panel.seed },
      uBackground: { value: new THREE.Color(panel.background) },
      uLine: { value: new THREE.Color(panel.line) },
      ...ribbonUniforms(ribbon),
    }),
    [panel, ribbon],
  );

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    const time = state.clock.elapsedTime;
    material.uniforms.uTime.value = time + angle;
    if (ribbon) {
      material.uniforms.uWaveTime.value = time;
      material.uniforms.uWaveOffset.value = ribbonOffset?.(time) ?? 0;
    }
  });

  return (
    <mesh geometry={geometry} rotation={[0, rotationY, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={ribbon ? ribbonVertexShader : vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── Producción ─────────────────────────────────────────────────────────────
// Un solo anillo de 12 paneles curvos, inclinado y girando sobre Y.
function ProductionVisualization() {
  const ringRef = useRef<THREE.Group>(null);
  const scale = useSceneScale();

  useFrame((state) => {
    const ring = ringRef.current;
    if (!ring) return;
    ring.rotation.y = state.clock.elapsedTime * RING_SPEED;
  });

  return (
    <group rotation={[0.24, 0, 0]} position={[0, 0.1, 0]} scale={scale}>
      <group ref={ringRef}>
        {PANELS.map((panel, i) => (
          <CompositionPanel
            key={i}
            panel={panel}
            angle={(i / PANEL_COUNT) * Math.PI * 2}
          />
        ))}
      </group>
    </group>
  );
}

// ─── Experimento: anillos múltiples girando en todos los ejes ───────────────
// Prompts:
// 1. "lo que ahora quiero es que agregues ma anillis interiores y experiores,
//    suamndo o restandoi rectangulos y dales una rotacion distinta"
// 2. "tambien rota en los demas ejes"
// 3. "cada anillo tendra el mismo color de bg y lineas y circulos, cambian entre anillos"
//
// Anillos concéntricos con el mismo tamaño de panel: los interiores restan paneles y
// los exteriores suman, así el radio sale del número de paneles. Cada uno gira sobre
// su eje y además da vueltas sobre X y Z a su propia velocidad, como un giroscopio.
// Al estar en radios distintos nunca se cruzan entre sí. Todos los paneles de un anillo
// comparten fondo y color de línea; cada anillo usa una combinación distinta.
type RingConfig = {
  count: number;
  tilt: [number, number, number];
  speed: number;
  seed: number;
  // Velocidad de giro de todo el anillo sobre X y Z.
  tumble: [number, number];
  background: string;
  line: string;
};

const TUMBLING_RING_CONFIGS: RingConfig[] = [
  {
    count: 5,
    tilt: [0.9, 0, 0.35],
    speed: -1.2,
    seed: 11,
    tumble: [0.53, -0.7],
    background: palette.primary1,
    line: palette.accent,
  },
  {
    count: 8,
    tilt: [-0.55, 0, -0.5],
    speed: 0.8,
    seed: 23,
    tumble: [-0.5, 0.12],
    background: palette.paper,
    line: palette.primary2,
  },
  {
    count: 11,
    tilt: [0.2, 0, 0.8],
    speed: 0.5,
    seed: 2026,
    tumble: [0.53, 0.15],
    background: palette.ink,
    line: palette.paper,
  },
  {
    count: 13,
    tilt: [0.2, 0, 0],
    speed: 0.18,
    seed: 2026,
    tumble: [0.3, 0.5],
    background: palette.accent,
    line: palette.ink,
  },
  {
    count: 16,
    tilt: [-0.3, 0, 0.83],
    speed: -0.51,
    seed: 47,
    tumble: [-0.4, -0.26],
    background: palette.primary2,
    line: palette.paper,
  },
];

function buildRings(configs: RingConfig[]) {
  return configs.map((config, ringIndex) => ({
    ...config,
    geometry: createPanelGeometry(ringRadius(config.count)),
    panels: buildPanels(
      config.count,
      config.seed,
      config.seed + 1,
      ringIndex,
    ).map((panel) => ({
      ...panel,
      background: config.background,
      line: config.line,
    })),
  }));
}

type Ring = ReturnType<typeof buildRings>[number];

const TUMBLING_RINGS = buildRings(TUMBLING_RING_CONFIGS);

function SpinningRing({ ring }: { ring: Ring }) {
  const tiltRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const group = ringRef.current;
    if (group) group.rotation.y = time * ring.speed;

    const tilt = tiltRef.current;
    if (tilt) {
      tilt.rotation.x = ring.tilt[0] + time * ring.tumble[0];
      tilt.rotation.z = ring.tilt[2] + time * ring.tumble[1];
    }
  });

  return (
    <group ref={tiltRef} rotation={ring.tilt}>
      <group ref={ringRef}>
        {ring.panels.map((panel, i) => (
          <CompositionPanel
            key={i}
            panel={panel}
            angle={(i / ring.count) * Math.PI * 2}
            geometry={ring.geometry}
          />
        ))}
      </group>
    </group>
  );
}

function TumblingRingVisualization() {
  const scale = useSceneScale();

  return (
    <group position={[0, 0.05, 0]} scale={scale * 0.5}>
      {TUMBLING_RINGS.map((ring, i) => (
        <SpinningRing key={i} ring={ring} />
      ))}
    </group>
  );
}

// ─── Experimento: marquesinas ───────────────────────────────────────────────
// Prompt: "para la siguiente quiere que hagas marques de vayan de derecha a izquierda,
// esta es una nueva vizualizacion"
//
// Filas de paneles planos 16:9 que avanzan de derecha a izquierda en bucle, cada fila
// a su propia velocidad. Cada fila mide más que el ancho visible, así el salto de un
// panel del borde izquierdo al derecho ocurre fuera de cuadro.
const flatPanelGeometry = new THREE.PlaneGeometry(PANEL_WIDTH, PANEL_HEIGHT);
const MARQUEE_GAP = 0.25;
const MARQUEE_SPACING = PANEL_WIDTH + MARQUEE_GAP;
const MARQUEE_ROW_GAP = 0.2;

type MarqueeConfig = {
  count: number;
  speed: number;
  seed: number;
};

const MARQUEE_CONFIGS: MarqueeConfig[] = [
  { count: 10, speed: 0.55, seed: 101 },
  { count: 10, speed: 0.35, seed: 202 },
  { count: 10, speed: 0.75, seed: 303 },
  { count: 10, speed: 0.45, seed: 404 },
  { count: 10, speed: 0.65, seed: 505 },
  { count: 10, speed: 0.3, seed: 606 },
  { count: 10, speed: 0.5, seed: 707 },
  { count: 10, speed: 0.8, seed: 808 },
  { count: 10, speed: 0.4, seed: 99 },
  { count: 10, speed: 0.6, seed: 1010 },
  { count: 10, speed: 0.7, seed: 1111 },
  { count: 10, speed: 0.35, seed: 1212 },
  { count: 10, speed: 0.55, seed: 1313 },
  { count: 10, speed: 0.75, seed: 1414 },
];

const MARQUEES = MARQUEE_CONFIGS.map((config, rowIndex) => {
  const rowHeight = PANEL_HEIGHT + MARQUEE_ROW_GAP;
  return {
    ...config,
    y: ((MARQUEE_CONFIGS.length - 1) / 2 - rowIndex) * rowHeight,
    length: config.count * MARQUEE_SPACING,
    // Desfase para que las columnas de filas vecinas no queden alineadas.
    offset: rowIndex * MARQUEE_SPACING * 0.37,
    panels: buildPanels(config.count, config.seed, config.seed + 1, rowIndex),
  };
});

type Marquee = (typeof MARQUEES)[number];

function MarqueePanel({
  marquee,
  panel,
  index,
}: {
  marquee: Marquee;
  panel: Panel;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const travel = index * MARQUEE_SPACING + marquee.offset;
    group.position.x =
      THREE.MathUtils.euclideanModulo(
        travel - state.clock.elapsedTime * marquee.speed,
        marquee.length,
      ) -
      marquee.length / 2;
  });

  return (
    <group ref={groupRef} position-y={marquee.y}>
      <CompositionPanel
        panel={panel}
        angle={index * 0.7 + marquee.y}
        geometry={flatPanelGeometry}
        rotationY={0}
      />
    </group>
  );
}

function MarqueeVisualization() {
  return (
    <group>
      {MARQUEES.map((marquee, row) =>
        marquee.panels.map((panel, i) => (
          <MarqueePanel
            key={`${row}-${i}`}
            marquee={marquee}
            panel={panel}
            index={i}
          />
        )),
      )}
    </group>
  );
}

// ─── Experimento: marquesinas curvas ────────────────────────────────────────
// Prompt: "ahora quieron marquesinas que se curvan, esta es otra nueva vizualizacion"
// Prompt: "bien, pero me refieron que se curven en y como un liston"
//
// Prompt: "bien casi, pero quiero algo mas parecido a esto" (referencia: listones anchos
// tipo "Flying Text Animation" que cruzan el cuadro en diagonal y se enciman)
//
// Prompt: "bien agrega otras 3 y evita que se intersecten"
//
// Seis listones de color que cruzan en diagonal a distintas profundidades. Cada uno es
// una banda continua que ondula en Y y en Z, y los paneles viajan sobre ella de derecha
// a izquierda como el texto de la referencia. Los paneles usan el color de su banda de
// fondo, así solo se leen sus líneas y círculos encima del listón.
//
// El orden del arreglo es el orden de atrás hacia adelante. La Z de cada listón se
// calcula para que su onda en profundidad nunca alcance a la del vecino: pueden
// encimarse en pantalla, pero no atravesarse.
const RIBBON_BAND_HEIGHT = 1.15;
const RIBBON_PANEL_LIFT = 0.02;
const RIBBON_LAYER_MARGIN = 0.2;

const ribbonPanelGeometry = new THREE.PlaneGeometry(
  PANEL_WIDTH,
  PANEL_HEIGHT,
  32,
  1,
);

type RibbonConfig = {
  count: number;
  speed: number;
  seed: number;
  rotation: number;
  y: number;
  band: string;
  line: string;
  wave: RibbonWave;
};

const RIBBON_CONFIGS: RibbonConfig[] = [
  {
    count: 10,
    speed: 0.45,
    seed: 31,
    rotation: 0.42,
    y: -0.5,
    band: palette.paper,
    line: palette.primary2,
    wave: {
      amplitude: 0.6,
      frequency: 0.4,
      depth: 0.5,
      speed: 0.6,
      phase: 0,
    },
  },
  {
    count: 18,
    speed: 0.5,
    seed: 47,
    rotation: -0.35,
    y: 5,
    band: palette.primary1,
    line: palette.accent,
    wave: {
      amplitude: 1,
      frequency: 0.26,
      depth: 0.03,
      speed: 0.55,
      phase: 1.2,
    },
  },

  {
    count: 14,
    speed: 0.35,
    seed: 78,
    rotation: 0.3,
    y: -3.6,
    band: palette.accent,
    line: palette.primary1,
    wave: {
      amplitude: 0.8,
      frequency: 0.4,
      depth: 0.35,
      speed: 0.45,
      phase: 3.1,
    },
  },
  // {
  //   count: 14,
  //   speed: 0.55,
  //   seed: 85,
  //   rotation: -0.08,
  //   y: -1.55,
  //   band: palette.paper,
  //   line: palette.ink,
  //   wave: {
  //     amplitude: 0.75,
  //     frequency: 0.44,
  //     depth: 0.3,
  //     speed: 0.65,
  //     phase: 5.2,
  //   },
  // },
  {
    count: 9,
    speed: 0.64,
    seed: 93,
    rotation: 0.12,
    y: 2,
    band: palette.ink,
    line: palette.accent,
    wave: {
      amplitude: 0.5,
      frequency: 0.38,
      depth: 0.35,
      speed: 0.5,
      phase: 4,
    },
  },
  {
    count: 12,
    speed: 0.6,
    seed: 62,
    rotation: -0.22,
    y: 1.55,
    band: palette.primary2,
    line: palette.paper,
    wave: {
      amplitude: 0.4,
      frequency: 0.4,
      depth: 0.2,
      speed: 0.7,
      phase: 2.1,
    },
  },
];

function ribbonLayers(configs: RibbonConfig[]) {
  const layers: number[] = [];
  configs.forEach((config, i) => {
    if (i === 0) {
      layers.push(0);
      return;
    }
    const previous = configs[i - 1];
    layers.push(
      layers[i - 1] +
        previous.wave.depth +
        config.wave.depth +
        RIBBON_PANEL_LIFT +
        RIBBON_LAYER_MARGIN,
    );
  });
  const center = (layers[0] + layers[layers.length - 1]) / 2;
  return layers.map((z) => z - center);
}

const RIBBON_LAYERS = ribbonLayers(RIBBON_CONFIGS);

// Onda secundaria por listón, derivada de su seed: otra frecuencia, otra velocidad
// (a veces en sentido contrario) y otra fase, para que no ondulen todos al mismo ritmo.
// Se puede fijar a mano con `wave.wobble` en RIBBON_CONFIGS.
function ribbonWobble(wave: RibbonWave, seed: number): RibbonWobble {
  const random = mulberry32(seed * 7 + 3);
  const direction = random() < 0.5 ? -1 : 1;
  return {
    amount: 0.35 + random() * 0.4,
    frequency: wave.frequency * (1.7 + random() * 1.3),
    speed: wave.speed * direction * (0.4 + random() * 0.8),
    phase: random() * Math.PI * 2,
  };
}

const RIBBONS = RIBBON_CONFIGS.map((config, ribbonIndex) => {
  const length = config.count * MARQUEE_SPACING;
  return {
    ...config,
    wave: {
      ...config.wave,
      wobble: config.wave.wobble ?? ribbonWobble(config.wave, config.seed),
    },
    z: RIBBON_LAYERS[ribbonIndex],
    length,
    bandGeometry: new THREE.PlaneGeometry(length, RIBBON_BAND_HEIGHT, 256, 1),
    panels: buildPanels(
      config.count,
      config.seed,
      config.seed + 1,
      ribbonIndex,
    ).map((panel) => ({
      ...panel,
      background: config.band,
      line: config.line,
    })),
  };
});

type Ribbon = (typeof RIBBONS)[number];

function RibbonBand({ ribbon }: { ribbon: Ribbon }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(ribbon.band) },
      ...ribbonUniforms(ribbon.wave),
    }),
    [ribbon],
  );

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uWaveTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh geometry={ribbon.bandGeometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={ribbonVertexShader}
        fragmentShader={ribbonBandFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function RibbonPanel({
  ribbon,
  panel,
  index,
}: {
  ribbon: Ribbon;
  panel: Panel;
  index: number;
}) {
  const offset = useMemo(
    () => (time: number) =>
      THREE.MathUtils.euclideanModulo(
        index * MARQUEE_SPACING - time * ribbon.speed,
        ribbon.length,
      ) -
      ribbon.length / 2,
    [index, ribbon],
  );

  return (
    <group position-z={RIBBON_PANEL_LIFT}>
      <CompositionPanel
        panel={panel}
        angle={index * 0.7 + ribbon.seed}
        geometry={ribbonPanelGeometry}
        rotationY={0}
        ribbon={ribbon.wave}
        ribbonOffset={offset}
      />
    </group>
  );
}

function CurvedMarqueeVisualization() {
  return (
    <group>
      {RIBBONS.map((ribbon, r) => (
        <group
          key={r}
          position={[0, ribbon.y, ribbon.z]}
          rotation-z={ribbon.rotation}
        >
          <RibbonBand ribbon={ribbon} />
          {ribbon.panels.map((panel, i) => (
            <RibbonPanel key={i} ribbon={ribbon} panel={panel} index={i} />
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── Selector ───────────────────────────────────────────────────────────────
// Cambia ACTIVE_VISUALIZATION para ver otra versión; "produccion" es la final.
const VISUALIZATIONS = {
  produccion: ProductionVisualization,
  anillosTodosLosEjes: TumblingRingVisualization,
  marquesinas: MarqueeVisualization,
  marquesinasCurvas: CurvedMarqueeVisualization,
};

const ACTIVE_VISUALIZATION: keyof typeof VISUALIZATIONS = "produccion";
const ActiveVisualization = VISUALIZATIONS[ACTIVE_VISUALIZATION];

export function LenguajeAudiovisualScene() {
  return <ActiveVisualization />;
}
