import { verifySignature } from "../../utils/elliptic.js";
import Transaction from "../../wallet/transaction.js";
import Wallet from "../../wallet/wallet.js";
import { beforeEach, describe, expect, jest } from '@jest/globals';


describe('Transaction',()=>{
    let transaction, senderWallet, recipient, amount;
    beforeEach(()=>{
        senderWallet=new Wallet();
        recipient= 'recipient-public-key';
        amount=50;

        transaction=new Transaction({senderWallet,recipient,amount});
    })

    it('has an `id`',()=>{
        expect(transaction).toHaveProperty('id'); 
    });

    describe('outputMap',()=>{
        it('has an `outputMap',()=>{
            expect(transaction).toHaveProperty('outputMap');
        });
        it('output the amount to the recipient',()=>{
            expect(transaction.outputMap[recipient])
            .toEqual(amount);
        })
        it('output the remaining balance for the `senderWallet',()=>{
            expect(transaction.outputMap[senderWallet.publicKey])
            .toEqual(senderWallet.balance-amount);
        })
    });

    describe('input',()=>{
        it('has an `input`',()=>{
            expect(transaction).toHaveProperty('input');
        });
        it('has an `timestamp` in the input',()=>{
            expect(transaction.input).toHaveProperty('timestamp');
        });
        it('sets the `amount` to the `senderWallet` balance',()=>{
            expect(transaction.input.amount)
            .toEqual(senderWallet.balance);
        })
        it('sets the `address` to the `senderWallet` publicKey',()=>{
            expect(transaction.input.address)
            .toEqual(senderWallet.publicKey);
        })
        it('signs the input',()=>{
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            )
            .toBe(true);
        });
    });

    describe('validTransaction()',()=>{
        let errorMock;
        beforeEach(()=>{
            errorMock=jest.fn();
            global.console.error=errorMock;
        })
        
        describe("when the Transaction is valid",()=>{
            it('returns true',()=>{
                expect(Transaction.ValidTransaction(transaction)).toBe(true)
            })
        })
        
        describe("when the Transaction is invalid",()=>{
            
            describe('and a transaction outputMap value is invalid',()=>{
                it('returns false and logs error',()=>{
                    transaction.outputMap[senderWallet.publicKey]=99999;
                    expect(Transaction.ValidTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                })
            })
            
            describe('and a transaction input signature is invalid',()=>{
                it('returns false and logs error',()=>{
                    transaction.input.signature=new Wallet().sign('data');
                    expect(Transaction.ValidTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                })
            })
        })
    });

    describe('updateTransaction()',()=>{
        let orignalSignature, orignalSenderOutput, nextRecipient, nextAmount;
        beforeEach(()=>{
            orignalSignature=transaction.input.signature;
            orignalSenderOutput=transaction.outputMap[senderWallet.publicKey];
            nextRecipient='next-recipient';
            nextAmount=50;
            transaction.updateTransaction({senderWallet,recipient: nextRecipient,amount: nextAmount})
        });

        describe('and the amount is invalid',()=>{
            it('throws an error',()=>{
                expect(()=>
                    transaction.updateTransaction({
                        senderWallet,recipient: 'foo', amount: 999999
                    })
                ).toThrow('Amount exceeds balance')
            })
        })

        describe('and the amount is valid',()=>{
            it("outputs the amount to the next recipient",()=>{
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
            });
            
            it('subtracts the amount from the orignal sender output amount',()=>{
                expect(transaction.outputMap[senderWallet.publicKey]).toEqual(orignalSenderOutput-nextAmount);
            });
    
            it('maintains the total output that matches the input amount',()=>{
                expect(Object.values(transaction.outputMap).reduce((total,curr)=>total+curr)
                ).toEqual(transaction.input.amount);
            });
    
            it('resigns the transactions',()=>{ 
                expect(transaction.input.signature).not.toEqual(orignalSignature);
            });

            describe('add another update for the same recipient',()=>{
                let addedAmount
                beforeEach(()=>{
                    addedAmount=80;
                    transaction.updateTransaction({senderWallet,recipient: nextRecipient,amount: addedAmount});
                })

                it('adds to the recipient amount',()=>{
                    expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount+addedAmount);
                })

                it('sibtracts the amount from the orignal sender output amount',()=>{
                    expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
                        orignalSenderOutput-nextAmount-addedAmount
                    )
                })
            })
        })


    })
})