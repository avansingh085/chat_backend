

const express=require('express');
const router=express.Router();
const { v4: uuidv4 } = require('uuid');
const Conversation=require('../models/Conversation');
const User=require('../models/User');
const UidMapWithConversation={

}


router.get('/group/:conversationId/link',async (req,res)=>{
try{

const {conversationId}=req.params;
// console.log(req.params,"AVAN SINGH")
const conversation=await Conversation.findOne({_id:conversationId});
// console.log(conversationId,"AVAN SINGH")
  if(!conversation) return res.status(404).send({success:false,message:"Conversation not found"});
const groupJoinId=uuidv4();
//delet after 10 hours
setTimeout(() => {
    delete UidMapWithConversation[conversationId];
}, 10*60*60*1000); // 10 hours in milliseconds
UidMapWithConversation[conversationId]=groupJoinId;
const joinLink=`http://localhost:3001/group/${groupJoinId}/${conversationId}/joinLink`;
// console.log(joinLink,"AVAN SINGH");
return res.status(200).send({success:true,joinLink})
}catch(err)
{
    console.log("Error during genrateLink:", err);
   return res.status(500).send({success:false,message:"Server error"});
}

})
router.get('/group/:groupJoinId/:conversationId/joinLink',async (req,res)=>{
    try{
        console.log(req.params,"AVAN SINGH");
   if(!req.params.groupJoinId||!req.params.conversationId) 
    return res.status(400).send({success:false,message:"GroupJoinId and conversationId are required"});
   if(!UidMapWithConversation[req.params.conversationId]||UidMapWithConversation[req.params.conversationId]!==req.params.groupJoinId)
    return res.status(400).send({success:false,message:"Invalid groupJoinId"});
    const conversation=await Conversation.findOne({_id:req.params.conversationId});
    if(!conversation) return res.status(404).send({success:false,message:"Conversation not found"});
    const participants=conversation.participants;
    const {id}=req.body;
    if(!id) return res.status(400).send({success:false,message:"Id is required"});
 const user=await  User.findOne({_id:id});
 if(!user)
    return res.status(404).send({success:false,message:"User not found"});
participants.push(user._id);
await Conversation.findByIdAndUpdate(req.params.conversationId,{participants:participants});
return res.status(200).send({success:true,message:"User added to group successfully"});
}catch(err)
    {
        return res.status(500).send({success:false,message:"Server error"});
    }

})

module.exports=router;