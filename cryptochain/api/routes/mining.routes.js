// src/api/routes/mining.routes.js
import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const miningRoutes = (ctx) => {
  const router = Router();
  const controller = ctx.controllers.mining;

  router.get('/mine-transactions', asyncHandler(controller.mineTransactions));

  return router;
};