// const { describe } = require("node:test");
const Block = require("./block");
const { GENESIS_DATA } = require("./config");

//class we are passing- a callback func
describe('Block',()=>{
    const timestamp='a-data';
    const lastHash='foo-hash';
    const hash='bar-hash';
    const data=['blockchain','data'];
    const block=new Block({timestamp,lastHash,hash,data});

    //string
    //creates a test
    it('has a timestamp, lastHash, hash, data',()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
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
    })
}) 