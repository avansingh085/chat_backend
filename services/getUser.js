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

        await Promise.all(user.contacts.map(async (conversationId) => {
            const [messages, conversation, group] = await Promise.all([
                Message.find({ conversationId }),
                Conversation.findOne({ _id: conversationId }),
                Group.findOne({ conversationId })
            ]);

            Chat[conversationId] = {
                Message: messages,
                Conversation: conversation,
                group: group
            };
        }));

        console.log({ User: user, success: true, Chat, token });
        return res.status(200).send({ User: user, success: true, Chat, token });
    } catch (error) {
        console.error("Error during getUser:", error);
        return res.status(500).send({ success: false, message: "Error during user data fetch or chat data fetch" });
    }
};

module.exports = getUser;