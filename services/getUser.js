const User = require("../models/User");
const getUser= async (req, res) => {
    try {
        let { id } = req.body;
        if (!id) return res.status(400).json({ message: "Id is required" });
        let user = await User.findOne({
            _id: id,
        });
        res.status(200).json(user);
    } 
    catch (error) {
        res.status(500).json(error);
    }
}
module.exports = getUser;