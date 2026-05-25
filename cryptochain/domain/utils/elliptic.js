import cryptoHash from '../utils/crypto-hash.js'
import elliptic from 'elliptic';

export const EC = new elliptic.ec('secp256k1');

export const verifySignature=({publicKey,data,signature})=>{
    //keyFromPublic(...) turns that raw string into an elliptic “key object” 
    // that the library can use for cryptographic operations—mainly signature verification.
    const keyFromPublic=EC.keyFromPublic(publicKey,'hex');
    //uses public key to verify the sign
    return keyFromPublic.verify(cryptoHash(data),signature);
}