import crypto from 'crypto';

const cryptoHash=(...inputs)=>{
    const hash=crypto.createHash('sha256');
    //js will treat object as an identical piece of information
    hash.update(inputs.map(val=>JSON.stringify(val)).sort().join());
    return hash.digest('hex');
}

export default cryptoHash;
