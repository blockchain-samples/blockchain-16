import crypto = require("crypto");

export class Block implements IBlock {

    public index: number;
    public hash: string;
    public prevHash: string;
    public timestamp: number;
    public data: string;
    public difficulty: number;
    public nonce: number;

    constructor(data: string, difficulty: number, nonce: number, prevBlock: Block | IBlock) {
        this.index = prevBlock.index + 1;
        this.prevHash = prevBlock.hash;
        this.data = data;
        this.difficulty = difficulty;
        this.nonce = nonce;
        this.timestamp = this.makeTimestamp();
        this.hash = this.makeHash();
    }

    private makeTimestamp(): number {
        return new Date().getTime() / 1000;
    }

    private makeHash(): string {
        const buffer = Buffer.from([this.index, this.prevHash, this.timestamp, this.difficulty, this.nonce]);
        return crypto.createHmac("sha256", buffer).update(this.data).digest("hex");
    }
}
