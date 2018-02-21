process.env.DEBUG = "app *, -not_this"

import { noop } from "./utils";
import { dbg_colors } from "./constants";
import debug = require("debug")

interface ICustomLogger extends debug.IDebugger {
    color?: number
}

enum ILogLevel {
    One,
    Two,
    Tree,
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

const Log = makeLogger(appLog);
const Warn = makeLogger(appWarn);
const Error = makeLogger(appError);

export class Logger {
    private static loggerLevel: ILogLevel = 3;
    private static isEnable: boolean = false;
    private static Log = makeLogger(appLog);
    private static Warn = makeLogger(appWarn);
    private static Error = makeLogger(appError);
    set logLevel(level: ILogLevel) {
        Logger.loggerLevel = level;
    }

    public static enable() {
        Logger.isEnable = true;
    }

    public static disable() {
        Logger.isEnable = false;
    }

    public static log(moduleName: string, message: string) {
        if (Logger.loggerLevel > 2 && Logger.isEnable) {
            Logger.Log(moduleName, message);
        }
    }

    public static warn(moduleName: string, message: string) {
        if (Logger.loggerLevel > 1 && Logger.isEnable) {
            Logger.Warn(moduleName, message);
        }
    }

    public static error(moduleName: string, message: string) {
        if (Logger.isEnable) {
            Logger.Error(moduleName, message);
        }
    }
}