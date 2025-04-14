const { v4: uuidv4 } = require('uuid');
const Conversation=require('../models/Conversation');
const User=require('../models/User');

const genrateLink=async (req,res)=>{
try{

const {conversationId}=req.params;
const conversation=await Conversation.findOne({_id:conversationId});
  if(!conversation) return res.status(404).send({success:false,message:"Conversation not found"});
const groupJoinId=uuidv4();
//delet after 10 hours
setTimeout(() => {
    delete UidMapWithConversation[conversationId];
}, 10*60*60*1000); // 10 hours in milliseconds
UidMapWithConversation[conversationId]=groupJoinId;
const joinLink=`http://localhost:3001/group/${groupJoinId}/${conversationId}/joinLink`;
return res.status(200).send({success:true,joinLink})
}catch(err)
{
    console.log("Error during genrateLink:", err);
   return res.status(500).send({success:false,message:"Server error"});
}

}
module.exports=genrateLink;