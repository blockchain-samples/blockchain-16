import { Logger } from "../logger";

export class TxOut implements ITxOut {
    public address: string;
    public amount: number;

    constructor(address: string, amount: number) {
        this.address = address;
        this.amount = amount;
    }
}

export class UnspentTxOut extends TxOut implements IUnspentTxOut {
    public readonly txOutId: string;
    public readonly txOutIndex: number;
    public readonly address: string;
    public readonly amount: number;

    constructor(txOutId: string, txOutIndex: number, address: string, amount: number) {
        super(address, amount);
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
    }
}

export class UnspentTxOuts {
    private utos: IUnspentTxOut[] = [];

    public findUnspentTxOut(txOutId, txOutIndex): IUnspentTxOut {

    }

}