const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://femmengineer:ajEpPd0JFdZTWA7V@devsync.yaanenb.mongodb.net/devSync");
};

module.exports = connectDB;
