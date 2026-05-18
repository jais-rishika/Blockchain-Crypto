const Block = require('../../blockchain/block');
const Blockchain = require('../../blockchain/blockchain');
const cryptoHash = require('../../utils/crypto/crypto-hash');

describe('valid blockchain',()=>{
    let blockchain, newChain, orignalChain;
    beforeEach(()=>{
        blockchain=new Blockchain();
        newChain=new Blockchain();
        orignalChain=blockchain.chain;
    })

    it('contains a `chain` Array instance',()=>{
        expect(blockchain.chain instanceof Array).toBe(true);
    })

    it('starts with the genesis block',()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    })

    it('adds a new block to the chain',()=>{
        const newData='foo-bar';
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    })

    describe('isValidChain()',()=>{
        describe('when the chain does not start with genesis block',()=>{
            it('return false',()=>{
                blockchain.chain[0]={data: 'genesis-fake'};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        })

        describe('when the chain start with genesis block and have multiple blocks',()=>{

            beforeEach(()=>{
                blockchain.addBlock({data: 'Dante'});
                blockchain.addBlock({data: 'Vergil'});
                blockchain.addBlock({data: 'Lady'});
                blockchain.addBlock({data: 'Trish'});
            })

            describe('and a lastHash reference has changed',()=>{
                it('return false',()=>{
                blockchain.chain[2].lastHash='broken-hash';
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            })

            describe('and the chain contains a block with an invalid field',()=>{
                it('return false',()=>{
                    blockchain.chain[2].data='false-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            })
    
            describe('and the chain contains a block with jumped Difficulty',()=>{
                it('return false',()=>{
                    const lastBlock=blockchain.chain[blockchain.chain.length-1];
                    const lastHash=lastBlock.hash;
                    const timestamp=Date.now();
                    const nonce=0;
                    const data=[];
                    const difficulty=lastBlock.difficulty-3;
                    const hash=cryptoHash(lastHash,timestamp,nonce,data,difficulty)
                    
                    const badBlock=new Block({lastHash,timestamp,nonce,data,difficulty,hash});
                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            })
    

            describe('and the chain does not contain any invalid block',()=>{
                it('return true',()=>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            })
        })
    })

    describe('replaceChain()',()=>{
        let logmock,errormock;
        beforeEach(()=>{
            errormock= jest.fn();
            logmock=jest.fn();

            global.console.error=errormock;
            global.console.log=logmock;
        })

        describe('when the new chain is not longer',()=>{
            beforeEach(()=>{
                newChain.chain[0]={data: 'new-chain'};
                blockchain.replaceChain(newChain.chain);
            })
            it('does not replaces the current chain',()=>{
                expect(blockchain.chain).toEqual(orignalChain);
            })
            it('logs an error',()=>{
                expect(errormock).toHaveBeenCalled();
            })
        })

        describe('when the chain is longer',()=>{
            beforeEach(()=>{
                newChain.addBlock({data: 'Dante'});
                newChain.addBlock({data: 'Vergil'});
                newChain.addBlock({data: 'Lady'});
                newChain.addBlock({data: 'Trish'});  
            })
            describe('and the chain is invalid',()=>{
                beforeEach(()=>{
                    newChain.chain[2].hash='false-hash';
                    blockchain.replaceChain(newChain.chain);
                })
                it('does not replaces the current chain',()=>{
                    expect(blockchain.chain).toEqual(orignalChain);
                })
                it('logs an error',()=>{
                    expect(errormock).toHaveBeenCalled();
                })
            })

            describe('and the chain is valid',()=>{
                beforeEach(()=>{
                    blockchain.replaceChain(newChain.chain);
                })
                it('replaces the current chain',()=>{
                    expect(blockchain.chain).toEqual(newChain.chain);
                })
                it('logs a comment  while replacing',()=>{
                    expect(logmock).toHaveBeenCalled();
                })
            })
        })
    })
})