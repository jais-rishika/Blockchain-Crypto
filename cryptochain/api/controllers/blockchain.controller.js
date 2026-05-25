// src/api/controllers/blockchain.controller.js
import { BlockchainResponseDto, MineBlockRequestDto } from '../dtos/blockchain.dto.js';

export const blockchainController = ({ blockchain, pubsub }) => ({
  getChain(req, res) {
    return res.json(BlockchainResponseDto(blockchain.chain));
  },

  mineBlock(req, res) {
    const { data } = MineBlockRequestDto(req.body);

    blockchain.addBlock({ data });
    pubsub.broadcastBlockChain();

    return res.redirect('/api/block');
  }
});