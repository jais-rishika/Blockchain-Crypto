// import 'dotenv/config';
// import express from 'express';
// import bodyParser from 'body-parser';

// import { syncWithRootState } from './services/sync.service.js';
// import Blockchain from './domain/blockchain/blockchain.js';
// import Pubsub from './services/pubsub.service.js';
// import TransactionPool from './domain/wallet/transactionPool.js';

// const app=express();
// const blockchain=new Blockchain();
// const transactionPool =new TransactionPool();
// const pubsub=new Pubsub({blockchain,transactionPool});

// (async () => {
//   await pubsub.connect();
// })();

// app.use(bodyParser.json());

// const DEFAULT_PORT=3000;
// let PEER_PORT;

// if(process.env.GENERATE_PEER_PORT==='true'){
//     PEER_PORT=DEFAULT_PORT+Math.ceil(Math.random()*1000);
// }
// const PORT=PEER_PORT || DEFAULT_PORT;
// app.listen(PORT,()=>{
//     console.log(`The port is listening at ${PORT}`)
//     if(PORT!==DEFAULT_PORT){
//         syncWithRootState();
//     }
// });


// index.js
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

import { createContainer } from './application/container.js';
import { apiRoutes } from './api/routes/index.js';
import { errorHandler } from './api/middlewares/errorHandler.js';
import Pubsub from './services/pubsub.service.js';

// optional: if you already created this service
import { syncWithRootState } from './services/sync.service.js';

const DEFAULT_PORT = 3000;

const getPeerPort = () => {
  if (process.env.GENERATE_PEER_PORT === 'true') {
    return DEFAULT_PORT + Math.ceil(Math.random() * 1000);
  }
  return null;
};

const startServer = async () => {
  // 1) Build dependencies (includes controllers)
  const ctx = createContainer();

  // 2) Connect pubsub (your redis pubsub)
  (async () => {
        await ctx.pubsub.connect();
  })();

  // 3) Express app
  const app = express();
  app.use(bodyParser.json());

  // 4) Mount routes (routes -> controllers -> domain logic)
  app.use(apiRoutes(ctx));

  // 5) Error handler LAST
  app.use(errorHandler);

  // 6) Start server
  const PEER_PORT = getPeerPort();
  const PORT = PEER_PORT || DEFAULT_PORT;

  app.listen(PORT, async () => {
    console.log(`The port is listening at ${PORT}`);

    // 7) Peer sync (if peer)
    if (PORT !== DEFAULT_PORT && typeof syncWithRootState === 'function') {
      await syncWithRootState({
        blockchain: ctx.blockchain,
        transactionPool: ctx.transactionPool
      });
    }
  });
};

startServer();