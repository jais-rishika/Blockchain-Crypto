import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import Blockchain from './blockchain/blockchain.js'
import Pubsub from './pubsub/pubsub.js';

const app=express();
const blockchain=new Blockchain();
const pubsub=new Pubsub({blockchain});


(async () => {
  await pubsub.connect();
})();

app.use(bodyParser.json());

app.get('/api/block',(req,res)=>{
    res.json(blockchain.chain);
})

app.post('/api/mine',(req,res)=>{
    const {data}=req.body;
    blockchain.addBlock({data});
    pubsub.broadcastBlockChain();
    res.redirect('/api/block');
})


const DEFAULT_PORT=3000;
const ROOT_NODE_ADDRESS=`http://localhost:${DEFAULT_PORT}`
const syncChain=async ()=>{
    try {
        const res= await fetch(`${ROOT_NODE_ADDRESS}/api/block`);
        if(!res.ok){throw new Error(`HTTP ${res.status}`)}

        const root_chain=await res.json();
        console.log('replace chain on sync with ',root_chain)
        blockchain.replaceChain(root_chain);
    } catch (error) {
        console.log("Some Error Occured:",error);
    }
}


let PEER_PORT;

if(process.env.GENERATE_PEER_PORT==='true'){
    PEER_PORT=DEFAULT_PORT+Math.ceil(Math.random()*1000);
}
const PORT=PEER_PORT || DEFAULT_PORT;
app.listen(PORT,()=>{
    console.log(`The port is listening at ${PORT}`)
    if(PORT!==DEFAULT_PORT){
        syncChain();
    }
})