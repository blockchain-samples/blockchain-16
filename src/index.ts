import { BC } from "./blockchain/blockChain";
import { SERVER_PORT } from "./constants";
import { P2PClient } from "./ws/p2p.client";
import { P2PServer } from "./ws/p2p.server";

BC.createGenesis("816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");

const p2pServer = new P2PServer({
    clientTracking: true,
    port: SERVER_PORT,
});

const p2pClient = new P2PClient();
