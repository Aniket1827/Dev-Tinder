const mongoose = require('mongoose')
const User = require("./user")

const connectionRequest = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }, 
    toUserId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    }, 
    status: {
        type: String,
        enum : {
            values: ["ignored", "intrested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true
    }
}, {
    timestamps: true
})

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest", connectionRequest
)

module.exports = ConnectionRequest