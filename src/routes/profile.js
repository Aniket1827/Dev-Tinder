const bcrypt = require('bcrypt')
const express = require('express')
const User = require('../model/user')
const { userAuth } = require('../middlewares/auth')
const { validateEditProfileData, validatEditPasswordData } = require('../utils/validation')

const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid update request")
        }
        const user = req.user
        Object.keys(req.body).forEach((key) => (user[key] = req.body[key]))
        await user.save()
        res.send("Profile updated successfully")
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
    try {
        if (!validatEditPasswordData(req)) {
            throw new Error("Invalid update request")
        }
        const user = req.user
        const oldPassword = req.body["oldPassword"]
        const newPassword = req.body["newPassword"]
        const isOldPasswordValid = user.validateUserPassword(oldPassword)
        if (!isOldPasswordValid) {
            throw new Error("Old password is incorrect")
        }

        const isNewAndOldPasswordSame = user.validateUserPassword(newPassword)
        if ( isNewAndOldPasswordSame ) {
            throw new Error("New password should be different from old password")
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.send("Password updated successfully")
    } catch (err) {
        res.status(400).send("Error: " + err)
    }
})

module.exports = profileRouter
