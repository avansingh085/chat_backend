const express = require('express');
const cors = require('cors');
const app = express();
const moongose=require('mongoose')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/uploads", express.static("uploads"));
app.use(cors({ origin: "*" }));



const http = require('http');
const multer=require('multer');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const ConnectionDB = require('./models/ConnectionDB');
ConnectionDB();
const upload = require('./controller/imageUploadDisk');


const updateProfile = require('./services/updateProfile');
const uploadImage=require('./services/uploadImage');
const {login,sign_in,sign_up,logout,verifyToken} = require('./controller/auth');
const getUser= require('./services/getUser');
const Conversation = require('./services/createConversation');
const Message=require('./models/Message');
const ConversationSchema=require('./models/Conversation');
const getImage = require('./services/getImage');


app.post('/login', login,getUser);
app.post('/sign_up', sign_up,getUser);
app.post('/logout', logout);
app.post('/verifyToken', verifyToken, getUser);
app.post("/newConversation", Conversation)
app.post("/upload", upload, uploadImage);
app.post("/updateProfile", updateProfile);
const Users={};
const Notifications={};
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    Users[socket.handshake.query.userId]={isOnline:true,socketId:socket.id};
    console.log("Message received:", Users);
     socket.on("deleteNotification", (notificationKey)=>{
      
      Notifications[notificationKey]={count:0};
      socket.emit("notification", {count:Notifications[notificationKey]?.count||0,notificationKey});
     }
    )


    
    socket.on("notification",async (notificationKey)=>{
      
      if(Notifications[notificationKey])
      {
          io.to(socket.id).emit("notification", {
          
              count:Notifications[notificationKey]?.count,notificationKey
          });
      }
      else{
        io.to(socket.id).emit("notification", {
          count:Notifications[notificationKey]?.count,notificationKey
        });
      }

    })

    //when user disconnects, we will remove the user from the online users list
    socket.on("disconnect", () => {
         Users[socket.handshake.query.userId].isOnline=false;
         Users[socket.handshake.query.userId].socketId=null;
        console.log("User disconnected:", socket.id);
    });


    //all message coming from the client will be handled here
    socket.on("message", async (mes) => { 
     
        let participants=await ConversationSchema.findOne({_id:mes.conversationId});
        participants=participants.participants
      participants.forEach((participant)=>{

        const notificationKey = `${participant}-${mes.conversationId}`;
        if(Notifications[notificationKey])
        {
          if(participant!==mes.sender)
            Notifications[notificationKey].count++;
        }
        else{
          if(participant!==mes.sender)
            Notifications[notificationKey]={count:1};
        }


        //those user oneline and not the sender will get the message
        if(Users[participant]?.isOnline&&participant!==mes.sender)
        {
          console.log("User is online:",Users[participant],Notifications);
          io.to(Users[participant].socketId).emit("message", mes);
           io.to(Users[participant].socketId).emit("notification", {
            count:Notifications[notificationKey].count,notificationKey
        });
      }
      })


      //message save in database in background in message schema
      const newMessage=new Message(mes);
        await newMessage.save();
    });
});


const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
