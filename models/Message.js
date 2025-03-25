const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    conversationId: { type: String, ref: "Conversation", required: true }, 
    senderId: { type: String, ref: "User", required: true }, 
    content: { type: String, default: "" },
    mediaUrl: { type: String, default: null }, 
    timestamp: { type: Date, default: Date.now }, 
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    reactions: {
      type: Map,
      of: String,
    },
    deletedFor: [{ type: String, ref: "User" }],
  });
  
  module.exports = mongoose.model("Message", MessageSchema);
  