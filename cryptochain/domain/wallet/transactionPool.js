import Transaction from "./transaction.js";

class TransactionPool{
    constructor(){
        this.transactionMap={}
    }

    setTransaction(transaction){
        this.transactionMap[transaction.id]=transaction;
    }

    existingTransaction({inputAddress}){
        const transactions=Object.values(this.transactionMap);
        return transactions.find(val=> val.input.address===inputAddress);
    }

    setMap(transactionMap){
        this.transactionMap=transactionMap
    }

    validTransactions(){
        const transactions=Object.values(this.transactionMap);
        return transactions.filter((transaction)=>Transaction.ValidTransaction(transaction));
    }

    clear(){
        this.transactionMap={};
    }

    clearBlockChainTransaction({chain}){
        for(let i=0;i<chain.length;i++){
            const block=chain[i];
            for(let transaction of block.data){
                if(this.transactionMap[transaction.id]){
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
}

export default TransactionPool