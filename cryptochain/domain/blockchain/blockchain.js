import Block from './block.js';
import cryptoHash from '../utils/crypto-hash.js';
import { MINING_REWARD, REWARD_INPUT } from '../../shared/config/blockchain-config.js';
import Transaction from '../wallet/transaction.js';
import Wallet from '../wallet/wallet.js';

class Blockchain{
    constructor(){
        this.chain=[Block.genesis()];
    }

    addBlock({data}){
        const newBlock=Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data,
        });
        this.chain.push(newBlock);
    }
    
    static isValidChain(chain){
        //check start with genesis
        Block.genesis();
        if(JSON.stringify(chain[0])!==JSON.stringify(Block.genesis())){
            return false;    
        }

        for(let i=1;i<chain.length;i++){
            const {lastHash,data,timestamp,hash,nonce,difficulty}=chain[i];
            const actualLastHash=chain[i-1].hash;
            const lastDifficulty=chain[i-1].difficulty;
            
            // 1. consist of right fields
            // 2. the lasthash of each block needs to actually reference the lastBlock hash
            if(actualLastHash!==lastHash) return false;
            
            // 3. the block hash needs to be valid.
            if(!(cryptoHash(lastHash,data,timestamp,nonce,difficulty)===hash)){ //some value is worng
                return false;
            }
            
            //difficulty shouldn't jump
            if(Math.abs(lastDifficulty-difficulty)>1) return false; 
        }
        return true;
    }

    replaceChain(newchain,validTransaction,onSuccess){
        /*
            Blockchain is able to replace its chain with a new chain of blocks as long as 
            1.the new chain is longer
            2.deems to be valid
        */
        // 1.the new chain is longer
        if(this.chain.length>newchain.length) {
            console.error("the incoming chain must be longer");
            return;
        };

        // 2.deems to be valid
        if(!Blockchain.isValidChain(newchain)){
            console.error("the incoming chain must be valid");
            return;
        };

        if(validTransaction && !this.validTransactionData({chain: newchain})){
            console.error("Invalid Transaction data");
            return;
        }

        if(onSuccess) onSuccess();
        console.log("replacing with the incoming chain",newchain);
        this.chain=newchain;
    }

    validTransactionData({chain}){
        //1
        for(let i=1;i<chain.length;i++){
            const block=chain[i];
            let rewardTransactionCount=0;
            let transactionSet=new Set();
            
            for(let transaction of block.data){
                if(transaction.input.address===REWARD_INPUT.address){
                    rewardTransactionCount++;
                    
                    if(rewardTransactionCount>1) {
                        console.error("Miner reward exceeds limit");
                        return false;
                    }

                    if(Object.values(transaction.outputMap)[0]!==MINING_REWARD){
                        console.error("Miner Reward amount is invalid");
                        return false;
                    }
                }
                else{
                    if(!Transaction.ValidTransaction(transaction)){
                        console.error("Invalid Transaction")
                        return false;
                    }
                    const trueBalance=Wallet.calculateBalance({chain: this.chain,address: transaction.input.address});
                    if(transaction.input.amount!==trueBalance){
                        console.error("Invalid input amount")
                        return false;
                    }
                    if(transactionSet.has(transaction)){
                        console.error("and an identical transaction appear more than once in a block");
                        return false;
                    }
                    else{
                        transactionSet.add(transaction);
                    }
                    

                }
            }
        }


        return true;
    }
}

export default Blockchain;
