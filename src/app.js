const express = require('express')

const app = express()

app.use("/test",(req, res) => {
    res.send("Hello World!!")
})

app.listen(3000, () => {
    console.log("Server is up and running!!")
})