import network = require("../config/network.json");
import genesis = require("../config/genesis.json");
import coinbase = require("../config/coinbase.json");

export const networkOptions = (network as IServerOptions);
export const preGenesis = (genesis as IBlock);
export const wallet = (coinbase as IWallet);
