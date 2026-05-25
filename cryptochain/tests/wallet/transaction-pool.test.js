import TransactionPool from "../../domain/wallet/transactionPool.js";
import Wallet from "../../domain/wallet/wallet.js";
import Blockchain from "../../domain/blockchain/blockchain.js";
import Transaction from "../../domain/wallet/transaction.js";
import { describe, jest } from '@jest/globals';

describe("TransactionPool",()=>{
    let transactionPool, transaction, senderWallet;
    beforeEach(()=>{
        transactionPool= new TransactionPool();
        senderWallet=new Wallet();
        transaction=new Transaction({senderWallet,recipient:'fake-recipient',amount: 50});
    })

    it('has a `transactionMap`',()=>{
        expect(transactionPool).toHaveProperty('transactionMap');
    })

    it('adds a transaction to the pool',()=>{
        transactionPool.setTransaction(transaction);
        expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    })

    describe('existingTransaction()',()=>{
        it('returns an existing address given an input address',()=>{
            transactionPool.setTransaction(transaction);
            expect(transactionPool.existingTransaction({inputAddress: senderWallet.publicKey})).toBe(transaction)
        })
    });

    describe("validTransactions()",()=>{
        let validTransactions,errorMock;
        beforeEach(()=>{
            validTransactions=[];
            
            errorMock=jest.fn();
            global.console.error=errorMock;
            
            for(let i=0;i<10;i++){
                transaction=new Transaction({
                    senderWallet,
                    recipient: 'any-recipient',
                    amount: 30
                });

                if(i%3===0){
                    transaction.input.amount=99999;
                }else if(i%3===1){
                    transaction.input.signature= new Wallet().sign('foo')
                }else{
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            }
        });

        it('returns only valid transactions from transaction pool',()=>{
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it('logs error for the invalid transaction',()=>{
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        })
    });

    describe("clear()",()=>{
        it('clears the transaction pool',()=>{
            transactionPool.clear();
            expect(transactionPool.transactionMap).toEqual({});
        })
    });

    describe("clearBlockChainTransaction()",()=>{
        it('clears the pool of any existing blockchain transaction',()=>{
            const blockchain=new Blockchain();
            let expectedTransaction={};
            for(let i=0;i<6;i++){
                const transaction=new Wallet().createTransaction({recipient: 'foo',amount:5});
                transactionPool.setTransaction(transaction);

                if(i%2==0){
                    blockchain.addBlock({data: [transaction]})
                }else{
                    expectedTransaction[transaction.id]=transaction;
                }
            }
            transactionPool.clearBlockChainTransaction({chain: blockchain.chain});
            expect(transactionPool.transactionMap).toEqual(expectedTransaction);
        })
    });
})