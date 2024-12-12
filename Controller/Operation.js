const User = require("../Schema/User");
const multer=require('multer');
const addContact = async (req, res) => {
  const { mobile, user, client, img, title } = req.body;
  try {
    
    const targetUser = await User.findOne({ mobile });
    const clientUser = await User.findOne({ mobile: client });

    if (!targetUser || !clientUser) {
      return res.status(404).send({ success: false, result: "User or client does not exist" });
    }
    const existingContact = clientUser.contacts.find((contact) => contact.mobile === mobile);

    if (existingContact) {
      
      existingContact.user = user;
      existingContact.mobile = mobile;
      existingContact.img = img || existingContact.img; 
      existingContact.title = title || existingContact.title; 
    } else {
      
      clientUser.contacts.push({ mobile, user, img, title });
    }

    
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
const uploadFile=(req, res) => {
  if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
  }
  res.send({ 
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`
  });
};
module.exports = { addContact, append_message, requestUserMessage ,upload,uploadFile};
