const express = require('express');
const { Server } = require('socket.io');
const app = express();
const http = require('http');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",  // React app URL
      methods: ["GET", "POST"]
    }
  });
module.exports={io};