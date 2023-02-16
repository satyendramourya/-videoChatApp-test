const express = require("express");
const io = require("socket.io")({
  path: "/webrtc",
});
const app = express();
const port = 8000;
app.get("/", (req, res) => res.send("server running"));
// app.get('/add/:f/:s',(req,res) => res.send(req.params.s+req.params.f))

const server = app.listen(port, () => {
  console.log(`WebRTC is listening on port ${port}`);
});

io.listen(server);

const webRTCNamespace = io.of("/webRTCPeers");
webRTCNamespace.on("connection", (socket) => {
  console.log(socket.id);

  socket.emit("connection-success", {
    status: "connection-success",
    socketId: socket.id,
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} has disconnected`);
  });

  socket.on("sdp", (data) => {
    console.log(data);
    socket.broadcast.emit("sdp", data);
  });

  socket.on("candidate", (data) => {
    console.log(data);
    socket.broadcast.emit("candidate", data);
  });
});
