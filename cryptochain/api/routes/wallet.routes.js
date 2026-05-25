import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const walletRoutes = (ctx) => {
  const router = Router();
  const controller = ctx.controllers.wallet;

  router.get('/wallet-info', asyncHandler(controller.walletInfo));

  return router;
};