const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");
const HexToBinary=require('hex-to-binary')


//class we are passing- a callback func
describe('Block',()=>{
    const timestamp=2000;
    const lastHash='foo-hash';
    const hash='bar-hash';
    const data=['blockchain','data'];
    const nonce=1;
    const difficulty=1;
    const block=new Block({timestamp,lastHash,hash,nonce,difficulty,data});

    //string
    //creates a test
    it('has a timestamp, lastHash, hash, data',()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()',()=>{
        const genesisBlock=Block.genesis();
    
        it('returns a Block instance',()=>{
            expect(genesisBlock instanceof Block).toEqual(true);
        })
        it('returns the genesis data',()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    })

    describe('MineBlock()',()=>{
        const lastBlock=Block.genesis();
        const data='minedData';
        const minedBlock=Block.mineBlock({lastBlock,data});
    
        it('returns a Block instance',()=>{
            expect(minedBlock instanceof Block).toEqual(true);
        })
        it('sets `lastHash` to be the `hash` of `lastBlock`' ,()=>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        })
        it('sets the data',()=>{
            expect(minedBlock.data).toEqual(data);
        })
        it('sets the timestamp',()=>{
            expect(minedBlock.timestamp).not.toEqual(undefined);
        })
        it('creates a SHA-256 based on proper inputs',()=>{
            expect(minedBlock.hash).toEqual(
                cryptoHash(
                    minedBlock.data,
                    minedBlock.timestamp,
                    minedBlock.lastHash,
                    minedBlock.nonce,
                    minedBlock.difficulty
                )
            );
        })

        it('sets a `hash` that matches the mined block difficulty criteria',()=>{
            expect(HexToBinary(minedBlock.hash).substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        })

        it('sets a valid Difficulty',()=>{
            const possibleDifficulties=[minedBlock.difficulty-1,minedBlock.difficulty+1];
        })
    })

    describe('adjustDifficulty',()=>{
        it(`lowers the difficulty for a slowly mined block`,()=>{
            expect(Block.adjustDifficulty({orignalBlock: block,timestamp: block.timestamp+MINE_RATE+100})).toEqual(block.difficulty-1);
        });
        it(`raises the difficulty for a quickly mined block`,()=>{
            expect(Block.adjustDifficulty({orignalBlock: block,timestamp: block.timestamp+MINE_RATE-100})).toEqual(block.difficulty+1);
        });
        it(`difficulty have a base minimum value`,()=>{
            block.difficulty=-1;
            expect(Block.adjustDifficulty({orignalBlock: block})).toEqual(1);
        });
    })
}) 