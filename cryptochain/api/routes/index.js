// src/api/routes/index.js
import { Router } from 'express';
import { blockchainRoutes } from './blockchain.routes.js';
import { transactionRoutes } from './transaction.routes.js';
import { walletRoutes } from './wallet.routes.js';
import { miningRoutes } from './mining.routes.js';

export const apiRoutes = (ctx) => {
  const router = Router();

  router.use('/api', blockchainRoutes(ctx));
  router.use('/api', transactionRoutes(ctx));
  router.use('/api', walletRoutes(ctx));
  router.use('/api', miningRoutes(ctx));

  return router;
};
``