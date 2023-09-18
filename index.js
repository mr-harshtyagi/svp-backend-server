// express server with routes
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);
const port = 3000;
const io = new Server(server);

// import routes
import index from "./routes/index.js";

// websocket server
io.on("connection", (socket) => {
  console.log("a user connected");
});

// use routes
app.use("/", index);

// start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
