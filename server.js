const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let startTime = 0;
let isRunning = false;

io.on('connection', (socket) => {
  console.log('Client connected');

  // Send the start time to the new client
  socket.emit('startTimer', startTime);

  // Handle startTimer event from the client
  socket.on('startTimer', (clientStartTime) => {
    if (!isRunning) {
      startTime = clientStartTime;
      isRunning = true;
      io.emit('startTimer', startTime);
    }
  });

  // Handle stopTimer event from the client
  socket.on('stopTimer', () => {
    if (isRunning) {
      isRunning = false;
      io.emit('stopTimer');
    }
  });

  // Handle resetTimer event from the client
  socket.on('resetTimer', () => {
    startTime = 0;
    isRunning = false;
    io.emit('resetTimer');
  });

  // Sync timer state with the new client
  socket.emit('syncTimer', calculateElapsedSeconds());

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const calculateElapsedSeconds = () => {
  if (isRunning) {
    const currentTime = Date.now();
    return Math.floor((currentTime - startTime) / 1000);
  }
  return 0;
};

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
