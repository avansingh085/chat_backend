const moongose=require('mongoose');
const Conversation = require('./Conversation');
const NotificationSchema=new moongose.Schema({
    ConversationId:{
        type:moongose.Schema.Types.ObjectId,
        ref:'Conversation',
        required:true
    },
    
});