import { STARTING_BALANCE } from "../../shared/config/blockchain-config.js";
import {EC} from "../utils/elliptic.js";
import cryptoHash from "../utils/crypto-hash.js";
import Transaction from "./transaction.js";

class Wallet{
    constructor(){
        this.balance=STARTING_BALANCE;

        //the asymmetric keys
        this.keyPair=EC.genKeyPair();
        this.publicKey=this.keyPair.getPublic().encode('hex');
    }

    //signing the data it utilizes the private key
    sign(data){
        return this.keyPair.sign(cryptoHash(data))
    }

    
    createTransaction({amount,recipient,chain}){
        if(chain){
            this.balance=Wallet.calculateBalance({
                chain,
                address: this.publicKey
            })
        }

        if(amount>this.balance){
            throw new Error('Amount exceeds balance');
        }

        return new Transaction({senderWallet: this,recipient,amount});
    }

    static calculateBalance({chain,address}){
        let ouputsTotal=0; //// total amount credited from all scanned transactions
        let hasConductesTransaction=false;
        for(let i=chain.length-1;i>0;i--){
            const block=chain[i];
            
            //for each transaction in the block
            for(let transaction of block.data){ 
                if(transaction.input.address===address){
                    hasConductesTransaction=true;
                }
                //check if recipient is our address then credit
                const addressOutput=transaction.outputMap[address]; 
                
                if(addressOutput){
                    ouputsTotal+=addressOutput; 
                }
            }

            if(hasConductesTransaction) break;
        }

        return hasConductesTransaction?ouputsTotal:STARTING_BALANCE+ouputsTotal;
    }
}

export default Wallet;