import { randomBytes } from 'node:crypto';

/** Source of the current time. Injected so that expiry logic can be tested without waiting. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now: () => new Date(),
};

/** Whole seconds since the Unix epoch, for compact integer timestamps in the database. */
export const epochSeconds = (clock: Clock): number => Math.floor(clock.now().getTime() / 1000);

export type TokenGenerator = () => string;

export const randomToken: TokenGenerator = () => randomBytes(18).toString('base64url');
