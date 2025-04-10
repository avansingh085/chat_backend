const createNewMessage = async (req, res) => {
    try {
        let { senderId, receiverId, message, ConversationId ,mediaUrl} = req.body;
        if (!senderId || !receiverId || !message || !ConversationId) return res.status(400).json({ message: "Name is required" });
        let newMessage = await Message.create({
            senderId: senderId,
            receiverId: receiverId,
            message: message,
            ConversationId: ConversationId,
            mediaUrl: mediaUrl
        });
        res.status(200).send({ success: true, newMessage });

    } catch (error) {
        res.status(500).send({ success: false, error });
    }
}

module.exports=createNewMessage;