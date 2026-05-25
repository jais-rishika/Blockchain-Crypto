
import { v4 as uuidv4 } from 'uuid';
import { verifySignature } from '../utils/elliptic.js';
import { MINING_REWARD, REWARD_INPUT } from '../../shared/config/blockchain-config.js';

class Transaction{
    constructor({senderWallet, recipient, amount, outputMap, input}){
        this.id=uuidv4(); //unique id

        //the amount details
        this.outputMap= outputMap || this.createOutputMap({senderWallet, recipient, amount});
        
        //the transaction details
        this.input= input || this.createInput({senderWallet,outputMap: this.outputMap});
    }

    createOutputMap({senderWallet, recipient, amount}){
        // who gets how much
        const outputMap={};
        outputMap[recipient]=amount; //amount to send
        outputMap[senderWallet.publicKey]=senderWallet.balance-amount; //balance left

        return outputMap;
    }

    createInput({senderWallet,outputMap}){
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    updateTransaction({senderWallet,recipient,amount}){
        if(amount> this.outputMap[senderWallet.publicKey]){
            throw new Error('Amount exceeds balance');
        }
        //if recipient does not exist
        if(!this.outputMap[recipient]){
            this.outputMap[recipient]=amount;
        }else{
            // recipient exists
            this.outputMap[recipient]=this.outputMap[recipient]+amount; 
        }

        this.outputMap[senderWallet.publicKey]=this.outputMap[senderWallet.publicKey]-amount;
        this.input= this.createInput({senderWallet,outputMap: this.outputMap});
    }

    static ValidTransaction(transaction){
        const {input : {amount,address,signature}, outputMap}=transaction;
        
        //senders balance
        const outputTotal= Object.values(outputMap).reduce((total,outputAmount)=> total+outputAmount);
        
        if(amount!=outputTotal){
            console.error(`Invalid transaction from ${address}`)
            return false;
        }

        if(!verifySignature({publicKey: address, data: outputMap, signature})){
            console.error(`Invalid signature from ${address}`);
            return false;
        }

        return true;
    }

    static rewardTransaction({minerWallet}){
        return new this({
            outputMap: {[minerWallet.publicKey]: MINING_REWARD},
            input: REWARD_INPUT
        })
    }
}

export default Transaction;