import pkg = require("../package.json");

const program = (pkg as any);
// tslint:disable-next-line:no-empty
export function noop() {}

export function projectVersion() {
    return program.version
}
