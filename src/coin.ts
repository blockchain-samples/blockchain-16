#!/usr/bin/env node

import { BC } from "./blockchain/blockChain";
import { networkOptions } from "./config";
import { commands, HELP_INFO } from "./constants";
import { www } from "./https/www";
import { P2PClient } from "./ws/p2p.client";
import { P2PServer } from "./ws/p2p.server";
import utils = require("./utils");
import Logger = require("./logger");

(function executeByFlags(flags: string[]): void {
    if (~flags.indexOf(commands.SHOW_VERSION[0]) || ~flags.indexOf(commands.SHOW_VERSION[1])) {
        console.log(utils.projectVersion());
        return;
    }  
    
    if (~flags.indexOf(commands.SHOW_HELP[0]) || ~flags.indexOf(commands.SHOW_HELP[1])) {
        console.log(HELP_INFO);
        return;
    }

    if (~flags.indexOf(commands.SHOW_LOGS[0]) || ~flags.indexOf(commands.SHOW_LOGS[1])) {
        console.log("enable logs");
    }

    const p2pServer = new P2PServer({
        clientTracking: true,
        port: networkOptions.p2pPort,
        backlog: networkOptions.maxpeers,
    });
    const p2pClient = new P2PClient({
        host: networkOptions.host,
        p2pPort: networkOptions.p2pPort,
        remotePeers: networkOptions.remotePeers,
        nodiscover: networkOptions.nodiscover,
    });

    if (~flags.indexOf(commands.ENABLE_MINING[0]) || ~flags.indexOf(commands.ENABLE_MINING[1])) {
        p2pServer.initMining();
    }

    if (~flags.indexOf(commands.ENABLE_HTTP[0])) {
        www({
            host: networkOptions.host,
            httpPort: networkOptions.httpPort,
            p2pServer,
            p2pClient,
            BC,
        });
    }
})(process.argv.slice(2));
