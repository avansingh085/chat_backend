const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();


const destroyToken =(token)=>{
   try{
         return null;
    }
    catch(error){
        console.log(error);
    }
}


const verifyToken = (req, res, next) => {
    try {
        const {token} = req.body;
       // console.log(token)
        if (!token) {
            return res.status(401).send({ message: "No Token Provided" });
        }
      //  console.log(token);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.body = { id: decoded.id, token,...req.body };
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).send({ message: "Invalid Token" });
    }
};


const login = async (req, res,next) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ success:false,message: "Email and Password are required!" });
        let user = await User.findOne({
            email: email,
        });
        if (user) {
            let isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
                req.body={id:user._id,token,...req.body};
                next();
            } else {
              return  res.status(401).send({success:false, message: "Password is incorrect try correct" });
            }
        } else {
           return res.status(404).send({ success:false,message: "User not found" });
        }
    }
    catch (error) {
        console.log(error)
       return res.status(500).send({success:false});
    }
}



const logout = async (req, res) => {
    try{
        let {token} = req.body;
        if(!token) return res.status(400).json({message:"Token is required"});
        destroyToken(token);
        res.status(200).json({message:"Logged out successfully"});
    }
    catch(error){
        res.status(500).json(error);
    }
}


const sign_up=async (req,res,next)=>{
    try {
          console.log(req.body, "Processing sign-up request");
        let { userId, email, password} = req.body;
        if (!userId || !email || !password) return res.status(400).send({ success:false,message: "All input is required" });
        let user = await User.findOne({
            email: email,
        });
        if (user) return res.status(400).send({ success:false,message: "User already exists" });
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);
        password = hashedPassword;
        let newUser = new User({
            userId,
            email,
            password,
        });
        await newUser.save();
        let token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);
        req.body={id:newUser._id,token,...req.body};
        next();
    } catch (error) {
        console.log(error,"erro during signup");
       return res.status(500).send({success:false});
    }
}
module.exports={login,logout,sign_up,verifyToken};