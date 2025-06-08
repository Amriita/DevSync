const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).send("User Signup successfully");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordMatched = await user.passwordValid(password);
        if (!isPasswordMatched) {
            throw new Error("Invalid Credentials");
        }
        const token = await user.generateAuthToken();
        console.log(token);
        res.cookie("token", token);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.status(200).send("User Logout successfully");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = authRouter;