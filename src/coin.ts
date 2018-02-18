#!/usr/bin/env node

import { BC } from "./blockchain/blockChain";
import { serverConfig } from "./config";
import { commands } from "./constants";
import { www } from "./https/www";
import { P2PClient } from "./ws/p2p.client";
import { P2PServer } from "./ws/p2p.server";
import utils = require("./utils");

(function executeByFlags(flags: string[]): void {
    if (~flags.indexOf(commands.SHOW_VERSION[0]) || ~flags.indexOf(commands.SHOW_VERSION[1])) {
        console.log(utils.projectVersion());
        return;
    }  
    
    if (~flags.indexOf(commands.SHOW_HELP[0]) || ~flags.indexOf(commands.SHOW_HELP[1])) {
        console.log("help");
        return;
    }

    if (~flags.indexOf(commands.SHOW_LOGS[0]) || ~flags.indexOf(commands.SHOW_LOGS[1])) {
        console.log("enable logs");
    }

    const p2pServer = new P2PServer({
        clientTracking: true,
        port: serverConfig.p2pPort,
    });
    const p2pClient = new P2PClient({
        host: serverConfig.host,
        p2pPort: serverConfig.p2pPort,
        httpPort: serverConfig.httpPort
    });

    if (~flags.indexOf(commands.ENABLE_MINING[0]) || ~flags.indexOf(commands.ENABLE_MINING[1])) {
        p2pServer.initMining();
    }

    if (~flags.indexOf(commands.ENABLE_HTTP[0])) {
        www({
            host: serverConfig.host,
            p2pPort: serverConfig.p2pPort,
            httpPort: serverConfig.httpPort,
            p2pServer,
            p2pClient,
            BC,
        });
    }
})(process.argv.slice(2));
