import crypto = require("crypto");
import { setInterval } from "timers";
import { blockchainEvents, KEY, p2pClientEvent, p2pServerEvents } from "../constants";
import { observable } from "../observables/observable";
import { Block } from "./block";

class BlockChain implements IBlockChain, IObserver {
    private blockChainDB: IBlock[] = [];
    private currentLastBlock: IBlock;

    constructor() {
        observable.register(blockchainEvents.ADD_BLOCK, this);
        observable.register(blockchainEvents.SYNC_BLOCKCHAIN, this);
        observable.register(blockchainEvents.START_MINING, this);
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
                const Interval = setInterval(() => {
                    this.makeBlock(KEY);
                }, 5000);
                break;
            default:
                break;
        }
    }

    private createGenesis(randomHash: string): BlockChain {
        if (!this.lastBlock) {
            const genesisParent: IBlock = {
                data: "",
                hash: crypto.createHmac("sha256", randomHash).digest("hex"),
                index: -1,
                prevHash: null,
                timestamp: 0,
            };
            const genesisBock = new Block("My genesis block", genesisParent);
            this.blockChainDB = [genesisBock];
            this.currentLastBlock = genesisBock;
        }
        return this;
    }

    private makeBlock(data: string): void {
        if (this.lastBlock) {
            const block = new Block(data, this.lastBlock);
            observable.notify(p2pServerEvents.NEW_BLOCK_MADE, {
                content: block,
                type: p2pServerEvents.NEW_BLOCK_MADE,
            });
        } else {
            this.createGenesis("816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
        }
    }

    private addBlock(block: IBlock): BlockChain {
        if (block && this.validateBlock(block, this.lastBlock)) {
            this.blockChainDB.push(block);
            this.currentLastBlock = block;
            // tslint:disable-next-line:no-console
            console.log(`block ${block.hash} was added`);
        }
        return this;
    }

    private replaceChain = ({ blockChain, lastBlock }: IBlockChain) => {

        if ((blockChain.length >= this.blockChainDB.length) && this.validateBlockChain(blockChain)) {
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
}

export const BC = new BlockChain();
