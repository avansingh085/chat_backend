const create_pair_chat = async (req, res) => {
    try {
        let { user1, user2 } = req.body;
        if (!user1 || !user2) return res.status(400).json({ message: "User1 and User2 are required" });
        let pairChat = await PairChat.findOne({
            participants: { $all: [user1, user2] },
        });
        if(pairChat){
            res.status(200).json(pairChat);
        }
        else            
        {
            let newPairChat = new PairChat({
                participants: [user1, user2],type:"pair"
            });
            await newPairChat.save();
            res.status(200).json(newPairChat);
        }
    }catch (error) {
        res.status(500).json(error);
    }
} 
module.exports = create_pair_chat;
