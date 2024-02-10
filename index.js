const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const PORT = 4000;
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://svp.smsl.online",
      "https://www.svp.smsl.online",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let mrValue = 0;
let smaValue = 0;
let motorSpeed = 0;
let temp = 75;
let acc = 0;

// Function to return actual data received from the raspberry pi
function getActualData() {
  return {
    status: "success",
    mrValue: mrValue,
    smaValue: smaValue,
    motorSpeed: motorSpeed,
    temp: 50 + Math.floor(Math.random() * 20),
    acc: Math.floor(Math.random() * 21) - 10,
  };
}

// Function to generate random data
function getRandomData() {
  let status = temp > 80 ? (temp > 90 ? "overheat" : "warning") : "healthy";
  return {
    status: status,
    mrValue: mrValue,
    smaValue: smaValue,
    motorSpeed: motorSpeed,
    temp: 50 + Math.floor(Math.random() * 20),
    // temp: temp,
    acc: Math.floor(Math.random() * 21) - 10,
  };
}

// Websocket connection
io.on("connection", (socket) => {
  console.log("A client connected", socket.id);

  // Periodically send data to the client (every 5 seconds in this example)
  const dataInterval = setInterval(() => {
    const responseData = getRandomData();
    socket.emit("dataUpdate", responseData);
  }, 100);

  // Handle messages from the client
  socket.on("clientMessage", (message) => {
    console.log("Received message from client:", message);

    mrValue = message.mrValue;
    smaValue = message.smaValue;
    motorSpeed = message.motorSpeed;
    // Handle the message here
    // const responseMessage = `Server received your message: ${message}`;
    // socket.emit("serverMessage", responseMessage);
  });

  // Handle messages from the raspberry pi
  socket.on("raspPiMessage", (message) => {
    console.log("Received message from client:", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Place your route definitions here, after the CORS middleware
app.get("/", (req, res) => {
  res.send("SVP server is online!");
});
