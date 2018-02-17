import EventEmitter = require("events");

class Observable extends EventEmitter implements IObservable {
    private observers: IObserver[] = [];

    constructor() {
        super();
    }

    public register(event: string, observer: IObserver): void {
        // tslint:disable-next-line:no-bitwise
        if (!~this.observers.indexOf(observer)) {
            this.observers.push(observer);
        }
        this.on(event, (data: IReceivedData<IBlock | IBlockChain | IBlockChainStats>) => {
            this.observers.forEach((activeObserver) => {
                activeObserver.update(data);
            });
        });
    }

    public notify(event: string, data: IReceivedData<IBlock | IBlockChain | IBlockChainStats>): void {
        this.emit(event, data);
    }

}

export const observable = new Observable();
