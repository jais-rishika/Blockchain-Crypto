const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

//basic building block of blockchain
class Block{
    constructor({timestamp,lastHash,hash,data}){ // helps not having direct order
        this.timestamp=timestamp;
        this.lastHash=lastHash;
        this.hash=hash;
        this.data=data;
    }

    static genesis=()=>{
        return new this(GENESIS_DATA);
    }
    static mineBlock=({lastBlock,data})=>{
        const lastHash=lastBlock.hash;
        const timestamp=Date.now();
        return new Block({
            lastHash,
            timestamp,
            data,
            hash: cryptoHash(lastHash,timestamp,data)
        });
    }
}

module.exports= Block;

