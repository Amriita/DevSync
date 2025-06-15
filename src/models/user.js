const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        index: true,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong");
            }
        }
    },
    age: {
        type: Number,
        min: 18, 
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Photo URL is not valid");
            }
        }
    },
    about: {
        type: String,
        validate(value) {
            if(!validator.isLength(value, { min: 10, max: 1000 })) {
                throw new Error("About data is not valid");
            }
        }
    },
    skills: {
        type: [String],
        validate: {
            validator: (v) => v.length <= 10,
            message: 'Cannot have more than 10 skills!'
        }
    }
}, {
    timestamps: true
});

UserSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET_KEY, { expiresIn: "1h" }); 
    return token;   
}

UserSchema.methods.passwordValid = async function (passwordInputData) {
    const isPasswordMatched = await bcrypt.compare(passwordInputData, this.password);
    return isPasswordMatched;
}
    

module.exports = mongoose.model("User", UserSchema);