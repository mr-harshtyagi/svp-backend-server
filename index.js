// express server with routes
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";

// allow cross origin requests
// import cors from "cors";

const app = express();
// app.use(cors());

const server = createServer(app);
const port = 4000;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// import routes
import index from "./routes/index.js";
// import ledOn from "./routes/led-on.js";
// import ledOff from "./routes/led-off.js";
// use routes
app.use("/", index);

// Define sensor data
const sensorData = Array.from({ length: 10 }, () =>
  Math.floor(Math.random() * 40)
);

// WebSocket server
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("sensorData", sensorData);
  socket.on("message", (data) => {
    console.log("message received", data);
  });
});

// app.get("/led-on", ledOn);
// app.get("/led-off", ledOff);

// start server
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
