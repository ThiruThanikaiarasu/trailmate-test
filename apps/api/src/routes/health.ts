import { Router } from 'express';
import type { Clock } from '../clock';

export function healthRouter(clock: Clock): Router {
  const router = Router();
  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', time: clock.now().toISOString() });
  });
  return router;
}
