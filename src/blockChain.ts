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
        if (this.validateBlock(block)) {
            this.blockChain.push(block);
            this.currentLastBlock = block;
        }
    }

    get lastBlock() {
        return this.currentLastBlock;
    }

    // public syncChain(): void {};

    private validateBlock(block: Block): boolean {
        return true;
    }

    private createGenesis() {
        const genesisParent: BaseBlock = {
            hash: crypto.createHash("sha256").digest(),
            index: -1,
        };
        const genesisBock = new Block("My genesis block", genesisParent);
        this.blockChain = [genesisBock];
        this.currentLastBlock = genesisBock;
    }
}

export const BC = new BlockChain();
