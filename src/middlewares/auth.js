const jwt = require('jsonwebtoken')
const User = require('../model/user')

const userAuth = async (req, res, next) => {
    try {

        const { token } = req.cookies
        if (!token) {
            throw new Error("Invalid token")
        }
        
        const decodedObj = await jwt.verify(token, "ANIKET@1827")
        const { _id } = decodedObj

        const user = await User.findById({ _id: _id })
        if (!user) {
            throw new Error("User not found")
        }

        req.user = user
        next()
    }
    catch (err) {
        res.status(400).send("Eror: " + err.message)
    }
}

module.exports = {
    userAuth
}