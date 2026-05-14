const express=require('express');
const Blockchain=require('./blockchain');
const bodyParser = require('body-parser');

const app=express();
const blockchain=new Blockchain();

app.use(bodyParser.json());

app.get('/api/block',(req,res)=>{
    res.json(blockchain.chain);
})

app.post('/api/mine',(req,res)=>{
    const {data}=req.body;
    blockchain.addBlock({data});
    res.redirect('/api/block');
})
const PORT=3000;
app.listen(PORT,()=>{
    console.log(`The port is listening at ${PORT}`)
})