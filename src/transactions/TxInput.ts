import { Logger } from "../logger";

export class TxIn implements ITxIn {
    public txOutId: string;
    public txOutIndex: number;
    public signature: string;
}