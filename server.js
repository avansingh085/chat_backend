const express = require('express');
const cors = require('cors');
const database = require('./Schema/database.js');
const bcrypt = require('bcrypt');            // Add bcrypt for hashing passwords
const jwt = require('jsonwebtoken');         // Add jwt for token generation
const { Server } = require("socket.io");     // Socket.io integration
require('dotenv').config();
database(); // Initialize database connection
let JWT_SECRET="189ac7bcf390094e24315f5302e07ed2d4853d27cbb3f7bdaf532f86d8025fecf3079c8fbcaa1d4166dbd783d84c1a4512e1a89810f77f7ada0a0a39e343ccfb31c066aa9d1dda3fd13f1354425745a7708cfcb6ec94109336327d0797a1e30ace0b77f82be6f1782d96ff1785e3bfe4896e24a480b02129e4ef3076bcf47d9c3bc3f0811550392eed1664ca57c47368ed48f77e9faf124ac517f51015669e9f031b5bf8fbc92a5ca12abb6133b72e0423e1538d5b31fa2209140d6594be451b6bef2da76ccb60d844cdf84a0f303f2b853de19574688a4ada6b9120556ebbd413fcbd7c26c5e7952477dc4b5348124da0c1a5cfd41ef4a8d446c771c70b820f"

const app = express();
const httpServer = require("http").createServer(app); // Create HTTP server
const io = new Server(httpServer, {                  // Bind Socket.io to HTTP server
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const { chat_message, private_message, disconnect, new_user } = require('./Controller/Chat.js');
const { login, sign_up, tokenverify } = require('./Controller/verification.js');
const User = require('./Schema/User.js');
const { addContact, append_message } = require('./Controller/Operation.js');

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
}));

// Routes
app.post('/login', login);
app.post('/sign_up', sign_up);
app.post('/addContact',addContact);
app.post('/append_message',append_message)
// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user registration
  socket.on('new user', new_user);

  // Handle public messages
  socket.on('chat message', chat_message);

  // Handle private messages by receiver's username
  socket.on('private message', private_message);

  // Handle user disconnection
  socket.on('disconnect', disconnect);
});

// Start server
const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
