// src/api/routes/transaction.routes.js
import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validateBody } from '../middlewares/validate.js';

export const transactionRoutes = (ctx) => {
  const router = Router();
  const controller = ctx.controllers.transaction;

  router.post('/transact', validateBody(['amount', 'recipient']), asyncHandler(controller.transact));
  router.get('/transaction-pool-map', asyncHandler(controller.getPoolMap));

  return router;
};