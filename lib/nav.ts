let navigateTo: ((href: string) => void) | null = null;

export function setAppNavigate(fn: ((href: string) => void) | null) {
  navigateTo = fn;
}

export function appNavigate(href: string) {
  navigateTo?.(href);
}
