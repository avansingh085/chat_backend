const express = require('express');
const cors = require('cors');
const database = require('./Schema/database.js');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For token generation
const User=require('./Schema/User');
const { Server } = require("socket.io"); // Socket.io integration
require('dotenv').config();

database(); // Initialize database connection
// Constants
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key";
const PORT = process.env.PORT || 3001;

// Express setup
const app = express();
const httpServer = require("http").createServer(app); // HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const { login, sign_up, tokenverify } = require('./Controller/verification.js');
const { addContact, append_message } = require('./Controller/Operation.js');

app.post('/login', login);
app.post('/sign_up', sign_up);
app.post('/addContact', addContact);
app.post('/append_message', append_message);

// In-memory user mapping
let users = {};

// Socket.io Handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  // Register new user
  socket.on('new user', (username) => {
    try {
      if (!username || typeof username !== 'string' || username.trim() === '') {
        socket.emit('user error', { message: "Invalid username!" });
        return;
      }
      users[socket.id] = username.trim();
      io.emit('user list', users); // Broadcast updated user list
    } catch (err) {
      console.error("Error registering new user:", err);
    }
  });

  // Public messages
  socket.on('chat message', (message) => {
    try {
      const username = users[socket.id];
      if (!username) {
        socket.emit('chat message error', { message: "You are not registered!" });
        return;
      }
      io.emit('chat message', { user: username, message });
    } catch (err) {
      console.error("Error sending chat message:", err);
    }
  });

  // Private messages
  socket.on('private message',async ({ receiver,from, message }) => {
    try {
        const senderData =await User.findOne({mobile:from});
        const senderMessages=senderData.messages;
        const updatesenderMessage=[...senderMessages,{from,receiver:receiver,message}];
        senderData.messages=updatesenderMessage;
        await senderData.save();
        const receiverSocketId = Object.keys(users).find(id => users[id] === receiver);
        const receiverData=await User.findOne({mobile:receiver});
        const receiverMessageArray=receiverData.messages;
        receiverData.messages=[...receiverMessageArray,{from,receiver:receiver,message}];
        await receiverData.save();
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('private message', { from, message ,receiver});
      } else {
        socket.emit('private message error', { message: "User not found!" });
      }
    } catch (err) {
      console.error("Error sending private message:", err);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    try {
      if (users[socket.id]) {
        delete users[socket.id];
        io.emit('user list', users); // Broadcast updated user list
      }
    } catch (err) {
      console.error("Error handling disconnection:", err);
    }
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
