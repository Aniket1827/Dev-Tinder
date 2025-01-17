const express = require('express')
const { userAuth } = require('../middlewares/auth')
const User = require("../model/user")
const ConnectionRequest = require('../model/connectionRequest')

const requestRouter = express.Router()

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const user = req.user
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status
        const allowedSatus = ["ignored", "intrested"]

        if (!allowedSatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type" })
        }

        const connectionRequestObj = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        })
        if (connectionRequestObj.fromUserId.equals(connectionRequestObj.toUserId)) {
            return res.status(400).json({ message: "You can't send connection request to yourself" })
        }

        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(400).json({ message: "Invalid toUserId" })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists" })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        })
        const data = await connectionRequest.save()
        res.json({
            message: `Connection request sent to {toUserId}`,
            data
        })
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const user = req.user
        const status = req.params.status
        const requestId = req.params.requestId

        const allowedSatus = ["accepted", "rejected"]
        if (!allowedSatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type" })
        }

        const connectionRequestObj = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: user._id,
            status: "intrested"
        })
        if (!connectionRequestObj) {
            return res.status(400).json({ message: "No connection request was sent" })
        }

        connectionRequestObj.status = status
        const data = await connectionRequestObj.save()
        res.json({
            message: "Connection request updated successfully",
            data
        })
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})
module.exports = requestRouter
