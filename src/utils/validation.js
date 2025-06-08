const validator = require("validator");
const validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName || !email || !password) {
        throw new Error("Required Feilds are missing");
    }

    if(!validator.isEmail(email)) {
        throw new Error("Invalid email");
    }

    if(!validator.isStrongPassword(password)) {
        throw new Error("Invalid password");
    }

    if(!validator.isLength(firstName, { min: 3, max: 50 })) {
        throw new Error("Invalid first name");
    }

    if(!validator.isLength(lastName, { min: 3, max: 50 })) {
        throw new Error("Invalid last name");
    }

    if(!validator.isLength(password, { min: 8, max: 50 })) {
        throw new Error("Invalid password");
    }
}

const validateProfileData = (req) => {
    const isAllowedEdit = ["firstName", "lastName", "age", "gender", "photoUrl", "skills", "about"];
    const isAllowedEditObject = Object.keys(req.body).forEach(key => {
        if(!isAllowedEdit.includes(key)) {
            throw new Error("Invalid key");
        }
    })
    console.log(req.body)
    const invalidKeys = Object.keys(req.body).filter(key => !isAllowedEdit.includes(key));
    console.log(invalidKeys)
    console.log(isAllowedEditObject)
    return invalidKeys.length === 0;    
}

module.exports = {validateSignupData, validateProfileData};