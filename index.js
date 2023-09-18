// express server with routes
import express from "express";
const app = express();
const port = 3000;
// import routes
import index from "./routes/index.js";

import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

// websocket server
wss.on("connection", function connection(ws) {
  // receive message from client
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
  // send message to client
  ws.send("something");
});

// use routes
app.use("/", index);

// start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
