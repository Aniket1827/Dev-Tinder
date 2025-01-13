const express = require('express')
const { connectDb } = require('./config/database')
const User = require("./model/user")

const app = express()

// Converts the request body in a json readable format for all the routes
app.use(express.json())

app.use("/signup", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.send("User added successfully!!")
    } catch (err) {
        res.send("Error while adding user; Error: " + err.message)
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

connectDb().then(() => {
    console.log("Database connected successfully")
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}).catch((err) => { 
    console.log("Error while connecting to database; Error: " + err.message) 
})