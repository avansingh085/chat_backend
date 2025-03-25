const getConversation=async (req,res)=>{
   try {
        let {  id } = req.body;
        if(!id) return res.status(400).json({message:"Id is required"});
        let conversation = await Conversation.findOne({
            _id:id,
          });
          res.status(200).json(conversation);
   } catch (error) {
         res.status(500).json(error);
   }
}
module.exports = getConversation;