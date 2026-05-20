import cryptoHash from '../utils/crypto-hash.js'
import elliptic from 'elliptic';

export const EC = new elliptic.ec('secp256k1');

export const verifySignature=({publicKey,data,signature})=>{
    const keyFromPublic=EC.keyFromPublic(publicKey,'hex');
    return keyFromPublic.verify(cryptoHash(data),signature);
}