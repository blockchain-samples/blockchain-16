import crypto = require("crypto");
import EventEmitter = require("events");
import { Block } from "./block";

class BlockChain extends EventEmitter  {
    private blockChainDB: Block[] = [];
    private currentLastBlock: Block;
    // constructor() {
    //     // 1. sinc to blockchain if it exist
    //     // 1.1 get blockchain
    //     // 1.2 validate all blocks
    //     // find last unvalidated block
    // }

    public createGenesis(randomHash: string): BlockChain {
        if (!this.lastBlock) {
            const genesisParent: IBaseBlock = {
                hash: Buffer.from(randomHash, "hex"),
                index: -1,
            };
            const genesisBock = new Block("My genesis block", genesisParent);
            this.blockChainDB = [genesisBock];
            this.currentLastBlock = genesisBock;
        }
        return this;
    }

    public makeBlock(data: string): Block {
        if (this.lastBlock) {
            return new Block(data, this.lastBlock);
        } else {
            // tslint:disable-next-line:no-console
            console.log("Please first generate genesis block");
        }
    }

    public addBlock(block: Block): BlockChain {
        if (block && this.validateBlock(block, this.lastBlock)) {
            this.blockChainDB.push(block);
            this.currentLastBlock = block;
        }
        return this;
    }

    // public syncChain(): void {};

    public replaceChain = ({ blockChain, lastBlock}: BlockChain) => {

        if (this.validateBlockChain(blockChain) && blockChain.length > this.blockChainDB.length) {
            // tslint:disable-next-line:no-console
            console.log("Received blockchain is valid. Replacing current blockchain with received blockchain");
            this.blockChainDB = blockChain;
            this.currentLastBlock = lastBlock;
        } else {
            // tslint:disable-next-line:no-console
            console.log("Received blockchain invalid");
        }

    }

    get lastBlock() {
        return this.currentLastBlock;
    }

    get blockChain(): Block[] {
        return this.blockChainDB;
    }

    private validateBlock(newBlock: Block, previousBlock: Block): boolean {

        const buffer = Buffer.from([previousBlock.index + 1, previousBlock.hash, newBlock.timestamp]);
        const realHashOfNewBlock = crypto.createHmac("sha256", buffer).update(newBlock.data).digest();

        return !realHashOfNewBlock.compare(newBlock.hash);
    }

    private validateBlockChain(blockchainToValidate: Block[]): boolean {

        return blockchainToValidate.every((blockToValidate, index, blockchain) => {
            if (index) {
                return this.validateBlock(blockToValidate, blockchain[index - 1]);
            }
            return !blockToValidate.hash.compare(this.blockChainDB[0].hash);
        });
    }
}

const BC = new BlockChain();

BC.on()
