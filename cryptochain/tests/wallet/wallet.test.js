import {beforeEach, describe, expect, jest} from "@jest/globals";
import { STARTING_BALANCE } from "../../shared/config/blockchain-config.js";
import Blockchain from "../../domain/blockchain/blockchain.js";
import { verifySignature } from "../../domain/utils/elliptic.js";
import Transaction from "../../domain/wallet/transaction.js";
import Wallet from "../../domain/wallet/wallet.js";

describe('Wallet',()=>{
    let wallet;
    beforeEach(()=>{
        wallet=new Wallet();
    })
    it('has a `balance` property',()=>{
        expect(wallet).toHaveProperty('balance');
    });
    it('has a `publicKey` property',()=>{
        expect(wallet).toHaveProperty('publicKey')
    });

    describe('signing data',()=>{
        const data='foo-bar';
        it('verifies a signature',()=>{
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })).toBe(true);
        });

        it('does not verify an invalid signature ',()=>{
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: new Wallet().sign(data)
            })).toBe(false);
        });
    })

    describe('createTransaction()',()=>{
        describe('and the amount exceeds the balance',()=>{
            it('throws an error',()=>{
                expect(()=>wallet.createTransaction({amount: 99999,recipient:'foo-recipient'}))
                .toThrow('Amount exceeds balance')
            });
        });
        
        describe('and the amount is valid',()=>{
            let transaction,amount,recipient;
            beforeEach(()=>{
                amount= 50;
                recipient='foo-recipient';
                transaction=wallet.createTransaction({amount,recipient})
            })
            it('creates an instance of the `transaction` class',()=>{
                expect(transaction instanceof Transaction).toBe(true);
            });
            it('matches the transaction input with the wallet',()=>{
                expect(transaction.input.address).toEqual(wallet.publicKey)
            });
            it('output the amount to the recipient',()=>{
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });

        describe('and a chain is passed',()=>{
            it('calls wallet.calculateBalance',()=>{
                const calculateBalanceMock=jest.fn();
                const orignalCalculateBalance=Wallet.calculateBalance;
                Wallet.calculateBalance=calculateBalanceMock;

                wallet.createTransaction({
                    recipient: 'foo',
                    amount: 10,
                    chain: new Blockchain()
                });

                expect(calculateBalanceMock).toHaveBeenCalled();
                Wallet.calculateBalance=orignalCalculateBalance;
            })
        })
    });

    describe('calculateBalance()',()=>{
        let blockchain;
        beforeEach(()=>{
            blockchain=new Blockchain();
        })

        describe('and there are no outputs for the wallet',()=>{
            it('returns the `STARTING_BALANCE`',()=>{
                expect(Wallet.calculateBalance({
                    chain: blockchain.chain,
                    address: wallet.publicKey
                })).toEqual(STARTING_BALANCE);
            });
        });

        describe('and there are outputs for the wallet',()=>{
            let transaction1, transaction2;
            beforeEach(()=>{
                transaction1=new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 50
                });
                transaction2=new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 60
                });

                blockchain.addBlock({data: [transaction1,transaction2]});
            })


            it('add the sum of all ouputs to the wallet balance',()=>{
                expect(Wallet.calculateBalance({
                    chain: blockchain.chain,
                    address: wallet.publicKey
                })).toEqual(
                    STARTING_BALANCE+
                    transaction1.outputMap[wallet.publicKey]+
                    transaction2.outputMap[wallet.publicKey]
                );
            });

            describe('the wallet has made a transaction',()=>{
                let recentTransaction;
                beforeEach(()=>{
                    recentTransaction=wallet.createTransaction({
                        recipient: 'foo-address',
                        amount: 75
                    });

                    blockchain.addBlock({data: [recentTransaction]});
                });

                it('returns the output amount of the recent transaction',()=>{
                    expect(Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })).toEqual(recentTransaction.outputMap[wallet.publicKey])
                });

                describe('and there are outputs next to and after recent transaction',()=>{
                    let sameBlockTransaction, nextBlockTransaction;
                    beforeEach(()=>{
                        recentTransaction= wallet.createTransaction({
                            recipient: 'foo-address',
                            amount: 60
                        });
                        sameBlockTransaction=Transaction.rewardTransaction({minerWallet: wallet});

                        blockchain.addBlock({data: [recentTransaction,sameBlockTransaction]});


                        nextBlockTransaction=new Wallet().createTransaction({
                            recipient: wallet.publicKey, amount: 70
                        })
                        blockchain.addBlock({data: [nextBlockTransaction]});
                    });

                    it('includes the output amounts in the returned balance',()=>{
                        expect(Wallet.calculateBalance({
                            chain: blockchain.chain,
                            address: wallet.publicKey
                        })).toEqual(
                            recentTransaction.outputMap[wallet.publicKey]+
                            sameBlockTransaction.outputMap[wallet.publicKey]+
                            nextBlockTransaction.outputMap[wallet.publicKey]
                        )
                    })
                })
            })
        });
    })
})