import { Router } from 'express';
import { idParam, validateBody } from '../middleware/validate';
import { createParticipantSchema } from '../schemas/participant';
import type { Services } from '../services';

export function participantsRouter({ participants }: Services): Router {
  const router = Router();

  router.get('/trips/:id/participants', (req, res) => {
    res.json(participants.list(idParam(req.params.id)));
  });

  router.post('/trips/:id/participants', validateBody(createParticipantSchema), (req, res) => {
    res.status(201).json(participants.add(idParam(req.params.id), req.body));
  });

  router.delete('/participants/:participantId', (req, res) => {
    participants.remove(idParam(req.params.participantId, 'participantId'));
    res.status(204).end();
  });

  return router;
}
