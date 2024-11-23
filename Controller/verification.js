const User = require("../Schema/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Signup function
let JWT_SECRET="189ac7bcf390094e24315f5302e07ed2d4853d27cbb3f7bdaf532f86d8025fecf3079c8fbcaa1d4166dbd783d84c1a4512e1a89810f77f7ada0a0a39e343ccfb31c066aa9d1dda3fd13f1354425745a7708cfcb6ec94109336327d0797a1e30ace0b77f82be6f1782d96ff1785e3bfe4896e24a480b02129e4ef3076bcf47d9c3bc3f0811550392eed1664ca57c47368ed48f77e9faf124ac517f51015669e9f031b5bf8fbc92a5ca12abb6133b72e0423e1538d5b31fa2209140d6594be451b6bef2da76ccb60d844cdf84a0f303f2b853de19574688a4ada6b9120556ebbd413fcbd7c26c5e7952477dc4b5348124da0c1a5cfd41ef4a8d446c771c70b820f"
const sign_up = async (req, res) => {
    console.log("ghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    try {
        console.log(req.body);
        const { mobile, password, user, email } = req.body;

        // Check if all fields are provided
        if (!mobile || !password || !user || !email) {
            return res.status(400).send({ success: false, result: 'Please fill all input fields' });
        }

        // Check if user already exists
        const isExist = await User.findOne({ mobile });
        if (isExist) {
            return res.status(409).send({ success: false, result: 'User already exists' });
        }

        // Hash password and save new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ user, email, password: hashedPassword, mobile });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ mobile, email }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(201).send({ success: true, token, result: "Successfully signed up" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, result: "Something went wrong during signup" });
    }
};

// Login function
const login = async (req, res) => {
    const { mobile, password } = req.body;

    try {
        // Check if user exists
        const isExist = await User.findOne({ mobile });
        if (!isExist) {
            return res.status(404).send({ success: false, result: "User does not exist" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, isExist.password);
        if (!isMatch) {
            return res.status(401).send({ success: false, result: "Failed login: Password does not match" });
        }

        // Generate JWT token
        const token = jwt.sign({ mobile: isExist.mobile, email: isExist.email }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).send({ success: true, token, result: "Login successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, result: "Failed login due to an error" });
    }
};

// Token verification function
const tokenverify = (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).send({ success: false, result: "Token is missing" });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        return res.status(200).send({ success: true, verified });
    } catch (err) {
        console.error(err);
        return res.status(401).send({ success: false, result: "Invalid token" });
    }
};

module.exports = { sign_up, login, tokenverify };
