import bodyParser = require("body-parser");
import express = require("express");

import { BC } from "./blockchain/blockChain";
import { EXTERNAL_IP, SERVER_PORT } from "./constants";
import { P2PClient } from "./ws/p2p.client";
import { P2PServer } from "./ws/p2p.server";

export const serverHandler = express();
const p2pClient = new P2PClient();

serverHandler
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .get("/blocks", (req, res) => res.send(JSON.stringify(BC.blockChain)))
    .post("/connectToNode", (req, res) => {
        p2pClient.connectToPeers([req.body.peer]);
        res.send();
    });

const isMining = process.argv.slice(2)[0];
// tslint:disable-next-line:no-console
console.log(isMining);

if (isMining === "--mining") {

    const p2pServer = new P2PServer({
        clientTracking: true,
        port: SERVER_PORT,
    });
    p2pClient.connectToPeers([`${EXTERNAL_IP}:${SERVER_PORT}`]);
    serverHandler
        .get("/connectedPeers", (req, res) => {
            const peers: string[] = [];
            p2pServer.clients.forEach((ws) => {
                peers.push(`peer ${ws.url}`);
            });
            res.send(JSON.stringify(peers));
        })
        .get("/nodeUrl", (req, res) => {
            res.send(JSON.stringify(`${EXTERNAL_IP}:${SERVER_PORT}`));
        });
}
