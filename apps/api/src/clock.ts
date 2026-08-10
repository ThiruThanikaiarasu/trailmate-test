import { randomBytes } from 'node:crypto';

/** Source of the current time. Injected so that expiry logic can be tested without waiting. */
export interface Clock {
  now(): Date;
}

export const systemClock: Clock = {
  now: () => new Date(),
};

export type TokenGenerator = () => string;

export const randomToken: TokenGenerator = () => randomBytes(18).toString('base64url');
