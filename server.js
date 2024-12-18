const express = require('express');
const cors = require('cors');
const database = require('./Schema/database.js');
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For token generation
const User=require('./Schema/User');
const { Server } = require("socket.io"); // Socket.io integration
//const connection=require('./Controller/Chat.js')
require('dotenv').config();

database(); // Initialize database connection


const app = express();
//const httpServer = require("http").createServer(app); // HTTP server

const JWT_SECRET = process.env.JWT_SECRET || "189ac7bcf390094e24315f5302e07ed2d4853d27cbb3f7bdaf532f86d8025fecf3079c8fbcaa1d4166dbd783d84c1a4512e1a89810f77f7ada0a0a39e343ccfb31c066aa9d1dda3fd13f1354425745a7708cfcb6ec94109336327d0797a1e30ace0b77f82be6f1782d96ff1785e3bfe4896e24a480b02129e4ef3076bcf47d9c3bc3f0811550392eed1664ca57c47368ed48f77e9faf124ac517f51015669e9f031b5bf8fbc92a5ca12abb6133b72e0423e1538d5b31fa2209140d6594be451b6bef2da76ccb60d844cdf84a0f303f2b853de19574688a4ada6b9120556ebbd413fcbd7c26c5e7952477dc4b5348124da0c1a5cfd41ef4a8d446c771c70b820f"
;
const PORT = process.env.PORT || 3001;
const httpServer = require("http").createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    
  },
  
});
app.use(cors());
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
const connection=(socket) => {
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
      console.log(receiver,"   ",from,"PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP")
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
}
io.on('connection', connection);
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
