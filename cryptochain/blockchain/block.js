const { GENESIS_DATA , MINE_RATE} = require("../blockchain/blockchain-config");
const cryptoHash = require("../utils/crypto/crypto-hash");
const HexToBinary=require('hex-to-binary')

//basic building block of blockchain
class Block{
    constructor({timestamp,lastHash,hash,nonce, difficulty,data}){ // helps not having direct order
        this.timestamp=timestamp;
        this.lastHash=lastHash;
        this.hash=hash;
        this.data=data;
        
        //Implemented the proof of work system by adding a difficulty and nonce value to each block.
        this.nonce=nonce;
        this.difficulty=difficulty;
    }

    static genesis=()=>{
        return new this(GENESIS_DATA);
    }

    static mineBlock=({lastBlock,data})=>{
        let hash,timestamp;
        const lastHash=lastBlock.hash;
        let {difficulty}=lastBlock;
        let nonce=0;
        
        //get the currect nonce according to the difficulty
        do{
            nonce++;
            timestamp=timestamp=Date.now();
            difficulty=Block.adjustDifficulty({orignalBlock: lastBlock,timestamp});
            hash=cryptoHash(lastHash,timestamp,nonce,difficulty,data);
        }while(HexToBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty)); //the jump is high in hex thats why using binary
        
        return new Block({lastHash,timestamp,data,nonce,difficulty,hash});
    }
    static adjustDifficulty({orignalBlock,timestamp}){
        const {difficulty}=orignalBlock;
        
        // should not go below 1 for security reasons
        if(difficulty<1) return 1;
        
        // Manage difficulty according to the MINE_RATE
        if((timestamp-orignalBlock.timestamp)>MINE_RATE) return difficulty-1;
        return difficulty+1; 
    }
}

module.exports= Block;

