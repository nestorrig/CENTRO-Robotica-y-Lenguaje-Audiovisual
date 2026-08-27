export type Vec3 = [number, number, number];

export type PrimitiveType = "box" | "disc" | "pyramid" | "sphere" | "torus";

export type SceneObject = {
  id: string;
  type: PrimitiveType;
  position: Vec3;
  rotation: Vec3;
  scale: number | Vec3;
  spin?: number;
  float?: number;
};

export type EntryScene = {
  id: string;
  objects: SceneObject[];
};

const home: EntryScene = {
  id: "home",
  objects: [
    {
      id: "home-cube",
      type: "box",
      position: [0.2, -2.8, 0.2],
      rotation: [0.4, 0.8, 0.1],
      scale: 0.9,
      spin: 0.08,
    },
    {
      id: "home-disc",
      type: "disc",
      position: [2.4, -3.2, -0.8],
      rotation: [1.1, 0.2, 0.3],
      scale: 1.1,
      spin: 0.05,
    },
  ],
};

const laboratorio: EntryScene = {
  id: "concepto-idea-solucion",
  objects: [
    {
      id: "lab-cube",
      type: "box",
      position: [-1.75, -0.05, 0.15],
      rotation: [0.35, 0.7, 0.12],
      scale: 1,
      spin: 0.1,
      float: 0.12,
    },
    {
      id: "lab-disc",
      type: "disc",
      position: [1.55, -0.4, -0.35],
      rotation: [1.05, 0.15, 0.2],
      scale: 1.15,
      spin: 0.06,
      float: 0.08,
    },
    {
      id: "lab-pyramid",
      type: "pyramid",
      position: [0.4, 1.2, -0.75],
      rotation: [-0.15, 0.45, 0.1],
      scale: 1,
      spin: 0.12,
      float: 0.1,
    },
  ],
};

const cuerpo: EntryScene = {
  id: "el-robot-como-cuerpo",
  objects: [
    {
      id: "cuerpo-base",
      type: "box",
      position: [0, -0.85, 0],
      rotation: [0.1, 0.2, 0],
      scale: [1.6, 0.35, 1.1],
      spin: 0.04,
    },
    {
      id: "cuerpo-torso",
      type: "box",
      position: [0, 0.15, 0],
      rotation: [0.05, 0.4, 0.05],
      scale: [0.9, 1.1, 0.7],
      spin: 0.07,
      float: 0.06,
    },
    {
      id: "cuerpo-cabeza",
      type: "pyramid",
      position: [0.1, 1.35, -0.2],
      rotation: [0.2, 0.6, 0],
      scale: 0.7,
      spin: 0.14,
      float: 0.14,
    },
  ],
};

const vision: EntryScene = {
  id: "lenguaje-audiovisual",
  objects: [
    {
      id: "vision-lens",
      type: "torus",
      position: [0.1, 0.15, 0.2],
      rotation: [0.2, 0.1, 0.4],
      scale: 1.2,
      spin: 0.16,
      float: 0.08,
    },
    {
      id: "vision-disc",
      type: "disc",
      position: [1.7, -0.5, -0.4],
      rotation: [1.2, 0.2, 0],
      scale: 0.95,
      spin: 0.05,
    },
    {
      id: "vision-sphere",
      type: "sphere",
      position: [-1.6, 0.55, -0.6],
      rotation: [0, 0, 0],
      scale: 0.55,
      float: 0.18,
    },
  ],
};

const ritmo: EntryScene = {
  id: "verdad-no-verdad",
  objects: [
    {
      id: "ritmo-a",
      type: "box",
      position: [-1.8, 0.2, 0],
      rotation: [0.3, 0.5, 0],
      scale: 0.7,
      spin: 0.2,
      float: 0.16,
    },
    {
      id: "ritmo-b",
      type: "box",
      position: [0, 0.6, -0.2],
      rotation: [0.2, 0.8, 0.1],
      scale: 0.55,
      spin: 0.28,
      float: 0.22,
    },
    {
      id: "ritmo-c",
      type: "box",
      position: [1.7, -0.15, 0.1],
      rotation: [0.4, 0.2, 0.2],
      scale: 0.85,
      spin: 0.14,
      float: 0.12,
    },
    {
      id: "ritmo-disc",
      type: "disc",
      position: [0.2, -1.1, -0.5],
      rotation: [1.1, 0, 0.2],
      scale: 1.3,
      spin: 0.04,
    },
  ],
};

const montaje: EntryScene = {
  id: "montaje-y-autonomia",
  objects: [
    {
      id: "montaje-cube",
      type: "box",
      position: [-1.2, 0.4, 0.2],
      rotation: [0.5, -0.4, 0.1],
      scale: 0.85,
      spin: 0.09,
      float: 0.1,
    },
    {
      id: "montaje-pyramid",
      type: "pyramid",
      position: [1.4, 0.2, -0.3],
      rotation: [0.2, 0.9, -0.2],
      scale: 1.05,
      spin: 0.11,
      float: 0.09,
    },
    {
      id: "montaje-sphere",
      type: "sphere",
      position: [0.1, -0.9, -0.2],
      rotation: [0, 0, 0],
      scale: 0.7,
      float: 0.2,
    },
    {
      id: "montaje-torus",
      type: "torus",
      position: [0.15, 1.25, -0.8],
      rotation: [0.8, 0.2, 0],
      scale: 0.65,
      spin: 0.18,
    },
  ],
};

const soon: EntryScene = {
  id: "soon",
  objects: [
    {
      id: "soon-disc",
      type: "disc",
      position: [-2.1, 0.4, -0.3],
      rotation: [0.9, -0.2, 0.1],
      scale: 1.05,
      spin: 0.07,
    },
    {
      id: "soon-pyramid",
      type: "pyramid",
      position: [2.0, 0.1, -0.5],
      rotation: [0.3, 0.7, 0.2],
      scale: 0.95,
      spin: 0.1,
    },
    {
      id: "soon-cube",
      type: "box",
      position: [0.1, -1.15, 0],
      rotation: [0.2, 0.5, 0.3],
      scale: 0.8,
      spin: 0.06,
    },
  ],
};

const byId: Record<string, EntryScene> = {
  [home.id]: home,
  [laboratorio.id]: laboratorio,
  [cuerpo.id]: cuerpo,
  [vision.id]: vision,
  [ritmo.id]: ritmo,
  [montaje.id]: montaje,
  [soon.id]: soon,
};

const fallback: EntryScene = {
  id: "fallback",
  objects: [
    {
      id: "fallback-cube",
      type: "box",
      position: [0, 0, 0],
      rotation: [0.3, 0.4, 0],
      scale: 1,
      spin: 0.1,
    },
  ],
};

export function getScene(id: string): EntryScene {
  return byId[id] ?? { ...fallback, id };
}

export function getJourneyScenes(slugs: string[]): EntryScene[] {
  return [home, ...slugs.map((slug) => getScene(slug)), soon];
}
