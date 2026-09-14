import { Router } from 'express';
import { idParam, validateBody } from '../middleware/validate';
import { createShareLinkSchema } from '../schemas/share';
import type { Services } from '../services';

export function shareRouter({ share }: Services): Router {
  const router = Router();

  router.post('/trips/:id/share', validateBody(createShareLinkSchema), (req, res) => {
    res.status(201).json(share.create(idParam(req.params.id), req.body.ttlHours));
  });

  router.delete('/trips/:id/share', (req, res) => {
    res.json({ revoked: share.revokeAll(idParam(req.params.id)) });
  });

  router.get('/share/:token', (req, res) => {
    res.json(share.resolve(req.params.token));
  });

  return router;
}
