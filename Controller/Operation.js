const User = require("../Schema/User");

const addContact = async (req, res) => {
  const { user_mobile, mobile, user, img, title } = req.body;
  try {
    let isExist = await User.findOne({ user_mobile });
    if (!isExist) {
      return res.status(500).send({ success: false, result: "User does not exist" });
    } else {
      let isExistContact = isExist.contacts.find(contact => contact.mobile === mobile);
      if (isExistContact) {
        // If the contact exists, update it
        isExistContact.user = user;
        isExistContact.img = img;
        isExistContact.title = title;
        await isExist.save();
      } else {
        // If the contact doesn't exist, add it
        isExist.contacts.push({ mobile, user, img, title });
        await isExist.save();
      }
    }
    return res.send({ success: true, result: "Contact added successfully" });
  } catch (err) {
    return res.status(500).send({ success: false, result: "Error in addContact", error: err.message });
  }
};

const append_message = async (req, res) => {
  const { mobile, message } = req.body;
console.log(req.body,"APPPLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
  try {
    let isExist = await User.findOne({ mobile });
    console.log(isExist,"kya be")
    if (isExist) {
      if (message) {
        // Append the message to the user's messages array
        isExist.messages.push({ receiver:mobile, message ,from});
        await isExist.save();
        return res.status(200).send({ success: true, result: "Message successfully appended" });
      }
    } else {
      return res.status(500).send({ success: false, result: "User does not exist" });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send({ success: false, result: "Error occurred in append_message", error: err.message });
  }
};

module.exports = { addContact, append_message };
