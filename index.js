const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { svpSocket } = require("./helpers/svp");
const { svbSocket } = require("./helpers/svb");

// Set up rate limiter: maximum of 100 requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
});

const app = express();
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(cors());

const server = http.createServer(app);
const PORT = 4000; // process.env.PORT || 4000
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

// Initiate SVP experiment
svpSocket(io);

// Initiate SVP experiment - TO DO
// svbSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Place your route definitions here, after the CORS middleware
app.get("/", (req, res) => {
  res.send("SMSL server is online!");
});
