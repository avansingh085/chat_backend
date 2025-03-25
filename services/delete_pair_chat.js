const deletePairChat = async (req, res) => {
    try {
        let { id } = req.body;
        if (!id) return res.status(400).json({ message: "Id is required" });
        let pairChat = await PairChat.findOne({
            _id: id,
        });
        if(pairChat){
            await pairChat.delete();
            res.status(200).json("Pair Chat has been deleted");
        }
        else
        {
            res.status(404).json("Pair Chat not found");
        }
    }catch (error) {
        res.status(500).json(error);
    }
}
module.exports = deletePairChat;