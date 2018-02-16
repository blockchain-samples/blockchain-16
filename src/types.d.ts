declare interface IBlock {
    index: number;
    hash: Buffer;
    prevHash: Buffer;
    timestamp: number;
    data: string;
}

declare interface IBlockChain {
    blockChain: IBlock[],
    lastBlock: IBlock,
}

declare interface IReceivedData {
    type: string,
    content:  any,
}