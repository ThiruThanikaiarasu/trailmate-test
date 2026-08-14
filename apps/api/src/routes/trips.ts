import { Router } from 'express';
import { idParam, validateBody } from '../middleware/validate';
import { createTripSchema, updateTripSchema } from '../schemas/trip';
import type { Services } from '../services';

export function tripsRouter({ trips }: Services): Router {
  const router = Router();

  router.get('/trips', (_req, res) => {
    res.json(trips.list());
  });

  router.post('/trips', validateBody(createTripSchema), (req, res) => {
    res.status(201).json(trips.create(req.body));
  });

  router.get('/trips/:id', (req, res) => {
    res.json(trips.get(idParam(req.params.id)));
  });

  router.patch('/trips/:id', validateBody(updateTripSchema), (req, res) => {
    res.json(trips.update(idParam(req.params.id), req.body));
  });

  router.delete('/trips/:id', (req, res) => {
    trips.remove(idParam(req.params.id));
    res.status(204).end();
  });

  return router;
}
