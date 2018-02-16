declare interface IBaseBlock {
    index: number;
    hash: Buffer;
}

declare interface ISimpleData {
    [name: string]: any;
}