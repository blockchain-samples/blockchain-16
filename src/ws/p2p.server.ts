import Socket = require("ws");
import { SERVER_PORT } from "../constants";

// send new block to peers

class P2PServer {
    public ip: any;
    private port: number = 8100;
    private server: Socket.Server;
    private clients: Set<Socket>;
    private ws: Socket;
    constructor(port?: number, options?: object) {

        if (port) {
            this.port = port;
        }

        this.server = new Socket.Server({port: this.port});

        this.clients = this.server.clients;

        this.initConnection = this.initConnection.bind(this);

        this.server.on("connection", this.initConnection);
        // tslint:disable-next-line:no-console
        console.log(`listening websocket p2p port on: ${this.port}`);
    }

    private initConnection(ws: Socket, req: any): void {
        this.ws = ws;
        this.ip = req.connection.remoteAddress;
        this.initMessageHandler();
        this.initErrorHandler();
    }

    private initMessageHandler(): void {
        this.ws.on("message", (data: string) => {
            this.ws.send("I listen");
        });
    }

    private initErrorHandler(): void {
        const closeConnection = () => {
            // tslint:disable-next-line:no-console
            console.log("connection failed to peer: " + this.ws.url);
        };
        this.ws.on("close", closeConnection);
        this.ws.on("error", closeConnection);
    }
}

export const p2pServer = new P2PServer(SERVER_PORT);
