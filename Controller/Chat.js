let users = {};
const {io}=require('./Socket.js');
const private_message=({ receiverName, message }) => {
    // Find the socket ID of the receiver
    console.log(receiverName, message,users[socket.id])
    const receiverSocketId = Object.keys(users).find(id => users[id] === receiverName);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('private message', { from: users[socket.id], message });
    } else {
      socket.emit('private message error', { message: "User not found!" });
    }
  }
  const disconnect=(socket) => {
    delete users[socket.id];
    io.emit('user list', users);  // Broadcast updated user list
  }
  //public Broadcast
  const chat_message=(message) => {
    io.emit('chat message', { user: users[socket.id], message});
  }
  const new_user=(username) => {
    users[socket.id] = username;
    io.emit('user list', users);  // Broadcast updated user list to all users
  }
  module.exports={new_user,disconnect,chat_message,private_message};