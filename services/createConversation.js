const Conversation = require('../models/Conversation');
const GroupMetadata = require('../models/GroupMetadata');
const User = require('../models/User');

const createConversation = async (req, res) => {
    try {
        console.log(req.body,"AVAN SINGH");
        const { participants, type, groupName } = req.body;

        // Validation
        if (!participants) return res.status(400).send({ success: false, message: "Participants are required" });
        if (!type) return res.status(400).send({ success: false, message: "Type is required" });
        if (type === "group" && !groupName) return res.status(400).send({ success: false, message: "Group name is required" });

        const conversation = await Conversation.create({
            participants: participants,
            type: type,
        });

        // Update users' contacts
        await Promise.all(participants.map(async (participant) => {
            const user = await User.findOne({ userId: participant });
            if (!user) throw new Error(`User with ID ${participant} not found`);
            user.contacts.push(conversation._id);
            await user.save();
        }));

        // Create group metadata if it's a group
        if (type === "group") {
            await GroupMetadata.create({
                conversationId: conversation._id,
                groupName: groupName,
                adminIds: participants,
            });
        }

        // Send response
        res.send({ success: true, conversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).send({ success: false, error: error.message });
    }
};

module.exports = createConversation;