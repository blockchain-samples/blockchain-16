import WebSocket = require("ws");

import { BC } from "../blockchain/blockChain";
import { blockchainEvents, SERVER_PORT, wsClientCommands, wsServerData } from "../constants";

interface IPeerAddress {
    ip: number | string;
    port: number;
}

// get new block and add it to blockchain

class P2PClient {
    public static syncBlockchain(blockChain: IBlockChain) {
        BC.emit(blockchainEvents.SYNC_BLOCKCHAIN, blockChain);
    }

    private connectedPeers: WebSocket[];
    private shouldSyncBlockchain: boolean = true;

    constructor() {
        this.connectToPeers([{ ip: "localhost", port: SERVER_PORT}]);
    }

    public connectToPeers(newPeers: IPeerAddress[]) {
        newPeers.forEach((peer) => {
            const { ip, port } = peer;
            const ws = new WebSocket(`ws://${ip}:${port}`);

            this.initOpenHandler(ws);
            this.initMassageHandler(ws);
            this.initErrorHandler(ws);
        });
    }

    private initOpenHandler(ws: WebSocket): void {
        ws.on("open", () => {
            if (this.shouldSyncBlockchain) {
                ws.send({
                    type: wsClientCommands.SYNC_BLOCKCHAIN,
                });
            } else {
                ws.send({
                    type: wsClientCommands.LAST_DATA,
                });
            }
            // tslint:disable-next-line:no-console
            console.log("connection enable");
        });
        this.connectedPeers.push(ws);
    }

    private initErrorHandler(ws: WebSocket): void {
        ws.on("error", () => {
            // tslint:disable-next-line:no-console
            console.log("connection failed");
        });
    }

    private initMassageHandler(ws: WebSocket): void {
        ws.on("message", (receivedData) => {

            const {type, content}: IReceivedData = JSON.parse(receivedData.toString());

            switch (type) {
                case wsServerData.ALL_BLOCKS:
                    P2PClient.syncBlockchain(content as IBlockChain);
                    this.shouldSyncBlockchain = true;
                    break;
                case wsServerData.NEW_BLOCK:
                    BC.emit(blockchainEvents.ADD_BLOCK, content as IBlock);
                case wsServerData.SHOULD_UPDATE:
                    const { lastBlockHash, lengthOfBlockchain } = content;
                    const needSync: boolean = (BC.lastBlock.hash.compare(Buffer.from(lastBlockHash))
                    && BC.blockChain.length > lengthOfBlockchain);
                    if (needSync) {
                        ws.send({
                            type: wsClientCommands.SYNC_BLOCKCHAIN,
                        });
                    }
                default:
                    break;
            }
            // tslint:disable-next-line:no-console
            console.log("ws get data");
        });
    }
}

export const p2pClient = new P2PClient();
