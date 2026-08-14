import { Router } from 'express';
import { idParam, validateBody } from '../middleware/validate';
import { createDaySchema, createWaypointSchema, updateDaySchema } from '../schemas/day';
import type { Services } from '../services';

export function daysRouter({ itinerary }: Services): Router {
  const router = Router();

  router.get('/trips/:id/days', (req, res) => {
    res.json(itinerary.listDays(idParam(req.params.id)));
  });

  router.post('/trips/:id/days', validateBody(createDaySchema), (req, res) => {
    res.status(201).json(itinerary.addDay(idParam(req.params.id), req.body));
  });

  router.get('/days/:dayId', (req, res) => {
    res.json(itinerary.getDay(idParam(req.params.dayId, 'dayId')));
  });

  router.patch('/days/:dayId', validateBody(updateDaySchema), (req, res) => {
    res.json(itinerary.updateDay(idParam(req.params.dayId, 'dayId'), req.body));
  });

  router.delete('/days/:dayId', (req, res) => {
    itinerary.removeDay(idParam(req.params.dayId, 'dayId'));
    res.status(204).end();
  });

  router.post('/days/:dayId/waypoints', validateBody(createWaypointSchema), (req, res) => {
    res.status(201).json(itinerary.addWaypoint(idParam(req.params.dayId, 'dayId'), req.body));
  });

  router.delete('/days/:dayId/waypoints/:waypointId', (req, res) => {
    res.json(
      itinerary.removeWaypoint(idParam(req.params.dayId, 'dayId'), idParam(req.params.waypointId, 'waypointId')),
    );
  });

  return router;
}
