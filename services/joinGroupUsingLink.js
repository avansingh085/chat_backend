const joinGroupUsingLink=async (req,res)=>{

    try{
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

}

module.exports=joinGroupUsingLink;