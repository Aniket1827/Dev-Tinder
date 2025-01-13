const mongoose = require('mongoose')

// mongoose.connect("mongodb://localhost:27017/")

const connectDb = async() => {
    await mongoose.connect(
        "mongodb://localhost:27017/Dev-Tinder"
    )
}

module.exports = {
    connectDb
}