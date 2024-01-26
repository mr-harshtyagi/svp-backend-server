const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const PORT = 4000;
const io = socketIo(server);

// Websocket connection
io.on("connection", (socket) => {
  console.log("A client connected");

  // Handle messages from the client
  socket.on("message", (message) => {
    // const data = JSON.parse(message);
    console.log("Received message data:", message);
    // Handle the message here
  });

  // Handle messages from the client
  socket.on("data", (message) => {
    // const data = JSON.parse(message);
    console.log("Received message data:", message);

    // After handling the message, you can send a response back to the client
    const responseData = {
      status: "success",
      mrValue: Math.random(),
      smaValue: Math.random(),
      motorSpeed: Math.random(),
    };
    socket.emit("dataResponse", responseData);
    // Handle the message here
  });

  socket.on("test", (message) => {
    console.log("Received data from Raspberry Pi:", message);
    // Handle the message here

    // After handling the message, you can send a response back to the client
    const responseData = {
      status: "success",
      mrValue: Math.random(),
      smaValue: Math.random(),
      motorSpeed: Math.random(),
    };
    socket.emit("testResponse", responseData);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
