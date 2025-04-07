var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sayhi } from "./src/tools.js";
import { EventEmitter } from "node:events";
import { createServer } from "node:http";
import { addUser, getAllUsers, removeUser, updateUser, getUser } from "./src/model/users.js";
console.log("Hello");
const myName = "VictorT!!!";
sayhi(myName);
const myEventEmitter = new EventEmitter();
function parseBody(req) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                try {
                    resolve(JSON.parse(body));
                }
                catch (e) {
                    reject(new Error("Invalid JSON"));
                }
            });
        });
    });
}
const myServer = createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, method } = req;
    try {
        if (!url) {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end("Bad Request: URL is undefined");
            return;
        }
        switch (true) {
            case url === "/" && method === "GET":
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("Hello");
                break;
            case url === "/api/users" && method === "POST":
                const newUser = yield parseBody(req);
                const added = addUser(newUser);
                res.writeHead(added ? 200 : 409, { "Content-Type": "text/html" });
                res.end(added ? "User Added" : "User already exists");
                break;
            case url === "/api/users" && method === "GET":
                const users = getAllUsers();
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(users));
                break;
            case url === "/api/users" && method === "PUT":
                const updatedUser = yield parseBody(req);
                const updated = updateUser(updatedUser);
                res.writeHead(updated ? 200 : 404, { "Content-Type": "text/html" });
                res.end(updated ? "User updated" : "User not found");
                break;
            case (url === null || url === void 0 ? void 0 : url.startsWith("/api/users/")) && method === "GET":
                const getId = parseInt(url.split("/")[3]);
                const user = getUser(getId);
                res.writeHead(user ? 200 : 404, {
                    "Content-Type": user ? "application/json" : "text/html"
                });
                res.end(user ? JSON.stringify(user) : "User not found");
                break;
            case (url === null || url === void 0 ? void 0 : url.startsWith("/api/users/")) && method === "DELETE":
                const deleteId = parseInt(url.split("/")[3]);
                const deleted = removeUser(deleteId);
                res.writeHead(deleted ? 200 : 404, {
                    "Content-Type": deleted ? "application/json" : "text/html"
                });
                res.end(deleted ? JSON.stringify(deleted) : "User not found");
                break;
            default:
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("Not Found");
        }
    }
    catch (error) {
        console.error("Server error:", error);
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("Internal Server Error");
    }
}));
myServer.listen(3005, () => {
    console.log("Server started at http://localhost:3005");
});
