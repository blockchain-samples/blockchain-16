import chai = require("chai");
import { Block } from "../src/blockchain/block";

const { expect } = chai;

describe('#block', () => {
    let genesisBlock;
    const  phrase = 'some text';
    const difficulty = 1;
    const nonce = 0;

    before(() => {
        genesisBlock = new Block("the genesis block", difficulty, nonce, { index: -1, prevHash: null, timestamp: 0, hash: null, data: '' });
    });
    context('create valid block', () => {
        it('next block hash should include hash of prev block', () => {
            const firstBlock = new Block(phrase, difficulty, nonce, genesisBlock);
            const secondBlock = new Block(phrase, difficulty, nonce, firstBlock);
            expect(secondBlock.prevHash).to.equal(firstBlock.hash);
        });
    });
});