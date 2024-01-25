const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 4000 });

wss.on("connection", (ws) => {
  console.log("New client connected");
  ws.on("message", (data) => {
    let sensorData = JSON.parse(data);
    console.log("Received: %s", sensorData);
  });

  ws.on("data", (data) => {
    let sensorData = JSON.parse(data);
    console.log("Data : %s", sensorData);
  });

  ws.send("Connection established");
});
