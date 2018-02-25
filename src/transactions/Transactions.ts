import crypto = require("crypto");
import ec = require("elliptic");
import { TxOut, UnspentTxOut, UnspentTxOuts } from "./TxOutput";
import { TxIn } from "./TxInput";

let unspentTxOuts = new UnspentTxOuts();

class Transaction implements ITransaction {
    public id: string;
    public txIns: TxIn[];
    public txOuts: TxOut[];

    get transactionId (): string {
        const txInContent: string = this.txIns
            .map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex)
            .reduce((a, b) => a + b, '');

        const txOutContent: string = this.txOuts
            .map((txOut: TxOut) => txOut.address + txOut.amount)
            .reduce((a, b) => a + b, '');

        return crypto.createHmac("sha256", txInContent + txOutContent).digest("hex");
    };

    public signTxIn(txInIndex: number, privateKey: string, aUnspentTxOuts: IUnspentTxOuts): string {
        const txIn: TxIn = this.txIns[txInIndex];
        const dataToSign = this.id;
        const referencedUnspentTxOut = unspentTxOuts.findUnspentTxOut(txIn.txOutId, txIn.txOutIndex);
        const referencedAddress = referencedUnspentTxOut.address;
        const key = ec.keyFromPrivate(privateKey, 'hex');
        const signature: string = toHexString(key.sign(dataToSign).toDER());
        return signature;
    };
}