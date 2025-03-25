const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();;
const destroyToken =(token)=>{
   try{
         return null;
    }
    catch(error){
        console.log(error);
    }
}
const verifyToken = (req,res) => {
    try {
        let { token } = req.body;
        //console.log(token);
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        return res.status(200).send({verify:decoded});
    } catch (error) {
        
        return res.status(401).send({message:"Invalid Token"});
    }
}
const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and Password are required!" });
        let user = await User.findOne({
            email: email,
        });
        if (user) {
            let isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
                res.status(200).json({ token ,id:user._id});
            } else {
                res.status(401).json({ message: "Password is incorrect try correct" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error);
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


const sign_in= async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and Password are required" });
        let user = await User.findOne({
            email: email,
        });
        if (!user) return res.status(400).json({ message: "User not found" });
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect Password" });
        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json(error);
    }
}


const sign_up=async (req,res)=>{
    try {
        console.log(req.body);

        let { username, email, password} = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: "All input is required" });
        let user = await User.findOne({
            email: email,
        });
        if (user) return res.status(400).json({ message: "User already exists" });
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);
        password = hashedPassword;
        let newUser = new User({
            username,
            email,
            password,
        });
        await newUser.save();
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports={login,logout,sign_in,sign_up,verifyToken};