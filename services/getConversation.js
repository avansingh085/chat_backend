const getConversation=async (req,res)=>{
    try {
          let {  id } = req.body;
          if(!id) return res.status(400).json({message:"Id is required"});
          let conversation = await Conversation.findOne({
                _id:id,
             });
           return  res.status(200).success(conversation);
    } catch (error) {
           return res.status(500).json(error);
    }

    }
    module.exports = getConversation;