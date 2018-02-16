import WebSocket = require("ws");
import { SERVER_PORT } from "../constants";

// const ws = new WebSocket("ws://localhost:8100");

// ws.onopen = () => {
//     // tslint:disable-next-line:no-console
//     ws.send("Hello");
// };

// ws.onmessage = (ev) => {
//     // tslint:disable-next-line:no-console
//     console.log("ws get message:" + ev.data);
// };

interface IPeerAddres {
    ip: number | string;
    port: number;
}

// get new block and add it to blockchain

class P2PClient {
    private conectedPeers: WebSocket[];

    constructor() {
        this.connectToPeers([{ ip: "localhost", port: SERVER_PORT}]);
    }

    public connectToPeers(newPeers: IPeerAddres[]) {
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
            // tslint:disable-next-line:no-console
            console.log("connection enable");
        });
        this.conectedPeers.push(ws);
    }

    private initErrorHandler(ws: WebSocket): void {
        ws.on("error", () => {
            // tslint:disable-next-line:no-console
            console.log("connection failed");
        });
    }

    private initMassageHandler(ws: WebSocket): void {
        ws.onmessage = (ev) => {
            // tslint:disable-next-line:no-console
            console.log("ws get message:" + ev.data);
        };
    }
}

export const p2pClient = new P2PClient();
