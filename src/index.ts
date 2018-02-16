// import { BC } from "./blockChain";

// BC.createGenesis("816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
// BC.addBlock(BC.makeBlock("Yeap"));
// // tslint:disable-next-line:no-console
// console.log(BC.blockChain);
import { p2pServer } from "./ws/p2p.server";

const ws = new WebSocket("ws://localhost:8100");

ws.onopen = () => {
    // tslint:disable-next-line:no-console
    ws.send("Hello");
};

ws.onmessage = (ev) => {
    // tslint:disable-next-line:no-console
    console.log("ws get message:" + ev.data);
};
