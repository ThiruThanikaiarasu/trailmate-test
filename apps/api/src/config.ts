export interface AppConfig {
  port: number;
  databaseFile: string;
  publicBaseUrl: string;
  defaultShareTtlHours: number;
}

function intFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer, got "${raw}"`);
  }
  return value;
}

export function loadConfig(): AppConfig {
  return {
    port: intFromEnv('PORT', 4000),
    databaseFile: process.env.DATABASE_FILE ?? 'trailmate.db',
    publicBaseUrl: (process.env.PUBLIC_BASE_URL ?? 'http://localhost:5173').replace(/\/$/, ''),
    defaultShareTtlHours: intFromEnv('SHARE_TTL_HOURS', 72),
  };
}
