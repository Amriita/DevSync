const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   // Reference to the User model
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["ignored", "intrested", "accepted", "rejected"],
    }
});

connectionRequestSchema.index({ senderId: 1, receiverId: 1 });

connectionRequestSchema.pre("save", function (next) {
    if(this.senderId.toString() === this.receiverId.toString()) {
        throw new Error("User cannot send connection request to himself");
    }
    next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
