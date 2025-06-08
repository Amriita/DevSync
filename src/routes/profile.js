const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
        if(!validateProfileData(req)) {
            throw new Error("Updating data not allowed");
        }
        const user = req.user;
        if(!user) {
            throw new Error("User doesn't exist");
        }

        Object.keys(req.body).forEach(key => {
            user[key] = req.body[key];
        })
        await user.save();
        res.json({
            message: `${user.firstName} updated successfully`,
            user
        })
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

profileRouter.patch("/password", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if(!user) {
            throw new Error("User doesn't exist");
        }
        if(!validator.isStrongPassword(req.body.password)) {
            throw new Error("Invalid password");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send("User password updated successfully");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

module.exports = profileRouter;
