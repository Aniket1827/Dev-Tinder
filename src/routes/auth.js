const bcrypt = require('bcrypt')
const express = require('express')
const validator = require('validator')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const { validateSignUpData } = require("../utils/validation")

const authRouter = express.Router()

authRouter.use("/signup", async (req, res) => {
    validateSignUpData(req)
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashedPassword
    })
    try {
        await user.save()
        res.send("User added successfully!!")
    } catch (err) {
        res.send("Error while adding user; Error: " + err.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        if (!validator.isEmail(emailId)) {
            res.status(400).send("Please enter a valid email id.")
        }

        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = await user.validateUserPassword(password)
        if (isPasswordValid) {
            const token = await user.getJWT(user)
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })
            res.send("Login successful")
        } else {
            res.status(400).send("Invalid credentials")
        }
    } catch (err) {
        res.status(400).send("Error occured while logging in; Error: " + err.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) })
        res.send("Successully logged out")
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})
module.exports = authRouter