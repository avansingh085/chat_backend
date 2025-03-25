const createConversation = async (req, res) => {
    try {
        let {  participants, type } = req.body;
        if(!participants||!type) return res.status(400).json({message:"Name is required"});
        let conversation = await Conversation.create({
            participants:participants,
            type:type,
        });
    participants.forEach(async (participant) => {
        let user = await User.findOne({
            _id: participant,
        });
        user.contacts.push(conversation._id);
        await user.save();
    })
        res.status(200).send({success:true,conversation});
    }
    catch(error){
        res.status(500).send({success:false,error});
    }
}
module.exports=createConversation;