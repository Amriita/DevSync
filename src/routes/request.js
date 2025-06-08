const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post('/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const { status, userId } = req.params;
        const user = req.user;
        if(!user) {
            throw new Error("User doesn't exist");
        }

        const receiverUser = await User.findById(userId);
        if(!receiverUser) {
            return res.status(400).json({
                message: "Receiver user doesn't exist"
            });
        }

        const isAllowedStatus = ["ignored", "intrested", "approved", "rejected"];
        if(!isAllowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                status
            });
        }
        const connectionRequestExists = await ConnectionRequest.findOne({
            $or: [
                { senderId: user._id, receiverId: userId },
                { senderId: userId, receiverId: user._id }
            ]
        });
        if(connectionRequestExists) {
            return res.status(400).json({
                message: "Connection request already exists",
                connectionRequestExists
            });
        }
        const connectionRequest = new ConnectionRequest({
            senderId: user._id,
            receiverId: userId,
            status
        });
        await connectionRequest.save();
        res.status(200).send({
            message: `${user.firstName} ${user.lastName} Connection request sent successfully`,
            connectionRequest
        });
    } catch (error) {
        res.status(400).send({
            message: "ERROR : " + error.message
        });
    }
})

requestRouter.post('/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedUser = req.user;

        //Validate the status
        const { status, requestId } = req.params;
        const isAllowedStatus = ["accepted", "rejected"];
        if(!isAllowedStatus.includes(status)) {
            throw new Error("Invalid status");
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            receiverId: loggedUser._id,
            status: "intrested"
        });
        if(!connectionRequest) {
            return res.status(400).json({
                message: "Connection request doesn't exist"
            });
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).send({
            message: `${loggedUser.firstName} ${loggedUser.lastName} ${status} request successfully`,
            connectionRequest
        });
    } catch (error) {
        res.status(400).send({
            message: "ERROR : " + error.message
        });
    }
})

module.exports = requestRouter;