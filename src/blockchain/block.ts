import crypto = require("crypto");

export class Block implements IBlock {

    public index: number;
    public hash: string;
    public prevHash: string;
    public timestamp: number;
    public data: string;

    constructor(data: string, prevBlock: Block | IBlock) {
        this.index = prevBlock.index + 1;
        this.prevHash = prevBlock.hash;
        this.data = data;
        this.makeTimestamp();
        this.makeHash();
    }

    private makeTimestamp() {
        this.timestamp = new Date().getTime() / 1000;
    }

    private makeHash() {
        const buffer = Buffer.from([this.index, this.prevHash, this.timestamp]);
        this.hash = crypto.createHmac("sha256", buffer).update(this.data).digest("hex");
    }
}
