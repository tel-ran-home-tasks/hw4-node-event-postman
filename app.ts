import { sayhi } from "./src/tools.js";
import { EventEmitter } from "node:events";
import { createServer, IncomingMessage } from "node:http";
import {
    addUser,
    getAllUsers,
    User,
    removeUser,
    updateUser,
    getUser
} from "./src/model/users.js";

console.log("Hello");
const myName: string = "VictorT!!!";
sayhi(myName);

const myEventEmitter = new EventEmitter();

async function parseBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new Error("Invalid JSON"));
            }
        });
    });
}

const myServer = createServer(async (req, res) => {
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
                const newUser = await parseBody(req) as User;
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
                const updatedUser = await parseBody(req) as User;
                const updated = updateUser(updatedUser);
                res.writeHead(updated ? 200 : 404, { "Content-Type": "text/html" });
                res.end(updated ? "User updated" : "User not found");
                break;

            case url?.startsWith("/api/users/") && method === "GET":
                const getId = parseInt(url.split("/")[3]);
                const user = getUser(getId);
                res.writeHead(user ? 200 : 404, {
                    "Content-Type": user ? "application/json" : "text/html"
                });
                res.end(user ? JSON.stringify(user) : "User not found");
                break;

            case url?.startsWith("/api/users/") && method === "DELETE":
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
    } catch (error) {
        console.error("Server error:", error);
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("Internal Server Error");
    }
});

myServer.listen(3005, () => {
    console.log("Server started at http://localhost:3005");
});
