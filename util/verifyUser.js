const jwt = require("jsonwebtoken")
const errorHandler = require("./error")

const verifyUser =(req, res, next)=>{
    const token = req.cookies.access_token
    if (!token) {
        return next(errorHandler(401, 'unauthorized'))
    }else{
        jwt.verify(token, "latayo", (err, user)=>{
            if (err) {
                return next(errorHandler(401, 'unauthorized'))
            }else{
                req.user = user
                next()
            }
        })
    }
}

module.exports = {verifyUser}