export const INITIAL_DIFFICULTY=3;
export const MINE_RATE=1000;
export const GENESIS_DATA={
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    data: [],
    nonce:0,
    difficulty:INITIAL_DIFFICULTY
};

export const STARTING_BALANCE=1000;

export default {GENESIS_DATA,MINE_RATE,STARTING_BALANCE}