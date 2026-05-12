const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain{
    constructor(){
        this.chain=[Block.genesis()];
    }

    addBlock({data}){
        const newBlock=Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
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
            const {lastHash,data,timestamp,hash}=chain[i];
            const actualLastHash=chain[i-1].hash;
            if(actualLastHash!==lastHash) return false;
            if(!(cryptoHash(lastHash,data,timestamp)===hash)){
                return false;
            }
        }
        return true;
    }

    replaceChain(newchain){
        if(this.chain.length>newchain.length) {
            console.error("the incoming chain must be longer");
            return;
        };
        if(!Blockchain.isValidChain(newchain)){
            console.error("the incoming chain must be valid");
            return;
        };
        console.log("replacing with the incoming chain",newchain);
        this.chain=newchain;
    }
}
module.exports=Blockchain;