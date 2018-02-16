import crypto = require("crypto");
import EventEmitter = require("events");
import { blockchainEvents } from "../constants";
import { Block } from "./block";

class BlockChain extends EventEmitter implements IBlockChain {
    private blockChainDB: IBlock[] = [];
    private currentLastBlock: IBlock;

    public createGenesis(randomHash: string): BlockChain {
        if (!this.lastBlock) {
            const genesisParent: IBlock = {
                data: "",
                hash: Buffer.from(randomHash, "hex"),
                index: -1,
                prevHash: new Buffer(0),
                timestamp: 0,
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

    public addBlock(block: IBlock): BlockChain {
        if (block && this.validateBlock(block, this.lastBlock)) {
            this.blockChainDB.push(block);
            this.currentLastBlock = block;
        }
        return this;
    }

    public replaceChain = ({ blockChain, lastBlock}: BlockChain) => {

        if (blockChain.length > this.blockChainDB.length && this.validateBlockChain(blockChain)) {
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

    get blockChain(): IBlock[] {
        return this.blockChainDB;
    }

    private validateBlock(newBlock: IBlock, previousBlock: IBlock): boolean {

        const buffer = Buffer.from([previousBlock.index + 1, previousBlock.hash, newBlock.timestamp]);
        const realHashOfNewBlock = crypto.createHmac("sha256", buffer).update(newBlock.data).digest();

        return !realHashOfNewBlock.compare(newBlock.hash);
    }

    private validateBlockChain(blockchainToValidate: IBlock[]): boolean {

        return blockchainToValidate.every((blockToValidate, index, blockchain) => {
            if (index) {
                return this.validateBlock(blockToValidate, blockchain[index - 1]);
            }
            return !blockToValidate.hash.compare(this.blockChainDB[0].hash);
        });
    }
}

export const BC = new BlockChain();

BC.on(blockchainEvents.ADD_BLOCK, (block: IBlock) => {
    this.addBlock(block);
    // tslint:disable-next-line:no-console
    console.log(`block: ${block.hash} was added`);
});

BC.on(blockchainEvents.SYNC_BLOCKCHAIN, (blockChain: BlockChain) => {
    BC.replaceChain(blockChain);
    // tslint:disable-next-line:no-console
    console.log(`sync blockchain was over`);
});
