const express = require('express')
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require("../model/connectionRequest")
const userRouter = express.Router()

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
    try {   
        const user = req.user
        const connectionRequests = await ConnectionRequest.find({
            toUserId: user._id,
            status: "intrested"
        }).populate("fromUserId", ["firstName", "lastName"])
        
        res.json(connectionRequests)
    } catch(err) {
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = userRouter