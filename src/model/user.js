const mongoose = require('mongoose')

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
        trim: true
    },
    password: {
        type: String,
        required: true
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
        type: String
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

module.exports = mongoose.model("User", userSchema);