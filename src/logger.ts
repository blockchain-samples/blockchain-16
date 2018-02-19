import { noop } from "./utils";
import { dbg_colors } from "./constants";
import debug = require("debug")

interface ICustomLogger extends debug.IDebugger {
    color?: number
}

interface ILogger {
    error: (moduleName: string, message: string) => void,
    warn: (moduleName: string, message: string) => void,
    log: (moduleName: string, message: string) => void,
}

const appLog: ICustomLogger = debug('app:: log::');
const appWarn: ICustomLogger = debug('app:: warn::');
const appError: ICustomLogger = debug('app:: error::');

appLog.color = dbg_colors.LOG;
appWarn.color = dbg_colors.WARN;
appError.color = dbg_colors.ERROR;

const makeLogger = (logger: ICustomLogger) => (moduleName: string, message: string) => {
    const logMsg = moduleName ? `${moduleName} -> ${message}` : message;
    return logger(logMsg);
};

const log = makeLogger(appLog);
const warn = makeLogger(appWarn);
const error = makeLogger(appError);

const level = process.env.LOG_LEVEL || 3;

let Logger: ILogger;

switch (Number(level)) {
    case 1:
        Logger = {
            error,
            warn: noop,
            log: noop,
        };
        break;
    case 2:
        Logger = {
            error,
            warn,
            log: noop,
        };
        break;

    default:
        Logger = {
            error,
            warn,
            log,
        };
        break;
}

export default Logger;