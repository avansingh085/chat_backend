const Group=require('./models/GroupMetadata')
const createGroup =async (req,res)=>{
     try {
        let {  adminIds,groupName, ConversationId,groupPicture} = req.body;
        if(!adminIds||!groupName||!ConverationId||!groupPicture) return res.status(400).send({success:true,message:"Name is required"});
        let group = await Group.create({
            adminIds:adminIds,
            groupName:groupName,
            ConversationId:ConversationId,
            groupPicture:groupPicture
        });
       return res.status(200).send({group,success:true});
}catch(error){
   return res.status(500).send({success:true,message:"server err during group creation"});
}
}
module.exports = createGroup;