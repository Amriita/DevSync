const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Unauthorized");
        }
        const decodedToken = jwt.verify(token, "Dev@Sync0510");
        const user = await User.findById(decodedToken._id);
        if (!user) {
            throw new Error("User doesn't exist");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("ERROR : " + error.message);
    }
}

module.exports = {userAuth};