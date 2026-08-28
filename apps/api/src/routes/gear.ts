import { Router } from 'express';
import { idParam, validateBody } from '../middleware/validate';
import { createGearItemSchema, updateGearItemSchema } from '../schemas/gear';
import type { Services } from '../services';

export function gearRouter({ gear }: Services): Router {
  const router = Router();

  router.get('/trips/:id/gear', (req, res) => {
    res.json(gear.list(idParam(req.params.id)));
  });

  router.get('/trips/:id/gear/weight', (req, res) => {
    res.json({ totalGrams: gear.packWeightGrams(idParam(req.params.id)) });
  });

  router.post('/trips/:id/gear', validateBody(createGearItemSchema), (req, res) => {
    res.status(201).json(gear.add(idParam(req.params.id), req.body));
  });

  router.patch('/gear/:gearId', validateBody(updateGearItemSchema), (req, res) => {
    res.json(gear.update(idParam(req.params.gearId, 'gearId'), req.body));
  });

  router.delete('/gear/:gearId', (req, res) => {
    gear.remove(idParam(req.params.gearId, 'gearId'));
    res.status(204).end();
  });

  return router;
}
