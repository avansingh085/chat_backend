
const makeAdmin = async (req, res) => {
    try {
        let { userId,currAdmin, groupId } = req.body;
        if (!userId || !currAdmin || !groupId) return res.status(400).json({ message: "All fields are required" });
        let group = await Group.findOne({
            _id: groupId,
        });
        if (!group) return res.status(400).json({ message: "Group does not exist" });
        let isAdmin = false;
        group.adminIds.forEach((adminId) => {
            if (adminId == currAdmin) {
                isAdmin = true;
            }
        });    
    if(isAdmin)
        {
            group.adminIds.push(userId);
            await group.save();
            res.status(200).json(group);
        }
        else{
            res.status(400).json({message:"You are not an admin"});
        }
    } catch (error) {
        res.status(500).json(error);
    }
}
module.exports = makeAdmin;