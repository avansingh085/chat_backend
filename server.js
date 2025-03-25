const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({ origin: "*" })); 


const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


const {login,sign_in,sign_up,logout,verifyToken} = require('./controller/auth');
const getUser = require('./services/getUser');
const ConnectionDB = require('./models/ConnectionDB');
ConnectionDB();



app.post('/login', login);
app.post('/sign_up', sign_up);
app.post('/logout', logout);
app.post('/sign_in', sign_in);
app.post('/verifyToken', verifyToken);
app.post('/getUser', getUser);
const Users={};
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    Users[socket.handshake.query.userId]={isOnline:true,socketId:socket.id};
    socket.on("disconnect", () => {
         Users[socket.handshake.query.userId].isOnline=false;
         Users[socket.handshake.query.userId].socketId=null;
        console.log("User disconnected:", socket.id);
    });

    socket.on("message", ({ sender, receiver, message }) => { 
        console.log(`Message from ${sender} to ${receiver}: ${message}`);
        if(Users[receiver].isOnline)
        io.to(Users[receiver].socketId).emit("message", { sender, receiver, message });

    });
});



const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
