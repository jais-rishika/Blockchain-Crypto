import Transaction from "../domain/wallet/transaction.js";

class TransactionMiner{
    constructor({blockchain, transactionPool,pubsub,wallet}){
        this.blockchain=blockchain;
        this.transactionPool=transactionPool;
        this.pubsub=pubsub;
        this.wallet=wallet;
    }

    mineTransaction(){
        //  get transaction's pool valid transaction
        const validTransactions=this.transactionPool.validTransactions();
        //  get miners reward
        validTransactions.push(Transaction.rewardTransaction({minerWallet: this.wallet}));
        //  add a block consisting of these transaction in blockchain
        this.blockchain.addBlock({data: validTransactions});
        //  broadcast the blockchain
        this.pubsub.broadcastBlockChain();
        //  clear the pool
        this.transactionPool.clearBlockChainTransaction({chain: this.blockchain.chain});
    }

}

export default TransactionMiner;