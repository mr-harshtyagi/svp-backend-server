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
      "http://localhost:5000",
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
    status: "healthy",
    mrValue: mrValue,
    smaValue: smaValue,
    motorSpeed: motorSpeed,
    temp: temp,
    acc: acc,
  };
}

// Function to generate random data
function getRandomData() {
  let status = temp > 80 ? (temp > 90 ? "overheat" : "warning") : "healthy";
  // return {
  //   status: status,
  //   mrValue: mrValue,
  //   smaValue: smaValue,
  //   motorSpeed: motorSpeed,
  //   temp: 50 + Math.floor(Math.random() * 20),
  //   // temp: temp,
  //   acc: Math.floor(Math.random() * 21) - 10,
  // };
  return getActualData();
}

// Websocket connection
io.on("connection", (socket) => {
  // limit the number of connections
  if (io.engine.clientsCount > 2) {
    socket.disconnect();
  }
  console.log("A client connected", socket.id);

  // Periodically send data to the client
  const dataInterval = setInterval(() => {
    const responseData = getRandomData();
    socket.emit("dataUpdate", responseData);
  }, 100);

  // Handle messages from the client i.e. the frontend
  socket.on("clientMessage", (message) => {
    console.log("Received message from frontend client:", message);

    mrValue = message.mrValue;
    smaValue = message.smaValue;
    motorSpeed = message.motorSpeed;
  });

  // Handle messages from the raspberry pi
  socket.on("raspPiMessage", (message) => {
    console.log("Received message from Rasp Pi:", message);
    temp = message.temp;
    acc = message.acc;
    if (
      message.mrValue !== mrValue ||
      message.smaValue !== smaValue ||
      message.motorSpeed !== motorSpeed
    ) {
      socket.emit("serverResponse", {
        mrValue: mrValue,
        smaValue: smaValue,
        motorSpeed: motorSpeed,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected");
    clearInterval(dataInterval);
    mrValue = 0;
    smaValue = 0;
    motorSpeed = 0;
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Place your route definitions here, after the CORS middleware
app.get("/", (req, res) => {
  res.send("SVP server is online!");
});
