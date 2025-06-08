const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            receiverId: loggedUser._id,
            status: "intrested"
        }).populate("senderId", ["firstName", "lastName", "skills", "photoUrl", "gender", "age", "about"]);

        res.status(200).send(connectionRequests);
    } catch (error) {
        res.status(400).send({
            message: "ERROR : " + error.message
        });
    }
});

userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { senderId: loggedUser._id, status: "accepted" },
                { receiverId: loggedUser._id, status: "accepted" }
            ]
        })
        .populate("receiverId", ["firstName", "lastName", "skills", "photoUrl", "gender", "age", "about"])
        .populate("senderId", ["firstName", "lastName", "skills", "photoUrl", "gender", "age", "about"]);

        console.log(connections);
        const data = connections.map(row => {
            if(row.senderId._id.toString() === loggedUser._id.toString()) {
                return row.receiverId;
            }
            return row.senderId;
        });
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({
            message: "ERROR : " + error.message
        });
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequest.find({
           $or: [
            { senderId: loggedUser._id},
            { receiverId: loggedUser._id}
           ]
        }).select("receiverId senderId").populate("receiverId", ["firstName"]).populate("senderId", ["firstName"]);;

        const hideUserFromFeed = new Set();
        connectionRequests.forEach(row => {
            hideUserFromFeed.add(row.receiverId._id.toString());
            hideUserFromFeed.add(row.senderId._id.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedUser._id } }
            ]
        })
        .select("firstName lastName photoUrl age skills gender")
        .skip(skip)
        .limit(limit);

        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({
            message: "ERROR : " + error.message
        });
    }
});

module.exports = userRouter;