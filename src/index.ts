import { BC } from "./blockChain";

BC.addBlock(BC.makeBlock("Yeap"));
// tslint:disable-next-line:no-console
console.log(BC.chowBlocks());
