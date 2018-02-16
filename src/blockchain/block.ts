import crypto = require("crypto");

export class Block implements IBaseBlock {
    private blockIndex: number;
    private blockHash: Buffer;
    private prevBlockHash: Buffer;
    private blockTimestamp: number;
    private blockData: string;
    constructor(data: string, prevBlock: Block | IBaseBlock) {
        this.blockIndex = prevBlock.index + 1;
        this.prevBlockHash = prevBlock.hash;
        this.blockData = data;
        this.makeTimestamp();
        this.makeHash();
    }

    get index() {
        return this.blockIndex;
    }

    get prevHash() {
        return this.prevBlockHash;
    }

    get hash() {
        return this.blockHash;
    }

    get timestamp() {
        return this.blockTimestamp;
    }

    get data() {
        return this.blockData;
    }

    private makeTimestamp() {
        this.blockTimestamp = new Date().getTime() / 1000;
    }

    private makeHash() {
        const buffer = Buffer.from([this.blockIndex, this.prevBlockHash, this.timestamp]);
        this.blockHash = crypto.createHmac("sha256", buffer).update(this.blockData).digest();
    }
}
