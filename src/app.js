const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const cookieParser = require('cookie-parser')

const User = require("./model/user")
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

const { userauth } = require("./middlewares/auth")
const { connectDb } = require('./config/database')


const app = express()
app.use(express.json()) // Converts the request body in a json readable format for all the routes
app.use(cookieParser()) // Parses the cookies attached to the request

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)

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