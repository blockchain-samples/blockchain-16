declare interface IBlock {
    index: number;
    hash: string;
    prevHash: string;
    timestamp: number;
    data: string;
}

declare interface IBlockChain {
    blockChain: IBlock[],
    lastBlock: IBlock,
}
declare interface IBlockChainStats {
    lastBlockHash: string,
    lengthOfBlockchain: number,
}

declare interface IWsStats {
    url: string,
    protocol: string,
}

declare interface IReceivedData {
    type: string,
    content?: IBlock | IBlockChain | IBlockChainStats,
    wsStats?: IWsStats,
}

declare interface IObserver {
    update: (data: IReceivedData)=> void,
}

declare interface IObservable {
    // register observer to specific event
    register: (event: string, observer: IObserver | IObserver[]) => void,
    notify: (event: string, data: IReceivedData) => void,
}