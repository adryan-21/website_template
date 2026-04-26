const truthyValues = new Set(['1', 'true', 'yes', 'on']);
const falsyValues = new Set(['0', 'false', 'no', 'off']);

const getFirstDefinedValue = (keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = process.env[key];

    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
};

export const envString = (keys: string[], fallback?: string): string | undefined => {
  return getFirstDefinedValue(keys) ?? fallback;
};

export const envInt = (keys: string[], fallback: number): number => {
  const value = getFirstDefinedValue(keys);

  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? fallback : parsed;
};

export const envBool = (keys: string[], fallback = false): boolean => {
  const value = getFirstDefinedValue(keys);

  if (!value) {
    return fallback;
  }

  const normalized = value.toLowerCase();

  if (truthyValues.has(normalized)) {
    return true;
  }

  if (falsyValues.has(normalized)) {
    return false;
  }

  return fallback;
};

export const envArray = (keys: string[], fallback: string[] = []): string[] => {
  const value = getFirstDefinedValue(keys);

  if (!value) {
    return fallback;
  }

  const parsed = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : fallback;
};