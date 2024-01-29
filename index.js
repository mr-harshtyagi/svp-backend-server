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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Function to generate random data
function generateRandomData() {
  return {
    status: "success",
    mrValue: Math.random(),
    smaValue: Math.random(),
    motorSpeed: Math.random(),
  };
}

// Websocket connection
io.on("connection", (socket) => {
  console.log("A client connected");

  // Periodically send data to the client (every 5 seconds in this example)
  const dataInterval = setInterval(() => {
    const responseData = generateRandomData();
    socket.emit("dataUpdate", responseData);
  }, 1000);

  // Send data to the client once when it connects
  // const responseData = generateRandomData();
  // socket.emit("dataUpdate", responseData);

  // Handle messages from the client
  socket.on("clientMessage", (message) => {
    console.log("Received message from client:", message);
    // Handle the message here
    const responseMessage = `Server received your message: ${message}`;
    // socket.emit("serverMessage", responseMessage);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected");
    // clearInterval(dataInterval); // Stop sending data when the client disconnects
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Place your route definitions here, after the CORS middleware
app.get("/", (req, res) => {
  res.send("I am alive!");
});

//Harsh's code

// const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// const server = http.createServer(app);
// const PORT = 4000;
// const io = socketIo(server);

// // Websocket connection
// io.on("connection", (socket) => {
//   console.log("A client connected");

//   // Handle messages from the client
//   socket.on("message", (message) => {
//     // const data = JSON.parse(message);
//     console.log("Received message data:", message);
//     // Handle the message here
//   });

//   // Handle messages from the client
//   socket.on("data", (message) => {
//     // const data = JSON.parse(message);
//     console.log("Received message data:", message);

//     // After handling the message, you can send a response back to the client
//     const responseData = {
//       status: "success",
//       mrValue: Math.random(),
//       smaValue: Math.random(),
//       motorSpeed: Math.random(),
//     };
//     socket.emit("dataResponse", responseData);
//     // Handle the message here
//   });

//   socket.on("test", (message) => {
//     console.log("Received data from Raspberry Pi:", message);
//     // Handle the message here

//     // After handling the message, you can send a response back to the client
//     const responseData = {
//       status: "success",
//       mrValue: Math.random(),
//       smaValue: Math.random(),
//       motorSpeed: Math.random(),
//     };
//     socket.emit("testResponse", responseData);
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("A client disconnected");
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
