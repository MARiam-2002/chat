import express from "express";
const app = express();
import { Server } from "socket.io";
const port = 3000;

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

const io = new Server(server, { cors: "*" });
let sockets = new Set();
io.on("connection", onConnected);
function onConnected(socket) {
  sockets.add(socket.id);

  io.emit("clients-total", sockets.size);

  socket.on("disconnect", () => {
    console.log("socket deleted", socket.id);
    sockets.delete(socket.id);
    io.emit("clients-total", sockets.size);
  });
  socket.on("message", (data) => {
    socket.broadcast.emit("chatBox-message", data);
  });
  socket.on("feedback", (data) => {
    socket.broadcast.emit("feed", data);
  });
}
