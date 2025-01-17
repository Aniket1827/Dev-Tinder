const validator = require('validator')

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong Password!");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "skills", "about"]
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))
    return isEditAllowed
}

const validatEditPasswordData = (req) => {
    const requiredFields = ["oldPassword", "newPassword"]
    const isEditAllowerd = Object.keys(req.body).every(field => requiredFields.includes(field))
    return isEditAllowerd
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validatEditPasswordData
}