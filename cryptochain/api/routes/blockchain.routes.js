// src/api/routes/blockchain.routes.js
import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validateBody } from '../middlewares/validate.js';

export const blockchainRoutes = (ctx) => {
  const router = Router();
  const controller = ctx.controllers.blockchain;

  router.get('/block', asyncHandler(controller.getChain));
  router.post('/mine', validateBody(['data']), asyncHandler(controller.mineBlock));

  return router;
};