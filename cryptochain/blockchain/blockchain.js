import Block from './block.js';
import cryptoHash from '../utils/crypto-hash.js';

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

    replaceChain(newchain){
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

        console.log("replacing with the incoming chain",newchain);
        this.chain=newchain;
    }
}

export default Blockchain;
