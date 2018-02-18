
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

declare interface IReceivedDataSimple {
    type: string
}

declare interface IReceivedData<T> extends IReceivedDataSimple {
    content?: T,
    wsStats?: IWsStats,
}

declare interface IObserver {
    update: (data: IReceivedData<IBlock | IBlockChain | IBlockChainStats>)=> void,
}

declare interface IObservable {
    // register observer to specific event
    register: (event: string, observer: IObserver | IObserver[]) => void,
    notify: (event: string, data: IReceivedData<IBlock | IBlockChain | IBlockChainStats>) => void,
}

declare interface IPeerAddress {
    ip: number | string;
    port: number;
}

declare interface IP2PClient extends IObserver {
    connectedPeers: Set<any>,
    connectToPeers: (newPeers: string[]) => void,
    syncBlockchain: (blockChain: IBlockChain) => void,
}

declare interface IP2PServer extends IObserver {
    clients: Set<any>
    initMining: () => void
}

declare interface IServerOptions {
    host: string,
    p2pPort: number,
    httpPort: number,
}

declare interface IHttpAPIOptions extends IServerOptions {
    BC: IBlockChain;
    p2pClient: IP2PClient;
    p2pServer: IP2PServer;
}

declare module "*.json" {}