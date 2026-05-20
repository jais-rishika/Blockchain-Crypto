import {verifySignature} from '../../utils/elliptic.js';
import Transaction from '../../wallet/transaction.js';
import Wallet from '../../wallet/wallet.js';

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
    })
})