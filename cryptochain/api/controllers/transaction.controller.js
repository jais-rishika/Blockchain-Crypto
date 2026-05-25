// src/api/controllers/transaction.controller.js
import {
  TransactRequestDto,
  TransactionPoolMapResponseDto,
  TransactionResponseDto
} from '../dtos/transaction.dto.js';
import { SuccessResponseDto } from '../dtos/common.dto.js';

export const transactionController = ({ blockchain, transactionPool, pubsub, wallet }) => ({
  transact(req, res) {
    const { amount, recipient } = TransactRequestDto(req.body);

    let transaction = transactionPool.existingTransaction({
      inputAddress: wallet.publicKey
    });

    if (transaction) {
      transaction.updateTransaction({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        amount,
        recipient,
        chain: blockchain.chain
      });
    }

    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);

    return res.json(
      SuccessResponseDto({ data: TransactionResponseDto(transaction) })
    );
  },

  getPoolMap(req, res) {
    return res.json(
      SuccessResponseDto({
        data: TransactionPoolMapResponseDto(transactionPool.transactionMap)
      })
    );
  }
});