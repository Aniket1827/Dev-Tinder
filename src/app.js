const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const cookieParser = require('cookie-parser')

const User = require("./model/user")
const { userauth } = require("./middlewares/auth")
const { connectDb } = require('./config/database')
const { validateSignUpData } = require("./utils/validation")

const app = express()

app.use(express.json()) // Converts the request body in a json readable format for all the routes
app.use(cookieParser()) // Parses the cookies attached to the request


app.use("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    try {

        const { emailId, password } = req.body
        if (!validator.isEmail(emailId)) {
            res.status(400).send("Please enter a valid email id.")
        }

        const storedUserDetails = await User.findOne({ emailId: emailId })
        if (!storedUserDetails) {
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = await user.validateUserPassword(password)
        if (isPasswordValid) {
            const token = await user.getJWT(storedUserDetails)
            res.cookie("token", token)
            res.send("Login successful")
        } else {
            res.status(400).send("Invalid credentials")
        }
    } catch (err) {
        res.status(400).send("Error occured while logging in; Error: " + err.message)
    }
})

app.get("/user", async (req, res) => {
    try {
        const userEmail = req.body.emailId
        const user = await User.find({ emailId: userEmail })
        if (user.length == 0) {
            res.status(404).send("User not found")
        }
        res.send(user)
    } catch (err) {
        res.status(404).send("Error while fetching user; Error: " + err.message)
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(404).send("Error while fetching users; Error: " + err.message)
    }
})

app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId
        const user = await User.findByIdAndDelete(userId)
        if (!user) {
            res.status(404).send("User not found")
        } else {
            res.send("User deleted successfully!!")
        }
    } catch (err) {
        res.status(404).send("Error while deleting user; Error: " + err.message)
    }
})

app.patch("/user/:userId", async (req, res) => {
    try {
        const ALLOWED_UPDATES = [
            "userId",
            "photoUrl",
            "about",
            "gender",
            "skills",
            "age"
        ]
        const isUpdateAllowed = Object.keys(data).every((key) => {
            ALLOWED_UPDATES.includes(key)
        })

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed.")
        }
        const userId = req.params?.userId
        const data = req.body
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true
        })
        res.send("User updated successfully")
    } catch (err) {
        res.status(400).send("Error while updating the user; Error: " + err.message)
    }
})

connectDb().then(() => {
    console.log("Database connected successfully")
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}).catch((err) => {
    console.log("Error while connecting to database; Error: " + err.message)
})