// application/container.js
import Blockchain from '../domain/blockchain/blockchain.js';
import TransactionPool from '../domain/wallet/transactionPool.js';
import Wallet from '../domain/wallet/wallet.js';
import TransactionMiner from './transaction-miner.js';
import Pubsub from '../services/pubsub.service.js';

import { blockchainController } from '../api/controllers/blockchain.controller.js';
import { transactionController } from '../api/controllers/transaction.controller.js';
import { walletController } from '../api/controllers/wallet.controller.js';
import { miningController } from '../api/controllers/mining.controller.js';


export const createContainer = () => {
  const blockchain = new Blockchain();
  const transactionPool = new TransactionPool();
  const wallet = new Wallet();

  const pubsub = new Pubsub({ blockchain, transactionPool });

  const transactionMiner = new TransactionMiner({
    blockchain,
    transactionPool,
    pubsub,
    wallet
  });

  const controllers = {
    blockchain: blockchainController({ blockchain, pubsub }),
    transaction: transactionController({ blockchain, transactionPool, pubsub, wallet }),
    wallet: walletController({ blockchain, wallet }),
    mining: miningController({ transactionMiner })
  };

  return { blockchain, transactionPool, wallet, pubsub, transactionMiner, controllers };
};