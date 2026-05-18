const cryptoHash  = require("../../../utils/crypto/crypto-hash");

describe('CryptoHash',()=>{
    it('generates a SHA-256 hash output',()=>{
        expect(cryptoHash('foo')).toEqual('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae')
    });
    it('produces same hash with same inputs in any given order',()=>{
        expect(cryptoHash('one','two','three')).toEqual(cryptoHash('three','two','one'))
    });
})