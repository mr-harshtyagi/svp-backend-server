// express server with routes
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);
const port = 4000;
const io = new Server(server);

// import routes
import index from "./routes/index.js";
// import ledOn from "./routes/led-on.js";
// import ledOff from "./routes/led-off.js";

// websocket server
io.on("connection", (socket) => {
  console.log("a user connected");
});

// use routes
app.use("/", index);

// app.get("/led-on", ledOn);
// app.get("/led-off", ledOff);

// start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
