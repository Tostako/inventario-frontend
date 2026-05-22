type ClassValue = string | undefined | null | false | Record<string, boolean>;

export function cn(...args: ClassValue[]): string {
  return args.map((arg) => {
    if (typeof arg === 'string') return arg;
    if (!arg) return '';
    return Object.entries(arg)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(' ');
  }).filter(Boolean).join(' ');
}
