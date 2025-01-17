const express = require('express')
const { userAuth } = require('../middlewares/auth')

const requestRouter = express.Router()

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
    try{
        const user = req.user
        req.send(user.firstName + " send the connection!!")
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = requestRouter
