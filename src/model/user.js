const { JsonWebTokenError } = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!(validator.isEmail(value))) {
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!(validator.isStrongPassword)) {
                throw new Error("Password is not strong")
            }
        }
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value) {           // This is a in-built function
            if (!(["male", "female", "other"].includes(value))) {
                throw new Error("Invalid gender")
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!(validator.isURL(value))) {
                throw new Error("Invalid URL")
            }
        }
    },
    about: {
        type: String,
        default: "This is default about for the user"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const token = await jwt.sign({ _id: this._id }, "ANIKET@1827")
    return token
}

userSchema.methods.validateUserPassword = async function (password) {
    const isPasswordValid = await bcrypt.compare(password, this.password)
    return isPasswordValid
}
module.exports = mongoose.model("User", userSchema);