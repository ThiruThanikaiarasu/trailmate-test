import express, { type Express } from 'express';
import { type Clock, systemClock } from './clock';
import type { Db } from './db/database';
import { createErrorHandler, notFoundHandler } from './middleware/errorHandler';
import { daysRouter } from './routes/days';
import { expensesRouter } from './routes/expenses';
import { gearRouter } from './routes/gear';
import { healthRouter } from './routes/health';
import { participantsRouter } from './routes/participants';
import { tripsRouter } from './routes/trips';
import { createServices } from './services';

export interface AppOptions {
  db: Db;
  clock?: Clock;
  log?: (message: string, error: unknown) => void;
}

export function createApp(options: AppOptions): Express {
  const clock = options.clock ?? systemClock;
  const services = createServices({ db: options.db, clock });

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));

  const api = express.Router();
  api.use(healthRouter(clock));
  api.use(tripsRouter(services));
  api.use(daysRouter(services));
  api.use(gearRouter(services));
  api.use(participantsRouter(services));
  api.use(expensesRouter(services));
  app.use('/api', api);

  app.use(notFoundHandler);
  app.use(createErrorHandler(options.log ?? ((message, error) => console.error(message, error))));
  return app;
}
