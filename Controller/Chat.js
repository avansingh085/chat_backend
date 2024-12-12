var users={};
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
module.exports = connection;
