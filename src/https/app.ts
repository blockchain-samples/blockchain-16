import bodyParser = require("body-parser");
import express = require("express");

export function app(options: IHttpAPIOptions) {
    const serverHandler = express();
    const { BC, p2pClient, p2pServer } = options;
    serverHandler
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({ extended: false }))
        .get("/blocks", (req, res) => res.send(JSON.stringify(BC.blockChain)))
        .post("/connectToNode", (req, res) => {
            p2pClient.connectToPeers([req.body.peer]);
            res.send();
        })
        .get("/connectedPeers", (req, res) => {
            const peers: string[] = [];
            p2pServer.clients.forEach((ws) => {
                peers.push(`peer ${ws.url}`);
            });
            res.send(JSON.stringify(peers));
        })
        .get("/nodeUrl", (req, res) => {
            res.send(JSON.stringify(`${options.host}:${options.httpPort}`));
        });
    return serverHandler;
}
