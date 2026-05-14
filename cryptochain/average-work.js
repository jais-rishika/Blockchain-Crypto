const Blockchain = require("./blockchain");

const blockchain=new Blockchain();
blockchain.addBlock({data: 'initial'});
let prevTimestamp, nextTimestamp, nextBlock, diffTime, average;

const times=[];

for(let i=0;i<100;i++){
    prevTimestamp=blockchain.chain[blockchain.chain.length-1].timestamp;
    
    blockchain.addBlock({data: `block${i}`});
    nextBlock=blockchain.chain[blockchain.chain.length-1];
    
    nextTimestamp=nextBlock.timestamp;
    diffTime=nextTimestamp-prevTimestamp;
    times.push(diffTime);
    
    average=times.reduce((total,num)=>total+num);

    console.log(`Time to mine Block: ${diffTime}ms; Difficulty: ${nextBlock.difficulty}; Average time: ${average}ms`);
}
