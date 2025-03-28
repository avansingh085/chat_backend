const express = require('express');
const cors = require('cors');
const app = express();
const moongose=require('mongoose')
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
const getUser= require('./services/getUser');
const Conversation = require('./services/createConversation');
const Message=require('./models/Message');
const ConversationSchema=require('./models/Conversation');
const ConnectionDB = require('./models/ConnectionDB');

ConnectionDB();
app.post('/login', login,getUser);
app.post('/sign_up', sign_up,getUser);
app.post('/logout', logout);
app.post('/verifyToken', verifyToken, getUser);
app.post("/newConversation", Conversation)
const Users={};
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    Users[socket.handshake.query.userId]={isOnline:true,socketId:socket.id};
    socket.on("disconnect", () => {
         Users[socket.handshake.query.userId].isOnline=false;
         Users[socket.handshake.query.userId].socketId=null;
        console.log("User disconnected:", socket.id);
    });

    socket.on("message", async (mes) => { 
        console.log(`Message from {}`,mes);
        let participants=await ConversationSchema.findOne({_id:mes.conversationId});
        participants=participants.participants
      participants.forEach((participant)=>{
        if(Users[participant]?.isOnline&&participant!==mes.sender)
          io.to(Users[participant].socketId).emit("message", mes);
      })
      const newMessage=new Message(mes);
        await newMessage.save();

    });
});



const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
