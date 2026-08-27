type Listener = () => void;

function store(initial = 0) {
  let value = initial;
  const listeners = new Set<Listener>();

  return {
    set(next: number) {
      if (Math.abs(next - value) < 0.0004) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    get() {
      return value;
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export const journeyOffset = store(0);
export const detailScroll = store(0);

export function journeyPageCount(entradaCount: number) {
  return 1 + entradaCount + 1;
}
