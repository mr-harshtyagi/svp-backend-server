// this contains the helper functions, events and signalling for the SVP
// (Smart Vibration Platform) experiment

// Experiment data
let mrValue = 0;
let smaValue = 0;
let motorSpeed = 0;
let temp = 25;
let acc = 0;

// connections count
let experimentServers = 0;

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

// webRTC related variables
const users = {};
const socketToRoom = {};

// SVP Socket logic
function svpSocket(io) {
  // Websocket connection
  io.on("connection", (socket) => {
    // limit the number of connections
    // if (io.engine.clientsCount > 4) {
    //   socket.disconnect();
    // }
    console.log(
      "A client connected to SVP : ",
      socket.id,
      socket.handshake.auth
    );

    // check auth.type and update the count
    if (socket.handshake.auth.type === "experiment") {
      console.log("Experiment server connected");
      experimentServers++;
    }

    // disconnect the new server if the limit is reached
    if (experimentServers > 1) {
      console.log(
        "Experiment server limit reached, Disconnecting the new server..."
      );
      socket.disconnect();
      experimentServers--;
    }

    // Periodically send data to the frontend client
    const dataInterval = setInterval(() => {
      const responseData = getRandomData();
      socket.emit("svpDataUpdate", responseData);
    }, 100);

    // Handle messages from the client i.e. the frontend (SVP)
    socket.on("svpClientMessage", (message) => {
      console.log("Received message from frontend client:", message);

      mrValue = message.mrValue;
      smaValue = message.smaValue;
      motorSpeed = message.motorSpeed;
    });

    // Handle messages from the raspberry pi (SVP)
    socket.on("svpRaspPiMessage", (message) => {
      // console.log("Received message from Rasp Pi:", message);
      temp = message.temp;
      acc = message.acc;
      if (
        message.mrValue !== mrValue ||
        message.smaValue !== smaValue ||
        message.motorSpeed !== motorSpeed
      ) {
        socket.emit("svpServerResponse", {
          mrValue: mrValue,
          smaValue: smaValue,
          motorSpeed: motorSpeed,
        });
      }
    });

    // webRTC signaling events
    socket.on("join room", (roomID) => {
      console.log("Joining room: ", roomID, " Socket ID: ", socket.id);
      if (users[roomID]) {
        const length = users[roomID].length;
        if (length === 4) {
          console.log("Room full");
          socket.emit("room full");
          return;
        }
        users[roomID].push(socket.id);
      } else {
        users[roomID] = [socket.id];
      }
      socketToRoom[socket.id] = roomID;
      const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

      socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", (payload) => {
      console.log("Sending signal to: ", payload.userToSignal);
      io.to(payload.userToSignal).emit("user joined", {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    });

    socket.on("returning signal", (payload) => {
      console.log("Returning signal to: ", payload.callerID);
      io.to(payload.callerID).emit("receiving returned signal", {
        signal: payload.signal,
        id: socket.id,
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
        room = room.filter((id) => id !== socket.id);
        users[roomID] = room;
      }
      console.log("A client disconnected");
      clearInterval(dataInterval);
      mrValue = 0;
      smaValue = 0;
      motorSpeed = 0;
    });
  });
}

// export the function
module.exports = { svpSocket };
