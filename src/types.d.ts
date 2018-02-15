declare interface BaseBlock {
    index: number;
    hash: Buffer;
}

declare interface SimpleData {
    [name: string]: any;
}