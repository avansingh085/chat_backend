const User = require("../Schema/User");

const addContact=async (req,res)=>{
    const {user_mobile,mobile,user,img,title}=req.body;
    try{
    let isExist=User.findOne({user_mobile});
    if(!isExist)
    {
        return res.status(500).send({success:false,result:"user not exist"});
    }
    else
    {
       let isExistContact=await isExist.contacts.findOne({mobile});
       if(isExistContact)
       {
            isExistContact={mobile,img,user,title};
            await isExist.contacts.save();
       }
       else
       {
           isExist.contacts.push({mobile,user,img,title});
       }
       await isExist.save();
    }
    return res.send({success:true,result:"add cotact successfully"});
}
catch(err)
{
    return res.status(500).send({success:false,result:"error addContact"});
}
     
}
const append_message=async (req,res)=>{
    const mobile=req.query.mobile;
    try{
       let isExist=await User.findOne({mobile});
       if(isExist)
       {
           if(req.body.message)
           {
             isExist.messages.push(req.body);
             await isExist.save();
             return res.status(200).send({success:true,result:"message successfull append "})
           }
       }
       else
       {
          return res.status(500).send({success:false,result:"user not exist append message"});
       }
    }
    catch(err)
    {
       return res.status(500).send({success:false,result:"error occur in append message"});
    }
}
module.exports={addContact,append_message};