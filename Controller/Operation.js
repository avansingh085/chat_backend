const User = require("../Schema/User");

const addContact = async (req, res) => {
  const { mobile, user, client, img, title } = req.body;

  try {
    // Check if the target user and the client exist
    const targetUser = await User.findOne({ mobile });
    const clientUser = await User.findOne({ mobile: client });

    if (!targetUser || !clientUser) {
      return res.status(404).send({ success: false, result: "User or client does not exist" });
    }

    // Check if the contact already exists in the client's contacts
    const existingContact = clientUser.contacts.find((contact) => contact.mobile === mobile);

    if (existingContact) {
      // If contact exists, update its information
      existingContact.user = user;
      existingContact.mobile = mobile;
      existingContact.img = img || existingContact.img; // Update image if provided
      existingContact.title = title || existingContact.title; // Update title if provided
    } else {
      // If contact doesn't exist, add it
      clientUser.contacts.push({ mobile, user, img, title });
    }

    // Save the updated client record
    await clientUser.save();

    return res.send({ success: true, result: "Contact added/updated successfully" });
  } catch (err) {
    console.error("Error in addContact:", err.message);
    return res.status(500).send({ success: false, result: "Error in addContact", error: err.message });
  }
};

const append_message = async (req, res) => {
  const { mobile, message, from } = req.body;

  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).send({ success: false, result: "User does not exist" });
    }

    if (message && from) {
      // Append the message to the user's messages array
      user.messages.push({ receiver: mobile, message, from });
      await user.save();

      return res.status(200).send({ success: true, result: "Message successfully appended" });
    } else {
      return res.status(400).send({ success: false, result: "Invalid data provided" });
    }
  } catch (err) {
    console.error("Error in append_message:", err.message);
    return res.status(500).send({ success: false, result: "Error occurred in append_message", error: err.message });
  }
};

const requestUserMessage = async (req, res) => {
  try {
    const { receiver } = req.query;

    if (!receiver) {
      return res.status(400).send({ success: false, result: "Receiver ID is required" });
    }

    const user = await User.findOne({ mobile: receiver });

    if (!user) {
      return res.status(404).send({ success: false, result: "User not found" });
    }

    return res.status(200).send({ success: true, result: user.messages });
  } catch (err) {
    console.error("Error in requestUserMessage:", err.message);
    return res.status(500).send({ success: false, result: "Error in requestUserMessage", error: err.message });
  }
};

module.exports = { addContact, append_message, requestUserMessage };
