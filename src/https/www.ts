import http = require("http");
import path = require("path");
import { app } from "./app";
import { Logger } from "../logger";

const MODULE_NAME = "www";

export function www(options: IHttpAPIOptions) {

    const expressApp = app(options);

    const handleError: (error: Error) => void = (error) => Logger.error(MODULE_NAME, JSON.stringify(error));
    const handleListen: () => void = () => Logger.log(MODULE_NAME, `Server running at http://${options.host}:${options.httpPort}/`);

    const server = http.createServer(expressApp);

    server.listen(options.httpPort, options.host)
        .on("error", handleError)
        .on("listening", handleListen);
}
