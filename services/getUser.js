const Group = require('../models/GroupMetadata');
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

const getUser = async (req, res) => {
    try {
        const { id, token } = req.body;
      
        if (!id) return res.status(400).send({ success: false, message: "Id is required" });

        const user = await User.findOne({ _id: id });
        if (!user) return res.status(404).send({ success: false, message: "User not found" });

        const Chat = {};
        const ContactData={};
        await Promise.all(user.contacts.map(async (conversationId) => {
            const [messages, conversation, group] = await Promise.all([
                Message.find({ conversationId }),
                Conversation.findOne({ _id: conversationId }),
                Group.findOne({ conversationId }),

            ]);

            Chat[conversationId] = {
                Message: messages,
                Conversation: conversation,
                Group: group
            };
            if(conversation.type!=="group"&&!ContactData[conversation.participants[1]])
            {
                const [Contact] = await Promise.all([
                    User.find({userId:conversation.participants[1] }),
                ]);
                ContactData[conversation.participants[1]]=Contact[0];
            }
             if(conversation.type!=="group"&&!ContactData[conversation?.participants[0]])
                {
                    const [Contact] = await Promise.all([
                        User.find(
                            { userId: conversation?.participants[0] }, 
                            { userId: 1, email: 1, profilePicture: 1, _id: 0,lastSeen:1 ,status:1}
                          ),
                    ]);
                    ContactData[conversation?.participants[0]]=Contact[0];
        
                }
        }));

       
        return res.status(200).send({ User: user, success: true, Chat, token,ContactData });
    } catch (error) {
        console.log("Error during getUser:", error);
        return res.status(500).send({ success: false, message: "Error during user data fetch or chat data fetch" });
    }
};

module.exports = getUser;