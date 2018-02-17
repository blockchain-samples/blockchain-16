import EventEmitter = require("events");

class Observable extends EventEmitter implements IObservable {
    private observers: IObserver[] = [];

    constructor() {
        super();
    }

    public register(event: string, observer: IObserver | IObserver[]): void {
        if (Array.isArray(observer)) {
            this.observers = this.observers.concat(observer);
            this.on(event, (data: IReceivedData) => {
                this.observers.forEach((activeObserver) => {
                    activeObserver.update(data);
                });
            });
        } else {
            // tslint:disable-next-line:no-bitwise
            if (!~this.observers.indexOf(observer)) {
                this.observers.push(observer);
            }
            this.on(event, (data: IReceivedData) => {
                this.observers.forEach((activeObserver) => {
                    activeObserver.update(data);
                });
            });
        }
    }

    public notify(event: string, data: IReceivedData): void {
        this.emit(event, data);
    }

}

export const observable = new Observable();
