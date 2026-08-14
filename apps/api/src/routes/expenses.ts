import { Router } from 'express';
import { idParam, validateBody } from '../middleware/validate';
import { createExpenseSchema } from '../schemas/expense';
import type { Services } from '../services';

export function expensesRouter({ expenses }: Services): Router {
  const router = Router();

  router.get('/trips/:id/expenses', (req, res) => {
    res.json(expenses.list(idParam(req.params.id)));
  });

  router.post('/trips/:id/expenses', validateBody(createExpenseSchema), (req, res) => {
    res.status(201).json(expenses.add(idParam(req.params.id), req.body));
  });

  router.delete('/trips/:id/expenses/:expenseId', (req, res) => {
    expenses.remove(idParam(req.params.id), idParam(req.params.expenseId, 'expenseId'));
    res.status(204).end();
  });

  router.get('/trips/:id/cost-split', (req, res) => {
    res.json(expenses.costSplit(idParam(req.params.id)));
  });

  return router;
}
