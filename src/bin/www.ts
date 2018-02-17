import http = require("http");
import path = require("path");
import { serverHandler } from "../app";

const port: number = +process.env.PORT || 8080;
const hostname: string = process.env.HOST || "127.0.0.1";

// tslint:disable-next-line:no-console
const handleError: (error: Error) => void = (error) => console.log(`The ${error} was throws`);

// tslint:disable-next-line:no-console
const handleListen: () => void = () => console.log(`Server running at http://${hostname}:${port}/`);

const server = http.createServer(serverHandler);

server.listen(port, hostname)
    .on("error", handleError)
    .on("listening", handleListen);
