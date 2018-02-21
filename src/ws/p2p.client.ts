import WebSocket = require("ws");

import {
    blockchainEvents,
    p2pClientEvent,
    wsClientMsgTypes,
    wsServerMsgTypes,
} from "../constants";
import { observable } from "../observables/observable";
import { Logger } from "../logger";

const MODULE_NAME = "p2p.client"

// get new block and add it to blockchain
// send commands for server to get additional info

export class P2PClient implements IP2PClient {

    public connectedPeers: Set<WebSocket> = new Set();
    private shouldSyncBlockchain: boolean = true;

    constructor(options: IServerOptions) {
        if (options.remotePeers.length > 0) {
            this.connectToPeers([`${options.host}:${options.p2pPort}`].concat(options.remotePeers));
        } else {
            this.connectToPeers([`${options.host}:${options.p2pPort}`]);
        }
        observable.register(p2pClientEvent.SHOULD_GET_ALL_BLOCKS, this);
    }

    public syncBlockchain(blockChain: IBlockChain): void {
        observable.notify(blockchainEvents.SYNC_BLOCKCHAIN, {
            content: blockChain,
            type: blockchainEvents.SYNC_BLOCKCHAIN,
        });
    }

    public update(data: IReceivedData<IBlockChainStats>) {
        const { type, wsStats } = data;
        switch (type) {
            case p2pClientEvent.SHOULD_GET_ALL_BLOCKS:
                const ws = [...this.connectedPeers].find((wServer) => wServer.url === wsStats.url);
                ws.send(JSON.stringify({
                    type: wsClientMsgTypes.GET_ALL_BLOCKS,
                }));
                break;
            default:
                break;
        }
    }

    public connectToPeers(newPeers: string[]): void {
        newPeers.forEach((peer) => {
            try {
                const ws = new WebSocket(`ws://${peer}`);
                Logger.log(MODULE_NAME, `start connect to ws://${peer}`)
                this.initOpenHandler(ws);
                this.initMassageHandler(ws);
                this.initErrorHandler(ws);
            } catch(e) {
                Logger.error(MODULE_NAME, JSON.stringify(e));
            }
        });
    }

    private initOpenHandler(ws: WebSocket): void {
        ws.on("open", () => {
            if (this.shouldSyncBlockchain) {
                ws.send(JSON.stringify({
                    type: wsClientMsgTypes.GET_ALL_BLOCKS,
                }));
            } else {
                ws.send(JSON.stringify({
                    type: wsClientMsgTypes.GET_LAST_DATA,
                }));
            }
            Logger.log(MODULE_NAME, "connection enable");
        });
        this.connectedPeers.add(ws);
    }

    private initErrorHandler(ws: WebSocket): void {
        ws.on("error", (e) => {
            // tslint:disable-next-line:no-console
            Logger.error(MODULE_NAME, JSON.stringify(e));
        });
    }

    private initMassageHandler(ws: WebSocket): void {
        ws.on("message", (receivedData) => {

            const { type, content }: IReceivedData<IBlock | IBlockChain | IBlockChainStats>
             = JSON.parse(receivedData.toString());

            switch (type) {
                case wsServerMsgTypes.ALL_BLOCKS:
                    this.syncBlockchain(content as IBlockChain);
                    this.shouldSyncBlockchain = false;
                    break;
                case wsServerMsgTypes.NEW_BLOCK:
                    // tslint:disable-next-line:no-console
                    Logger.log(MODULE_NAME, `new block has been received from ${ws.url}`);
                    observable.notify(blockchainEvents.ADD_BLOCK, { 
                        content: content as IBlock,
                        type: blockchainEvents.ADD_BLOCK,
                    });
                    break;
                case wsServerMsgTypes.LAST_DATA:
                    observable.notify(blockchainEvents.CHECK_LAST_DATA, {
                        content: content as IBlockChainStats,
                        type: blockchainEvents.CHECK_LAST_DATA,
                        wsStats: {
                            protocol: ws.protocol,
                            url: ws.url,
                        },
                    });
                    break;
                default:
                    break;
            }
        });
    }
}
