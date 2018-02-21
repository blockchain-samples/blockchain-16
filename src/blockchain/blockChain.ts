import crypto = require("crypto");
import { setInterval } from "timers";
import { blockchainEvents, KEY, p2pClientEvent, p2pServerEvents } from "../constants";
import { observable } from "../observables/observable";
import { Block } from "./block";
import { preGenesis } from "../config";
import { Logger } from "../logger";
import { hexToBinary } from "../utils";

const MODULE_NAME = "blockChain";

class BlockChain implements IBlockChain, IObserver {
    private blockChainDB: IBlock[] = [];
    private currentLastBlock: IBlock;
    private BLOCK_GENERATION_INTERVAL: number = 10;
    private DIFFICULTY_ADJUSTMENT_INTERVAL: number = 2;
    private isMiningOn: boolean = false;

    constructor() {
        observable.register(blockchainEvents.ADD_BLOCK, this);
        observable.register(blockchainEvents.SYNC_BLOCKCHAIN, this);
        observable.register(blockchainEvents.START_MINING, this);
        observable.register(blockchainEvents.MINE_BLOCK, this);
    }

    public update(data: IReceivedData<IBlock | IBlockChain | IBlockChainStats>) {
        const { type, content, wsStats } = data;
        switch (type) {
            case blockchainEvents.ADD_BLOCK:
                this.addBlock(content as IBlock);
                break;
            case blockchainEvents.SYNC_BLOCKCHAIN:
                this.replaceChain(content as IBlockChain);
                break;
            case blockchainEvents.CHECK_LAST_DATA:
                if (this.isBlockChainDifferent(content as IBlockChainStats)) {
                    // notify client to get new blockchain from remote peer
                    observable.notify(p2pClientEvent.SHOULD_GET_ALL_BLOCKS, {
                        type: p2pClientEvent.SHOULD_GET_ALL_BLOCKS,
                        wsStats,
                    });
                }
                break;
            case blockchainEvents.START_MINING:
                this.isMiningOn = true;
                this.makeBlock(KEY);
                break;
            case blockchainEvents.MINE_BLOCK:
                if (this.isMiningOn) {
                    this.makeBlock(KEY);
                }
                break;
            default:
                break;
        }
    }

    private makeBlock(data: string): void {
        if (this.lastBlock) {
            let nonce = 0;
            const df = this.getDifficulty();
            while (true) {
                const block = new Block(data, df, nonce, this.lastBlock);
                if (this.hashMatchesDifficulty(block.hash, df)) {
                    observable.notify(p2pServerEvents.NEW_BLOCK_MADE, {
                        content: block,
                        type: p2pServerEvents.NEW_BLOCK_MADE,
                    });
                    return;
                }
                nonce++;
            }            
        } else {
            const pseudoBlock: IBlock = Object.assign({}, preGenesis, { index: -1, prevHash: null, timestamp: 0 });
            const genesisBock = new Block("The genesis block", 1, 0, pseudoBlock);
            Logger.log(MODULE_NAME, `genesis ${genesisBock.hash} created`);
            this.blockChainDB = [genesisBock];
            this.currentLastBlock = genesisBock;
            observable.notify(blockchainEvents.MINE_BLOCK, {
                type: blockchainEvents.MINE_BLOCK,
            });
        }
    }

    private addBlock(block: IBlock): void {
        if (block && this.validateBlock(block, this.lastBlock)) {
            this.blockChainDB.push(block);
            this.currentLastBlock = block;
            Logger.log(MODULE_NAME, `block ${block.hash} was added`);
            observable.notify(blockchainEvents.MINE_BLOCK, {
                type: blockchainEvents.MINE_BLOCK,
            });
        }
    }

    private replaceChain({ blockChain, lastBlock }: IBlockChain): void {

        if ((blockChain.length >= this.blockChainDB.length) && this.validateBlockChain(blockChain)) {
            Logger.log(MODULE_NAME, "Received blockchain is valid. Replacing current blockchain with received blockchain");
            this.blockChainDB = blockChain;
            this.currentLastBlock = lastBlock;
            observable.notify(blockchainEvents.MINE_BLOCK, {
                type: blockchainEvents.MINE_BLOCK,
            });
        } else {
            Logger.warn(MODULE_NAME, "Received blockchain invalid");
        }

    }

    get lastBlock(): IBlock {
        return this.currentLastBlock;
    }

    get blockChain(): IBlock[] {
        return this.blockChainDB;
    }

    private validateBlock(newBlock: IBlock, previousBlock: IBlock): boolean {

        const buffer = Buffer.from([previousBlock.index + 1, previousBlock.hash, newBlock.timestamp, newBlock.difficulty, newBlock.nonce]);
        const realHashOfNewBlock = crypto.createHmac("sha256", buffer).update(newBlock.data).digest("hex");

        return realHashOfNewBlock === newBlock.hash;
    }

    private validateBlockChain(blockchainToValidate: IBlock[]): boolean {

        return blockchainToValidate.every((blockToValidate, index, blockchain) => {
            if (index) {
                return this.validateBlock(blockToValidate, blockchain[index - 1]);
            }
            return blockToValidate.hash === this.blockChainDB[0].hash;
        });
    }

    private isBlockChainDifferent({ lastBlockHash, lengthOfBlockchain }: IBlockChainStats): boolean {
        return (!(this.currentLastBlock.hash === lastBlockHash) && lengthOfBlockchain > this.blockChain.length);
    }

    private hashMatchesDifficulty = (hash: string, difficulty: number): boolean => {
        const requiredPrefix: string = '0'.repeat(difficulty);
        return hexToBinary(hash).startsWith(requiredPrefix);
    };

    private getDifficulty (): number {
        if (this.lastBlock.index % this.DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && this.lastBlock.index !== 0) {
            return this.getAdjustedDifficulty();
        } else {
            return this.lastBlock.difficulty;
        }
    };

    private getAdjustedDifficulty = () => {
        const prevAdjustmentBlock: IBlock = this.blockChainDB[this.blockChainDB.length - this.DIFFICULTY_ADJUSTMENT_INTERVAL];
        const timeExpected: number = this.BLOCK_GENERATION_INTERVAL * this.DIFFICULTY_ADJUSTMENT_INTERVAL;
        const timeTaken: number = this.lastBlock.timestamp - prevAdjustmentBlock.timestamp;
        if (timeTaken < timeExpected / 2) {
            return prevAdjustmentBlock.difficulty + 1;
        } else if (timeTaken > timeExpected * 2) {
            return prevAdjustmentBlock.difficulty - 1;
        } else {
            return prevAdjustmentBlock.difficulty;
        }
    };
}

export const BC = new BlockChain();
