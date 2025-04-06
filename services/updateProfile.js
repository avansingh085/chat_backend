const User=require('../models/User'); 
const updateProfile=async(req,res)=>{
    try{
        let {userId,status,profilePicture}=req.body;
        if(!userId||!status||!profilePicture) return res.status(400).send({success:false,message:"All fields are required"});

       await User.findOneAndUpdate({userId:userId},{$set:{status:status,profilePicture:profilePicture}})
         return res.status(200).send({success:true,message:"Profile updated successfully"});
}
catch(error){
    console.log(error)
    return res.status(500).send({success:false,message:"Server error during profile update"});
}
}
module.exports=updateProfile;