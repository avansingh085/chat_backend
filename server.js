const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
 let cn={
  123:{
    name:"paw",
    number:930202
  }
 }
 console.log(cn["avn"])
// Enable CORS
app.use(cors({
  origin: "http://localhost:3000",  
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // React app URL
    methods: ["GET", "POST"]
  }
});

let users = {};  // Object to map socket ID to username

// Handle new user connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user registration (using username)
  socket.on('new user', (username) => {
    users[socket.id] = username;
    io.emit('user list', users);  // Broadcast updated user list to all users
  });

  // Handle public messages
  socket.on('chat message', (message) => {
    io.emit('chat message', { user: users[socket.id], message});
  });

  // Handle private messages by receiver's username
  socket.on('private message', ({ receiverName, message }) => {
    // Find the socket ID of the receiver
    console.log(receiverName, message,users[socket.id])
    const receiverSocketId = Object.keys(users).find(id => users[id] === receiverName);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('private message', { from: users[socket.id], message });
    } else {
      socket.emit('private message error', { message: "User not found!" });
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user list', users);  // Broadcast updated user list
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
