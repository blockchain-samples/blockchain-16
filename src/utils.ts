import pkg = require("../package.json");

interface IHexBinTable {
    [props: string]: string
}

const program = (pkg as any);
// tslint:disable-next-line:no-empty
export function noop() {}

export function projectVersion() {
    return program.version
}

export function hexToBinary(s: string): string {
    let ret: string = '';
    const lookupTable: IHexBinTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111'
    };
    for (let i = 0; i < s.length; i += 1) {
        const char: string = s[i];
        if (lookupTable[char]) {
            ret += lookupTable[char];
        } else {
            return null;
        }
    }
    return ret;
};

export function getCurrentTimestamp (): number {
    return Math.round(new Date().getTime() / 1000);
}
