const express = require('express');
const cors = require('cors');
const database = require('./Schema/database.js');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For token generation
const User=require('./Schema/User');
const { Server } = require("socket.io"); // Socket.io integration
const connection=require('./Controller/Chat.js')
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
app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { login, sign_up, tokenverify } = require('./Controller/verification.js');
const { addContact, append_message ,upload,uploadFile} = require('./Controller/Operation.js');
app.post('/login', login);
app.post('/sign_up', sign_up);
app.post('/addContact', addContact);
app.post('/append_message', append_message);
app.post('/upload/file',upload.single('file'),uploadFile);
app.post('/upload/photo',upload.single('photo'),uploadFile);
let users = {};
io.on('connection', connection);
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
