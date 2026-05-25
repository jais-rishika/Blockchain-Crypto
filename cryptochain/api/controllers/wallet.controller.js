// src/api/controllers/wallet.controller.js
import Wallet from '../../domain/wallet/wallet.js';
import { WalletInfoResponseDto } from '../dtos/wallet.dto.js';

export const walletController = ({ blockchain, wallet }) => ({
  walletInfo(req, res) {
    const address = wallet.publicKey;

    const balance = Wallet.calculateBalance({
      chain: blockchain.chain,
      address
    });

    return res.json(WalletInfoResponseDto({ address, balance }));
  }
});