import crypto = require("crypto");
import { Block } from "./block";

class BlockChain {
    private blockChain: Block[];
    private currentLastBlock: Block;
    constructor() {
        // 1. sinc to blockchain if it exist
        // 1.1 get blockchain
        // 1.2 validate all blocks
        // find last unvalidated block
        if (this.lastBlock) {
            ///
        } else {
            this.createGenesis();
        }
    }

    public makeBlock(data: string): Block {
        return new Block(data, this.lastBlock);
    }

    public chowBlocks(): Block[] {
        return this.blockChain;
    }

    public addBlock(block: Block) {
        if (this.validateBlock(block, this.lastBlock)) {
            this.blockChain.push(block);
            this.currentLastBlock = block;
        }
    }

    // public syncChain(): void {};

    public validateBlock(newBlock: Block, previousBlock: Block): boolean {

        const buffer = Buffer.from([previousBlock.index + 1, previousBlock.hash, newBlock.timestamp]);
        const realHashOfNewBlock = crypto.createHmac("sha256", buffer).update(newBlock.data).digest();
        
        return !realHashOfNewBlock.compare(newBlock.hash);
    }

    get lastBlock() {
        return this.currentLastBlock;
    }

    private createGenesis() {
        const genesisParent: BaseBlock = {
            hash: null,
            index: -1,
        };
        const genesisBock = new Block("My genesis block", genesisParent);
        this.blockChain = [genesisBock];
        this.currentLastBlock = genesisBock;
    }
}

export const BC = new BlockChain();
