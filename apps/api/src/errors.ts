export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const notFound = (what: string): HttpError => new HttpError(404, 'NOT_FOUND', `${what} not found`);

export const conflict = (code: string, message: string): HttpError => new HttpError(409, code, message);

export const gone = (code: string, message: string): HttpError => new HttpError(410, code, message);
