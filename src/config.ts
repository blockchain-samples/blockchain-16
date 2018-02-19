import network = require("../config/network.json");
import genesis = require("../config/genesis.json");

export const networkOptions = (network as IServerOptions);
export const preGenesis = (network as IBlock);
