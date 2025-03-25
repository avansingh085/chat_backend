const createGroup =async (req,res)=>{
     try {
        let {  adminIds,groupName, ConversationId,groupPicture} = req.body;
        if(!adminIds||!groupName||!ConverationId||!groupPicture) return res.status(400).json({message:"Name is required"});
        let group = await Group.create({
            adminIds:adminIds,
            groupName:groupName,
            ConversationId:ConversationId,
            groupPicture:groupPicture
        });
        res.status(200).json(group);

}catch(error){
    res.status(500).json(error);
}
}
module.exports = createGroup;