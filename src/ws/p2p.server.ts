import EventEmitter = require("events");
import Socket = require("ws");

import { BC } from "../blockchain/blockChain";
import { blockchainEvents, p2pServerEvents, wsClientMsgTypes, wsServerMsgTypes } from "../constants";
import { observable } from "../observables/observable";

// send new block to peers
// get commands from peers and send data

export class P2PServer implements IP2PServer {

    private setOfClients: Set<Socket>;
    private server: Socket.Server;
    constructor(options: Socket.ServerOptions) {
        this.server = new Socket.Server({ port: options.port, clientTracking: options.clientTracking });
        this.setOfClients = this.server.clients;
        this.initConnection();
        // tslint:disable-next-line:no-console
        console.log(`listening websocket p2p port on: ${options.port}`);
    }

    public update(data: IReceivedData<IBlock>): void {
        const { type, content } = data;
        if (type === p2pServerEvents.NEW_BLOCK_MADE) {
            // tslint:disable-next-line:no-console
            console.log(`new block has been created! Send it to peers`);
            this.setOfClients.forEach((socket) => {
                const newData: IReceivedData<IBlock> = {
                    content,
                    type: wsServerMsgTypes.NEW_BLOCK,
                };
                socket.send(JSON.stringify(newData));
            });
        }
    }

    public initMining(): void {
        observable.register(p2pServerEvents.NEW_BLOCK_MADE, this);
        observable.notify(blockchainEvents.START_MINING, {
            type: blockchainEvents.START_MINING,
        });
    }

    private initConnection(): void {

        this.server.on("connection", (socket, req) => {
            this.initMessageHandler(socket);
            this.initErrorHandler(socket);
        });
    }

    private initMessageHandler(socket: Socket): void {
        socket.on("message", (receivedData) => {
            const { type }: IReceivedDataSimple = JSON.parse(receivedData.toString());

            switch (type) {
                case wsClientMsgTypes.GET_ALL_BLOCKS:
                    const blockChain: IReceivedData<IBlockChain> = {
                        content: {
                            blockChain: BC.blockChain,
                            lastBlock: BC.lastBlock,
                        },
                        type: wsServerMsgTypes.ALL_BLOCKS,
                    };
                    socket.send(JSON.stringify(blockChain));
                    break;
                case wsClientMsgTypes.GET_LAST_DATA:
                    const lastData: IReceivedData<IBlockChainStats> = {
                        content: {
                            lastBlockHash: BC.lastBlock.hash,
                            lengthOfBlockchain: BC.blockChain.length,
                        },
                        type: wsServerMsgTypes.LAST_DATA,
                    };
                    socket.send(JSON.stringify(lastData));
                default:
                    break;
            }
        });
    }

    private initErrorHandler(socket: Socket): void {
        const closeConnection = () => {
            // tslint:disable-next-line:no-console
            console.log("connection failed to peer: " + socket.url);
        };
        socket.on("close", closeConnection);
        socket.on("error", closeConnection);
    }

    get clients(): Set<Socket> {
        return this.setOfClients;
    }
}
