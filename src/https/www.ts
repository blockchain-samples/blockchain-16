import http = require("http");
import path = require("path");
import { app } from "./app";

export function www(options: IHttpAPIOptions) {

    const expressApp = app(options);
    // tslint:disable-next-line:no-console
    const handleError: (error: Error) => void = (error) => console.log(`The ${error} was throws`);

    // tslint:disable-next-line:no-console
    const handleListen: () => void = () => console.log(`Server running at http://${options.host}:${options.httpPort}/`);

    const server = http.createServer(expressApp);

    server.listen(options.httpPort, options.host)
        .on("error", handleError)
        .on("listening", handleListen);
}
