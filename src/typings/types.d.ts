
declare interface IObserver {
    update: (data: IReceivedData<IBlock | IBlockChain | IBlockChainStats>) => void,
}

declare interface IObservable {
    // register observer to specific event
    register: (event: string, observer: IObserver | IObserver[]) => void,
    notify: (event: string, data: IReceivedData<IBlock | IBlockChain | IBlockChainStats>) => void,
}

declare interface IBlock {
    index: number;
    hash: string;
    prevHash: string;
    timestamp: number;
    data: string;
    difficulty: number;
    nonce: number;
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
    host?: string,
    p2pPort?: number,
    httpPort?: number,
    remotePeers?: string[],
    maxpeers?: number,
    maxpendpeers?: number,
    nodiscover?: boolean,
}

declare interface IHttpAPIOptions extends IServerOptions {
    BC: IBlockChain;
    p2pClient: IP2PClient;
    p2pServer: IP2PServer;
}

declare interface ITxAddress {
    private_keys: string,
    public_keys: string,
    for_mining: boolean
}

declare interface IWallet {
    [props: number]: ITxAddress;
}

declare interface ITxOut {
    address: string;
    amount: number;
}

declare interface ITxIn {
    txOutId: string;
    txOutIndex: number;
    signature: string;
}

declare interface IUnspentTxOut extends ITxOut {
    readonly txOutId: string;
    readonly txOutIndex: number;
    readonly address: string;
    readonly amount: number;
}

declare interface IUnspentTxOuts {
    utos: IUnspentTxOut[],
    findUnspentTxOut: (txOutId: string, txOutIndex: number) => IUnspentTxOut,

}

declare interface ITransaction {
    id: string,
    txIns: ITxIn[],
    txOuts: ITxOut[],
    transactionId: string,
    signTxIn: (txInIndex: number, privateKey: string, aUnspentTxOuts: IUnspentTxOuts) => string,
}

declare module "*.json" {}