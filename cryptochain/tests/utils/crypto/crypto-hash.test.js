// const cryptoHash  = require("../../../utils/crypto-hash");
import cryptoHash from "../../../utils/crypto-hash.js";
describe('CryptoHash',()=>{
    it('generates a SHA-256 hash output',()=>{
        expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b')
    });
    it('produces same hash with same inputs in any given order',()=>{
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','two','one'))
    });
})